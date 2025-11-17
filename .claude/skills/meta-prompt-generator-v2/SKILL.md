---
name: meta-prompt-generator-v2
description: 적응형 복잡도, 자기 평가, 비용 인식을 갖춘 차세대 메타프롬프트 생성기. 프롬프트 생성, 워크플로우 설계, 테스트 스위트 작성 시 v1 대비 더 지능적이고 효율적인 결과를 원할 때 사용하세요.
---

## Metadata

name: 메타 프롬프트 생성기 v2
description: 적응형 복잡도와 자기 평가 시스템을 갖춘 차세대 메타프롬프트 생성기
version: 2.0.0

## Overview

이 스킬은 v1의 한계를 극복한 **차세대 메타프롬프트 생성기**입니다. 단순히 구조화된 프롬프트를 생성하는 것이 아니라, **작업의 실제 복잡도에 맞게 적응**하고, **자기 평가를 통해 품질을 보장**하며, **비용 효율성을 고려한 병렬화 전략**을 제시합니다.

### v1 대비 핵심 개선사항

| 영역 | v1 | v2 |
|------|----|----|
| 복잡도 | 고정된 구조 | 적응형 구조 (Minimal/Standard/Comprehensive) |
| 지식 수집 | 고정 3개 에이전트 | 동적 1-5개 에이전트 (주제 복잡도 기반) |
| 질문 프로세스 | 무한 반복 가능 | 최대 5회, fallback 전략 포함 |
| 실패 처리 | 미고려 | 롤백/재시도/부분 성공 전략 |
| 비용 | 무제한 | ROI 기반 의사결정 |
| 품질 검증 | 에러 0개만 체크 | 5단계 검증 수준 (Critical→Info) |
| 피드백 루프 | 없음 | 자기 평가 및 학습 |

---

## 핵심 원칙

### 1. 적응형 복잡도 (Adaptive Complexity)

작업 규모에 따라 3가지 모드를 자동 선택합니다:

```
┌─────────────────────────────────────────────────────┐
│                  복잡도 결정 트리                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  예상 단계 수 < 3                                    │
│      ↓ YES                                          │
│  ┌─────────┐                                        │
│  │ MINIMAL │  최소 구조, 오버헤드 제거               │
│  └─────────┘                                        │
│      ↓ NO                                           │
│  예상 단계 수 3-6 AND 병렬화 가능 < 50%             │
│      ↓ YES                                          │
│  ┌──────────┐                                       │
│  │ STANDARD │  표준 구조, 균형잡힌 접근              │
│  └──────────┘                                       │
│      ↓ NO                                           │
│  ┌─────────────────┐                                │
│  │ COMPREHENSIVE   │  완전한 구조, 최대 병렬화      │
│  └─────────────────┘                                │
└─────────────────────────────────────────────────────┘
```

### 2. 비용 인식 병렬화 (Cost-Aware Parallelization)

병렬화 결정 시 ROI를 계산합니다:

```
ROI = (예상_시간_절약 × 시간_가치) / (추가_토큰_비용)

병렬화 조건:
- ROI > 1.5 (기본 임계값)
- 작업 예상 시간 > 30초
- 상호 독립성 > 80%
```

### 3. 실패 친화적 설계 (Failure-Friendly Design)

모든 단계에 복구 전략을 포함합니다:

```
단계 실패 시:
1. 재시도 (최대 2회, exponential backoff)
2. 대체 전략 실행
3. 부분 성공 인정 및 계속 진행
4. 사용자 개입 요청 (최후 수단)
```

---

## 워크플로우

### Phase 0: 복잡도 분석 (신규)

**목적**: 작업의 실제 복잡도를 파악하여 적절한 구조 결정

```markdown
## 복잡도 분석 체크리스트

### 정량적 지표
- [ ] 예상 파일 수: ___개
- [ ] 예상 코드 라인: ___줄
- [ ] 외부 의존성 수: ___개
- [ ] 테스트 케이스 예상: ___개

### 정성적 지표
- [ ] 도메인 친숙도: 높음 | 보통 | 낮음
- [ ] 기술적 불확실성: 높음 | 보통 | 낮음
- [ ] 요구사항 명확성: 높음 | 보통 | 낮음

### 결과
복잡도 점수: ___ / 100
권장 모드: MINIMAL | STANDARD | COMPREHENSIVE
```

