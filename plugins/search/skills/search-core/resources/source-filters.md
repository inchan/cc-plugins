# 출처 필터링 가이드

검색 결과의 신뢰도를 평가하는 Tier 분류 시스템입니다.

---

## Tier 분류 체계

| Tier | 분류 | 신뢰도 점수 | 예시 |
|------|------|-------------|------|
| **1** | 공식 문서 | 90-100 | react.dev, nodejs.org, python.org |
| **2** | 준공식 | 70-89 | blog.reactjs.org, vercel.com/guides |
| **3** | 커뮤니티 | 50-69 | Stack Overflow, Reddit, Dev.to |
| **4** | 전문가/개인 | 30-49 | Medium, 개인 블로그 |

---

## Tier 1: 공식 문서 (Official Documentation)

### 판단 기준

다음 조건 중 **하나 이상** 충족:

1. **도메인 패턴**
   - `.org` 도메인 + 프로젝트명 일치
     - 예: `react.org` → `reactjs.org` (공식)
   - `docs.*` 서브도메인
     - 예: `docs.python.org`, `docs.github.com`

2. **GitHub 공식 저장소**
   - 주요 프로젝트의 organization 소유
   - 예: `github.com/facebook/react`, `github.com/nodejs/node`
   - **주의**: 개인 fork는 제외

3. **공식 도메인 리스트**
   - 사전 정의된 공식 도메인 (아래 참고)

### 신뢰도 점수 산정

```typescript
function calculateTier1Score(url: string): number {
  const base = 90;
  let bonus = 0;

  // .org 도메인 (+5점)
  if (url.includes('.org')) bonus += 5;

  // docs 서브도메인 (+3점)
  if (url.includes('docs.')) bonus += 3;

  // GitHub official repo (+2점)
  if (isOfficialGitHubRepo(url)) bonus += 2;

  return Math.min(base + bonus, 100);
}
```

### 공식 도메인 예시 (주요 기술 스택)

**JavaScript/TypeScript**
- react.dev, reactjs.org
- nodejs.org
- typescriptlang.org
- developer.mozilla.org (MDN)

**Python**
- python.org
- docs.python.org
- pypi.org (패키지 정보)

**백엔드**
- spring.io
- docs.oracle.com (Java)
- golang.org

**데이터베이스**
- postgresql.org
- mongodb.com/docs
- redis.io

**클라우드/인프라**
- aws.amazon.com/documentation
- cloud.google.com/docs
- kubernetes.io

---

## Tier 2: 준공식 자료 (Semi-Official)

### 판단 기준

1. **공식 블로그/뉴스**
   - 예: blog.reactjs.org, nodejs.org/blog

2. **공식 파트너 문서**
   - 예: vercel.com (Next.js 개발사), netlify.com

3. **공식 샘플/예제**
   - GitHub 공식 examples 디렉토리
   - 예: `github.com/vercel/next.js/tree/canary/examples`

4. **주요 기술 플랫폼**
   - GitHub Guides, GitLab Docs
   - DigitalOcean Tutorials (검증된 품질)

### 신뢰도 점수 산정

```typescript
function calculateTier2Score(url: string): number {
  const base = 70;
  let bonus = 0;

  // 공식 블로그 (+10점)
  if (url.includes('/blog') && isOfficialDomain(url)) bonus += 10;

  // 공식 예제 (+8점)
  if (url.includes('/examples')) bonus += 8;

  // 주요 플랫폼 (+5점)
  if (isMajorPlatform(url)) bonus += 5;

  return Math.min(base + bonus, 89); // 최대 89점
}
```

### 주요 플랫폼 예시

- **Vercel**: Next.js, Turborepo 공식 개발사
- **Netlify**: Jamstack 생태계 리더
- **DigitalOcean**: 검증된 튜토리얼 품질
- **GitHub/GitLab**: 공식 가이드 섹션

---

## Tier 3: 커뮤니티 (Community)

### 판단 기준

1. **Q&A 플랫폼**
   - Stack Overflow
   - Reddit (r/programming, r/reactjs 등)
   - Hacker News

2. **개발자 플랫폼**
   - Dev.to
   - Hashnode
   - freeCodeCamp

3. **커뮤니티 위키**
   - MDN (비공식 섹션)
   - W3Schools

### 신뢰도 점수 산정

