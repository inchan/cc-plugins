---
name: search-core
description: 웹 검색 및 출처 필터링 공통 로직. 공식 문서, 커뮤니티, 기술 블로그 검색 시 자동 활성화
---

# Search Core: 웹 검색 공통 로직

## 목적

웹 검색을 위한 재사용 가능한 인터페이스를 제공합니다.
3개의 검색 에이전트(official-docs, comprehensive, best-practice)가 공통으로 사용하는 핵심 로직입니다.

## 핵심 기능

1. **Gemini 검색 위임**: other-agents MCP 또는 Bash를 통해 Gemini에게 구글 검색 위임
2. **출처 신뢰도 평가**: Tier 1-4 분류 시스템
3. **결과 정규화**: 일관된 형식으로 변환
4. **중복 제거**: URL 기반 deduplication

---

## 검색 방법 (우선순위)

검색은 다음 우선순위로 실행됩니다:

| 순위 | 방법 | 조건 | 도구 |
|------|------|------|------|
| **1순위** | Gemini via MCP | other-agents MCP + gemini 설치 | `google_search`, `web_fetch` |
| **2순위** | Gemini via Bash | gemini CLI 설치 | `google_search`, `web_fetch` |
| **3순위** | 자체 WebSearch | Gemini 불가 시 | `WebSearch`, `WebFetch` |

### Gemini 내부 도구 (1-2순위)

Gemini에게 다음 도구를 사용하도록 지시합니다:

| 순위 | 도구 | 용도 |
|------|------|------|
| **1순위** | `google_search` | 구글 검색 수행 |
| **2순위** | `web_fetch` | 특정 페이지 내용 조회 |

### Gemini 검색 위임 장점

- **구글 검색 네이티브**: Gemini의 `google_search` 도구 활용
- **최신 정보**: 실시간 검색 결과
- **정확한 출처**: 구글 검색 결과의 신뢰도
- **비용 효율**: 일반 작업에서 Gemini 우선 정책과 일치

### 사용 예시

```python
# 1순위: MCP로 Gemini 호출
response = mcp__other-agents__use_agent(
    cli_name="gemini",
    message="google_search 도구로 'React Server Components' 검색해줘"
)

# 2순위: Bash로 Gemini CLI 호출
response = Bash('gemini "google_search 도구로 React Server Components 검색해줘"')

# 3순위: 자체 WebSearch (Fallback)
response = WebSearch(query="React Server Components")
```

---

## 사용 방법

### 1. 기본 검색 (WebSearch 래핑)

```typescript
// Input:
{
  query: string,           // 검색어 (최소 3자)
  tier?: 1 | 2 | 3 | 4,   // 출처 필터 (생략 시 전체)
  maxResults?: number      // 최대 결과 수 (기본 10)
}

// Output:
Array<{
  title: string,
  url: string,
  snippet: string,
  tier: 1 | 2 | 3 | 4,
  reliability_score: number  // 0-100
}>
```

**사용 예시:**

```
검색어: "React Server Components tutorial"
필터: tier=1 (공식 문서만)
→ [{
    title: "Server Components - React",
    url: "https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components",
    snippet: "React Server Components allow developers to build applications...",
    tier: 1,
    reliability_score: 95
  }]
```

### 2. 상세 검색 (WebFetch 활용)

특정 URL의 전체 내용을 가져와 분석할 때 사용합니다.

```typescript
// Input:
{
  url: string,
  prompt: string  // 추출할 정보
}

// Output:
{
  content: string,
  tier: 1 | 2 | 3 | 4,
  reliability_score: number
}
```

---

## 성공 기준 (P1: Validation First)

### Input Validation

- **검색어**: 3자 이상, 비어있지 않음
- **Tier**: 1-4 범위 또는 undefined
- **MaxResults**: 1-50 범위

### Output Format

모든 검색 결과는 다음 형식을 준수:

```typescript
interface SearchResult {
  title: string;        // 비어있지 않음
  url: string;          // 유효한 URL 형식
  snippet: string;      // 200자 이하
  tier: 1 | 2 | 3 | 4;
  reliability_score: number;  // 0-100
}
```

