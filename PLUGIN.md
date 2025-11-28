# CC-Skills Plugin Architecture

---
version: 0.0.1
last_updated: 2025-11-26
status: pre-release
---

> **⚠️ Pre-release**: 현재 v0.0.1 개발 버전입니다. 정식 릴리스는 v1.0.0부터 시작됩니다.

Claude Code용 모듈형 플러그인 컬렉션 - 9개 독립 플러그인 + 1개 메타 플러그인으로 구성

## 📦 플러그인 목록

| 플러그인 | 스킬 수 | 기능 | 설치 |
|---------|--------|------|------|
| [workflow-automation](plugins/workflow-automation) | 7 | 복잡도 기반 작업 라우팅 | 필수 |
| [dev-guidelines](plugins/dev-guidelines) | 3 | Frontend/Backend 개발 패턴 | 권장 |
| [tool-creators](plugins/tool-creators) | 6 | Skill/Command/Agent/Hook 생성 | 권장 |
| [quality-review](plugins/quality-review) | 2 | 5차원 품질 평가 | 권장 |
| [ai-integration](plugins/ai-integration) | 3 | 외부 AI CLI 통합 | 선택 |
| [prompt-enhancement](plugins/prompt-enhancement) | 2 | 메타 프롬프트 생성 | 선택 |
| [utilities](plugins/utilities) | 1 | 유틸리티 도구 | 선택 |
| [research](plugins/research) | 1 | 공식 자료 조사 | 선택 |
| [hooks](plugins/hooks) | - | Multi-Tier 스킬 자동 활성화 | 필수 |
| [**install-all**](plugins/install-all) | **Meta** | **모든 플러그인 통합 설치** | **권장** |

**총 25개 스킬, 4개 커맨드, 3개 에이전트, 3개 훅 (9개 플러그인 + 1개 메타)**

---

## 🚀 설치 방법

### 옵션 1: install-all 메타 플러그인 (권장)

```bash
# 1. 레포지토리 클론
git clone https://github.com/inchan/cc-skills.git

# 2. install-all 플러그인 설치 (모든 기능 포함)
claude plugins install /path/to/cc-skills/plugins/install-all
```

**장점**:
- ✅ 한 번의 설치로 모든 기능 사용
- ✅ 상대 경로 참조로 파일 중복 없음
- ✅ 자동 업데이트 스크립트 지원

**주의**:
- ⚠️ 상대 경로 참조는 실험적 기능
- 작동하지 않으면 옵션 2 사용

### 옵션 2: 마켓플레이스 전체 설치

```bash
# Claude Code에서 마켓플레이스로 추가
# Settings → Plugins → Add Marketplace
# Path: /path/to/cc-skills
```

### 옵션 3: 플러그인 선택적 설치

필요한 플러그인만 개별 설치:

```bash
# 개별 플러그인 설치
claude plugins install /path/to/cc-skills/plugins/workflow-automation
claude plugins install /path/to/cc-skills/plugins/dev-guidelines
```

또는 Claude Code Settings에서 활성화:

```json
{
  "enabledPlugins": {
    "workflow-automation@inchan-cc-skills": true,
    "dev-guidelines@inchan-cc-skills": true,
    "tool-creators@inchan-cc-skills": false
  }
}
```

---

## 🏗️ 플러그인 아키텍처

### Multi-Plugin 구조

```
cc-skills/
├── .claude-plugin/
│   └── marketplace.json         # 10개 플러그인 정의 (9 + install-all)
│
├── plugins/
│   ├── workflow-automation/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json      # 플러그인 메타데이터
│   │   ├── skills/
│   │   │   ├── skill-rules.json # 자동 활성화 규칙
│   │   │   ├── agent-workflow-manager/
│   │   │   ├── intelligent-task-router/
│   │   │   └── ... (7개 스킬)
│   │   ├── commands/            # 4개 슬래시 커맨드
│   │   └── agents/              # 1개 에이전트
│   │
│   ├── hooks/                   # 스킬 자동 활성화 시스템
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skill-activation-hook.sh
│   │   └── hooks.json
│   │
│   ├── dev-guidelines/
│   ├── tool-creators/
│   ├── quality-review/
│   ├── ai-integration/
│   ├── prompt-enhancement/
│   ├── utilities/
│   ├── research/
│   │
│   └── install-all/             # 🎯 메타 플러그인
│       ├── .claude-plugin/
│       │   └── plugin.json     # 상대 경로로 모든 플러그인 참조
│       └── README.md
│
├── scripts/
│   ├── update-install-all.js   # install-all 자동 업데이트
│   └── analyze-dependencies.js
│
└── docs/                        # 문서
```

### 플러그인 독립성

- ✅ **Zero dependencies**: 플러그인 간 의존성 없음
- ✅ **독립 버전 관리**: 각 플러그인 개별 버전
- ✅ **선택적 활성화**: 필요한 플러그인만 사용
- ✅ **독립 업데이트**: 플러그인별 업데이트 가능

---

## 📚 플러그인별 상세 설명

### 1. workflow-automation

**목적**: 작업 복잡도에 따른 자동 워크플로우 라우팅

**스킬** (7개):
- `agent-workflow-manager` (critical) - 전체 워크플로우 관리
- `intelligent-task-router` (high) - 복잡도 기반 라우팅
- `sequential-task-processor` (high) - 순차 처리 (복잡도 < 0.3)
- `parallel-task-executor` (high) - 병렬 실행 (0.3-0.7)
- `dynamic-task-orchestrator` (high) - 동적 조율 (> 0.7)
- `agent-workflow-advisor` (critical) - 패턴 추천
- `agent-workflow-orchestrator` (unregistered) - 고급 기능

