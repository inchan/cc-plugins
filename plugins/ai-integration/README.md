# AI Integration Plugin

외부 AI CLI 도구 통합 (Dual-AI Loop)

## 포함 스킬 (3개)

- **dual-ai-loop** - Dual-AI 엔지니어링 루프 오케스트레이션
- **cli-updater** - CLI 어댑터 자동 업데이트
- **cli-adapters** - 5개 AI CLI 어댑터

## 지원 AI CLI

1. **aider** - AI pair programming
2. **codex** - OpenAI Codex
3. **qwen** - Alibaba Qwen
4. **copilot** - GitHub Copilot CLI
5. **rovo-dev** - Atlassian Rovo

## Dual-AI Loop 워크플로우

```
Claude Code (플래닝)
  ↓
External AI (구현)
  ↓
Claude Code (검증)
  ↓
반복 또는 완료
```

## 어댑터 구조

각 CLI 어댑터:
- `SKILL.md` - CLI 통합 가이드
- `VERSION.json` - 버전 정보
- 인증 설정
- 명령 실행 패턴

## 사용 예시

```
"codex로 구현해줘"
→ dual-ai-loop 활성화
→ codex adapter 로드
→ 코드 생성 및 검증
```

## 새 CLI 추가

`cli-adapters/ADD_NEW_CLI.md` 참조:
1. SKILL.md 작성
2. VERSION.json 생성
3. cli-registry.json 등록
4. 인증 설정 (AUTH_SETUP.md)
