/**
 * 실패 복구 관리자 - Meta Prompt Generator v2
 *
 * 단계별 실패 처리, 롤백, 재시도 전략을 관리합니다.
 */

interface RetryPolicy {
  maxAttempts: number;
  backoffType: "constant" | "linear" | "exponential";
  initialDelayMs: number;
  maxDelayMs: number;
  retryOn: string[];
  failFastOn: string[];
}

interface RollbackAction {
  type: "revert_files" | "restore_state" | "cleanup_resources" | "custom";
  description: string;
  execute?: () => Promise<void>;
}

interface RecoveryStrategy {
  phaseName: string;
  retryPolicy: RetryPolicy;
  rollbackActions: RollbackAction[];
  fallbackStrategy?: string;
  allowPartialSuccess: boolean;
  minimumCompletionPercentage: number;
}

interface ExecutionState {
  phase: string;
  attempt: number;
  status: "pending" | "in_progress" | "success" | "failed" | "partial";
  startTime: Date;
  endTime?: Date;
  error?: string;
  checkpointData?: Record<string, unknown>;
}

interface RecoveryReport {
  totalPhases: number;
  completedPhases: number;
  failedPhases: number;
  partialPhases: number;
  totalRetries: number;
  rollbacksPerformed: number;
  overallStatus: "success" | "partial_success" | "failed";
  issues: string[];
  resumePoint?: string;
}

export class FailureRecoveryManager {
  private strategies: Map<string, RecoveryStrategy> = new Map();
  private executionHistory: ExecutionState[] = [];
  private checkpoints: Map<string, Record<string, unknown>> = new Map();

  // 기본 재시도 정책
  private static DEFAULT_RETRY_POLICY: RetryPolicy = {
    maxAttempts: 3,
    backoffType: "exponential",
    initialDelayMs: 2000,
    maxDelayMs: 16000,
    retryOn: ["network_error", "timeout", "transient_failure"],
    failFastOn: ["auth_error", "permission_denied", "invalid_input"],
  };

  // 복구 전략 등록
  registerStrategy(
    phaseName: string,
    strategy: Partial<RecoveryStrategy>
  ): void {
    const fullStrategy: RecoveryStrategy = {
      phaseName,
      retryPolicy: {
        ...FailureRecoveryManager.DEFAULT_RETRY_POLICY,
        ...strategy.retryPolicy,
      },
      rollbackActions: strategy.rollbackActions || [],
      fallbackStrategy: strategy.fallbackStrategy,
      allowPartialSuccess: strategy.allowPartialSuccess ?? true,
      minimumCompletionPercentage: strategy.minimumCompletionPercentage ?? 60,
    };

    this.strategies.set(phaseName, fullStrategy);
  }

  // 단계 실행 (재시도 포함)
  async executePhase<T>(
    phaseName: string,
    phaseFunction: () => Promise<T>,
    errorClassifier?: (error: unknown) => string
  ): Promise<{ success: boolean; result?: T; error?: string }> {
    const strategy = this.strategies.get(phaseName);
    if (!strategy) {
      console.warn(`전략 미등록: ${phaseName}, 기본 정책 사용`);
      this.registerStrategy(phaseName, {});
    }

    const currentStrategy = this.strategies.get(phaseName)!;
    const state: ExecutionState = {
      phase: phaseName,
      attempt: 0,
      status: "in_progress",
      startTime: new Date(),
    };

    this.executionHistory.push(state);

    let lastError: unknown;

    for (let attempt = 1; attempt <= currentStrategy.retryPolicy.maxAttempts; attempt++) {
      state.attempt = attempt;

      try {
        console.log(`[${phaseName}] 시도 ${attempt}/${currentStrategy.retryPolicy.maxAttempts}`);
        const result = await phaseFunction();

        state.status = "success";
        state.endTime = new Date();

        // 체크포인트 저장
        this.checkpoints.set(phaseName, { completed: true, result });

        return { success: true, result };
      } catch (error) {
        lastError = error;
        const errorType = errorClassifier
          ? errorClassifier(error)
          : this.classifyError(error);

        console.error(`[${phaseName}] 시도 ${attempt} 실패: ${errorType}`);

        // 즉시 실패해야 하는 에러인지 확인
        if (currentStrategy.retryPolicy.failFastOn.includes(errorType)) {
          console.error(`[${phaseName}] 빠른 실패: ${errorType}`);
          break;
        }

        // 재시도 가능한 에러인지 확인
        if (!currentStrategy.retryPolicy.retryOn.includes(errorType)) {
          console.error(`[${phaseName}] 재시도 불가능한 에러: ${errorType}`);
          break;
        }

        // 마지막 시도가 아니면 대기
        if (attempt < currentStrategy.retryPolicy.maxAttempts) {
          const delay = this.calculateDelay(
            attempt,
            currentStrategy.retryPolicy
          );
          console.log(`[${phaseName}] ${delay}ms 후 재시도...`);
          await this.sleep(delay);
        }
      }
    }

    // 모든 재시도 실패
    state.status = "failed";
    state.endTime = new Date();
    state.error = lastError instanceof Error ? lastError.message : String(lastError);

    // 롤백 실행
    await this.performRollback(phaseName);

    // 대체 전략 확인
    if (currentStrategy.fallbackStrategy) {
      console.log(`[${phaseName}] 대체 전략 실행: ${currentStrategy.fallbackStrategy}`);
      return {
        success: false,
        error: `실패 후 대체 전략 필요: ${currentStrategy.fallbackStrategy}`,
      };
    }

    return {
      success: false,
      error: state.error,
    };
  }

