# Meta Prompt Generator v2

> 적응형 복잡도, 자기 평가, 비용 인식을 갖춘 차세대 메타프롬프트 생성기

## 개요

Meta Prompt Generator v2는 v1의 한계를 극복한 차세대 메타프롬프트 생성기입니다. 단순히 구조화된 프롬프트를 생성하는 것이 아니라, **작업의 실제 복잡도에 맞게 적응**하고, **자기 평가를 통해 품질을 보장**하며, **비용 효율성을 고려한 병렬화 전략**을 제시합니다.

## v1 대비 주요 개선사항

| 영역 | v1 | v2 |
|------|----|----|
| 복잡도 | 고정된 구조 | 적응형 구조 (MINIMAL/STANDARD/COMPREHENSIVE) |
| 지식 수집 | 고정 3개 에이전트 | 동적 1-5개 에이전트 |
| 질문 프로세스 | 무한 반복 가능 | 최대 5회, fallback 전략 |
| 실패 처리 | 미고려 | 롤백/재시도/부분 성공 전략 |
| 비용 | 무제한 | ROI 기반 의사결정 |
| 품질 검증 | 에러 0개만 체크 | 5단계 검증 수준 |
| 피드백 루프 | 없음 | 자기 평가 및 학습 |

## 핵심 모듈

### 1. 복잡도 분석기 (`complexity-analyzer.ts`)

작업의 실제 복잡도를 분석하여 적절한 모드를 결정합니다.

```typescript
import { analyzeComplexity } from './complexity-analyzer';

const result = analyzeComplexity(
  {
    estimatedFiles: 25,
    estimatedLinesOfCode: 3500,
    externalDependencies: 8,
    expectedTestCases: 20
  },
  {
    domainFamiliarity: 'medium',
    technicalUncertainty: 'high',
    requirementClarity: 'medium'
  }
);

// 결과: { score: 52.3, mode: 'STANDARD', ... }
```

**3가지 모드:**
- **MINIMAL** (점수 < 30): 간단한 작업, 최소 오버헤드
- **STANDARD** (점수 30-60): 중간 규모, 균형잡힌 접근
- **COMPREHENSIVE** (점수 > 60): 대규모 프로젝트, 전체 기능

### 2. 비용 추적기 (`cost-tracker.ts`)

토큰 사용량 추적, ROI 계산, 비용 최적화 제안을 제공합니다.

```typescript
import { CostTracker, estimateCost } from './cost-tracker';

const tracker = new CostTracker({
  total: 50000,
  perPhase: 10000,
  warningThreshold: 0.8
});

// 병렬화 ROI 계산
const roi = tracker.calculateParallelizationROI(
  180,  // 순차 실행 시간 (초)
  100,  // 병렬 실행 시간 (초)
  2,    // 추가 에이전트 수
  5000  // 에이전트당 토큰
);

// 결과: { roi: 2.3, recommend: true, ... }
```

### 3. 자기 평가기 (`self-evaluator.ts`)

생성된 프롬프트의 품질을 5개 차원에서 평가합니다.

```typescript
import { SelfEvaluator } from './self-evaluator';

const evaluator = new SelfEvaluator();
const result = evaluator.evaluate(
  promptContent,
  ['JWT', '인증', '보안'],
  'STANDARD'
);

// 결과: {
//   totalScore: 78.2,
//   passed: true,
//   dimensions: {
//     functionalCompleteness: { score: 8, ... },
//     executability: { score: 7, ... },
//     ...
//   }
// }
```

**평가 차원:**
1. 기능적 완전성 (0-10)
2. 실행 가능성 (0-10)
3. 효율성 (0-10)
4. 유지보수성 (0-10)
5. 안전성 (0-10)

### 4. 실패 복구 관리자 (`failure-recovery.ts`)

단계별 실패 처리, 롤백, 재시도 전략을 관리합니다.

```typescript
import { FailureRecoveryManager, PRESET_STRATEGIES } from './failure-recovery';

const manager = new FailureRecoveryManager();
manager.registerStrategy('code_generation', PRESET_STRATEGIES.codeGeneration);

const result = await manager.executePhase('code_generation', async () => {
  // 작업 실행
  return await generateCode();
});

// 자동 재시도, 롤백, 부분 성공 처리
```

**주요 기능:**
- Exponential backoff 재시도
- 자동 롤백
- 체크포인트 저장/복원
- 부분 성공 인정

### 5. 테스트 생성기 (`test-generator.ts`)

실제 실행 가능한 테스트 코드를 자동으로 생성합니다.

```typescript
import { TestGenerator } from './test-generator';

const generator = new TestGenerator();
const { code, suite } = generator.generateCompleteTestFile('jest', {
  entityName: 'User',
  includeSecurityTests: true,
  includePerformanceTests: true,
  coverageTarget: 85
});

// 완전한 Jest 테스트 코드 생성
```

**지원 프레임워크:**
- Jest (JavaScript/TypeScript)
- Vitest (JavaScript/TypeScript)
- flutter_test (Dart)
- Pytest (Python)
- go_test (Go)

