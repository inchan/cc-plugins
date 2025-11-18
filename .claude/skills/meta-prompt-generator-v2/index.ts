#!/usr/bin/env node
/**
 * Meta Prompt Generator v2 - Main Orchestrator
 *
 * 모든 모듈을 통합하여 실행 가능한 메타프롬프트 생성 시스템을 제공합니다.
 */

import * as fs from "fs";
import * as path from "path";

// 모든 모듈을 단일 파일로 통합

// ====== 타입 정의 ======
interface ComplexityResult {
  score: number;
  mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE";
  recommendations: string[];
}

interface UserRequirements {
  projectType: string;
  framework: string;
  description: string;
  features: string[];
  qualityLevel: "basic" | "standard" | "high";
}

interface EvaluationResult {
  totalScore: number;
  passed: boolean;
  suggestedImprovements: string[];
}

interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

interface CostReport {
  estimated: TokenUsage;
  actual: TokenUsage;
  budgetUsed: number;
}

interface GeneratedPrompt {
  name: string;
  content: string;
  mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE";
  filePath: string;
  metadata: {
    version: string;
    created: string;
    complexity: ComplexityResult;
    estimatedCost: number;
  };
}

interface GenerationResult {
  success: boolean;
  prompt?: GeneratedPrompt;
  evaluation?: EvaluationResult;
  costReport?: CostReport;
  error?: string;
}

// ====== 간단한 복잡도 분석기 (인라인) ======
function quickComplexityEstimate(
  projectType: string,
  description: string
): ComplexityResult {
  const keywords = description.toLowerCase();
  let score = 30; // 기본 점수
  const recommendations: string[] = [];

  // 규모 키워드
  if (keywords.includes("전체") || keywords.includes("full") || keywords.includes("complete")) {
    score += 40;
    recommendations.push("대규모 프로젝트: COMPREHENSIVE 모드 권장");
  } else if (keywords.includes("모듈") || keywords.includes("module") || keywords.includes("기능")) {
    score += 20;
    recommendations.push("중간 규모: STANDARD 모드 적합");
  }

  // 복잡도 키워드
  if (keywords.includes("인증") || keywords.includes("auth")) {
    score += 15;
    recommendations.push("인증 기능: 보안 검증 필수");
  }
  if (keywords.includes("보안") || keywords.includes("security")) {
    score += 10;
    recommendations.push("보안 중요: Level 3+ 검증 권장");
  }
  if (keywords.includes("api") || keywords.includes("backend")) {
    score += 10;
    recommendations.push("API 개발: 테스트 커버리지 80%+ 권장");
  }
  if (keywords.includes("테스트") || keywords.includes("test")) {
    score += 5;
    recommendations.push("테스트 포함: TDD 접근 권장");
  }

  // 단순화 키워드
  if (keywords.includes("간단") || keywords.includes("simple") || keywords.includes("빠르게")) {
    score -= 20;
    recommendations.push("단순 작업: MINIMAL 모드로 빠르게 처리");
  }

  score = Math.max(0, Math.min(100, score));

  let mode: "MINIMAL" | "STANDARD" | "COMPREHENSIVE";
  if (score < 30) {
    mode = "MINIMAL";
  } else if (score < 60) {
    mode = "STANDARD";
  } else {
    mode = "COMPREHENSIVE";
  }

  return { score, mode, recommendations };
}

// ====== 간단한 비용 추적기 (인라인) ======
function estimateCost(mode: string, phases: number): TokenUsage {
  const tokensPerPhase: Record<string, number> = {
    MINIMAL: 3000,
    STANDARD: 8000,
    COMPREHENSIVE: 15000,
  };
  const base = (tokensPerPhase[mode] || 8000) * phases;
  const total = Math.round(base * 1.2); // 20% 오버헤드
  return {
    prompt: Math.round(total * 0.3),
    completion: Math.round(total * 0.7),
    total,
  };
}

