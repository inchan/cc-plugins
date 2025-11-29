# Agents (서브에이전트)

> 특화된 작업을 수행하는 독립적 에이전트

---

## 디렉토리 구조

```
agents/
├── engineer.md       # 범용 개발 도우미 (코드 품질 + 문서화 + 성능)
├── tdd/              # TDD 개발 팀 (5개 에이전트)
│   ├── task-planner.md   # 작업 분해
│   ├── test-writer.md    # Red 단계
│   ├── implementer.md    # Green 단계
│   ├── refactorer.md     # Refactor 단계
│   ├── reviewer.md       # 품질 검증
│   └── tests/            # 테스트 가이드
└── {agent-name}.md   # 에이전트 프롬프트
```

## 사용 가능한 에이전트

### 단독 에이전트

| 에이전트 | 역할 | 주요 기능 |
|---------|------|----------|
| **engineer** | 꼼꼼한 시니어 개발자 | 코드 품질 검증, 문서화 검토, 성능 분석 |

### TDD 개발 팀 (다중 에이전트 시스템)

| 에이전트 | 역할 | TDD 단계 | 주요 기능 |
|---------|------|---------|----------|
| **tdd-task-planner** | 작업 분해 | 준비 | 큰 기능 → 작은 단위 (최대 20개), 성공 기준 정의 |
| **tdd-test-writer** | 테스트 우선 | Red | 실패하는 테스트 먼저 작성, 실패 확인 |
| **tdd-implementer** | 최소 구현 | Green | 테스트 통과하는 최소 코드, YAGNI 준수 |
| **tdd-refactorer** | 코드 개선 | Refactor | 품질 향상 (복잡도 감소, DRY 적용) |
| **tdd-reviewer** | 품질 검증 | 검증 | P1-P4 원칙 확인, 승인/거부 결정 |

**사용법**: `/tdd-team "기능 설명"`

**워크플로우 조율**: `/tdd-team` 커맨드가 메인 스레드에서 직접 조율 (Claude Code 제약으로 인해 orchestrator 에이전트 제거됨)

**참고**:
- [TDD 다중 에이전트 패턴](../docs/references/agents/tdd-multi-agent-pattern.md)
- [TDD Orchestrator 가이드](../docs/references/agents/tdd-orchestrator-guide.md) (참조용)

---

## 에이전트 생성 가이드

자세한 생성 방법은 다음 문서 참고:
- [도구 생성 가이드](../docs/guidelines/tool-creation.md#3-subagent-생성)
- [Requirements](../docs/requirements.md#23-sub-agents-서브에이전트)
- [다중 에이전트 패턴](../docs/references/agents/multi-agent-orchestration.md)
- [TDD 다중 에이전트 패턴](../docs/references/agents/tdd-multi-agent-pattern.md)

---

## 참고 자료

- [Tool Creation Guide](../docs/guidelines/tool-creation.md)
- [Sub-agents 공식 문서](https://docs.anthropic.com/claude-code/agents)

---

## 변경 이력

- **2025-11-29**: orchestrator 에이전트 제거 (Claude Code 제약: 서브에이전트가 다른 서브에이전트 호출 불가)
  - 워크플로우 조율은 `/tdd-team` 커맨드가 메인 스레드에서 수행
  - TDD 개발 팀은 5개 에이전트로 운영
- **2025-11-28**: TDD 개발 팀 추가 (6개 에이전트 시스템)
  - tdd-orchestrator: 워크플로우 조율 (제거됨)
  - tdd-task-planner: 작업 분해
  - tdd-test-writer: Red 단계
  - tdd-implementer: Green 단계
  - tdd-refactorer: Refactor 단계
  - tdd-reviewer: 품질 검증
- **2025-11-28**: engineer 에이전트 추가 (범용 개발 도우미)
- **2025-11-28**: agents 디렉토리 생성