**자동화**:
```javascript
function calculateComplexity(metrics) {
  const quantScore = (
    metrics.files * 0.2 +
    metrics.linesOfCode / 100 * 0.3 +
    metrics.dependencies * 0.3 +
    metrics.testCases * 0.2
  );

  const qualScore = (
    metrics.domainFamiliarity * 0.3 +
    metrics.technicalUncertainty * 0.4 +
    metrics.requirementClarity * 0.3
  );

  return (quantScore * 0.6 + qualScore * 0.4);
}
```

### Phase 1: 지능형 지식 수집

**v2 개선사항**:
- 동적 에이전트 수 결정 (주제 복잡도 기반)
- 정보 신뢰도 점수 부여
- 캐싱을 통한 중복 검색 방지
- 검색 실패 시 fallback 전략

```markdown
## 지식 수집 전략

### 에이전트 수 결정
복잡도 점수 < 30: 1개 에이전트
복잡도 점수 30-60: 2-3개 에이전트
복잡도 점수 > 60: 3-5개 에이전트

### 각 에이전트 역할
- Agent 1: 공식 문서 및 API 레퍼런스
- Agent 2: 커뮤니티 모범 사례 및 패턴
- Agent 3: 최신 변경사항 및 마이그레이션 가이드
- Agent 4: 보안 권고사항 및 취약점 정보 (선택)
- Agent 5: 성능 벤치마크 및 최적화 팁 (선택)

### 정보 검증
- 출처 신뢰도 점수 (1-10)
- 정보 최신성 (게시일 기준)
- 교차 검증 (2개 이상 출처에서 확인)

### 캐싱 전략
- 세션 내 동일 주제 재검색 방지
- 캐시 유효 기간: 24시간
- 캐시 키: 주제 + 검색 의도
```

**Fallback 전략**:
```markdown
1. 웹 검색 실패 시:
   - 내장 지식 기반으로 진행
   - 사용자에게 추가 정보 요청
   - "불확실성 플래그" 설정

2. 정보 불충분 시:
   - 최소 필수 정보만으로 진행
   - 가정(assumptions) 명시적 기록
   - 검증 단계에서 재확인
```

### Phase 2: 요구사항 명확화 (개선됨)

**v2 개선사항**:
- 최대 질문 횟수 제한 (5회)
- 스마트 질문 생성 (이전 답변 기반)
- "모르겠다" 응답 처리
- 기본값 제안

```markdown
## 필수 정보 체크리스트

### 기술 스택 (필수)
- [ ] 프레임워크/언어: ___
  - 기본값: 프로젝트 파일에서 자동 감지
  - "모르겠다" 시: package.json, pubspec.yaml 등 분석

- [ ] 패키지 매니저: ___
  - 기본값: npm (Node.js), pip (Python), pub (Dart)

- [ ] 대상 환경: 개발 | 프로덕션 | 둘 다
  - 기본값: 개발

### 프로젝트 범위 (필수)
- [ ] 예상 규모: 소형 | 중형 | 대형
  - 소형: < 10 파일, < 1000줄
  - 중형: 10-50 파일, 1000-10000줄
  - 대형: > 50 파일, > 10000줄

- [ ] 주요 기능 목록 (최소 1개)

### 품질 요구사항 (선택)
- [ ] 코드 커버리지 목표: ___% (기본값: 80%)
- [ ] 성능 목표: ___ (기본값: 없음)
- [ ] 보안 수준: 기본 | 강화 | 최대 (기본값: 기본)

### 질문 전략
1. 가장 중요한 질문 먼저
2. 2-3개 관련 질문을 하나로 묶기
3. 기본값 제안과 함께 질문
4. 최대 5회 질문 후 진행

예시:
"프로젝트의 기술 스택을 확인하겠습니다:
1. 프레임워크: [자동 감지: React] 맞나요?
2. 상태 관리: Redux | Zustand | Context API | 기타?
3. 테스트 프레임워크: Jest | Vitest | 기타?

기본값을 사용하려면 엔터만 누르세요."
```

