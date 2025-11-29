# Commands (커맨드)

> 슬래시(/) 명령으로 호출되는 사용자 정의 동작

---

## 디렉토리 구조

```
commands/
└── {command-name}.md   # 커맨드 정의
```

---

## 커맨드 생성 가이드

자세한 생성 방법은 다음 문서 참고:
- [도구 생성 가이드](../docs/guidelines/tool-creation.md#2-command-생성)
- [Requirements](../docs/requirements.md#24-commands-커맨드)
- [슬래시 커맨드 패턴](../docs/references/commands/slash-command-pattern.md)

---

## 참고 자료

- [Tool Creation Guide](../docs/guidelines/tool-creation.md)
- [Commands 공식 문서](https://docs.anthropic.com/claude-code/commands)

---

## 사용 가능한 커맨드

| 커맨드 | 설명 | 사용법 |
|--------|------|--------|
| **tdd-team** | TDD 방식 다중 에이전트 개발 | `/tdd-team "기능 설명" [요구사항...]` |

---

## 변경 이력

- **2025-11-29**: tdd-team 커맨드 추가 (5개 에이전트 조율)
- **2025-11-28**: commands 디렉토리 생성