  // 에러 분류
  private classifyError(error: unknown): string {
    if (!(error instanceof Error)) {
      return "unknown_error";
    }

    const message = error.message.toLowerCase();

    if (
      message.includes("network") ||
      message.includes("econnrefused") ||
      message.includes("fetch")
    ) {
      return "network_error";
    }

    if (message.includes("timeout") || message.includes("etimedout")) {
      return "timeout";
    }

    if (
      message.includes("auth") ||
      message.includes("unauthorized") ||
      message.includes("401")
    ) {
      return "auth_error";
    }

    if (
      message.includes("permission") ||
      message.includes("forbidden") ||
      message.includes("403")
    ) {
      return "permission_denied";
    }

    if (message.includes("invalid") || message.includes("validation")) {
      return "invalid_input";
    }

    return "transient_failure";
  }

  // 지연 시간 계산
  private calculateDelay(attempt: number, policy: RetryPolicy): number {
    let delay: number;

    switch (policy.backoffType) {
      case "constant":
        delay = policy.initialDelayMs;
        break;
      case "linear":
        delay = policy.initialDelayMs * attempt;
        break;
      case "exponential":
        delay = policy.initialDelayMs * Math.pow(2, attempt - 1);
        break;
    }

    return Math.min(delay, policy.maxDelayMs);
  }

  // 대기
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 롤백 실행
  private async performRollback(phaseName: string): Promise<void> {
    const strategy = this.strategies.get(phaseName);
    if (!strategy || strategy.rollbackActions.length === 0) {
      console.log(`[${phaseName}] 롤백 작업 없음`);
      return;
    }

    console.log(`[${phaseName}] 롤백 시작...`);

    for (const action of strategy.rollbackActions) {
      try {
        console.log(`  - ${action.description}`);
        if (action.execute) {
          await action.execute();
        }
      } catch (error) {
        console.error(`  롤백 작업 실패: ${action.description}`, error);
      }
    }

    console.log(`[${phaseName}] 롤백 완료`);
  }