**커맨드** (4개):
- `/auto-workflow` - 자동 워크플로우
- `/workflow-simple` - 간단한 작업
- `/workflow-parallel` - 병렬 작업
- `/workflow-complex` - 복잡한 프로젝트

**에이전트** (1개):
- `workflow-orchestrator` - 멀티스텝 오케스트레이션

### 2. dev-guidelines

**목적**: Frontend/Backend 개발 패턴 및 에러 추적

**스킬** (3개):
- `frontend-dev-guidelines` (high) - React/TypeScript/MUI v7
- `backend-dev-guidelines` (high) - Node.js/Express/Prisma
- `error-tracking` (high) - Sentry v8 패턴

**자동 활성화**:
- 파일 경로 패턴 매칭 (예: `*.tsx` → frontend)
- 코드 콘텐츠 분석 (예: Express → backend)

### 3. tool-creators

**목적**: 스킬/커맨드/에이전트/훅 생성 도구

**스킬** (6개):
- `skill-generator-tool` (critical) - 도구 타입 추천
- `skill-developer` (high) - 스킬 개발 가이드
- `skill-health-checker` (medium) - 스킬 품질 진단
- `command-creator` (high) - 커맨드 생성
- `hooks-creator` (high) - 훅 생성
- `subagent-creator` (high) - 에이전트 생성

**번들 리소스**:
- 템플릿, 스크립트, 예제 코드 포함

### 4. quality-review

**목적**: 종합 품질 평가 및 리뷰

**스킬** (2개):
- `iterative-quality-enhancer` (high) - 5차원 평가
  - Functionality, Performance, Code Quality, Security, Documentation
- `reflection-review` (high) - 6영역 리뷰 + P0/P1/P2 피드백

**에이전트** (2개):
- `code-reviewer` - 코드 리뷰
- `architect` - 아키텍처 설계

### 5. ai-integration

**목적**: 외부 AI CLI 도구 통합

**스킬** (3개):
- `dual-ai-loop` (medium) - 외부 AI CLI 협업
- `cli-updater` (unregistered) - CLI 버전 관리
- **CLI 어댑터**: aider, codex, qwen, copilot, rovo-dev

**특징**:
- 각 AI 도구별 어댑터 스킬
- VERSION.json 메타데이터 관리

### 6. prompt-enhancement

**목적**: 프롬프트 생성 및 최적화

**스킬** (2개):
- `meta-prompt-generator` (high) - 커맨드용 프롬프트 생성
- `prompt-enhancer` (high) - 컨텍스트 기반 개선

**프레임워크**:
- GOLDEN (Goal, Output, Limits, Data, Evaluation, Nuances)

### 7. utilities

**목적**: 유틸리티 도구

**스킬** (1개):
- `route-tester` (high) - 인증 라우트 테스트

### 8. research

**목적**: 공식 자료 조사 및 신뢰성 있는 정보 수집

**스킬** (1개):
- `official-research` (high) - 공식 문서 및 신뢰할 수 있는 출처 조사

**특징**:
- 공식 문서 우선 검색
- 출처 신뢰성 검증
- 최신 정보 확인

---

## 🔧 플러그인 개발

### 새 플러그인 추가

```bash
# 1. 플러그인 구조 생성
mkdir -p plugins/new-plugin/{.claude-plugin,skills,commands,agents}

# 2. plugin.json 작성
cat > plugins/new-plugin/.claude-plugin/plugin.json <<EOF
{
  "name": "new-plugin",
  "version": "0.0.1",
  "description": "Plugin description",
  "author": {
    "name": "Your Name",
    "url": "https://github.com/username"
  },
  "skills": ["./skills"],
  "commands": ["./commands"],
  "agents": ["./agents"]
}
EOF

# 3. marketplace.json 업데이트
# .claude-plugin/marketplace.json에 플러그인 추가
```

### skill-rules.json 스키마

```json
{
  "skills": {
    "skill-name": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["keyword1", "keyword2"],
        "intentPatterns": ["regex1", "regex2"]
      }
    }
  }
}
```

### 플러그인 검증

```bash
# JSON 검증
for plugin in plugins/*/; do
  node -e "JSON.parse(require('fs').readFileSync('${plugin}.claude-plugin/plugin.json'))"
done

# skill-rules.json 검증
node tests/validate-skill-rules.js
```

---

## 📖 관련 문서

### 프로젝트 문서
- [README.md](README.md) - 프로젝트 개요
- [CLAUDE.md](CLAUDE.md) - 개발 가이드
- [docs/SKILL-DEVELOPMENT-GUIDE.md](docs/SKILL-DEVELOPMENT-GUIDE.md) - 스킬 개발
- [docs/DOCUMENTATION_GUIDELINES.md](docs/DOCUMENTATION_GUIDELINES.md) - 문서 표준

### 공식 참조
- [Claude Code Plugins](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

---

<!--
## 🔄 마이그레이션 (v1.x → v2.0.0)

v0.0.1 pre-release 단계에서는 마이그레이션이 필요하지 않습니다.
정식 릴리스 시 해당 섹션이 추가될 예정입니다.
-->

---

## 📊 통계

- **25개 스킬** (20개 등록 + 5개 unregistered)
- **4개 슬래시 커맨드**
- **3개 에이전트**
- **3개 전역 훅**
- **9개 독립 플러그인** (+ 1개 메타 플러그인)

---

## 🤝 기여

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

자세한 내용은 [CLAUDE.md](CLAUDE.md)를 참조하세요.

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file
