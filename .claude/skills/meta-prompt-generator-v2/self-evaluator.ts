/**
 * 자기 평가기 - Meta Prompt Generator v2
 *
 * 생성된 프롬프트의 품질을 평가하고 개선점을 식별합니다.
 */

interface EvaluationDimension {
  score: number; // 0-10
  feedback: string;
  improvements: string[];
}

interface EvaluationResult {
  dimensions: {
    functionalCompleteness: EvaluationDimension;
    executability: EvaluationDimension;
    efficiency: EvaluationDimension;
    maintainability: EvaluationDimension;
    safety: EvaluationDimension;
  };
  totalScore: number; // 0-100
  passed: boolean;
  criticalIssues: string[];
  suggestedImprovements: string[];
  iterationRecommendation: "accept" | "improve" | "reject";
}

interface PromptStructure {
  hasVariables: boolean;
  hasInstructions: boolean;
  hasWorkflow: boolean;
  workflowPhases: number;
  hasTestSuite: boolean;
  hasValidation: boolean;
  hasFailureRecovery: boolean;
  hasSecurityChecks: boolean;
  hasCostTracking: boolean;
}

export class SelfEvaluator {
  private static MINIMUM_PASSING_SCORE = 70;
  private static MAX_ITERATIONS = 3;

  private currentIteration: number = 0;
  private evaluationHistory: EvaluationResult[] = [];

