# Tool Creators Plugin

Claude Code 도구 생성 종합 툴킷 (Anthropic 베스트 프랙티스)

## 포함 스킬 (5개)

- **skill-generator-tool** - 진입점: 도구 타입 추천
- **skill-developer** - Skill 개발 (500줄 규칙, 번들 리소스)
- **command-creator** - Slash command 생성
- **subagent-creator** - Subagent 생성 (7개 템플릿)
- **hooks-creator** - Hook 생성 (6개 이벤트)

## 워크플로우

```
"도구를 만들고 싶어"
  ↓
skill-generator-tool (의도 분석)
  ↓
타입 추천 (Command/Skill/Subagent/Hook)
  ↓
해당 creator 스킬 라우팅
```

## 도구 타입 선택 가이드

| 타입 | 사용 시기 | 예시 |
|------|----------|-----|
| **Command** | 사용자 호출 단축키 | `/review`, `/commit` |
| **Skill** | 도메인 전문성 + 리소스 | `frontend-dev-guidelines` |
| **Subagent** | 집중된 AI + 권한 | `code-reviewer` |
| **Hook** | 이벤트 기반 자동화 | `UserPromptSubmit` |

## 주요 원칙

- **500줄 제한** (SKILL.md)
- **Progressive disclosure** (메타데이터 → 본문 → 리소스)
- **Bundled resources** (scripts/, references/, assets/)
- **skill-rules.json** (자동 트리거)