  // 체크포인트 저장
  saveCheckpoint(phaseName: string, data: Record<string, unknown>): void {
    this.checkpoints.set(phaseName, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    console.log(`[${phaseName}] 체크포인트 저장됨`);
  }

  // 체크포인트 로드
  loadCheckpoint(phaseName: string): Record<string, unknown> | undefined {
    return this.checkpoints.get(phaseName);
  }

  // 부분 성공 처리
  evaluatePartialSuccess(
    phaseName: string,
    completedTasks: number,
    totalTasks: number
  ): boolean {
    const strategy = this.strategies.get(phaseName);
    if (!strategy) return false;

    const completionPercentage = (completedTasks / totalTasks) * 100;

    if (completionPercentage >= strategy.minimumCompletionPercentage) {
      console.log(
        `[${phaseName}] 부분 성공 인정: ${completionPercentage.toFixed(1)}% 완료`
      );

      // 상태 업데이트
      const state = this.executionHistory.find((s) => s.phase === phaseName);
      if (state) {
        state.status = "partial";
      }

      return true;
    }

    return false;
  }

  // 복구 보고서 생성
  generateReport(): RecoveryReport {
    const totalPhases = this.executionHistory.length;
    const completedPhases = this.executionHistory.filter(
      (s) => s.status === "success"
    ).length;
    const failedPhases = this.executionHistory.filter(
      (s) => s.status === "failed"
    ).length;
    const partialPhases = this.executionHistory.filter(
      (s) => s.status === "partial"
    ).length;

    const totalRetries = this.executionHistory.reduce(
      (sum, s) => sum + (s.attempt - 1),
      0
    );

    const rollbacksPerformed = this.executionHistory.filter(
      (s) => s.status === "failed"
    ).length;

    const issues = this.executionHistory
      .filter((s) => s.error)
      .map((s) => `${s.phase}: ${s.error}`);

    let overallStatus: "success" | "partial_success" | "failed";
    if (failedPhases === 0) {
      overallStatus = "success";
    } else if (completedPhases + partialPhases > failedPhases) {
      overallStatus = "partial_success";
    } else {
      overallStatus = "failed";
    }

    // 재개 지점 찾기
    const lastSuccessful = this.executionHistory
      .filter((s) => s.status === "success" || s.status === "partial")
      .pop();
    const resumePoint = lastSuccessful ? lastSuccessful.phase : undefined;

    return {
      totalPhases,
      completedPhases,
      failedPhases,
      partialPhases,
      totalRetries,
      rollbacksPerformed,
      overallStatus,
      issues,
      resumePoint,
    };
  }

  // 사용자 개입 요청
  static formatInterventionRequest(
    phaseName: string,
    error: string,
    options: string[]
  ): string {
    return `
## 사용자 개입 필요

### 상황
단계 "${phaseName}"에서 자동 복구가 실패했습니다.

### 에러
${error}

### 가능한 옵션
${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}

### 선택
위 옵션 중 하나를 선택하거나, 직접 해결 방법을 제시해주세요.
`;
  }

  // 리셋
  reset(): void {
    this.strategies.clear();
    this.executionHistory = [];
    this.checkpoints.clear();
  }
}

// 프리셋 전략들
export const PRESET_STRATEGIES = {
  // 지식 수집용
  knowledgeCollection: {
    retryPolicy: {
      maxAttempts: 3,
      backoffType: "exponential" as const,
      initialDelayMs: 2000,
      maxDelayMs: 16000,
      retryOn: ["network_error", "timeout"],
      failFastOn: ["auth_error"],
    },
    rollbackActions: [
      {
        type: "cleanup_resources" as const,
        description: "임시 검색 결과 정리",
      },
    ],
    fallbackStrategy: "내장 지식 기반으로 진행",
    allowPartialSuccess: true,
    minimumCompletionPercentage: 50,
  },

  // 코드 생성용
  codeGeneration: {
    retryPolicy: {
      maxAttempts: 2,
      backoffType: "constant" as const,
      initialDelayMs: 1000,
      maxDelayMs: 5000,
      retryOn: ["transient_failure"],
      failFastOn: ["invalid_input", "permission_denied"],
    },
    rollbackActions: [
      {
        type: "revert_files" as const,
        description: "생성된 파일 롤백",
      },
    ],
    allowPartialSuccess: false,
    minimumCompletionPercentage: 100,
  },

  // 검증용
  validation: {
    retryPolicy: {
      maxAttempts: 2,
      backoffType: "constant" as const,
      initialDelayMs: 500,
      maxDelayMs: 2000,
      retryOn: ["transient_failure"],
      failFastOn: [],
    },
    rollbackActions: [],
    allowPartialSuccess: true,
    minimumCompletionPercentage: 80,
  },
};

// 사용 예시
if (require.main === module) {
  const manager = new FailureRecoveryManager();

  // 전략 등록
  manager.registerStrategy(
    "knowledge_collection",
    PRESET_STRATEGIES.knowledgeCollection
  );
  manager.registerStrategy("code_generation", PRESET_STRATEGIES.codeGeneration);
  manager.registerStrategy("validation", PRESET_STRATEGIES.validation);

  // 테스트 실행
  (async () => {
    // 성공 케이스
    const result1 = await manager.executePhase("knowledge_collection", async () => {
      console.log("지식 수집 중...");
      return { data: "collected" };
    });
    console.log("결과 1:", result1);

    // 실패 후 재시도 케이스
    let attempt = 0;
    const result2 = await manager.executePhase("validation", async () => {
      attempt++;
      if (attempt < 2) {
        throw new Error("transient_failure: temporary issue");
      }
      return { validated: true };
    });
    console.log("결과 2:", result2);

    // 보고서
    const report = manager.generateReport();
    console.log("\n복구 보고서:");
    console.log(JSON.stringify(report, null, 2));
  })();
}
