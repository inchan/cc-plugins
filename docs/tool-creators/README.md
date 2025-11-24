# 도구 생성 스킬 가이드 (Tool Creators Guide)

CC-Skills 프로젝트의 도구 생성 스킬 시스템에 대한 종합 가이드입니다.

## 목차

1. [개요](#개요)
2. [문서 구조](#문서-구조)
3. [빠른 시작](#빠른-시작)
4. [주요 개념](#주요-개념)
5. [개발 워크플로우](#개발-워크플로우)
6. [베스트 프랙티스](#베스트-프랙티스)
7. [참고 자료](#참고-자료)
8. [문제 해결](#문제-해결)
9. [기여 가이드](#기여-가이드)

---

## 개요

이 디렉토리는 Claude Code에서 사용할 수 있는 4가지 도구 생성 스킬에 대한 문서를 포함합니다:

1. **command-creator** - 슬래시 커맨드 생성
2. **skill-developer** - 스킬 패키지 개발
3. **hooks-creator** - 훅 스크립트 생성
4. **subagent-creator** - 서브에이전트 정의

## 문서 구조

| 문서 | 설명 | 대상 독자 |
|------|------|----------|
| [INDEX.md](./INDEX.md) | 전체 분석 문서 개요 및 인덱스 | 모든 사용자 |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | 빠른 참조 가이드 | 사용자 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 아키텍처 상세 설명 | 개발자 |
| [ANALYSIS.md](./ANALYSIS.md) | 종합 분석 및 비교 | 개발자, 기여자 |

## 빠른 시작

### 어떤 도구를 선택해야 할까?

**skill-generator-tool** 스킬을 사용하면 자동으로 적합한 도구 타입을 추천받을 수 있습니다:

```bash
/skill skill-generator-tool
```

### 각 도구의 사용 시점

**슬래시 커맨드 (command-creator)**
- 짧고 빠른 작업을 자주 실행할 때
- 사용자가 직접 호출하는 단축키가 필요할 때
- 예: `/auto-workflow`, `/workflow-simple`

**스킬 (skill-developer)**
- 도메인 전문 지식이 필요할 때
- 번들 리소스(템플릿, 예제)가 필요할 때
- 자동 활성화 (키워드/인텐트 매칭)가 필요할 때
- 예: `frontend-dev-guidelines`, `error-tracking`

**훅 (hooks-creator)**
- 이벤트 기반 자동화가 필요할 때
- 사용자 프롬프트, 도구 실행 전후에 자동 실행할 때
- 예: `skill-forced-eval-hook`, `stop-hook-lint-and-translate`

**서브에이전트 (subagent-creator)**
- 특정 역할/페르소나가 필요할 때
- 제한된 도구 권한이 필요할 때
- 복잡한 워크플로우에서 독립적인 역할을 수행할 때
- 예: `code-reviewer`, `architect`, `workflow-orchestrator`

## 주요 개념

### 공통 아키텍처 패턴

모든 도구 생성 스킬은 다음 패턴을 공유합니다:

1. **템플릿 기반 생성**
   - 사전 정의된 템플릿 제공
   - 사용자 커스터마이징 지원

2. **대화형 워크플로우**
   - 요구사항 수집
   - 선택사항 제시
   - 생성 및 검증

3. **베스트 프랙티스 통합**
   - Anthropic 공식 가이드라인 준수
   - 500줄 규칙 (스킬)
   - 보안 및 성능 고려사항

4. **자동 등록 및 설치**
   - `skill-rules.json` 업데이트 (스킬)
   - `hooks.json` 업데이트 (훅)
   - 실행 권한 설정

### 스킬 규칙 (skill-rules.json)

스킬 자동 활성화를 위한 키워드 및 인텐트 패턴 등록:

```json
{
  "skills": {
    "skill-name": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["word1", "word2"],
        "intentPatterns": ["regex1", "regex2"]
      }
    }
  }
}
```

## 개발 워크플로우

### 1. 도구 타입 결정
```bash
/skill skill-generator-tool
# 요구사항 설명 → 적합한 타입 추천
```

### 2. 도구 생성
```bash
# 커맨드
/skill command-creator

# 스킬
/skill skill-developer

# 훅
/skill hooks-creator

# 서브에이전트
/skill subagent-creator
```

### 3. 테스트 및 검증
```bash
# 스킬 규칙 검증
node tests/validate-skill-rules.js

# 활성화 테스트
node tests/run-activation-tests.js

# 설치 테스트
node scripts/install-skills.js --dry-run
```

### 4. 등록 및 배포
```bash
# 빌드
npm run build

# 로컬 동기화
npm run sync

# Claude Code 재시작
```

## 베스트 프랙티스

### 도구 설계 원칙

**1. 단일 책임 원칙 (Single Responsibility)**
- 각 도구는 하나의 명확한 목적을 가져야 함
- 여러 기능이 필요하면 여러 도구로 분리

**2. 프로그레시브 공개 (Progressive Disclosure)**
- 간단한 사용 → 고급 옵션 순으로 제시
- 기본값 제공으로 빠른 시작 지원

**3. 명확한 문서화**
- SKILL.md/커맨드.md에 명확한 설명
- 실행 가능한 예제 포함
- 트러블슈팅 가이드 제공

**4. 자동화 우선**
- 수동 단계 최소화
- 검증 및 오류 처리 자동화
- 설치 및 등록 자동화

### 스킬 개발 체크리스트

- [ ] SKILL.md 500줄 이하
- [ ] 번들 리소스 `resources/` 디렉토리 사용
- [ ] `skill-rules.json`에 키워드/인텐트 등록
- [ ] 예제 포함
- [ ] 테스트 실행 및 통과
- [ ] CLAUDE.md 업데이트 (필요시)

### 커맨드 개발 체크리스트

- [ ] YAML frontmatter 포함
- [ ] 명확한 설명 (description)
- [ ] 필요한 도구 권한 명시 (allowed-tools)
- [ ] 예제 포함
- [ ] 실행 테스트

### 훅 개발 체크리스트

- [ ] 경량화 (빠른 실행)
- [ ] `hooks.json`에 등록
- [ ] 실행 권한 설정 (chmod +x)
- [ ] 오류 처리 포함
- [ ] `${CLAUDE_PLUGIN_ROOT}` 환경 변수 사용
- [ ] `settings.local.json` 권한 설정

### 서브에이전트 개발 체크리스트

- [ ] 명확한 역할/페르소나 정의
- [ ] 필요한 도구 권한만 부여
- [ ] 출력 형식 명시
- [ ] 예제 포함
- [ ] 테스트 실행

## 참고 자료

### 공식 문서
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Agent Skills Guide](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Code Plugins](https://code.claude.com/docs/en/plugins)

### 프로젝트 문서
- [SKILL-DEVELOPMENT-GUIDE.md](../SKILL-DEVELOPMENT-GUIDE.md) - 스킬 개발 가이드
- [skills-guide/](../skills-guide/) - 스킬 사용 가이드
- [agent-patterns/](../agent-patterns/) - 에이전트 패턴
- [DOCUMENTATION_GUIDELINES.md](../DOCUMENTATION_GUIDELINES.md) - 문서 작성 가이드라인

### 루트 문서
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 개발 가이드
- [README.md](../../README.md) - 프로젝트 개요
- [PLUGIN.md](../../PLUGIN.md) - 플러그인 사용 가이드

## 문제 해결

### 스킬이 자동 활성화되지 않음
1. `skills/skill-rules.json`에 등록되어 있는지 확인
2. 키워드/인텐트 패턴이 올바른지 검증
3. Claude Code 재시작

### 훅이 실행되지 않음
1. 실행 권한 확인: `chmod +x hooks/*.sh`
2. `hooks/hooks.json`에 등록되어 있는지 확인
3. `settings.local.json`에 권한 설정 확인

### 빌드가 실패함
1. `npm run build` 실행
2. 오류 메시지 확인
3. 파일 경로 및 권한 확인

## 기여 가이드

새로운 도구 생성 스킬 추가 또는 기존 스킬 개선:

1. **이슈 생성**: 변경 사항 설명
2. **브랜치 생성**: `feature/tool-name`
3. **개발**: 위의 체크리스트 준수
4. **테스트**: 모든 검증 스크립트 통과
5. **PR 생성**: 명확한 설명 및 예제 포함
6. **리뷰**: 피드백 반영

---

**마지막 업데이트**: 2025-11-21
**버전**: 1.5.0
