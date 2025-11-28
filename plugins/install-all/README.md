# install-all Plugin

**메타 플러그인** - 모든 cc-skills 플러그인을 한 번에 설치합니다.

## 개요

`install-all`은 상대 경로 참조를 통해 다른 모든 플러그인의 리소스를 통합하는 메타 플러그인입니다. 이 플러그인 하나만 설치하면 모든 cc-skills 기능에 접근할 수 있습니다.

## 포함된 리소스

### Hooks (1개)
- **cc-skills-hooks**: Multi-Tier 스킬 자동 활성화 시스템

### Skills (9개 플러그인 = 25개 스킬)
- **workflow-automation**: 복잡도 기반 작업 라우팅 (7개 스킬)
- **dev-guidelines**: Frontend/Backend 개발 패턴 (3개 스킬)
- **tool-creators**: Skill/Command/Agent/Hook 생성 (6개 스킬)
- **quality-review**: 5차원 품질 평가 (2개 스킬)
- **ai-integration**: 외부 AI CLI 통합 (3개 스킬)
- **prompt-enhancement**: 메타 프롬프트 생성 (2개 스킬)
- **utilities**: 유틸리티 도구 (1개 스킬)
- **research**: 공식 자료 조사 (1개 스킬)

### Commands (4개)
- `/auto-workflow`: 자동 워크플로우
- `/workflow-simple`: 단순 순차 작업
- `/workflow-parallel`: 병렬 작업
- `/workflow-complex`: 복잡한 프로젝트

### Agents (3개)
- **workflow-orchestrator**: 워크플로우 조율
- **architect**: 아키텍처 설계
- **code-reviewer**: 코드 리뷰

## 설치 방법

```bash
# Claude Code CLI를 통한 설치
claude plugins install /path/to/cc-skills/plugins/install-all

# 또는 marketplace를 통한 설치 (마켓플레이스 등록 시)
claude plugins install inchan-cc-skills/install-all
```

## 자동 업데이트

`install-all`의 `plugin.json`은 스크립트를 통해 자동 생성됩니다:

```bash
# 미리보기 (파일 수정 안 함)
node scripts/update-install-all.js --dry-run --verbose

# 실제 업데이트
node scripts/update-install-all.js

# 백업 파일이 자동으로 생성됩니다
# plugins/install-all/.claude-plugin/plugin.json.backup
```

## 작동 원리

이 플러그인은 실제 파일을 포함하지 않고, 상대 경로를 통해 다른 플러그인의 리소스를 참조합니다:

```json
{
  "hooks": ["../hooks/hooks.json"],
  "skills": [
    "../workflow-automation/skills",
    "../dev-guidelines/skills",
    ...
  ],
  "commands": ["../workflow-automation/commands"],
  "agents": [
    "../workflow-automation/agents/workflow-orchestrator.md",
    ...
  ]
}
```

## 주의사항

⚠️ **실험적 기능**: 상대 경로를 통한 플러그인 간 참조는 공식 문서에 명시되지 않은 방법입니다.
Claude Code가 플러그인 외부 경로를 허용하지 않을 경우, 대안 방법(통합 플러그인 또는 개별 설치)을 사용해야 할 수 있습니다.

## 대안

상대 경로가 작동하지 않는 경우:

1. **개별 설치**: 각 플러그인을 하나씩 설치
2. **Symlink 방식**: 심볼릭 링크로 리소스 연결
3. **통합 플러그인**: 모든 리소스를 실제로 복사

## 문제 해결

### 스킬이 보이지 않음

```bash
# 설치된 스킬 확인
claude skills list

# 플러그인 재설치
claude plugins uninstall install-all
claude plugins install /path/to/cc-skills/plugins/install-all
```

### 경로 오류

스크립트를 다시 실행하여 최신 경로로 업데이트:

```bash
node scripts/update-install-all.js
```

## 라이센스

MIT