**"모르겠다" 처리**:
```markdown
사용자 응답: "잘 모르겠어요" | "알아서 해주세요" | "기본값으로"

대응:
1. 프로젝트 파일 자동 분석
2. 업계 표준 패턴 적용
3. 선택한 기본값 명시적 기록
4. 나중에 수정 가능함을 안내
```

### Phase 3: 프롬프트 구조 설계 (개선됨)

**v2 개선사항**:
- 복잡도 기반 구조 선택
- 조건부 분기 지원
- 비용 예산 명시
- 버전 관리 지원

```markdown
## 구조 템플릿

### MINIMAL 모드 (복잡도 < 30)
```yaml
---
allowed-tools: <최소 필수 도구>
description: <간단 설명>
model: haiku  # 비용 최적화
---

# <프롬프트 이름>

## 목표
- 단일 명확한 목표

## 단계 (최대 3개)
1. <핵심 작업 1>
2. <핵심 작업 2>
3. <검증>

## 성공 기준
- <단일 검증 조건>
```

### STANDARD 모드 (복잡도 30-60)
```yaml
---
allowed-tools: <필요 도구>
description: <상세 설명>
model: sonnet
version: 1.0.0
---

# <프롬프트 이름>

## 변수
- 동적 변수 정의

## 지침
- 핵심 제약사항
- 품질 기준

## 워크플로우 (3-6 단계)
각 단계:
- 종속성
- 실행 모드
- 성공 기준
- 실패 시 대응

## 검증
- 프레임워크별 검증 명령
- 보안 스캔 포함

## 결과물
- 명확한 산출물
```

### COMPREHENSIVE 모드 (복잡도 > 60)
```yaml
---
allowed-tools: <전체 도구 세트>
description: <포괄적 설명>
argument-hint: [<인수>]
model: sonnet
version: 1.0.0
cost-budget: <토큰 예산>
---

# <프롬프트 이름>

## 메타데이터
- 버전, 작성일, 의존성

## 변수
- 동적/정적 변수

## 전제조건
- 필수 환경
- 사전 검증

## 지침
- 상세 규칙
- 엣지 케이스
- 보안 요구사항

## 코드베이스 구조
- ASCII 트리
- 파일별 목적

## 워크플로우 (7+ 단계)
각 단계:
- 종속성 그래프
- 실행 모드 (세분화)
  - 순차적
  - 완전 병렬
  - 부분 병렬
  - 조건부 병렬
- 서브에이전트 전략
- 입력/출력 명세
- 성공/실패 기준
- 롤백 전략
- 재시도 정책

## 조건부 분기
```
IF condition_A THEN
  Phase X
ELSE IF condition_B THEN
  Phase Y
ELSE
  Phase Z
END
```

## 테스트 스위트
- 단위/통합/E2E
- 실제 테스트 코드 생성
- 커버리지 목표

## 보안 검증
- OWASP Top 10 체크
- 의존성 취약점 스캔
- 시크릿 노출 검사

## 성능 검증
- 벤치마크 목표
- 프로파일링 명령

## 비용 추적
- 예상 토큰 사용량
- 실제 사용량 기록
- ROI 계산

## 자기 평가
- 성공률 추적
- 개선 제안 생성

## 결과물
- 상세 산출물 목록

## 보고서
- 실행 요약
- 학습된 교훈
```

### Phase 4: 콘텐츠 생성 (개선됨)

**v2 개선사항**:
- 구조 검증 자동화
- 누락 섹션 감지
- 일관성 검사
- 품질 점수 계산

```markdown
## 콘텐츠 품질 검증

### 구조 검증
- [ ] 모든 필수 섹션 포함
- [ ] YAML frontmatter 유효성
- [ ] 마크다운 문법 정확성
- [ ] 링크 유효성

### 일관성 검사
- [ ] 용어 일관성 (동일 개념에 동일 용어)
- [ ] 변수 참조 일관성
- [ ] 단계 번호 연속성
- [ ] 종속성 그래프 무결성

### 완전성 검사
- [ ] 모든 단계에 성공 기준 있음
- [ ] 모든 병렬 작업에 동기화 지점 있음
- [ ] 모든 실패 가능성에 대응 전략 있음

### 품질 점수
Structure: ___ / 25
Clarity: ___ / 25
Completeness: ___ / 25
Actionability: ___ / 25
Total: ___ / 100

