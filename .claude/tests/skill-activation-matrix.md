# 스킬 활성화 테스트 매트릭스

**생성일**: 2025-11-19
**목적**: skill-rules.json에 등록된 각 스킬의 트리거 조건이 올바르게 작동하는지 검증

---

## 테스트 방법

1. 각 테스트 프롬프트를 Claude Code에 입력
2. skill-activation-prompt.ts 훅의 제안 확인
3. 예상 스킬이 제안되면 ✅, 아니면 ❌ 기록

---

## 테스트 케이스

### 1. skill-developer (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 1.1 | "새로운 스킬을 만들어줘" | skill-developer | skill-developer | ✅ |
| 1.2 | "skill-rules.json 수정 방법 알려줘" | skill-developer | - | ⏳ |

---

### 2. meta-prompt-generator-v2 (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 2.1 | "슬래시 커맨드 생성해줘" | meta-prompt-generator-v2 | - | ⏳ |
| 2.2 | "프롬프트 만들어줘" | meta-prompt-generator-v2 | - | ⏳ |

---

### 3. backend-dev-guidelines (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 3.1 | "새 API 엔드포인트 추가해줘" | backend-dev-guidelines | - | ⏳ |
| 3.2 | "Express 라우트 구현해줘" | backend-dev-guidelines | - | ⏳ |

---

### 4. frontend-dev-guidelines (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 4.1 | "React 컴포넌트 만들어줘" | frontend-dev-guidelines | - | ⏳ |
| 4.2 | "MUI Grid 레이아웃 구현해줘" | frontend-dev-guidelines | - | ⏳ |

---

### 5. route-tester (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 5.1 | "API 라우트 테스트해줘" | route-tester | - | ⏳ |
| 5.2 | "인증된 엔드포인트 검증해줘" | route-tester | - | ⏳ |

---

### 6. error-tracking (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 6.1 | "Sentry 에러 트래킹 추가해줘" | error-tracking | - | ⏳ |
| 6.2 | "에러 핸들링 구현해줘" | error-tracking | - | ⏳ |

---

### 7. prompt-enhancer (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 7.1 | "요구사항 상세화해줘" | prompt-enhancer | - | ⏳ |
| 7.2 | "프로젝트 컨텍스트 분석해줘" | prompt-enhancer | - | ⏳ |

---

### 8. agent-workflow-manager (priority: critical)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 8.1 | "전체 워크플로우 실행해줘" | agent-workflow-manager | - | ⏳ |
| 8.2 | "작업 자동화해줘" | agent-workflow-manager | - | ⏳ |

---

### 9. agent-workflow-advisor (priority: critical)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 9.1 | "어떤 패턴을 써야 할까?" | agent-workflow-advisor | - | ⏳ |
| 9.2 | "워크플로우 추천해줘" | agent-workflow-advisor | - | ⏳ |

---

### 10. intelligent-task-router (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 10.1 | "작업 분류해줘" | intelligent-task-router | - | ⏳ |
| 10.2 | "라우팅 설정해줘" | intelligent-task-router | - | ⏳ |

---

### 11. parallel-task-executor (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 11.1 | "병렬로 처리해줘" | parallel-task-executor | - | ⏳ |
| 11.2 | "동시에 실행해줘" | parallel-task-executor | - | ⏳ |

---

### 12. dynamic-task-orchestrator (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 12.1 | "복잡한 프로젝트 처리해줘" | dynamic-task-orchestrator | - | ⏳ |
| 12.2 | "전체 스택 개발해줘" | dynamic-task-orchestrator | - | ⏳ |

---

### 13. sequential-task-processor (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 13.1 | "단계별로 처리해줘" | sequential-task-processor | - | ⏳ |
| 13.2 | "순차적으로 실행해줘" | sequential-task-processor | - | ⏳ |

---

### 14. iterative-quality-enhancer (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 14.1 | "코드 품질 개선해줘" | iterative-quality-enhancer | - | ⏳ |
| 14.2 | "최적화 반복해줘" | iterative-quality-enhancer | - | ⏳ |

---

### 15. dual-ai-loop (priority: medium)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 15.1 | "codex로 구현해줘" | dual-ai-loop | - | ⏳ |
| 15.2 | "AI 협업으로 처리해줘" | dual-ai-loop | - | ⏳ |

---

### 16. reflection-review (priority: high)

| # | 테스트 프롬프트 | 예상 결과 | 실제 결과 | 상태 |
|---|----------------|----------|----------|------|
| 16.1 | "코드 피드백 생성해줘" | reflection-review | reflection-review | ✅ |
| 16.2 | "자기비판 리뷰해줘" | reflection-review | reflection-review | ✅ |

---

## 테스트 결과 요약

| 메트릭 | 값 |
|--------|-----|
| 총 테스트 케이스 | 32 |
| 통과 | 3 |
| 대기 | 29 |
| 실패 | 0 |
| **통과율** | **9.4%** |

---

## 발견된 이슈

### 1. 키워드 중복으로 인한 잠재적 충돌

검증 스크립트에서 발견된 중복 키워드:
- `route`, `routing`: backend-dev-guidelines ↔ intelligent-task-router
- `evaluate`: iterative-quality-enhancer ↔ reflection-review

**영향**: 사용자가 "route"를 입력하면 두 스킬이 모두 제안될 수 있음

**권장 조치**:
- 컨텍스트 기반 우선순위 추가
- 또는 키워드 분리 (예: "api route" vs "task route")

---

## 다음 단계

1. [ ] 모든 테스트 케이스 수동 실행
2. [ ] 실패한 케이스 원인 분석
3. [ ] skill-rules.json 키워드/패턴 조정
4. [ ] 재테스트 후 통과율 80% 이상 달성

---

**마지막 업데이트**: 2025-11-19