### Edge Cases

1. **빈 검색어** → Error: "Search query must be at least 3 characters"
2. **결과 0개** → `[]` + 경고 메시지
3. **중복 URL** → 첫 번째 결과만 유지
4. **잘못된 URL** → 해당 결과 제외 + 로그
5. **Tier 필터 미적용** → 모든 tier 결과 반환

---

## 출처 신뢰도 평가 시스템

상세 내용은 `resources/source-filters.md` 참고

### Tier 분류 기준 (요약)

**Tier 1 (공식 문서)**
- 점수: 90-100
- 예시: react.dev, nodejs.org, docs.python.org
- 판단 기준:
  - `.org` 도메인 + 프로젝트명 일치
  - `docs.*` 서브도메인
  - 공식 GitHub 저장소 (주요 프로젝트)

**Tier 2 (준공식)**
- 점수: 70-89
- 예시: blog.reactjs.org, vercel.com/guides
- 판단 기준:
  - 공식 블로그/가이드
  - 공식 샘플 코드
  - 공식 파트너 문서

**Tier 3 (커뮤니티)**
- 점수: 50-69
- 예시: Stack Overflow, Reddit, Dev.to
- 판단 기준:
  - 커뮤니티 플랫폼
  - 투표/평점 시스템 존재

**Tier 4 (전문가 블로그)**
- 점수: 30-49
- 예시: Medium, 개인 블로그
- 판단 기준:
  - 개인 블로그
  - 기술 미디어 플랫폼

---

## 중복 제거 로직

### 정규화 규칙

다음 URL은 동일하게 처리:
- `http://example.com` = `https://example.com`
- `example.com/page` = `example.com/page/`
- `example.com/page#section` = `example.com/page`
- `example.com/page?utm_source=x` = `example.com/page`

### 구현 예시

```typescript
function normalizeUrl(url: string): string {
  const parsed = new URL(url);
  // 프로토콜 제거, 트레일링 슬래시 제거, 쿼리/해시 제거
  return parsed.hostname + parsed.pathname.replace(/\/$/, '');
}

function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    const normalized = normalizeUrl(result.url);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
```

---

## 검색 결과 순위 조정

기본 정렬 순서:

1. **Tier 우선** (1 > 2 > 3 > 4)
2. **Reliability Score 내림차순**
3. **최신성** (날짜 정보 있을 경우)

```typescript
results.sort((a, b) => {
  if (a.tier !== b.tier) return a.tier - b.tier;
  if (a.reliability_score !== b.reliability_score)
    return b.reliability_score - a.reliability_score;
  return 0; // 동일 tier + score 시 원본 순서 유지
});
```

---

## 출력 형식 가이드

상세 내용은 `resources/output-formats.md` 참고

### 1. 요약 형식 (Quick Answer)

사용자가 빠른 답변을 원할 때:

```markdown
## 답변

[핵심 내용 2-3문장]

## 참고 링크

- [공식 문서] Title (tier 1)
- [공식 가이드] Title (tier 2)
- [커뮤니티] Title (tier 3)

Sources:
- [Title 1](url1)
- [Title 2](url2)
```

### 2. 상세 분석 (Deep Dive)

각 출처를 비교 분석할 때:

```markdown
## 공식 문서 (Tier 1)

### [Title](url) - 신뢰도: 95/100

[요약]

주요 내용:
- 포인트 1
- 포인트 2

## 커뮤니티 (Tier 3)

### [Title](url) - 신뢰도: 65/100

[요약 + 주의사항]

Sources:
- [all URLs]
```

### 3. 대화형 탐색 (Progressive Discovery)

초기 검색 후 drill-down:

```markdown
## 초기 검색 결과 (Top 5)

1. [Title 1](url1) - tier 1, score: 95
2. [Title 2](url2) - tier 2, score: 80

더 알아보고 싶은 영역:
- [ ] 공식 문서 상세 보기
- [ ] 실전 예제 찾기
- [ ] 커뮤니티 의견 확인

Sources: [...]
```