최소 합격 점수: 70/100
```

### Phase 5: 자기 평가 및 개선 (신규)

**목적**: 생성된 프롬프트의 품질을 평가하고 개선점을 식별

```markdown
## 자기 평가 프레임워크

### 평가 차원

1. **기능적 완전성** (0-10)
   - 모든 요구사항 반영 여부
   - 엣지 케이스 처리 여부
   - 에러 핸들링 완전성

2. **실행 가능성** (0-10)
   - 단계별 명확성
   - 종속성 논리성
   - 도구 사용 적절성

3. **효율성** (0-10)
   - 병렬화 최적화 수준
   - 불필요한 단계 여부
   - 리소스 사용 효율성

4. **유지보수성** (0-10)
   - 구조 명확성
   - 문서화 품질
   - 확장 용이성

5. **안전성** (0-10)
   - 보안 검증 포함
   - 롤백 전략 완전성
   - 데이터 보호 고려

### 자동 개선 제안
```javascript
function generateImprovements(evaluation) {
  const suggestions = [];

  if (evaluation.functional < 7) {
    suggestions.push("요구사항 재검토 필요");
  }

  if (evaluation.efficiency < 7) {
    suggestions.push("병렬화 기회 재분석");
  }

  if (evaluation.safety < 7) {
    suggestions.push("보안 검증 단계 추가");
  }

  return suggestions;
}
```

### 반복 개선
최대 3회 자동 개선 시도:
1. 평가 실행
2. 점수 < 70인 영역 식별
3. 자동 개선 적용
4. 재평가
5. 개선 없으면 중단
```

### Phase 6: 저장 및 학습 (개선됨)

**v2 개선사항**:
- 버전 관리 통합
- 사용 패턴 기록
- 학습 데이터 수집

```markdown
## 저장 전략

### 파일 구조
```
.claude/commands/
├── <prompt-name>/
│   ├── v1.0.0.md        # 버전별 프롬프트
│   ├── v1.1.0.md
│   ├── current.md → v1.1.0.md  # 심링크
│   ├── metadata.json    # 메타데이터
│   └── history.json     # 실행 이력
```

### metadata.json
```json
{
  "name": "prompt-name",
  "version": "1.1.0",
  "created": "2025-11-17T10:00:00Z",
  "updated": "2025-11-17T12:00:00Z",
  "complexity_mode": "STANDARD",
  "total_executions": 15,
  "success_rate": 0.87,
  "average_cost": 12500,
  "tags": ["react", "typescript", "frontend"]
}
```

### history.json
```json
{
  "executions": [
    {
      "timestamp": "2025-11-17T10:00:00Z",
      "version": "1.0.0",
      "success": true,
      "duration": 180,
      "token_cost": 11200,
      "issues": []
    },
    {
      "timestamp": "2025-11-17T11:00:00Z",
      "version": "1.0.0",
      "success": false,
      "duration": 120,
      "token_cost": 8500,
      "issues": ["Phase 3 failed: dependency conflict"]
    }
  ]
}
```

### 학습 기록
- 실패 패턴 분석
- 성공 패턴 추출
- 버전별 성과 비교
- 개선 제안 자동 생성
```

---

## 테스트 스위트 생성 (개선됨)

### 실제 테스트 코드 생성

v1은 테스트 명령어만 나열했지만, v2는 실제 실행 가능한 테스트 코드를 생성합니다.

```markdown
## 테스트 코드 생성 전략

### 단위 테스트
프레임워크별 템플릿:

**JavaScript/TypeScript (Jest)**:
```typescript
// __tests__/unit/<component>.test.ts
describe('<ComponentName>', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should <expected behavior>', () => {
    // Arrange
    const input = {};

    // Act
    const result = componentFunction(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('should handle edge case: <description>', () => {
    // Edge case test
  });

  it('should throw error when <condition>', () => {
    expect(() => componentFunction(invalidInput)).toThrow();
  });
});
```

**Flutter (flutter_test)**:
```dart
// test/<feature>_test.dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('<FeatureName>', () {
    late MockService mockService;

    setUp(() {
      mockService = MockService();
    });

    test('should <expected behavior>', () {
      // Arrange
      final input = TestInput();

      // Act
      final result = feature.process(input);

      // Assert
      expect(result, equals(expectedOutput));
    });

    test('should handle null input', () {
      expect(() => feature.process(null), throwsArgumentError);
    });
  });
}
```