  // 프롬프트 구조 분석
  analyzeStructure(promptContent: string): PromptStructure {
    const content = promptContent.toLowerCase();

    return {
      hasVariables: content.includes("## 변수") || content.includes("## variables"),
      hasInstructions: content.includes("## 지침") || content.includes("## instructions"),
      hasWorkflow: content.includes("## 워크플로우") || content.includes("## workflow"),
      workflowPhases: (content.match(/### (단계|phase) \d+/gi) || []).length,
      hasTestSuite: content.includes("## 테스트") || content.includes("## test"),
      hasValidation: content.includes("검증") || content.includes("validation"),
      hasFailureRecovery: content.includes("실패") || content.includes("롤백") || content.includes("retry"),
      hasSecurityChecks: content.includes("보안") || content.includes("security") || content.includes("audit"),
      hasCostTracking: content.includes("비용") || content.includes("cost") || content.includes("budget"),
    };
  }

  // 전체 평가 수행
  evaluate(
    promptContent: string,
    requirements: string[],
    mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE"
  ): EvaluationResult {
    const structure = this.analyzeStructure(promptContent);

    const dimensions = {
      functionalCompleteness: this.evaluateFunctionalCompleteness(
        promptContent,
        requirements
      ),
      executability: this.evaluateExecutability(structure, mode),
      efficiency: this.evaluateEfficiency(structure, mode),
      maintainability: this.evaluateMaintainability(structure),
      safety: this.evaluateSafety(structure, mode),
    };

    // 총점 계산 (각 차원 동일 가중치)
    const totalScore =
      ((dimensions.functionalCompleteness.score +
        dimensions.executability.score +
        dimensions.efficiency.score +
        dimensions.maintainability.score +
        dimensions.safety.score) /
        5) *
      10;

    // 심각한 문제 식별
    const criticalIssues: string[] = [];
    if (dimensions.functionalCompleteness.score < 5) {
      criticalIssues.push("기능적 완전성 심각하게 부족");
    }
    if (dimensions.safety.score < 5) {
      criticalIssues.push("안전성 검증 부족");
    }
    if (dimensions.executability.score < 5) {
      criticalIssues.push("실행 가능성 의심");
    }

    // 개선 제안 통합
    const suggestedImprovements = [
      ...dimensions.functionalCompleteness.improvements,
      ...dimensions.executability.improvements,
      ...dimensions.efficiency.improvements,
      ...dimensions.maintainability.improvements,
      ...dimensions.safety.improvements,
    ].slice(0, 5); // 상위 5개만

    // 반복 권장사항
    let iterationRecommendation: "accept" | "improve" | "reject";
    if (totalScore >= SelfEvaluator.MINIMUM_PASSING_SCORE && criticalIssues.length === 0) {
      iterationRecommendation = "accept";
    } else if (this.currentIteration < SelfEvaluator.MAX_ITERATIONS) {
      iterationRecommendation = "improve";
    } else {
      iterationRecommendation = criticalIssues.length > 0 ? "reject" : "accept";
    }

    const result: EvaluationResult = {
      dimensions,
      totalScore: Math.round(totalScore * 10) / 10,
      passed: totalScore >= SelfEvaluator.MINIMUM_PASSING_SCORE,
      criticalIssues,
      suggestedImprovements,
      iterationRecommendation,
    };

    this.evaluationHistory.push(result);
    this.currentIteration++;

    return result;
  }

  // 기능적 완전성 평가
  private evaluateFunctionalCompleteness(
    content: string,
    requirements: string[]
  ): EvaluationDimension {
    let score = 10;
    const improvements: string[] = [];

    // 요구사항 반영 체크
    const missingRequirements: string[] = [];
    for (const req of requirements) {
      if (!content.toLowerCase().includes(req.toLowerCase())) {
        missingRequirements.push(req);
        score -= 2;
      }
    }

    if (missingRequirements.length > 0) {
      improvements.push(
        `누락된 요구사항 추가: ${missingRequirements.join(", ")}`
      );
    }

    // 엣지 케이스 처리 체크
    if (!content.includes("엣지") && !content.includes("edge")) {
      score -= 1;
      improvements.push("엣지 케이스 처리 섹션 추가");
    }

    // 에러 핸들링 체크
    if (!content.includes("에러") && !content.includes("error")) {
      score -= 1;
      improvements.push("에러 핸들링 전략 명시");
    }

    score = Math.max(0, score);

    return {
      score,
      feedback:
        score >= 7
          ? "요구사항이 잘 반영됨"
          : "일부 요구사항 누락 또는 불완전",
      improvements,
    };
  }

  // 실행 가능성 평가
  private evaluateExecutability(
    structure: PromptStructure,
    mode: string
  ): EvaluationDimension {
    let score = 10;
    const improvements: string[] = [];

    // 워크플로우 체크
    if (!structure.hasWorkflow) {
      score -= 4;
      improvements.push("워크플로우 섹션 필수 추가");
    } else {
      // 모드별 단계 수 적정성
      const expectedPhases =
        mode === "MINIMAL" ? 3 : mode === "STANDARD" ? 5 : 8;
      if (Math.abs(structure.workflowPhases - expectedPhases) > 2) {
        score -= 1;
        improvements.push(
          `단계 수 조정 필요 (현재: ${structure.workflowPhases}, 권장: ${expectedPhases})`
        );
      }
    }

    // 지침 체크
    if (!structure.hasInstructions) {
      score -= 2;
      improvements.push("실행 지침 명확화");
    }

    // 검증 체크
    if (!structure.hasValidation) {
      score -= 2;
      improvements.push("검증 단계 추가");
    }

    score = Math.max(0, score);

    return {
      score,
      feedback: score >= 7 ? "실행 가능한 구조" : "실행 명확성 개선 필요",
      improvements,
    };
  }

  // 효율성 평가
  private evaluateEfficiency(
    structure: PromptStructure,
    mode: string
  ): EvaluationDimension {
    let score = 10;
    const improvements: string[] = [];

    // 병렬화 기회 분석
    if (
      mode !== "MINIMAL" &&
      structure.workflowPhases > 3 &&
      !structure.hasCostTracking
    ) {
      score -= 2;
      improvements.push("병렬화 및 비용 추적 추가 권장");
    }

    // 불필요한 복잡성 체크
    if (mode === "MINIMAL" && structure.workflowPhases > 4) {
      score -= 2;
      improvements.push("MINIMAL 모드에 비해 과도한 단계, 단순화 필요");
    }

    // 리소스 효율성
    if (mode === "COMPREHENSIVE" && !structure.hasCostTracking) {
      score -= 3;
      improvements.push("COMPREHENSIVE 모드는 비용 추적 필수");
    }

    score = Math.max(0, score);

    return {
      score,
      feedback: score >= 7 ? "효율적인 설계" : "효율성 개선 여지 있음",
      improvements,
    };
  }

  // 유지보수성 평가
  private evaluateMaintainability(
    structure: PromptStructure
  ): EvaluationDimension {
    let score = 10;
    const improvements: string[] = [];

    // 변수화 체크
    if (!structure.hasVariables) {
      score -= 2;
      improvements.push("재사용을 위한 변수 정의 추가");
    }

    // 문서화 체크 (간접적으로 지침 섹션으로 확인)
    if (!structure.hasInstructions) {
      score -= 1;
      improvements.push("명확한 지침 문서화");
    }

    // 구조 명확성
    if (!structure.hasWorkflow) {
      score -= 2;
      improvements.push("구조화된 워크플로우로 가독성 향상");
    }

    // 테스트 가능성
    if (!structure.hasTestSuite) {
      score -= 2;
      improvements.push("테스트 스위트 추가로 검증 용이성 확보");
    }

    score = Math.max(0, score);

    return {
      score,
      feedback: score >= 7 ? "유지보수하기 좋은 구조" : "유지보수성 개선 필요",
      improvements,
    };
  }

  // 안전성 평가
  private evaluateSafety(
    structure: PromptStructure,
    mode: string
  ): EvaluationDimension {
    let score = 10;
    const improvements: string[] = [];

    // 실패 복구 전략
    if (!structure.hasFailureRecovery) {
      score -= 3;
      improvements.push("실패 복구 및 롤백 전략 필수 추가");
    }

    // 보안 검증
    if (mode !== "MINIMAL" && !structure.hasSecurityChecks) {
      score -= 3;
      improvements.push("보안 검증 단계 추가");
    }

    // 검증 단계
    if (!structure.hasValidation) {
      score -= 2;
      improvements.push("최종 검증 단계 강화");
    }

    score = Math.max(0, score);

    return {
      score,
      feedback: score >= 7 ? "안전한 설계" : "안전성 강화 필요",
      improvements,
    };
  }

  // 개선 이력 조회
  getIterationHistory(): EvaluationResult[] {
    return this.evaluationHistory;
  }

  // 개선 추세 분석
  analyzeImprovementTrend(): {
    improving: boolean;
    scoreChange: number;
    recommendation: string;
  } {
    if (this.evaluationHistory.length < 2) {
      return {
        improving: false,
        scoreChange: 0,
        recommendation: "더 많은 반복 필요",
      };
    }

    const lastScore =
      this.evaluationHistory[this.evaluationHistory.length - 1].totalScore;
    const previousScore =
      this.evaluationHistory[this.evaluationHistory.length - 2].totalScore;
    const scoreChange = lastScore - previousScore;

    const improving = scoreChange > 0;

    let recommendation: string;
    if (scoreChange > 5) {
      recommendation = "큰 개선, 계속 진행";
    } else if (scoreChange > 0) {
      recommendation = "점진적 개선, 추가 반복 고려";
    } else if (scoreChange === 0) {
      recommendation = "정체 상태, 다른 접근법 시도";
    } else {
      recommendation = "퇴보 감지, 이전 버전으로 롤백 권장";
    }

    return {
      improving,
      scoreChange: Math.round(scoreChange * 10) / 10,
      recommendation,
    };
  }

  // 리셋
  reset(): void {
    this.currentIteration = 0;
    this.evaluationHistory = [];
  }
}

// 빠른 평가 유틸리티
export function quickEvaluate(
  promptContent: string,
  mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE" = "STANDARD"
): { score: number; status: string; topIssues: string[] } {
  const evaluator = new SelfEvaluator();
  const result = evaluator.evaluate(promptContent, [], mode);

  let status: string;
  if (result.totalScore >= 80) {
    status = "우수";
  } else if (result.totalScore >= 70) {
    status = "양호";
  } else if (result.totalScore >= 50) {
    status = "개선 필요";
  } else {
    status = "미흡";
  }

  return {
    score: result.totalScore,
    status,
    topIssues: result.suggestedImprovements.slice(0, 3),
  };
}

// 사용 예시
if (require.main === module) {
  const samplePrompt = `
---
allowed-tools: Task, Read, Write
description: 사용자 인증 모듈
model: sonnet
---

# 사용자 인증 모듈

## 변수
- $1: 프로젝트 경로

## 지침
- JWT 기반 인증 구현
- 보안 모범 사례 준수

## 워크플로우

### 단계 1: 설계
- 인증 흐름 설계

### 단계 2: 구현
- 핵심 로직 구현

### 단계 3: 테스트
- 단위 테스트 작성

### 단계 4: 검증
- 보안 검증

## 테스트 스위트
- 인증 성공/실패 테스트
- 토큰 만료 테스트
`;

  const evaluator = new SelfEvaluator();
  const result = evaluator.evaluate(
    samplePrompt,
    ["JWT", "인증", "보안"],
    "STANDARD"
  );

  console.log("평가 결과:");
  console.log(JSON.stringify(result, null, 2));

  console.log("\n빠른 평가:");
  console.log(quickEvaluate(samplePrompt, "STANDARD"));
}