// ====== 간단한 자기 평가기 (인라인) ======
function evaluatePrompt(
  content: string,
  requiredFeatures: string[],
  mode: string
): EvaluationResult {
  let score = 70; // 기본 점수
  const improvements: string[] = [];
  const lowerContent = content.toLowerCase();

  // 모드별 구조 체크
  if (mode === "MINIMAL") {
    // MINIMAL 모드: 단계와 성공 기준만 체크
    if (!lowerContent.includes("## 단계") && !lowerContent.includes("## steps")) {
      score -= 15;
      improvements.push("단계 섹션 추가 필요");
    }
    if (!lowerContent.includes("## 성공 기준") && !lowerContent.includes("## success")) {
      score -= 10;
      improvements.push("성공 기준 섹션 추가 필요");
    }
  } else {
    // STANDARD/COMPREHENSIVE: 워크플로우와 지침 체크
    if (!lowerContent.includes("## 워크플로우") && !lowerContent.includes("## workflow")) {
      score -= 15;
      improvements.push("워크플로우 섹션 추가 필요");
    }
    if (!lowerContent.includes("## 지침") && !lowerContent.includes("## instructions")) {
      score -= 10;
      improvements.push("지침 섹션 추가 필요");
    }
    if (!lowerContent.includes("검증") && !lowerContent.includes("validation")) {
      score -= 10;
      improvements.push("검증 단계 추가 필요");
    }
  }

  // 기능 체크 (MINIMAL은 관대하게)
  if (mode !== "MINIMAL") {
    for (const feature of requiredFeatures) {
      if (!lowerContent.includes(feature.toLowerCase())) {
        score -= 5;
        improvements.push(`누락된 기능: ${feature}`);
      }
    }
  }

  // COMPREHENSIVE 모드 추가 체크
  if (mode === "COMPREHENSIVE") {
    if (!lowerContent.includes("보안") && !lowerContent.includes("security")) {
      score -= 10;
      improvements.push("보안 검증 섹션 필수");
    }
    if (!lowerContent.includes("테스트") && !lowerContent.includes("test")) {
      score -= 10;
      improvements.push("테스트 스위트 필수");
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    totalScore: score,
    passed: score >= 70,
    suggestedImprovements: improvements.slice(0, 5),
  };
}

// ====== 간단한 실패 복구 (인라인) ======
async function executeWithRetry<T>(
  name: string,
  fn: () => Promise<T>,
  maxRetries: number = 2
): Promise<{ success: boolean; result?: T; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  [${name}] 시도 ${attempt}/${maxRetries}...`);
      const result = await fn();
      return { success: true, result };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`  [${name}] 실패: ${errorMsg}`);
      if (attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.log(`  ${delay}ms 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        return { success: false, error: errorMsg };
      }
    }
  }
  return { success: false, error: "최대 재시도 횟수 초과" };
}

export class MetaPromptGeneratorV2 {
  private outputDir: string;
  private maxIterations: number = 3;
  private tokenUsage: TokenUsage = { prompt: 0, completion: 0, total: 0 };
  private estimatedTokens: TokenUsage = { prompt: 0, completion: 0, total: 0 };

  constructor(outputDir: string = "./.claude/commands") {
    this.outputDir = outputDir;
  }