### 통합 테스트
```typescript
// __tests__/integration/<feature>.integration.test.ts
describe('<Feature> Integration', () => {
  let app: TestingModule;
  let service: FeatureService;
  let database: TestDatabase;

  beforeAll(async () => {
    database = await TestDatabase.create();
    app = await Test.createTestingModule({
      imports: [FeatureModule],
    }).compile();
    service = app.get<FeatureService>(FeatureService);
  });

  afterAll(async () => {
    await database.cleanup();
    await app.close();
  });

  it('should complete full workflow', async () => {
    // Step 1
    const created = await service.create(testData);
    expect(created.id).toBeDefined();

    // Step 2
    const retrieved = await service.findById(created.id);
    expect(retrieved).toEqual(created);

    // Step 3
    const updated = await service.update(created.id, updateData);
    expect(updated.modified).toBeTruthy();
  });
});
```

### E2E 테스트
```typescript
// e2e/<user-flow>.e2e.test.ts
describe('User Flow: <FlowName>', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  it('should complete user journey', async () => {
    // 1. User visits page
    await page.goto('/feature');

    // 2. User interacts
    await page.click('[data-testid="action-button"]');

    // 3. Verify result
    await expect(page).toHaveURL('/feature/success');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### 커버리지 검증
```bash
# JavaScript/TypeScript
npm test -- --coverage --coverageThreshold='{
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}'

# Flutter
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
# Verify: coverage/html/index.html shows >= 80%
```

---

## 검증 수준 (5단계)

v1의 "에러만 0개"를 넘어 세분화된 검증 수준을 제공합니다:

```markdown
## 검증 수준 정의

### Level 1: CRITICAL (필수)
- 컴파일/빌드 에러 0개
- 런타임 크래시 0개
- 보안 취약점 Critical/High 0개

### Level 2: ERROR (강력 권장)
- 모든 Level 1 통과
- 린트 에러 0개
- 테스트 실패 0개
- 의존성 충돌 0개

### Level 3: WARNING (권장)
- 모든 Level 2 통과
- 린트 경고 최소화 (< 10개)
- 코드 커버리지 >= 80%
- 성능 목표 달성

### Level 4: INFO (선택)
- 모든 Level 3 통과
- 코드 복잡도 적정 (cyclomatic < 10)
- 문서화 커버리지 >= 90%
- 접근성 검증 통과

### Level 5: EXCELLENCE (최적)
- 모든 Level 4 통과
- 린트 경고 0개
- 코드 커버리지 >= 95%
- 성능 최적화 완료
- 보안 감사 통과

### 프로젝트별 기본 수준
- 프로토타입: Level 1
- 개발: Level 2
- 스테이징: Level 3
- 프로덕션: Level 4+
```

---

## 보안 검증 (신규)

v1에서 누락된 보안 검증을 필수 항목으로 추가합니다:

```markdown
## 보안 검증 체크리스트

### 의존성 취약점 스캔
```bash
# Node.js
npm audit --production
npx audit-ci --config audit-ci.json

# Flutter/Dart
flutter pub outdated
dart pub global activate pana
pana --no-warning

# Python
pip-audit
safety check
```

### 코드 보안 분석
```bash
# JavaScript/TypeScript
npx eslint --config security .
npx njsscan .

# General
semgrep --config auto .
```

### 시크릿 노출 검사
```bash
# Pre-commit hook
git secrets --scan
trufflehog filesystem .
gitleaks detect
```

### OWASP Top 10 체크리스트
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Auth Failures
- [ ] A08: Data Integrity Failures
- [ ] A09: Logging Failures
- [ ] A10: SSRF

### 보안 수준별 요구사항
**기본**: 의존성 스캔 + 시크릿 검사
**강화**: + SAST 도구 + OWASP 체크
**최대**: + 침투 테스트 + 보안 감사
```

---

## 실패 복구 전략

모든 단계에 포함되는 실패 처리 메커니즘:

```markdown
## 단계별 실패 복구