## 사용 방법

### Claude Code에서 사용

```
사용자: "사용자 인증 모듈 만들어줘"

Claude (v2 스킬 사용):
1. 복잡도 분석 → STANDARD 모드 결정
2. 최대 3회 질문으로 요구사항 수집
3. 표준 구조 프롬프트 생성
4. 자기 평가 (점수 78/100)
5. 비용 보고서 생성
6. 버전 관리와 함께 저장
```

### 직접 모듈 사용

```bash
# 복잡도 분석
npx ts-node complexity-analyzer.ts

# 비용 추적
npx ts-node cost-tracker.ts

# 자기 평가
npx ts-node self-evaluator.ts

# 실패 복구 테스트
npx ts-node failure-recovery.ts

# 테스트 코드 생성
npx ts-node test-generator.ts
```

## 파일 구조

```
meta-prompt-generator-v2/
├── SKILL.md                   # 스킬 정의 (Claude Code용)
├── README.md                  # 이 파일
├── package.json               # 패키지 설정
├── complexity-analyzer.ts     # 복잡도 분석 모듈
├── cost-tracker.ts            # 비용 추적 모듈
├── self-evaluator.ts          # 자기 평가 모듈
├── failure-recovery.ts        # 실패 복구 모듈
└── test-generator.ts          # 테스트 생성 모듈
```

## 복잡도 모드별 특징

### MINIMAL 모드
- **대상**: 간단한 유틸리티, 단일 함수
- **단계 수**: 최대 3개
- **모델**: Haiku (비용 최적화)
- **병렬화**: 없음
- **특징**: 최소 오버헤드

### STANDARD 모드
- **대상**: 중간 규모 기능, 모듈
- **단계 수**: 3-6개
- **모델**: Sonnet
- **병렬화**: ROI > 1.5인 경우만
- **특징**: 균형잡힌 접근

### COMPREHENSIVE 모드
- **대상**: 대규모 프로젝트, 전체 스택
- **단계 수**: 7개 이상
- **모델**: Sonnet/Opus
- **병렬화**: 적극 활용
- **특징**: 전체 기능, 완전한 검증

## 보안 검증

v2는 보안을 필수 요소로 포함합니다:

```markdown
## 검증 수준

Level 1 (CRITICAL): 에러 0개, 런타임 크래시 0개
Level 2 (ERROR): 린트 에러 0개, 테스트 실패 0개
Level 3 (WARNING): 커버리지 >= 80%, 성능 목표 달성
Level 4 (INFO): 문서화 완전, 접근성 검증
Level 5 (EXCELLENCE): 모든 지표 최적화
```

**보안 스캔:**
- 의존성 취약점 (npm audit, pip-audit)
- 코드 보안 분석 (ESLint security, semgrep)
- 시크릿 노출 검사 (git secrets, trufflehog)
- OWASP Top 10 체크리스트

## 마이그레이션 (v1 → v2)

기존 v1 프롬프트를 v2로 업그레이드:

1. 복잡도 분석 추가
2. 버전 관리 메타데이터 추가
3. 실패 복구 전략 포함
4. 보안 검증 단계 추가
5. 자기 평가 섹션 추가

## 제한사항

- 극도로 동적인 작업에는 제한적
- 매우 전문적인 도메인은 웹 검색 한계
- 혁신적 접근법은 여전히 인간 판단 필요
- 실시간 환경에는 재생성 필요

## 향후 계획

### v2.1
- 자연어 복잡도 분석 개선
- 더 정교한 ROI 모델
- A/B 테스트 지원

### v2.2
- 다국어 프롬프트 생성
- 팀 협업 기능
- 실시간 비용 모니터링

### v3.0
- 자기 진화 프롬프트
- 컨텍스트 기반 자동 개선
- 예측적 최적화

## 빠른 시작

```bash
# 메인 생성기 실행
npx tsx index.ts "사용자 인증 모듈 만들어줘"

# 개별 모듈 테스트
npx tsx complexity-analyzer.ts
npx tsx cost-tracker.ts
npx tsx self-evaluator.ts
npx tsx failure-recovery.ts
npx tsx test-generator.ts

# 통합 테스트 실행
npx tsx --test __tests__/integration.test.ts
```

## 테스트 결과

```
# tests 19
# suites 6
# pass 19
# fail 0
# duration_ms 2454ms
```

**테스트 커버리지:**
- Complexity Analyzer: 4/4 ✅
- Cost Tracker: 4/4 ✅
- Self Evaluator: 3/3 ✅
- Failure Recovery: 3/3 ✅
- Test Generator: 4/4 ✅
- End-to-End: 1/1 ✅

## 기여

이슈와 PR은 환영합니다. 기여 전에 CLAUDE.md의 가이드라인을 확인해주세요.

## 라이선스

MIT

---

**Last Updated**: 2025-11-18
**Version**: 2.0.0
**Status**: ✅ Production Ready (모든 테스트 통과)
**Maintainer**: @inchan
