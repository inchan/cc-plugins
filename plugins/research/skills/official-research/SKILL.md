---
name: official-research
description: |
  Research any topic by prioritizing official sources first. Use when user asks to investigate, research, look up, or find information about technologies, libraries, frameworks, or any subject. Triggers on: 공식 문서, 공식 사이트, 오피셜 조사, 조사해줘, 알아봐줘, 찾아봐줘, research, investigate, look up, official documentation, official source, best practices.
---

# Official Research

공식 소스 우선 조사 스킬. 모든 주제에 대해 공식 출처를 먼저 조사하고, 공신력 있는 2차 소스로 보완합니다.

## Purpose

신뢰할 수 있는 정보를 체계적으로 수집합니다:
- **Tier 1**: 공식 소스 (공식사이트, 문서, 저장소, 블로그, 샘플, 모범사례)
- **Tier 2**: 공신력 있는 2차 소스 (기술 블로그, 학술/교육, 커뮤니티)

## When to Use

자동 활성화 조건:
- "조사해줘", "알아봐줘", "찾아봐줘" 요청
- "공식 문서", "공식 사이트", "오피셜" 언급
- "research", "investigate", "look up" 요청
- 기술/라이브러리/프레임워크 정보 필요 시
- 모범 사례, 권장 패턴 확인 필요 시

---

## Research Depth Levels

| Level | 설명 | 출력 형식 |
|-------|------|----------|
| **Quick** | 공식 소스 링크만 | 링크 목록 |
| **Standard** | 공식 소스 + 핵심 요약 (기본값) | 링크 + 요약 |
| **Deep** | 공식 + 2차 소스 종합 | 종합 보고서 |

---

## Source Priority

### Tier 1: 공식 소스 (최우선)

| 유형 | 판별 기준 | 예시 |
|------|----------|------|
| 공식 사이트 | 브랜드 도메인 | react.dev, kubernetes.io |
| 공식 문서 | /docs, docs.* | docs.python.org |
| 공식 저장소 | github.com/[org] verified | github.com/facebook/react |
| 공식 블로그 | blog.[domain] | blog.golang.org |
| 공식 샘플 | /examples, /tutorials | nextjs.org/examples |
| 모범사례 | best-practices, guidelines | cloud.google.com/best-practices |

### Tier 2: 공신력 있는 2차 소스

| 유형 | 판별 기준 | 예시 |
|------|----------|------|
| 기술 블로그 | 유명 기업 엔지니어링 | engineering.fb.com, netflixtechblog |
| 학술/교육 | .edu, 강의 플랫폼 | MIT OCW, Coursera |
| 커뮤니티 | 높은 평점/투표 | Stack Overflow 고득표 답변 |
| 전문 미디어 | 공신력 있는 기술 미디어 | InfoQ, The New Stack |

---

## Workflow

### Step 1: 주제 분석

사용자 요청에서 추출:
- 핵심 주제/기술명
- 버전 (있다면)
- 구체적 관심 영역

### Step 2: 공식 소스 탐색

**기술 주제 → Context7 MCP 활용:**
```
mcp__context7__resolve-library-id → mcp__context7__get-library-docs
```

**웹 검색 쿼리 전략:**
```
1차: "[주제] official documentation"
2차: "[주제] site:[공식도메인]"
3차: "[주제] github official"
```

### Step 3: 소스 검증

**공식 소스 시그널:**
- 도메인: `[brand].com`, `[brand].io`, `[brand].dev`
- 경로: `/docs`, `/documentation`, `/official`
- GitHub: Verified org, 높은 스타 수
- 메타: "Official", "Documentation" 표기

### Step 4: 결과 정리

**Standard 출력 형식:**
```markdown
## [주제] 조사 결과

### 📚 공식 소스

#### 공식 문서
- [제목](URL) - 요약

#### 공식 저장소
- [제목](URL) - 요약

### 🔗 추가 참고 자료
- [제목](URL) - 출처, 요약

### 💡 핵심 요약
[3-5줄 핵심 내용]

---
Sources: [출처 목록]
```

---

## Tools

| 도구 | 용도 |
|------|------|
| `WebSearch` | 공식 소스 검색 |
| `WebFetch` | 페이지 내용 확인 |
| `mcp__context7__resolve-library-id` | 기술 라이브러리 ID 확인 |
| `mcp__context7__get-library-docs` | 기술 문서 조회 |

---

## Search Query Patterns

### 공식 문서
```
"[subject] official documentation"
"[subject] docs"
site:github.com [subject] official
```

### 모범 사례
```
"[subject] best practices official"
"[subject] recommended patterns"
"[subject] guidelines"
```

### 한글 주제
```
"[주제] 공식 문서"
"[주제] 가이드"
```

---

## Example

**Input:** "React Server Components 조사해줘"

**Output:**
```markdown
## React Server Components 조사 결과

### 📚 공식 소스

#### 공식 문서
- [Server Components - React Docs](https://react.dev/reference/rsc/server-components)
  - RSC 개념, 사용법, 제약사항

#### 공식 저장소
- [React RFC #188](https://github.com/reactjs/rfcs/pull/188)
  - RSC 설계 제안서

#### 공식 블로그
- [React Labs - March 2023](https://react.dev/blog/2023/03/22/react-labs-march-2023)
  - RSC 소개 및 로드맵

### 🔗 추가 참고 자료
- [Vercel - Understanding RSC](https://vercel.com/blog/understanding-react-server-components)
  - Vercel 엔지니어링 블로그, 실무 가이드

### 💡 핵심 요약
React Server Components는 서버에서 렌더링되는 새로운 컴포넌트 유형.
번들 크기 감소, 직접 백엔드 접근, 자동 코드 분할이 주요 장점.
Next.js 13+ App Router에서 기본 지원.

---
Sources:
- [React Official Docs](https://react.dev)
- [React GitHub](https://github.com/facebook/react)
- [Vercel Blog](https://vercel.com/blog)
```

---

## Domain Knowledge

### 주요 기술별 공식 소스

| 기술 | 공식 사이트 | 공식 문서 | GitHub |
|------|-----------|----------|--------|
| React | react.dev | react.dev/learn | github.com/facebook/react |
| Vue | vuejs.org | vuejs.org/guide | github.com/vuejs/core |
| Next.js | nextjs.org | nextjs.org/docs | github.com/vercel/next.js |
| Node.js | nodejs.org | nodejs.org/docs | github.com/nodejs/node |
| Python | python.org | docs.python.org | github.com/python/cpython |
| Go | go.dev | go.dev/doc | github.com/golang/go |
| Rust | rust-lang.org | doc.rust-lang.org | github.com/rust-lang/rust |
| Kubernetes | kubernetes.io | kubernetes.io/docs | github.com/kubernetes |
| Docker | docker.com | docs.docker.com | github.com/docker |
| AWS | aws.amazon.com | docs.aws.amazon.com | github.com/aws |
| GCP | cloud.google.com | cloud.google.com/docs | github.com/googleapis |

---

## Tips

- **버전 명시**: 특정 버전 필요 시 검색에 포함
- **교차 검증**: 2차 소스는 항상 공식 소스로 검증
- **한계 인식**: 공식 소스 없는 주제는 명시적 표기
- **최신성**: 날짜 필터로 최신 정보 우선

---

**Skill Status**: Active ✅
**Line Count**: ~200 (under 500-line rule) ✅
**Progressive Disclosure**: Reference files available if needed ✅