```typescript
function calculateTier3Score(url: string, metadata?: any): number {
  const base = 50;
  let bonus = 0;

  // Stack Overflow 투표 수 기반
  if (url.includes('stackoverflow.com')) {
    const votes = metadata?.votes || 0;
    bonus += Math.min(votes / 10, 15); // 최대 +15점
  }

  // Dev.to 반응 수 기반
  if (url.includes('dev.to')) {
    const reactions = metadata?.reactions || 0;
    bonus += Math.min(reactions / 50, 10); // 최대 +10점
  }

  // 최신성 (1년 이내 +5점)
  if (isRecent(metadata?.publishedAt, 365)) bonus += 5;

  return Math.min(base + bonus, 69); // 최대 69점
}
```

### 주의 사항

- **교차 검증 필수**: 공식 문서와 대조
- **투표/반응 확인**: 높은 투표 = 커뮤니티 검증
- **날짜 확인**: 1년 이상 경과 시 기술 스택 변화 가능

---

## Tier 4: 전문가/개인 블로그 (Expert/Personal)

### 판단 기준

1. **기술 미디어**
   - Medium
   - Substack

2. **개인 블로그**
   - 개발자 개인 도메인
   - 예: kentcdodds.com, overreacted.io (Dan Abramov)

3. **기술 블로그 플랫폼**
   - Tistory, Velog (한국)
   - WordPress 기반 개인 블로그

### 신뢰도 점수 산정

```typescript
function calculateTier4Score(url: string, metadata?: any): number {
  const base = 30;
  let bonus = 0;

  // 유명 개발자 (화이트리스트)
  if (isWellKnownDeveloper(url)) bonus += 15;

  // Medium: Claps 기반
  if (url.includes('medium.com')) {
    const claps = metadata?.claps || 0;
    bonus += Math.min(claps / 100, 10);
  }

  // 최신성 (6개월 이내 +5점)
  if (isRecent(metadata?.publishedAt, 180)) bonus += 5;

  return Math.min(base + bonus, 49); // 최대 49점
}
```

### 유명 개발자 화이트리스트 (예시)

**React 생태계**
- Dan Abramov (overreacted.io)
- Kent C. Dodds (kentcdodds.com)
- Lee Robinson (leerob.io)

**JavaScript**
- Addy Osmani
- Jake Archibald

**주의**: 화이트리스트는 정적이므로, 커뮤니티 검증(Claps, 댓글) 병행 필수

---

## 도메인 매칭 로직

### 구현 예시

```typescript
interface DomainRule {
  pattern: RegExp;
  tier: 1 | 2 | 3 | 4;
  baseScore: number;
}

const DOMAIN_RULES: DomainRule[] = [
  // Tier 1
  { pattern: /react\.dev|reactjs\.org/, tier: 1, baseScore: 95 },
  { pattern: /nodejs\.org/, tier: 1, baseScore: 95 },
  { pattern: /docs\.python\.org/, tier: 1, baseScore: 95 },

  // Tier 2
  { pattern: /vercel\.com\/(guides|docs|blog)/, tier: 2, baseScore: 85 },
  { pattern: /blog\.reactjs\.org/, tier: 2, baseScore: 88 },

  // Tier 3
  { pattern: /stackoverflow\.com/, tier: 3, baseScore: 65 },
  { pattern: /dev\.to/, tier: 3, baseScore: 60 },

  // Tier 4
  { pattern: /medium\.com/, tier: 4, baseScore: 40 },
];

function classifyUrl(url: string): { tier: number; score: number } {
  for (const rule of DOMAIN_RULES) {
    if (rule.pattern.test(url)) {
      return { tier: rule.tier, score: rule.baseScore };
    }
  }

  // 기본값: Tier 4
  return { tier: 4, score: 30 };
}
```

---

## 특수 케이스

### GitHub 저장소 판단

```typescript
function isOfficialGitHubRepo(url: string): boolean {
  const OFFICIAL_ORGS = [
    'facebook',     // React
    'nodejs',       // Node.js
    'vercel',       // Next.js, Turborepo
    'microsoft',    // TypeScript, VS Code
    'python',       // Python
    'golang',       // Go
  ];

  const match = url.match(/github\.com\/([^\/]+)/);
  if (!match) return false;

  const org = match[1];
  return OFFICIAL_ORGS.includes(org);
}
```

### URL 정규화

중복 제거를 위한 정규화:

```typescript
function normalizeUrl(url: string): string {
  const parsed = new URL(url);

  // 1. 프로토콜 제거 (http/https 동일 처리)
  // 2. www 제거
  let normalized = parsed.hostname.replace(/^www\./, '');

  // 3. 경로 정규화
  normalized += parsed.pathname
    .replace(/\/$/, '')        // 트레일링 슬래시 제거
    .toLowerCase();            // 대소문자 통일

  // 4. 쿼리/해시 제거 (추적 파라미터 제거)
  // utm_source, fbclid 등은 무시

  return normalized;
}

// 예시
normalizeUrl('https://www.React.dev/blog/');
// → 'react.dev/blog'

normalizeUrl('http://nodejs.org/api/?utm_source=twitter');
// → 'nodejs.org/api'
```

---

## 필터링 전략

### 전략 1: Tier 기반 필터

```typescript
function filterByTier(
  results: SearchResult[],
  tiers: number[]
): SearchResult[] {
  return results.filter(r => tiers.includes(r.tier));
}

// 사용 예시
const officialOnly = filterByTier(results, [1]);
const trusted = filterByTier(results, [1, 2]);
```

### 전략 2: 점수 기반 필터

```typescript
function filterByScore(
  results: SearchResult[],
  minScore: number
): SearchResult[] {
  return results.filter(r => r.reliability_score >= minScore);
}

// 사용 예시
const highQuality = filterByScore(results, 70); // 70점 이상
```

### 전략 3: 하이브리드 (Tier + Score)

```typescript
function filterHybrid(results: SearchResult[]): SearchResult[] {
  return results.filter(r => {
    // Tier 1-2는 무조건 포함
    if (r.tier <= 2) return true;

    // Tier 3는 60점 이상만
    if (r.tier === 3) return r.reliability_score >= 60;

    // Tier 4는 제외
    return false;
  });
}
```

---

## 출처 다양성 보장

검색 결과가 특정 tier에 편중되지 않도록:

```typescript
function diversifyResults(
  results: SearchResult[],
  maxPerTier: number = 3
): SearchResult[] {
  const grouped = groupBy(results, 'tier');
  const diversified: SearchResult[] = [];

  for (const tier of [1, 2, 3, 4]) {
    const tierResults = grouped[tier] || [];
    diversified.push(...tierResults.slice(0, maxPerTier));
  }

  return diversified;
}

// 예시
// Input: Tier 1 10개, Tier 2 5개, Tier 3 20개
// Output: Tier 1 3개, Tier 2 3개, Tier 3 3개 (총 9개)
```

---

## Edge Cases

### 1. 리다이렉트된 도메인

```typescript
// 예: reactjs.org → react.dev
const DOMAIN_REDIRECTS: Record<string, string> = {
  'reactjs.org': 'react.dev',
  'npmjs.org': 'npmjs.com',
};

function resolveRedirect(url: string): string {
  const domain = new URL(url).hostname;
  const target = DOMAIN_REDIRECTS[domain];
  return target ? url.replace(domain, target) : url;
}
```

### 2. 다국어 도메인

```typescript
// 예: ko.reactjs.org, ja.nodejs.org
function extractBaseDomain(url: string): string {
  const domain = new URL(url).hostname;
  // 언어 코드 제거 (ko., ja., en. 등)
  return domain.replace(/^[a-z]{2}\./, '');
}

// 예시
extractBaseDomain('https://ko.reactjs.org/docs');
// → 'reactjs.org'
```

### 3. 서브도메인 예외

```typescript
// blog.example.com ≠ example.com
// 서브도메인에 따라 tier 달라질 수 있음
function getTierBySubdomain(url: string): number {
  const hostname = new URL(url).hostname;

  if (hostname.startsWith('docs.')) return 1;  // 공식 문서
  if (hostname.startsWith('blog.')) return 2;  // 공식 블로그

  // 기본 도메인 규칙 적용
  return classifyUrl(url).tier;
}
```

---

## 업데이트 정책

### 도메인 리스트 유지보수

- **월 1회**: 주요 기술 스택 공식 도메인 변경 확인
- **분기 1회**: 유명 개발자 화이트리스트 갱신
- **연 1회**: Tier 분류 기준 재검토

### 신규 도메인 추가 기준

1. **Tier 1 추가**: 프로젝트 Star 10k+ 또는 공식 재단 소유
2. **Tier 2 추가**: 공식 파트너십 확인 또는 공식 인용
3. **Tier 3/4**: 동적 점수 기반, 화이트리스트 불필요

---

## 변경 이력

- **2025-11-29**: 초기 생성 (Tier 1-4 분류 체계 및 도메인 규칙)