  /**
   * 메인 생성 함수
   */
  async generate(userRequest: string): Promise<GenerationResult> {
    console.log("\n=== Meta Prompt Generator v2 ===\n");

    try {
      // Phase 0: 복잡도 분석
      console.log("Phase 0: 복잡도 분석...");
      const complexityResult = await executeWithRetry("complexity_analysis", async () => {
        const projectType = this.detectProjectType();
        return quickComplexityEstimate(projectType, userRequest);
      });

      if (!complexityResult.success || !complexityResult.result) {
        return {
          success: false,
          error: `복잡도 분석 실패: ${complexityResult.error}`,
        };
      }

      const complexity = complexityResult.result;
      console.log(`  모드: ${complexity.mode}`);
      console.log(`  점수: ${complexity.score}/100`);
      if (complexity.recommendations.length > 0) {
        console.log(`  권장사항:`);
        complexity.recommendations.forEach((r) => console.log(`    - ${r}`));
      }

      // Phase 1: 비용 예산 설정
      console.log("\nPhase 1: 비용 예산 설정...");
      const estimatedPhases = this.getPhaseCount(complexity.mode);
      this.estimatedTokens = estimateCost(complexity.mode, estimatedPhases);
      console.log(`  예상 토큰: ${this.estimatedTokens.total}`);
      console.log(`  예산 (1.5x): ${Math.round(this.estimatedTokens.total * 1.5)}`);

      // Phase 2: 요구사항 수집
      console.log("\nPhase 2: 요구사항 분석...");
      const requirements = this.parseRequirements(userRequest);
      console.log(`  프로젝트 타입: ${requirements.projectType}`);
      console.log(`  프레임워크: ${requirements.framework}`);
      console.log(`  기능: ${requirements.features.join(", ")}`);
      console.log(`  품질 수준: ${requirements.qualityLevel}`);

      // Phase 3: 프롬프트 생성 (반복 개선)
      let currentPrompt: GeneratedPrompt | null = null;
      let currentEvaluation: EvaluationResult | null = null;
      let iteration = 0;

      while (iteration < this.maxIterations) {
        iteration++;
        console.log(`\nPhase 3.${iteration}: 프롬프트 생성 (반복 ${iteration}/${this.maxIterations})...`);

        const generationResult = await executeWithRetry("prompt_generation", async () => {
          return this.generatePromptContent(requirements, complexity, currentEvaluation);
        });

        if (!generationResult.success || !generationResult.result) {
          return {
            success: false,
            error: `프롬프트 생성 실패: ${generationResult.error}`,
          };
        }

        currentPrompt = generationResult.result;
        this.tokenUsage.total += Math.round(this.estimatedTokens.total / estimatedPhases);

        // Phase 4: 자기 평가
        console.log(`\nPhase 4.${iteration}: 자기 평가...`);
        const evalResult = await executeWithRetry("self_evaluation", async () => {
          return evaluatePrompt(currentPrompt!.content, requirements.features, complexity.mode);
        });

        if (!evalResult.success || !evalResult.result) {
          return {
            success: false,
            error: `평가 실패: ${evalResult.error}`,
          };
        }

        currentEvaluation = evalResult.result;
        console.log(`  점수: ${currentEvaluation.totalScore}/100`);
        console.log(`  통과: ${currentEvaluation.passed ? "예 ✓" : "아니오 ✗"}`);

        if (currentEvaluation.passed) {
          console.log("  ✓ 품질 기준 충족!");
          break;
        }

        if (iteration < this.maxIterations) {
          console.log("  개선 필요:");
          currentEvaluation.suggestedImprovements.forEach((imp) => {
            console.log(`    - ${imp}`);
          });
        }
      }

      if (!currentPrompt || !currentEvaluation) {
        return {
          success: false,
          error: "프롬프트 생성 실패",
        };
      }

      // Phase 5: 저장
      console.log("\nPhase 5: 저장...");
      const savedPath = this.savePrompt(currentPrompt);
      currentPrompt.filePath = savedPath;
      console.log(`  저장됨: ${savedPath}`);

      // 비용 보고서 생성
      const budgetUsed = Math.round((this.tokenUsage.total / (this.estimatedTokens.total * 1.5)) * 100);
      const costReport: CostReport = {
        estimated: this.estimatedTokens,
        actual: this.tokenUsage,
        budgetUsed,
      };

      console.log("\n=== 생성 완료 ===");
      console.log(`모드: ${complexity.mode}`);
      console.log(`최종 점수: ${currentEvaluation.totalScore}/100`);
      console.log(`반복 횟수: ${iteration}`);
      console.log(`토큰 사용: ${costReport.actual.total} (예산의 ${costReport.budgetUsed}%)`);

      return {
        success: true,
        prompt: currentPrompt,
        evaluation: currentEvaluation,
        costReport: costReport,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `예상치 못한 오류: ${errorMessage}`,
      };
    }
  }

