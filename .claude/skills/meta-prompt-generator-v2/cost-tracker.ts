/**
 * 비용 추적기 - Meta Prompt Generator v2
 *
 * 토큰 사용량 추적, ROI 계산, 비용 최적화 제안을 제공합니다.
 */

interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

interface CostBudget {
  total: number;
  perPhase: number;
  warningThreshold: number; // 0-1 비율
}

interface ParallelizationROI {
  roi: number;
  recommend: boolean;
  timeSavedSeconds: number;
  additionalTokens: number;
  reasoning: string;
}

interface CostReport {
  estimated: TokenUsage;
  actual: TokenUsage;
  variance: number; // 백분율
  budgetUsed: number; // 백분율
  warnings: string[];
  optimizations: string[];
}

export class CostTracker {
  private budget: CostBudget;
  private estimatedUsage: TokenUsage;
  private actualUsage: TokenUsage;
  private phaseHistory: Array<{ phase: string; tokens: number }>;

  // 모델별 토큰 비용 (USD per 1K tokens)
  private static COSTS = {
    haiku: { input: 0.00025, output: 0.00125 },
    sonnet: { input: 0.003, output: 0.015 },
    opus: { input: 0.015, output: 0.075 },
  };

  // 시간 가치 (USD per hour)
  private static HOURLY_VALUE = 50;

  constructor(budget: CostBudget) {
    this.budget = budget;
    this.estimatedUsage = { prompt: 0, completion: 0, total: 0 };
    this.actualUsage = { prompt: 0, completion: 0, total: 0 };
    this.phaseHistory = [];
  }

  // 예상 사용량 설정
  setEstimate(usage: TokenUsage): void {
    this.estimatedUsage = usage;
  }

  // 실제 사용량 기록
  recordUsage(phase: string, tokens: number): void {
    this.phaseHistory.push({ phase, tokens });
    this.actualUsage.total += tokens;

    // 경고 체크
    const usageRatio = this.actualUsage.total / this.budget.total;
    if (usageRatio >= this.budget.warningThreshold) {
      console.warn(
        `경고: 예산의 ${(usageRatio * 100).toFixed(1)}% 사용됨`
      );
    }
  }

  // 병렬화 ROI 계산
  calculateParallelizationROI(
    sequentialTimeSeconds: number,
    parallelTimeSeconds: number,
    additionalAgents: number,
    tokensPerAgent: number,
    model: "haiku" | "sonnet" | "opus" = "sonnet"
  ): ParallelizationROI {
    const timeSaved = sequentialTimeSeconds - parallelTimeSeconds;
    const additionalTokens = additionalAgents * tokensPerAgent;

    // 시간 절약의 금전적 가치
    const timeValue =
      (timeSaved / 3600) * CostTracker.HOURLY_VALUE;

    // 추가 토큰 비용
    const tokenCost =
      (additionalTokens / 1000) * CostTracker.COSTS[model].output;

    const roi = tokenCost > 0 ? timeValue / tokenCost : 0;

    let reasoning: string;
    if (roi > 2) {
      reasoning = "강력 권장: 높은 ROI로 병렬화 효과적";
    } else if (roi > 1.5) {
      reasoning = "권장: 적절한 ROI";
    } else if (roi > 1) {
      reasoning = "선택적: 약간의 이득";
    } else {
      reasoning = "비권장: 비용 대비 효과 낮음";
    }

    return {
      roi: Math.round(roi * 100) / 100,
      recommend: roi > 1.5,
      timeSavedSeconds: timeSaved,
      additionalTokens,
      reasoning,
    };
  }

