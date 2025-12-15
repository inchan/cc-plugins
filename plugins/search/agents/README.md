# Search Agent (통합 검색 에이전트)

> 공식 문서, 종합 검색, 모범 사례 검색을 하나의 에이전트로 통합

---

## 디렉토리 구조

```
agents/search/
├── README.md               # 검색 에이전트 개요
├── search-agent.md         # 통합 검색 에이전트
└── resources/              # 전략 문서
    ├── official-docs-strategy.md
    ├── comprehensive-strategy.md
    └── best-practice-strategy.md
```

---

## 개요

Search Agent는 3가지 검색 전략(공식 문서/종합/모범 사례)을 하나의 에이전트로 통합한 웹 검색 도구입니다.

### 주요 특징

- **단일 진입점**: `/search` 커맨드로 모든 검색 타입 접근
- **전략 기반**: type 파라미터에 따라 적절한 전략 선택
- **Resources 패턴**: 전략 문서를 resources/ 디렉토리로 분리하여 유지보수성 향상
- **DRY 준수**: 공통 로직을 search-core 스킬로 분리

---

## 사용법

### 1. 커맨드를 통한 사용

```bash
# Type 선택 질문
/search "React hooks"

# Type 직접 지정
/search --type=official "React hooks"
/search --type=comprehensive "React hooks"
/search --type=best-practice "React hooks"
```

### 2. Agent 직접 호출

```json
{
  "subagent_type": "search:search-agent",
  "prompt": "{\"type\":\"official\",\"query\":\"React hooks\",\"format\":\"summary\"}"
}
```

---

## 검색 타입 비교

| 타입 | Tier 필터 | 신뢰도 기준 | 최대 결과 | 주요 용도 |
|------|----------|------------|----------|----------|
| **official** | 1-2 (공식 출처) | 90점 이상 | 10개 | 공식 API 확인, 빠른 검증 |
| **comprehensive** | 1-4 (전체) | 60점 이상 | 20개 | 문제 해결, 다양한 관점 비교 |
| **best-practice** | 1-2 우선, 3 허용 | 품질 30점 이상 | 10개 | 코드 샘플, 실전 예제 |

---

## 검색 Tier 정의

| Tier | 출처 유형 | 신뢰도 | 예시 |
|------|----------|--------|------|
| **Tier 1** | 공식 문서 | 90-100점 | docs.python.org, react.dev |
| **Tier 2** | 공식 저장소/블로그 | 70-89점 | github.com/facebook/react, blog.cloudflare.com |
| **Tier 3** | 신뢰 커뮤니티 | 50-69점 | Stack Overflow, Reddit |
| **Tier 4** | 일반 커뮤니티 | 30-49점 | Medium, Dev.to, 개인 블로그 |

상세 내용: [출처 필터링 가이드](../skills/search-core/resources/source-filters.md)

---

## 출력 형식

### 1. 요약 (summary)

```markdown
## 답변
[핵심 내용 2-3문장]

## 주요 출처
- [Title](url) - tier X, 신뢰도 XX/100

Sources:
- [모든 URL]
```

### 2. 상세 분석 (detailed)

```markdown
## Tier 1: 공식 문서
### [Title](url) - 신뢰도: XX/100
[요약]

**주요 내용**:
- 포인트 1
- 포인트 2

Sources:
- [모든 URL]
```

### 3. 대화형 탐색 (progressive)

```markdown
## 초기 검색 결과 (Top 5)
1. [Title](url) - tier X

## 더 알아보고 싶은 영역
- [ ] 공식 문서 상세 보기
- [ ] 실전 예제 찾기

Sources:
- [모든 URL]
```

상세 내용: [출력 형식 가이드](../skills/search-core/resources/output-formats.md)

---

## 전략 문서

각 검색 타입의 상세 전략은 resources/ 디렉토리 참조:

- [공식 문서 검색 전략](resources/official-docs-strategy.md)
- [종합 검색 전략](resources/comprehensive-strategy.md)
- [모범 사례 검색 전략](resources/best-practice-strategy.md)

---

## 타입 선택 가이드

| 상황 | 추천 타입 | 이유 |
|------|----------|------|
| 최신 공식 API 찾기 | **official** | 공식 출처만 신뢰 가능 |
| 문제 해결 방법 비교 | **comprehensive** | 다양한 관점 필요 |
| 실제 구현 예제 필요 | **best-practice** | 코드 샘플 우선 검색 |
| 빠른 공식 확인 | **official** | 검색 범위 좁아 빠름 |
| 심층 조사 | **comprehensive** | 전체 Tier 조사 |

---

## 공통 스킬 의존성

Search Agent는 다음 공통 스킬을 사용합니다:

- **search-core** ([SKILL.md](../skills/search-core/SKILL.md)):
  - **Gemini 검색 위임** (MCP/Bash)
  - 검색 래퍼 (WebSearch/WebFetch - Fallback)
  - Tier 분류 및 신뢰도 평가
  - 중복 제거 및 결과 정렬
  - 출처 필터링

---

## 아키텍처

```
/search command
    ↓
search-agent.md (통합 에이전트)
    ↓
    ├─ resources/official-docs-strategy.md
    ├─ resources/comprehensive-strategy.md
    └─ resources/best-practice-strategy.md
    ↓
search-core skill
    ↓
검색 방법 선택 (우선순위)
    ├─ 1순위: Gemini via MCP → google_search, web_fetch
    ├─ 2순위: Gemini via Bash → google_search, web_fetch
    └─ 3순위: 자체 WebSearch/WebFetch (Fallback)
    ↓
    ├─ Tier 분류
    ├─ 중복 제거
    └─ 결과 정렬
```

---

## 성능 지표

- **파일 수**: 7개 → 5개 (29% 감소)
- **코드 라인**: ~2189줄 → ~900줄 (59% 감소)
- **중복률**: 72% → 0%
- **유지보수 포인트**: 6곳 → 1곳 (83% 감소)

---

## 제약 사항

- **Gemini 권장**: other-agents MCP 또는 gemini CLI 설치 시 구글 검색 활용
- **WebSearch Fallback**: Gemini 사용 불가 시 자체 WebSearch 사용 (미국 지역만 가능)
- 최대 결과 수: type에 따라 10-20개

---

## 참고 자료

- [Tool Creation Guide](../../docs/guidelines/tool-creation.md)
- [Sub-agents 공식 문서](https://docs.anthropic.com/claude-code/agents)
- [search-core 스킬](../skills/search-core/SKILL.md)

---

## 변경 이력

- **2025-11-30 (v2.1)**: 품질 개선
  - 출력 형식 중복 제거 (85% → 5%) - output-formats.md 참조로 교체
  - format 검증 강화 (빈 값 기본 처리 + 에러 메시지 개선)
  - Edge Cases 완전 처리 (허용 값 명시)
  - P1-P4 가이드라인 100% 준수 달성
- **2025-11-30 (v0.1.0)**: 통합 에이전트로 리팩토링
  - 기존 3개 에이전트(official-docs, comprehensive, best-practice) → search-agent로 통합
  - Resources 패턴 도입 (전략 문서 분리)
  - 중복 코드 60% 제거
- **2025-11-29**: 검색 에이전트 3종 추가 (official-docs, comprehensive, best-practice)
- **2025-11-29**: search 디렉토리 생성