  /**
   * 프로젝트 타입 감지
   */
  private detectProjectType(): string {
    // 현재 디렉토리의 파일들을 확인
    const cwd = process.cwd();

    if (fs.existsSync(path.join(cwd, "package.json"))) {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(cwd, "package.json"), "utf-8")
      );
      if (pkg.dependencies?.react || pkg.devDependencies?.react) {
        return "react";
      }
      if (pkg.dependencies?.next || pkg.devDependencies?.next) {
        return "nextjs";
      }
      return "nodejs";
    }

    if (fs.existsSync(path.join(cwd, "pubspec.yaml"))) {
      return "flutter";
    }

    if (fs.existsSync(path.join(cwd, "requirements.txt"))) {
      return "python";
    }

    if (fs.existsSync(path.join(cwd, "go.mod"))) {
      return "go";
    }

    return "generic";
  }

  /**
   * 모드별 단계 수
   */
  private getPhaseCount(mode: string): number {
    switch (mode) {
      case "MINIMAL":
        return 3;
      case "STANDARD":
        return 5;
      case "COMPREHENSIVE":
        return 8;
      default:
        return 5;
    }
  }

  /**
   * 요구사항 파싱
   */
  private parseRequirements(userRequest: string): UserRequirements {
    const lowerRequest = userRequest.toLowerCase();

    // 프레임워크 감지
    let framework = "generic";
    if (lowerRequest.includes("react")) framework = "react";
    else if (lowerRequest.includes("next")) framework = "nextjs";
    else if (lowerRequest.includes("flutter")) framework = "flutter";
    else if (lowerRequest.includes("node")) framework = "nodejs";
    else if (lowerRequest.includes("python")) framework = "python";
    else if (lowerRequest.includes("go ") || lowerRequest.includes("golang"))
      framework = "go";

    // 기능 추출
    const features: string[] = [];
    if (lowerRequest.includes("인증") || lowerRequest.includes("auth")) {
      features.push("authentication");
    }
    if (lowerRequest.includes("api") || lowerRequest.includes("엔드포인트")) {
      features.push("api");
    }
    if (lowerRequest.includes("데이터베이스") || lowerRequest.includes("db")) {
      features.push("database");
    }
    if (lowerRequest.includes("테스트") || lowerRequest.includes("test")) {
      features.push("testing");
    }
    if (lowerRequest.includes("보안") || lowerRequest.includes("security")) {
      features.push("security");
    }

    if (features.length === 0) {
      features.push("core_functionality");
    }

    // 품질 수준 감지
    let qualityLevel: "basic" | "standard" | "high" = "standard";
    if (
      lowerRequest.includes("간단") ||
      lowerRequest.includes("빠르게") ||
      lowerRequest.includes("prototype")
    ) {
      qualityLevel = "basic";
    } else if (
      lowerRequest.includes("프로덕션") ||
      lowerRequest.includes("production") ||
      lowerRequest.includes("완전")
    ) {
      qualityLevel = "high";
    }

    return {
      projectType: this.detectProjectType(),
      framework,
      description: userRequest,
      features,
      qualityLevel,
    };
  }

  /**
   * 프롬프트 콘텐츠 생성
   */
  private generatePromptContent(
    requirements: UserRequirements,
    complexity: ComplexityResult,
    previousEvaluation: ReturnType<SelfEvaluator["evaluate"]> | null
  ): GeneratedPrompt {
    const promptName = this.generatePromptName(requirements.description);
    const now = new Date().toISOString();

    let content: string;

    switch (complexity.mode) {
      case "MINIMAL":
        content = this.generateMinimalPrompt(requirements, promptName);
        break;
      case "COMPREHENSIVE":
        content = this.generateComprehensivePrompt(
          requirements,
          promptName,
          previousEvaluation
        );
        break;
      default:
        content = this.generateStandardPrompt(
          requirements,
          promptName,
          previousEvaluation
        );
    }

    return {
      name: promptName,
      content,
      mode: complexity.mode,
      filePath: "",
      metadata: {
        version: "2.0.0",
        created: now,
        complexity,
        estimatedCost: this.costTracker?.getRemainingBudget() || 0,
      },
    };
  }

  /**
   * MINIMAL 모드 프롬프트 생성
   */
  private generateMinimalPrompt(
    requirements: UserRequirements,
    promptName: string
  ): string {
    return `---
allowed-tools: Task, Read, Write, Edit, Bash
description: ${requirements.description}
model: haiku
---

# ${promptName}

## 목표
${requirements.description}

## 단계

### 1. 구현
- 프레임워크: ${requirements.framework}
- 기능: ${requirements.features.join(", ")}
- 최소한의 실행 가능한 구현 작성

### 2. 검증
- 기본 동작 확인
- 에러 없음 확인

### 3. 완료
- 결과 보고

## 성공 기준
- 핵심 기능 동작
- 컴파일/실행 에러 없음
`;
  }

  /**
   * STANDARD 모드 프롬프트 생성
   */
  private generateStandardPrompt(
    requirements: UserRequirements,
    promptName: string,
    previousEvaluation: ReturnType<SelfEvaluator["evaluate"]> | null
  ): string {
    // 이전 평가 기반 개선사항 반영
    let additionalInstructions = "";
    if (previousEvaluation && !previousEvaluation.passed) {
      additionalInstructions = `

## 개선 필수사항
${previousEvaluation.suggestedImprovements.map((imp) => `- ${imp}`).join("\n")}
`;
    }

    const validationCommands = this.getValidationCommands(requirements.framework);

    return `---
allowed-tools: Task, Read, Write, Edit, Bash, Glob, Grep
description: ${requirements.description}
model: sonnet
version: 1.0.0
---

# ${promptName}

## 변수
- $PROJECT_ROOT: 프로젝트 루트 경로
- $FRAMEWORK: ${requirements.framework}

## 지침
- ${requirements.framework} 모범 사례 준수
- 타입 안전성 확보
- 에러 핸들링 필수
- 테스트 코드 포함
${additionalInstructions}

## 워크플로우

### 단계 1: 설계
**종속성**: 없음
**실행 모드**: 순차적

- 아키텍처 설계
- 파일 구조 계획
- 의존성 목록 작성

**성공 기준**: 명확한 설계 문서

---

### 단계 2: 핵심 구현
**종속성**: 단계 1
**실행 모드**: 순차적

- ${requirements.features.join("\n- ")}
- 기본 구조 작성

**성공 기준**: 핵심 기능 구현 완료

---

### 단계 3: 테스트 작성
**종속성**: 단계 2
**실행 모드**: 병렬 (가능시)

- 단위 테스트
- 통합 테스트
- 엣지 케이스

**성공 기준**: 커버리지 >= 80%

---

### 단계 4: 검증
**종속성**: 단계 2, 3
**실행 모드**: 순차적

실행 명령:
\`\`\`bash
${validationCommands.join("\n")}
\`\`\`

**성공 기준**: 모든 검증 통과

---

### 단계 5: 문서화
**종속성**: 단계 4
**실행 모드**: 순차적

- README 업데이트
- 사용법 문서화
- API 문서 (해당시)

**성공 기준**: 완전한 문서

---

## 테스트 스위트

### 필수 테스트
${requirements.features.map((f) => `- ${f} 기능 테스트`).join("\n")}

### 검증 명령
\`\`\`bash
${validationCommands.join("\n")}
\`\`\`

## 실패 복구
- 단계 실패 시: 에러 분석 후 수정
- 검증 실패 시: 문제 해결 후 재검증
- 최대 2회 재시도

## 최종 결과물
- 구현된 기능 코드
- 테스트 코드
- 문서

## 보고서
- 구현된 기능 목록
- 테스트 결과
- 알려진 제한사항
`;
  }

  /**
   * COMPREHENSIVE 모드 프롬프트 생성
   */
  private generateComprehensivePrompt(
    requirements: UserRequirements,
    promptName: string,
    previousEvaluation: ReturnType<SelfEvaluator["evaluate"]> | null
  ): string {
    const validationCommands = this.getValidationCommands(requirements.framework);
    const securityCommands = this.getSecurityCommands(requirements.framework);

    let improvements = "";
    if (previousEvaluation && !previousEvaluation.passed) {
      improvements = previousEvaluation.suggestedImprovements
        .map((imp) => `- ${imp}`)
        .join("\n");
    }

    return `---
allowed-tools: Task, Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch
description: ${requirements.description}
argument-hint: [project-path]
model: sonnet
version: 1.0.0
cost-budget: 50000
---

# ${promptName}

## 메타데이터
- 버전: 1.0.0
- 생성일: ${new Date().toISOString()}
- 프레임워크: ${requirements.framework}
- 품질 수준: ${requirements.qualityLevel}

## 변수
- $1: 프로젝트 경로 (기본값: 현재 디렉토리)
- $PROJECT_TYPE: ${requirements.projectType}
- $FRAMEWORK: ${requirements.framework}

## 전제조건
- ${requirements.framework} 개발 환경 구성됨
- 필수 도구 설치됨
- 적절한 권한 보유

## 지침
- ${requirements.framework} 최신 모범 사례 준수
- SOLID 원칙 적용
- 보안 최우선 (OWASP Top 10 고려)
- 성능 최적화
- 완전한 타입 안전성
- 포괄적 에러 핸들링
- 테스트 주도 개발 (TDD)

${improvements ? `## 필수 개선사항\n${improvements}\n` : ""}

## 코드베이스 구조
\`\`\`
$PROJECT_ROOT/
├── src/
│   ├── core/           # 핵심 비즈니스 로직
│   ├── features/       # 기능별 모듈
│   ├── shared/         # 공유 유틸리티
│   └── types/          # 타입 정의
├── tests/
│   ├── unit/           # 단위 테스트
│   ├── integration/    # 통합 테스트
│   └── e2e/            # E2E 테스트
├── docs/               # 문서
└── config/             # 설정 파일
\`\`\`

## 워크플로우

### 단계 1: 사전 분석
**종속성**: 없음
**실행 모드**: 병렬 (Task 사용)
**서브 에이전트 전략**: 3개 병렬 에이전트

1. Agent 1: ${requirements.framework} 최신 문서 조사
2. Agent 2: 유사 프로젝트 패턴 분석
3. Agent 3: 보안 권고사항 수집

**병렬 실행**: 가능 (독립적 작업)
**실패 복구**: 내장 지식으로 대체

---

### 단계 2: 상세 설계
**종속성**: 단계 1
**실행 모드**: 순차적

- 아키텍처 다이어그램 작성
- API 스펙 정의
- 데이터 모델 설계
- 보안 요구사항 명세

**성공 기준**: 검토 가능한 설계 문서
**실패 복구**: 대체 설계 패턴 적용

---

### 단계 3-5: 핵심 구현 (병렬 가능)
**종속성**: 단계 2
**실행 모드**: 병렬 (ROI > 1.5인 경우)

3. 핵심 비즈니스 로직
4. API/인터페이스 레이어
5. 데이터 액세스 레이어

각 단계:
- 입력: 설계 문서
- 출력: 구현된 코드 + 단위 테스트
- 성공 기준: 컴파일 성공 + 테스트 통과

**실패 복구**: 롤백 후 재시도 (최대 2회)

---

### 단계 6: 통합
**종속성**: 단계 3, 4, 5
**실행 모드**: 순차적

- 모듈 통합
- 의존성 연결
- 통합 테스트 실행

**성공 기준**: 전체 시스템 동작
**실패 복구**: 문제 모듈 식별 및 수정

---

### 단계 7: 보안 검증
**종속성**: 단계 6
**실행 모드**: 순차적

\`\`\`bash
${securityCommands.join("\n")}
\`\`\`

**성공 기준**: Critical/High 취약점 0개
**실패 복구**: 취약점 수정 후 재검증

---

### 단계 8: 최종 검증
**종속성**: 단계 7
**실행 모드**: 순차적

\`\`\`bash
${validationCommands.join("\n")}
\`\`\`

**검증 수준**:
- Level 1 (CRITICAL): 필수
- Level 2 (ERROR): 필수
- Level 3 (WARNING): 강력 권장
- Level 4 (INFO): 권장

**성공 기준**: Level 3 이상 달성

---

## 테스트 스위트

### 단위 테스트 (80%+ 커버리지)
${requirements.features
  .map(
    (f) => `- ${f}: 성공/실패/엣지 케이스
  - 최소 3개 테스트 케이스
  - 모킹 사용`
  )
  .join("\n")}

### 통합 테스트
- 전체 워크플로우 검증
- 외부 의존성 통합
- 데이터 흐름 확인

### E2E 테스트
- 사용자 시나리오
- 실제 환경 시뮬레이션
- 성능 측정

### 보안 테스트
- 인젝션 방지
- 인증/인가 검증
- 데이터 보호

## 비용 추적
- 예상 토큰: 35,000
- 최대 예산: 50,000
- 경고 임계값: 80%

병렬화 ROI 조건:
- 예상 시간 절약 > 30초
- 추가 비용 < 예산의 10%
- ROI > 1.5

## 자기 평가 체크리스트
- [ ] 기능적 완전성 >= 8/10
- [ ] 실행 가능성 >= 7/10
- [ ] 효율성 >= 7/10
- [ ] 유지보수성 >= 7/10
- [ ] 안전성 >= 8/10
- [ ] 총점 >= 70/100

## 최종 결과물
- 완전한 구현 코드
- 포괄적 테스트 스위트
- API 문서
- 사용자 가이드
- 배포 가이드
- 보안 보고서

## 보고서 형식
\`\`\`markdown
# 구현 보고서

## 요약
- 총 파일: N개
- 코드 라인: N줄
- 테스트 커버리지: N%
- 검증 수준: Level N

## 구현된 기능
- [x] 기능 1
- [x] 기능 2
...

## 테스트 결과
- 단위: N/N 통과
- 통합: N/N 통과
- E2E: N/N 통과

## 보안 상태
- Critical: 0개
- High: 0개
- Medium: N개
- Low: N개

## 알려진 제한사항
- 제한 1
- 제한 2

## 다음 단계
- 개선점 1
- 개선점 2
\`\`\`
`;
  }

  /**
   * 프레임워크별 검증 명령
   */
  private getValidationCommands(framework: string): string[] {
    switch (framework) {
      case "react":
      case "nextjs":
        return [
          "npm run build",
          "npm test -- --coverage",
          "npm run lint",
          "npx tsc --noEmit",
        ];
      case "flutter":
        return [
          "flutter analyze",
          "flutter test --coverage",
          "flutter build apk --debug",
        ];
      case "python":
        return [
          "python -m pytest --cov=.",
          "python -m mypy .",
          "python -m flake8 .",
        ];
      case "go":
        return ["go build ./...", "go test -cover ./...", "go vet ./..."];
      case "nodejs":
        return ["npm run build", "npm test", "npm run lint"];
      default:
        return ["# 프레임워크별 검증 명령 추가"];
    }
  }

  /**
   * 프레임워크별 보안 명령
   */
  private getSecurityCommands(framework: string): string[] {
    switch (framework) {
      case "react":
      case "nextjs":
      case "nodejs":
        return [
          "npm audit --production",
          "npx eslint --config security .",
          "git secrets --scan",
        ];
      case "flutter":
        return ["flutter pub outdated", "dart pub global activate pana && pana"];
      case "python":
        return ["pip-audit", "safety check", "bandit -r ."];
      case "go":
        return ["go list -m all | nancy sleuth", "gosec ./..."];
      default:
        return ["# 보안 스캔 명령 추가"];
    }
  }

  /**
   * 프롬프트 이름 생성
   */
  private generatePromptName(description: string): string {
    return description
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
  }

  /**
   * 프롬프트 저장
   */
  private savePrompt(prompt: GeneratedPrompt): string {
    // 디렉토리 생성
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const filePath = path.join(this.outputDir, `${prompt.name}.md`);

    // 프롬프트 파일 저장
    fs.writeFileSync(filePath, prompt.content, "utf-8");

    // 메타데이터 저장
    const metadataPath = path.join(this.outputDir, `${prompt.name}.meta.json`);
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(prompt.metadata, null, 2),
      "utf-8"
    );

    return filePath;
  }
}

// CLI 실행
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("사용법: npx ts-node index.ts <요청>");
    console.log('예시: npx ts-node index.ts "사용자 인증 모듈 만들어줘"');
    process.exit(1);
  }

  const userRequest = args.join(" ");
  const generator = new MetaPromptGeneratorV2();
  const result = await generator.generate(userRequest);

  if (result.success) {
    console.log("\n✓ 성공적으로 생성됨");
    console.log(`파일: ${result.prompt?.filePath}`);
  } else {
    console.error(`\n✗ 실패: ${result.error}`);
    process.exit(1);
  }
}

// ESM entry point check
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
