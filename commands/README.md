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

### TDD Development (개발)

| 커맨드 | 설명 | 사용법 |
|--------|------|--------|
| **tdd-team** | TDD 방식 다중 에이전트 개발 | `/tdd-team "기능 설명" [요구사항...]` |

### Search Commands (검색 시스템)

| 커맨드 | 용도 | 예시 |
|--------|------|------|
| **search-official** | 공식 문서/저장소 검색 | `/search-official "React hooks"` |
| **search-comprehensive** | 종합 리서치 (공식+커뮤니티) | `/search-comprehensive "state management"` |
| **search-best-practice** | 모범 사례/샘플 검색 | `/search-best-practice "error handling"` |

**검색 범위**:
- `search-official`: 공식 문서, GitHub 공식 저장소, 공식 블로그만
- `search-comprehensive`: 공식(60%) + Q&A(20%) + 기술 블로그(15%) + Reddit(5%)
- `search-best-practice`: 공식 샘플(50%) + 레퍼런스 프로젝트(30%) + 오픈소스(20%)

**출력 형식** (모든 검색 커맨드 공통):
- **요약**: 핵심 내용 + 링크
- **상세**: API 레퍼런스 + 예제 + 분석
- **대화형**: 자연스러운 설명 + 실용 예제

---

## 변경 이력

- **2025-11-29**: 검색 커맨드 3개 추가 (search-official, search-comprehensive, search-best-practice)
- **2025-11-29**: tdd-team 커맨드 추가 (5개 에이전트 조율)
- **2025-11-28**: commands 디렉토리 생성