  // 비용 보고서 생성
  generateReport(): CostReport {
    const variance =
      this.estimatedUsage.total > 0
        ? ((this.actualUsage.total - this.estimatedUsage.total) /
            this.estimatedUsage.total) *
          100
        : 0;

    const budgetUsed = (this.actualUsage.total / this.budget.total) * 100;

    const warnings: string[] = [];
    const optimizations: string[] = [];

    // 경고 생성
    if (budgetUsed > 90) {
      warnings.push("예산의 90% 이상 사용됨");
    }
    if (variance > 20) {
      warnings.push(`예상보다 ${variance.toFixed(1)}% 더 사용됨`);
    }

    // 최적화 제안 생성
    if (this.phaseHistory.length > 0) {
      const avgTokensPerPhase =
        this.actualUsage.total / this.phaseHistory.length;

      if (avgTokensPerPhase > this.budget.perPhase) {
        optimizations.push("단계별 토큰 사용량이 예산 초과, 단계 세분화 권장");
      }

      // 가장 비용이 높은 단계 식별
      const maxPhase = this.phaseHistory.reduce((max, curr) =>
        curr.tokens > max.tokens ? curr : max
      );
      optimizations.push(
        `가장 비용이 높은 단계: ${maxPhase.phase} (${maxPhase.tokens} 토큰)`
      );
    }

    // 캐싱 제안
    if (this.phaseHistory.filter((p) => p.phase.includes("search")).length > 1) {
      optimizations.push("중복 검색 감지: 캐싱으로 15-20% 비용 절감 가능");
    }

    return {
      estimated: this.estimatedUsage,
      actual: this.actualUsage,
      variance: Math.round(variance * 10) / 10,
      budgetUsed: Math.round(budgetUsed * 10) / 10,
      warnings,
      optimizations,
    };
  }

  // 모델 선택 최적화
  static recommendModel(
    taskComplexity: number,
    qualityRequirement: "low" | "medium" | "high"
  ): "haiku" | "sonnet" | "opus" {
    if (taskComplexity < 30 && qualityRequirement !== "high") {
      return "haiku"; // 간단한 작업, 비용 최적화
    } else if (taskComplexity > 70 || qualityRequirement === "high") {
      return "sonnet"; // 복잡한 작업, 품질 우선
    } else {
      return "sonnet"; // 균형
    }
  }

  // 남은 예산 확인
  getRemainingBudget(): number {
    return this.budget.total - this.actualUsage.total;
  }

  // 단계별 사용량 요약
  getPhaseBreakdown(): Array<{ phase: string; tokens: number; percentage: number }> {
    return this.phaseHistory.map((p) => ({
      ...p,
      percentage:
        Math.round((p.tokens / this.actualUsage.total) * 1000) / 10,
    }));
  }
}

// 빠른 비용 추정
export function estimateCost(
  mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE",
  estimatedPhases: number
): TokenUsage {
  const tokensPerPhase: Record<string, number> = {
    MINIMAL: 3000,
    STANDARD: 8000,
    COMPREHENSIVE: 15000,
  };

  const baseTokens = tokensPerPhase[mode] * estimatedPhases;

  // 오버헤드 추가 (검증, 자기 평가 등)
  const overhead = mode === "COMPREHENSIVE" ? 1.3 : 1.1;

  const total = Math.round(baseTokens * overhead);

  return {
    prompt: Math.round(total * 0.3),
    completion: Math.round(total * 0.7),
    total,
  };
}

// 사용 예시
if (import.meta.url === `file://${process.argv[1]}`) {
  const budget: CostBudget = {
    total: 50000,
    perPhase: 10000,
    warningThreshold: 0.8,
  };

  const tracker = new CostTracker(budget);

  // 예상 사용량 설정
  tracker.setEstimate(estimateCost("STANDARD", 5));

  // 실제 사용량 기록
  tracker.recordUsage("knowledge_collection", 8500);
  tracker.recordUsage("requirement_clarification", 3200);
  tracker.recordUsage("structure_design", 7800);
  tracker.recordUsage("content_generation", 12500);
  tracker.recordUsage("self_evaluation", 5000);

  // ROI 계산
  const roi = tracker.calculateParallelizationROI(
    180, // 순차 실행 3분
    100, // 병렬 실행 1분 40초
    2, // 추가 에이전트 2개
    5000 // 에이전트당 5000 토큰
  );

  console.log("병렬화 ROI:", roi);

  // 보고서 생성
  const report = tracker.generateReport();
  console.log("\n비용 보고서:");
  console.log(JSON.stringify(report, null, 2));

  // 단계별 분석
  console.log("\n단계별 사용량:");
  console.log(tracker.getPhaseBreakdown());
}