---

## 사용 제약 및 주의사항

### 제약 조건

1. **WebSearch API 제한**
   - 미국에서만 사용 가능
   - 결과 수 제한 준수

2. **WebFetch 캐싱**
   - 15분 자동 캐싱
   - 동일 URL 반복 요청 시 캐시 활용

3. **성능**
   - 최대 결과 수: 50개 (초과 시 자동 truncate)
   - 타임아웃: 10초

### 에러 핸들링

```typescript
// WebSearch 실패 시
if (!results || results.length === 0) {
  console.warn("No results found for query:", query);
  return [];
}

// URL 파싱 실패 시
try {
  new URL(result.url);
} catch {
  console.error("Invalid URL:", result.url);
  continue; // 스킵
}
```

---

## 검색 전략 패턴

### Pattern 1: 공식 문서 우선 검색

```
1. tier=1 검색 실행
2. 결과 >= 3개 → 종료
3. 결과 < 3개 → tier=2 추가 검색
4. 결과 < 5개 → tier=3,4 추가 검색
```

### Pattern 2: 종합 검색

```
1. 전체 tier 검색 (maxResults=20)
2. tier별 그룹화
3. 각 tier에서 top 2-3개씩 선택
4. 총 10개 이내로 제한
```

### Pattern 3: 점진적 탐색

```
1. 초기: tier=1,2 + maxResults=5
2. 사용자 피드백: "더 많은 예제 필요"
3. 추가 검색: tier=3 + keyword="example" + maxResults=10
4. 결과 병합 + deduplication
```

---

## 통합 예시

### 예시 1: React Server Components 공식 문서 찾기

```typescript
// Input
const query = "React Server Components";
const tier = 1;  // 공식 문서만

// Process
1. WebSearch 호출
2. 결과 필터링 (tier=1만)
3. URL 중복 제거
4. 신뢰도 점수 계산
5. 정렬 (reliability_score DESC)

// Output
[
  {
    title: "Server Components - React",
    url: "https://react.dev/blog/2023/03/22/...",
    snippet: "React Server Components allow...",
    tier: 1,
    reliability_score: 95
  },
  {
    title: "React Server Components - RFC",
    url: "https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md",
    tier: 1,
    reliability_score: 92
  }
]
```

### 예시 2: Next.js 실전 예제 찾기 (종합 검색)

```typescript
// Input
const query = "Next.js App Router tutorial";
// tier 미지정 = 전체 검색

// Process
1. WebSearch 호출 (maxResults=20)
2. 모든 tier 결과 수집
3. 중복 제거
4. tier별 그룹화
5. 각 tier에서 top 3개씩 선택

// Output (tier 혼합)
[
  // Tier 1
  { title: "App Router - Next.js", tier: 1, score: 95, ... },
  { title: "Routing Fundamentals", tier: 1, score: 93, ... },

  // Tier 2
  { title: "Vercel Guide: App Router", tier: 2, score: 85, ... },

  // Tier 3
  { title: "Dev.to: Migrating to App Router", tier: 3, score: 68, ... },
  { title: "Stack Overflow: App Router Best Practices", tier: 3, score: 62, ... }
]
```

---

## 확장 가능성

### 향후 추가 가능 기능

(현재 구현하지 않음 - YAGNI 원칙)

- 날짜 필터링 (최근 1년 내)
- 언어 필터링 (한글/영어)
- 도메인 블랙리스트
- 사용자 피드백 기반 점수 조정

**중요**: 위 기능은 실제 필요성이 확인될 때까지 구현하지 않습니다.

---

## 관련 자료

- [출처 필터링 상세 가이드](resources/source-filters.md)
- [출력 형식 템플릿](resources/output-formats.md)
- [WebSearch Tool 문서](https://docs.anthropic.com/claude-code/websearch)
- [WebFetch Tool 문서](https://docs.anthropic.com/claude-code/webfetch)

---

## 변경 이력

- **2025-11-29**: 초기 생성 (WebSearch/WebFetch 래퍼 + Tier 분류)