### 재시도 정책
```yaml
retry_policy:
  max_attempts: 3
  backoff: exponential
  initial_delay: 2s
  max_delay: 16s
  retry_on:
    - network_error
    - timeout
    - transient_failure
  fail_fast_on:
    - auth_error
    - permission_denied
    - invalid_input
```

### 롤백 전략
```yaml
rollback_strategy:
  enabled: true
  checkpoint_frequency: per_phase
  cleanup_on_failure: true
  preserve_logs: true

  actions:
    - revert_file_changes
    - restore_database_state
    - cleanup_temp_resources
```

### 부분 성공 처리
```yaml
partial_success:
  allowed: true
  minimum_completion: 60%
  continue_on:
    - non_critical_failure
    - optional_step_failure
  report:
    - completed_phases
    - skipped_phases
    - remaining_work
```

### 사용자 개입 요청
```markdown
자동 복구 실패 시:
1. 실패 상황 명확히 설명
2. 가능한 옵션 제시:
   - 재시도
   - 다른 접근 방식
   - 수동 해결 후 계속
   - 중단
3. 사용자 선택 대기
4. 선택에 따라 진행
```

---

## 비용 추적 및 ROI 계산

```markdown
## 비용 인식 의사결정

### 토큰 예산 관리
```yaml
budget:
  total: 50000  # 총 토큰 예산
  per_phase: 10000  # 단계별 최대
  warning_threshold: 80%  # 80% 사용 시 경고

tracking:
  estimated_usage: 0
  actual_usage: 0
  remaining: 50000
```

### 병렬화 ROI 계산
```typescript
function calculateParallelizationROI(task) {
  const sequentialTime = estimateSequentialTime(task);
  const parallelTime = estimateParallelTime(task);
  const timeSaved = sequentialTime - parallelTime;

  const sequentialCost = estimateTokenCost(task, 'sequential');
  const parallelCost = estimateTokenCost(task, 'parallel');
  const additionalCost = parallelCost - sequentialCost;

  const timeValue = timeSaved * hourlyRate / 3600;
  const roi = timeValue / additionalCost;

  return {
    roi,
    recommend: roi > 1.5,
    savings: timeSaved,
    cost: additionalCost
  };
}
```

### 비용 보고서
```markdown
## 실행 비용 요약

### 예상 vs 실제
| 항목 | 예상 | 실제 | 차이 |
|------|------|------|------|
| 총 토큰 | 35,000 | 32,500 | -7.1% |
| 병렬 에이전트 | 3 | 2 | -33% |
| 실행 시간 | 180s | 165s | -8.3% |
| 총 비용 | $0.035 | $0.033 | -5.7% |

### ROI 분석
- 병렬화로 절약된 시간: 45초
- 추가 토큰 비용: 5,000 토큰
- ROI: 2.3 (효율적)

### 최적화 제안
- Phase 3에서 불필요한 검색 제거 가능
- 캐싱 활용으로 15% 비용 절감 가능
```

---

## 사용 예시

### 예시 1: 간단한 유틸리티 함수 (MINIMAL 모드)

```
사용자: "문자열 검증 유틸리티 함수 만들어줘"

v2 동작:
1. 복잡도 분석: 점수 15/100 → MINIMAL 모드
2. 최소 정보 수집: 대상 언어만 확인
3. 간단한 프롬프트 생성:
   - 3단계: 구현 → 테스트 → 검증
   - 병렬화 없음 (오버헤드 > 이득)
   - Haiku 모델 사용 (비용 최적화)
4. 저장 및 완료
```

### 예시 2: 중간 규모 기능 (STANDARD 모드)

```
사용자: "사용자 인증 모듈 만들어줘"

v2 동작:
1. 복잡도 분석: 점수 45/100 → STANDARD 모드
2. 필수 정보 수집 (최대 3회 질문):
   - Q1: "인증 방식? JWT | Session | OAuth (기본: JWT)"
   - Q2: "추가 기능? 2FA | 소셜 로그인 | 없음"
3. 표준 프롬프트 생성:
   - 5단계: 설계 → 인프라 → 핵심 로직 → 보안 강화 → 검증
   - 부분 병렬화 (ROI > 1.5인 경우만)
   - 보안 검증 필수 포함
4. 자기 평가: 점수 78/100
5. 저장 및 보고
```

### 예시 3: 대규모 프로젝트 (COMPREHENSIVE 모드)

```
사용자: "전자상거래 플랫폼 전체 백엔드 구축해줘"

