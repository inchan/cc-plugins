# Complexity Logic Philosophy

**작성일**: 2025-11-27
**상태**: Approved (Phase 1B)

## Overview

이 문서는 `router`와 `advisor`의 복잡도 로직 차이점과 그 철학적 근거를 설명합니다.

**⚠️ 중요**: 이 두 로직은 **의도적으로 분리**되어 있습니다. 명시적 인터페이스 재검토 없이 통합하지 마세요.

---

## 두 가지 복잡도 철학

### Router: 복잡도 → 모델 선택

**목적**: 복잡도 점수를 기반으로 **최적의 LLM 모델**을 선택

**임계값**:
| 복잡도 범위 | 선택 모델 | 근거 |
|------------|----------|------|
| **< 0.4** | Claude Haiku | 빠르고 저렴, 단순 작업 |
| **0.4 - 0.7** | Claude Sonnet | 균형 잡힌 성능, 대부분의 작업 |
| **> 0.7** | Claude Opus | 최고 성능, 복잡한 작업 |

**계산 공식**:
```
Complexity = (Scope × 0.3) + (Dependencies × 0.25) + (Technical Depth × 0.3) + (Risk × 0.15)
```

**철학**: **정량적 평가** - 4가지 차원을 가중 평균하여 단일 점수로 변환

### Advisor: 구조 → 패턴 선택

**목적**: 작업의 **구조적 특성**을 기반으로 **최적의 워크플로우 패턴**을 선택

**우선순위**:
1. **구조 분석** (Primary): Fixed steps? Categories? Independent parts?
2. **복잡도 점수** (Secondary): Tie-breaker로만 사용

**결정 트리**:
```
Is task simple? (< 0.3) → No Pattern
├─ Is it categorization? → Router Pattern
├─ Are subtasks known?
│   ├─ Dependencies exist? → Sequential Pattern
│   └─ Independent? → Parallel Pattern
└─ Subtasks emerge? → Orchestrator Pattern
    └─ Quality focus? → Add Evaluator
```

**철학**: **구조 우선** - 복잡도는 보조 지표, 구조가 패턴을 결정

---

## 왜 통합하지 않는가?

### 1. 목적이 다름

| 측면 | Router | Advisor |
|------|--------|---------|
| **출력** | LLM 모델 (Haiku/Sonnet/Opus) | 워크플로우 패턴 (Sequential/Parallel/...) |
| **결정 기준** | 계산 비용 vs 성능 | 작업 구조 및 의존성 |
| **사용 시점** | 모든 작업 | 패턴 선택이 불확실할 때 |

### 2. 관심사 분리 (Separation of Concerns)

- **Router**: "이 작업을 처리할 **리소스 수준**은?"
- **Advisor**: "이 작업의 **실행 구조**는?"

이 두 질문은 독립적입니다. 복잡한 작업(Opus)도 Sequential일 수 있고, 간단한 작업(Haiku)도 Parallel일 수 있습니다.

### 3. 유지보수성

통합 시 문제:
- 임계값 변경이 양쪽에 영향
- 테스트 복잡도 증가
- 디버깅 어려움

분리 유지 시:
- 각 로직 독립적 테스트
- 변경 영향 범위 명확
- 단일 책임 원칙 준수

---

## 임계값 고정 (Pinning)

### Router 임계값

```javascript
// ⚠️ 이 값들은 Pinning 테스트로 보호됩니다
const ROUTER_THRESHOLDS = {
  HAIKU_MAX: 0.4,      // complexity < 0.4 → Haiku
  SONNET_MAX: 0.7,     // 0.4 ≤ complexity < 0.7 → Sonnet
  // complexity ≥ 0.7 → Opus
};
```

### Advisor 임계값

```javascript
// ⚠️ 이 값은 "No Pattern" 결정에만 사용됩니다
const ADVISOR_THRESHOLDS = {
  NO_PATTERN_MAX: 0.3, // complexity < 0.3 → May not need pattern
};
```

---

## 가드레일

### 코드 주석 가드레일

각 파일에 다음 주석을 추가해야 합니다:

**intelligent-task-router/SKILL.md**:
```markdown
<!--
⚠️ COMPLEXITY LOGIC GUARD
이 복잡도 로직은 advisor와 의도적으로 분리되어 있습니다.
통합하려면 먼저 docs/complexity-logic-philosophy.md를 검토하세요.
임계값 변경 시 tests/complexity-pinning.test.js 테스트 업데이트 필수.
-->
```

**agent-workflow-advisor/SKILL.md**:
```markdown
<!--
⚠️ COMPLEXITY LOGIC GUARD
이 복잡도 사용은 router와 철학이 다릅니다 (구조 우선 vs 모델 선택).
통합하려면 먼저 docs/complexity-logic-philosophy.md를 검토하세요.
임계값 변경 시 tests/complexity-pinning.test.js 테스트 업데이트 필수.
-->
```

### CI 검증 (선택)

```yaml
# .github/workflows/complexity-guard.yml
name: Complexity Logic Guard
on:
  pull_request:
    paths:
      - 'plugins/workflow-automation/skills/intelligent-task-router/**'
      - 'plugins/workflow-automation/skills/agent-workflow-advisor/**'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run pinning tests
        run: npm test -- tests/complexity-pinning.test.js
```

---

## 변경 절차

임계값 또는 로직 변경 시:

1. **이 문서 검토**: 변경 이유가 철학적으로 타당한지 확인
2. **Pinning 테스트 업데이트**: 새 값으로 테스트 케이스 수정
3. **양쪽 영향 분석**: Router 변경이 Advisor에 (또는 그 반대로) 영향을 주는지 확인
4. **문서 업데이트**: 변경 사항 반영
5. **PR 리뷰**: 최소 1명의 승인 필요

---

## 참고 자료

- [Router Complexity Guide](../skills/intelligent-task-router/resources/complexity-analysis-guide.md)
- [Advisor SKILL.md](../skills/agent-workflow-advisor/SKILL.md)
- [Pinning Tests](../tests/complexity-pinning.test.js)
- [Anthropic Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

---

**최종 요약**:

| 항목 | Router | Advisor |
|------|--------|---------|
| **목적** | 모델 선택 | 패턴 선택 |
| **복잡도 역할** | Primary (결정 기준) | Secondary (Tie-breaker) |
| **임계값** | 0.4, 0.7 | 0.3 |
| **통합 권장** | ❌ No | ❌ No |

**⚠️ 이 분리는 의도적입니다. 통합 시도 전 이 문서와 Pinning 테스트를 반드시 검토하세요.**
