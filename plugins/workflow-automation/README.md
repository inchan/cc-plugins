# Workflow Automation Plugin

복잡도 기반 작업 자동 라우팅 및 오케스트레이션

## 포함 스킬 (7개)

- **agent-workflow-manager** - 통합 워크플로우 관리 및 조율
- **agent-workflow-advisor** - 최적 패턴 추천
- **intelligent-task-router** - 복잡도 분석 기반 라우팅 (0.0-1.0)
- **sequential-task-processor** - 순차 처리 (< 0.3)
- **parallel-task-executor** - 병렬 처리 (0.3-0.7)
- **dynamic-task-orchestrator** - 동적 분해 (> 0.7)
- **agent-workflow-orchestrator** - 고급 오케스트레이션

## 커맨드 (4개)

- `/auto-workflow` - 자동 워크플로우 실행
- `/workflow-simple` - 순차 워크플로우
- `/workflow-parallel` - 병렬 워크플로우
- `/workflow-complex` - 복잡 워크플로우

## 에이전트 (1개)

- **workflow-orchestrator** - 워크플로우 조율 전문

## 사용 예시

```
User: "전체 프로세스 자동화해줘"
→ agent-workflow-manager 활성화
→ intelligent-task-router가 복잡도 분석
→ 적절한 처리기로 라우팅
```

## 아키텍처

```
사용자 요청
  ↓
intelligent-task-router (복잡도 분석)
  ↓
├─ < 0.3: sequential-task-processor
├─ 0.3-0.7: parallel-task-executor
└─ > 0.7: dynamic-task-orchestrator
```