v2 동작:
1. 복잡도 분석: 점수 85/100 → COMPREHENSIVE 모드
2. 지능형 지식 수집:
   - 4개 병렬 에이전트 (최신 아키텍처 패턴)
   - 정보 신뢰도 검증
   - 보안 권고사항 수집
3. 상세 정보 수집 (최대 5회):
   - 핵심 기능, 성능 목표, 보안 수준, 확장성 요구사항
   - "모르겠다" 응답 시 업계 표준 적용
4. 포괄적 프롬프트 생성:
   - 10단계 워크플로우
   - 조건부 분기 포함
   - 전체 테스트 코드 생성
   - 5단계 검증 수준 적용
   - 비용 예산 및 ROI 계산
5. 자기 평가: 점수 72/100
   - 자동 개선 1회차: 보안 검증 강화
   - 재평가: 점수 81/100
6. 버전 관리 저장
7. 상세 보고서 생성
```

---

## 마이그레이션 가이드 (v1 → v2)

기존 v1 프롬프트를 v2 형식으로 업그레이드하는 방법:

```markdown
## v1 → v2 마이그레이션

### 1. 복잡도 분석 추가
기존 프롬프트의 단계 수와 특성을 분석하여 모드 결정

### 2. 버전 관리 추가
```yaml
# v1
---
allowed-tools: ...
---

# v2
---
allowed-tools: ...
version: 2.0.0
cost-budget: 30000
---
```

### 3. 실패 복구 전략 추가
각 단계에 롤백 및 재시도 정책 추가

### 4. 보안 검증 단계 추가
기존 검증에 보안 스캔 포함

### 5. 자기 평가 섹션 추가
품질 점수 및 개선 제안 포함

### 자동 마이그레이션 도구
```bash
# .claude/commands/ 내 v1 프롬프트 분석
# v2 형식으로 자동 변환
# 수동 검토 및 세부 조정
```
```

---

## 모범 사례 (v2)

### 1. 복잡도 먼저 파악
- 작업 전 복잡도 분석 필수
- 과도한 구조화 피하기
- "적절한 수준"이 핵심

### 2. 비용 인식 의사결정
- 모든 병렬화에 ROI 계산
- 예산 한도 설정
- 비용 vs 품질 트레이드오프 명시

### 3. 실패 대비 설계
- 모든 단계에 복구 전략
- 부분 성공 인정
- 사용자 개입 최소화

### 4. 보안 우선
- 모든 프로젝트에 최소 기본 보안 검증
- 의존성 취약점 자동 스캔
- 시크릿 노출 방지

### 5. 지속적 학습
- 실행 이력 기록
- 패턴 분석
- 자동 개선 제안 활용

### 6. 버전 관리
- 모든 프롬프트 버전 추적
- 변경 이력 보존
- 롤백 가능성 확보

---

## 제한사항

### 알려진 한계
1. **극도로 동적인 작업**: 예측 불가능한 요구사항 변화에는 적응 어려움
2. **도메인 특화 지식**: 매우 전문적인 분야는 웹 검색 한계
3. **인간 창의성**: 혁신적인 접근법은 여전히 인간 판단 필요
4. **실시간 환경**: 지속적으로 변하는 환경에는 재생성 필요

### 적합하지 않은 경우
- 1회성 간단 명령 (직접 실행이 더 효율적)
- 탐색적 연구 (방향이 불명확한 경우)
- 강한 창의성 요구 작업

---

## 향후 로드맵

### v2.1 (계획)
- 자연어 복잡도 분석 개선
- 더 정교한 ROI 모델
- A/B 테스트 지원

### v2.2 (계획)
- 다국어 프롬프트 생성
- 팀 협업 기능
- 실시간 비용 모니터링

### v3.0 (비전)
- 자기 진화 프롬프트
- 컨텍스트 기반 자동 개선
- 예측적 최적화

---

이 v2 스킬은 메타프롬프트 생성의 새로운 표준을 제시합니다. 단순히 구조화된 프롬프트를 생성하는 것이 아니라, **지능적으로 적응**하고, **스스로 평가**하며, **지속적으로 학습**하는 진정한 메타프롬프트 생성기입니다.
