# CC-Skills v0.0.1 (Pre-release)

Claude Code용 모듈형 플러그인 마켓플레이스 - 워크플로우 자동화, 개발 가이드라인, 품질 도구

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.0.1--pre--release-orange.svg)](https://github.com/inchan/cc-skills/releases)

---

## 🚀 Multi-Plugin Architecture (Pre-release)

anthropics/claude-code 패턴을 따라 **10개 플러그인** (9개 + 1개 메타)으로 구성됩니다.

> **⚠️ Pre-release**: 현재 v0.0.1 개발 버전입니다. 정식 릴리스는 v1.0.0부터 시작됩니다.

### 📦 플러그인 목록

| 플러그인 | 타입 | 설명 | 문서 |
|---------|-----|------|------|
| [hooks](plugins/hooks) | Hooks | Multi-Tier 스킬 자동 활성화 시스템 | [INDEX](plugins/hooks/INDEX.md) |
| [workflow-automation](plugins/workflow-automation) | 7 Skills | 복잡도 기반 작업 라우팅 | [README](plugins/workflow-automation/README.md) |
| [dev-guidelines](plugins/dev-guidelines) | 3 Skills | Frontend/Backend 개발 패턴 | [README](plugins/dev-guidelines/README.md) |
| [tool-creators](plugins/tool-creators) | 6 Skills | Skill/Command/Agent/Hook 생성 | [README](plugins/tool-creators/README.md) |
| [quality-review](plugins/quality-review) | 2 Skills | 5차원 품질 평가 | [README](plugins/quality-review/README.md) |
| [ai-integration](plugins/ai-integration) | 3 Skills | 외부 AI CLI 통합 | [README](plugins/ai-integration/README.md) |
| [prompt-enhancement](plugins/prompt-enhancement) | 2 Skills | 메타 프롬프트 생성 | [README](plugins/prompt-enhancement/README.md) |
| [utilities](plugins/utilities) | 1 Skill | 유틸리티 도구 | [README](plugins/utilities/README.md) |
| [research](plugins/research) | 1 Skill | 공식 자료 조사 | [README](plugins/research/README.md) |
| [**install-all**](plugins/install-all) | **Meta** | **모든 플러그인 통합 설치** | [README](plugins/install-all/README.md) |

**총계**: 25 스킬, 4 커맨드, 3 에이전트, 3 훅 (10개 플러그인: 9개 + 1개 메타)

---

## ⚡ Quick Start

### 설치 방법

#### 옵션 1: 전체 설치 (권장)

```bash
# 1. 레포지토리 클론
git clone https://github.com/inchan/cc-skills.git

# 2. install-all 플러그인 설치 (모든 기능 포함)
claude plugins install /path/to/cc-skills/plugins/install-all

# 또는 마켓플레이스 추가 (전체 접근)
# Settings → Plugins → Add Marketplace
# Path: /path/to/cc-skills
```

#### 옵션 2: 선택적 설치

필요한 플러그인만 개별 설치:

```bash
# Workflow automation만 필요한 경우
claude plugins install /path/to/cc-skills/plugins/workflow-automation

# 개발 가이드만 필요한 경우
claude plugins install /path/to/cc-skills/plugins/dev-guidelines
```

#### install-all 메타 플러그인

`install-all`을 설치하면 모든 플러그인의 기능을 한 번에 사용할 수 있습니다:

- ✅ **Hooks**: 스킬 자동 활성화
- ✅ **Skills**: 9개 플러그인 = 25개 스킬
  - **workflow-automation**: 워크플로우 자동화 (7개 스킬)
  - **dev-guidelines**: 개발 가이드라인 (3개 스킬)
  - **tool-creators**: 도구 생성 (6개 스킬)
  - **quality-review**: 품질 리뷰 (2개 스킬)
  - **ai-integration**: AI 통합 (3개 스킬)
  - **prompt-enhancement**: 프롬프트 최적화 (2개 스킬)
  - **utilities**: 유틸리티 (1개 스킬)
  - **research**: 공식 자료 조사 (1개 스킬)
- ✅ **Commands**: 4개 슬래시 커맨드
- ✅ **Agents**: 3개 서브에이전트

**작동 원리**: 상대 경로를 통해 다른 플러그인의 리소스를 참조하므로, 실제 파일 중복 없이 모든 기능에 접근합니다.

> ⚠️ **주의**: 상대 경로 참조는 실험적 기능입니다. 작동하지 않을 경우 개별 플러그인을 설치하세요.

---

## 📚 주요 기능

### 1. Workflow Automation

복잡도 기반 자동 라우팅:

```
User Prompt
  ↓
intelligent-task-router (복잡도 분석 0.0-1.0)
  ↓
├─ < 0.3: sequential-task-processor (순차)
├─ 0.3-0.7: parallel-task-executor (병렬)
└─ > 0.7: dynamic-task-orchestrator (동적)
```

**커맨드:**
- `/auto-workflow` - 자동 워크플로우
- `/workflow-simple`, `/workflow-parallel`, `/workflow-complex`

### 2. Dev Guidelines

#### Frontend (React + TypeScript)
- MUI v7 (Grid2, Suspense)
- TanStack Router
- 성능 최적화 패턴

#### Backend (Node.js + Express)
- Layered architecture
- Prisma ORM
- Zod validation

#### Error Tracking
- Sentry v8 통합
- 모든 에러 캡처

### 3. Tool Creators

```
"도구를 만들고 싶어"
  ↓
skill-generator-tool (의도 분석)
  ↓
타입 추천 (Command/Skill/Subagent/Hook)
  ↓
해당 creator로 라우팅
```

### 4. Quality Review

**5차원 평가** (iterative-quality-enhancer):
- Functionality, Performance, Code Quality, Security, Documentation

**6영역 리뷰** (reflection-review):
- P0/P1/P2 우선순위 피드백

### 5. AI Integration

외부 AI CLI 통합 (Dual-AI Loop):
- aider, codex, qwen, copilot, rovo-dev

---

## 🏗️ 아키텍처

### 디렉토리 구조

```
plugins/
├── hooks/                  # 🔥 스킬 자동 활성화 시스템
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── skill-activation-hook.sh
│   ├── lib/               # 공유 라이브러리
│   ├── matchers/          # Multi-Tier 매칭 엔진
│   ├── config/            # 설정 파일
│   └── cache/             # 캐시 디렉토리
├── workflow-automation/    # 워크플로우 자동화
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── skills/ (7개)
│   ├── commands/ (4개)
│   └── agents/ (1개)
├── dev-guidelines/         # 개발 가이드
├── tool-creators/          # 도구 생성
├── quality-review/         # 품질 리뷰
├── ai-integration/         # AI 통합
├── prompt-enhancement/     # 프롬프트 최적화
├── utilities/              # 유틸리티
├── research/               # 공식 자료 조사
└── install-all/            # 🎯 메타 플러그인
    ├── .claude-plugin/
    │   └── plugin.json    # 상대 경로로 모든 플러그인 참조
    └── README.md

scripts/
├── update-install-all.js   # install-all 자동 업데이트
└── analyze-dependencies.js

.claude-plugin/
└── marketplace.json        # 마켓플레이스 메타데이터
```

### 플러그인 독립성

- ✅ Zero cross-plugin dependencies
- ✅ 개별 버전 관리
- ✅ 선택적 활성화/비활성화
- ✅ 독립적 업데이트

---

## 🛠️ 개발

### install-all 플러그인 관리

```bash
# install-all plugin.json 자동 업데이트
node scripts/update-install-all.js

# 미리보기 (파일 수정 안 함)
node scripts/update-install-all.js --dry-run --verbose

# 새 플러그인을 추가하거나 기존 플러그인을 수정한 후 실행
# 자동으로 모든 플러그인의 리소스를 스캔하여 상대 경로로 통합
```

### 의존성 분석

```bash
# 스킬 간 의존성 분석
node scripts/analyze-dependencies.js
```

### 새 플러그인 추가

```bash
# 1. 플러그인 구조 생성
mkdir -p plugins/new-plugin/{.claude-plugin,skills,commands,agents}

# 2. plugin.json 작성
cat > plugins/new-plugin/.claude-plugin/plugin.json <<EOF
{
  "name": "new-plugin",
  "version": "2.0.0",
  "description": "Plugin description",
  "skills": ["./skills"]
}
EOF

# 3. marketplace.json 업데이트
# .claude-plugin/marketplace.json에 플러그인 추가

# 4. install-all 자동 업데이트
node scripts/update-install-all.js
```

### 테스트

```bash
# 플러그인 JSON 검증
for plugin in plugins/*/; do
  node -e "JSON.parse(require('fs').readFileSync('${plugin}.claude-plugin/plugin.json'))"
done

# skill-rules.json 검증
for rules in plugins/*/skills/skill-rules.json; do
  node -e "JSON.parse(require('fs').readFileSync('$rules'))"
done
```

---

## 📖 문서

- **[CLAUDE.md](CLAUDE.md)** - 개발 가이드 (Claude Code용)
- **[PLUGIN.md](PLUGIN.md)** - 플러그인 구조 상세
- **[docs/](docs/)** - 추가 문서
  - [SKILL-DEVELOPMENT-GUIDE.md](docs/SKILL-DEVELOPMENT-GUIDE.md)
  - [DOCUMENTATION_GUIDELINES.md](docs/DOCUMENTATION_GUIDELINES.md)

---

## 🔄 마이그레이션 (v1.x → v2.0.0)

v1.x 단일 플러그인 구조에서 v2.0.0 멀티 플러그인으로:

**주요 변경사항:**
- `src/` 제거 → `plugins/` 독립 구조
- skill-rules.json 플러그인별 분할
- 빌드 프로세스 제거 (직접 Git 추적)

**마이그레이션 스크립트:**
```bash
# 자동 마이그레이션 (참고용)
bash scripts/migrate-to-multi-plugin.sh
```

---

## 🤝 기여

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- [Anthropic Claude Code](https://claude.ai/code)
- [anthropics/claude-code](https://github.com/anthropics/claude-code) - Plugin pattern reference
- [Anthropic Agent Skills Guide](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/inchan/cc-skills?style=social)
![GitHub forks](https://img.shields.io/github/forks/inchan/cc-skills?style=social)
![GitHub issues](https://img.shields.io/github/issues/inchan/cc-skills)

**v0.0.1 (Pre-release)** - Multi-Plugin Architecture 🚧
