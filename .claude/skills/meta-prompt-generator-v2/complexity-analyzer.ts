/**
 * 복잡도 분석기 - Meta Prompt Generator v2
 *
 * 작업의 실제 복잡도를 분석하여 적절한 모드를 결정합니다.
 */

interface QuantitativeMetrics {
  estimatedFiles: number;
  estimatedLinesOfCode: number;
  externalDependencies: number;
  expectedTestCases: number;
}

interface QualitativeMetrics {
  domainFamiliarity: "high" | "medium" | "low";
  technicalUncertainty: "high" | "medium" | "low";
  requirementClarity: "high" | "medium" | "low";
}

interface ComplexityResult {
  score: number;
  mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE";
  breakdown: {
    quantitative: number;
    qualitative: number;
  };
  recommendations: string[];
}

export function analyzeComplexity(
  quantitative: QuantitativeMetrics,
  qualitative: QualitativeMetrics
): ComplexityResult {
  // 정량적 점수 계산 (0-100)
  const quantScore = calculateQuantitativeScore(quantitative);

  // 정성적 점수 계산 (0-100)
  const qualScore = calculateQualitativeScore(qualitative);

  // 가중 평균 (정량 60%, 정성 40%)
  const totalScore = quantScore * 0.6 + qualScore * 0.4;

  // 모드 결정
  const mode = determineMode(totalScore);

  // 권장사항 생성
  const recommendations = generateRecommendations(
    quantitative,
    qualitative,
    mode
  );

  return {
    score: Math.round(totalScore * 10) / 10,
    mode,
    breakdown: {
      quantitative: Math.round(quantScore * 10) / 10,
      qualitative: Math.round(qualScore * 10) / 10,
    },
    recommendations,
  };
}

function calculateQuantitativeScore(metrics: QuantitativeMetrics): number {
  // 각 지표를 0-100 범위로 정규화
  const fileScore = Math.min((metrics.estimatedFiles / 100) * 100, 100);
  const locScore = Math.min((metrics.estimatedLinesOfCode / 10000) * 100, 100);
  const depScore = Math.min((metrics.externalDependencies / 20) * 100, 100);
  const testScore = Math.min((metrics.expectedTestCases / 50) * 100, 100);

  // 가중 평균
  return fileScore * 0.2 + locScore * 0.3 + depScore * 0.3 + testScore * 0.2;
}

function calculateQualitativeScore(metrics: QualitativeMetrics): number {
  const levelToScore: Record<string, number> = {
    high: 100,
    medium: 50,
    low: 0,
  };

  // 도메인 친숙도가 낮으면 복잡도 증가
  const domainScore = 100 - levelToScore[metrics.domainFamiliarity];

  // 기술적 불확실성이 높으면 복잡도 증가
  const uncertaintyScore = levelToScore[metrics.technicalUncertainty];

  // 요구사항 명확성이 낮으면 복잡도 증가
  const clarityScore = 100 - levelToScore[metrics.requirementClarity];

  // 가중 평균
  return domainScore * 0.3 + uncertaintyScore * 0.4 + clarityScore * 0.3;
}

function determineMode(
  score: number
): "MINIMAL" | "STANDARD" | "COMPREHENSIVE" {
  if (score < 30) {
    return "MINIMAL";
  } else if (score < 60) {
    return "STANDARD";
  } else {
    return "COMPREHENSIVE";
  }
}

function generateRecommendations(
  quant: QuantitativeMetrics,
  qual: QualitativeMetrics,
  mode: string
): string[] {
  const recommendations: string[] = [];

  // 파일 수 관련
  if (quant.estimatedFiles > 50) {
    recommendations.push(
      "대규모 프로젝트: 모듈화 및 단계별 구현 권장"
    );
  }

  // 의존성 관련
  if (quant.externalDependencies > 10) {
    recommendations.push(
      "많은 외부 의존성: 의존성 충돌 검증 단계 필수"
    );
  }

  // 도메인 친숙도 관련
  if (qual.domainFamiliarity === "low") {
    recommendations.push(
      "도메인 친숙도 낮음: 추가 리서치 단계 포함 권장"
    );
  }

  // 기술적 불확실성 관련
  if (qual.technicalUncertainty === "high") {
    recommendations.push(
      "기술적 불확실성 높음: 프로토타입 단계 선행 권장"
    );
  }

  // 요구사항 명확성 관련
  if (qual.requirementClarity === "low") {
    recommendations.push(
      "요구사항 불명확: 사용자와 추가 질의응답 필요"
    );
  }

  // 모드별 권장사항
  if (mode === "MINIMAL") {
    recommendations.push(
      "MINIMAL 모드: Haiku 모델 사용으로 비용 최적화"
    );
  } else if (mode === "COMPREHENSIVE") {
    recommendations.push(
      "COMPREHENSIVE 모드: 병렬화 및 자기 평가 활성화"
    );
  }

  return recommendations;
}

// 빠른 복잡도 추정 (프로젝트 파일 기반)
export function quickComplexityEstimate(
  projectType: string,
  description: string
): ComplexityResult {
  const keywords = description.toLowerCase();

  // 키워드 기반 추정
  let files = 5;
  let loc = 500;
  let deps = 3;
  let tests = 5;

  // 규모 키워드
  if (keywords.includes("전체") || keywords.includes("full")) {
    files *= 10;
    loc *= 10;
    deps *= 3;
    tests *= 10;
  } else if (keywords.includes("모듈") || keywords.includes("module")) {
    files *= 3;
    loc *= 3;
    deps *= 2;
    tests *= 3;
  }

  // 복잡도 키워드
  if (keywords.includes("인증") || keywords.includes("auth")) {
    deps += 5;
    tests += 10;
  }
  if (keywords.includes("보안") || keywords.includes("security")) {
    tests += 15;
  }
  if (keywords.includes("api") || keywords.includes("backend")) {
    files += 10;
    loc += 2000;
  }

  const quantitative: QuantitativeMetrics = {
    estimatedFiles: files,
    estimatedLinesOfCode: loc,
    externalDependencies: deps,
    expectedTestCases: tests,
  };

  // 정성적 지표는 기본값 사용
  const qualitative: QualitativeMetrics = {
    domainFamiliarity: "medium",
    technicalUncertainty: "medium",
    requirementClarity: "medium",
  };

  return analyzeComplexity(quantitative, qualitative);
}

// 사용 예시
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = analyzeComplexity(
    {
      estimatedFiles: 25,
      estimatedLinesOfCode: 3500,
      externalDependencies: 8,
      expectedTestCases: 20,
    },
    {
      domainFamiliarity: "medium",
      technicalUncertainty: "high",
      requirementClarity: "medium",
    }
  );

  console.log("복잡도 분석 결과:");
  console.log(JSON.stringify(result, null, 2));
}
