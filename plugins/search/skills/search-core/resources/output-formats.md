# 출력 형식 가이드

검색 결과를 사용자에게 제시하는 3가지 표준 템플릿입니다.

---

## 1. 요약 형식 (Quick Answer)

**사용 시기**: 사용자가 빠른 답변을 원할 때

### 템플릿

```markdown
## 답변

[핵심 내용을 2-3문장으로 요약]

## 주요 출처

- **[공식 문서]** [Title](url) - [1줄 설명]
- **[공식 가이드]** [Title](url) - [1줄 설명]
- **[커뮤니티]** [Title](url) - [1줄 설명]

[추가 권장 사항이 있다면 1-2문장]

Sources:
- [Title 1](url1)
- [Title 2](url2)
- [Title 3](url3)
```

### 실제 예시

```markdown
## 답변

React Server Components는 서버에서 실행되는 컴포넌트로, 클라이언트 번들 크기를 줄이고
데이터 페칭을 서버에서 처리할 수 있습니다. Next.js 13 App Router에서 기본으로 채택되었습니다.

## 주요 출처

- **[공식 문서]** Server Components - React - 개념과 사용법 설명
- **[공식 RFC]** React Server Components RFC - 설계 의도와 상세 스펙
- **[가이드]** Vercel: Introduction to React Server Components - 실전 예제 포함

Next.js에서 사용 시 공식 문서와 Vercel 가이드를 함께 참고하는 것을 권장합니다.

Sources:
- [Server Components - React](https://react.dev/blog/2023/03/22/...)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Introduction to React Server Components](https://vercel.com/blog/...)
```

### 규칙

- 핵심 답변: 50단어 이하
- 주요 출처: 3-5개 (tier 1-2 우선)
- Sources 섹션: 필수 (WebSearch 규칙)

---

## 2. 상세 분석 (Deep Dive)

**사용 시기**: 각 출처를 비교하고 신뢰도를 평가할 때

### 템플릿

```markdown
## Tier 1: 공식 문서

### [Title](url) - 신뢰도: XX/100

[요약 2-3문장]

**주요 내용**:
- 핵심 포인트 1
- 핵심 포인트 2
- 핵심 포인트 3

**장점**: [이 출처의 강점]
**한계**: [제한 사항 또는 주의점]

---

## Tier 2: 준공식 자료

### [Title](url) - 신뢰도: XX/100

[요약]

**주요 내용**:
- ...

---

## Tier 3: 커뮤니티

### [Title](url) - 신뢰도: XX/100

[요약]

**주의**: 커뮤니티 콘텐츠이므로 공식 문서와 교차 검증 필요

---

## 종합 의견

[전체 출처를 종합한 결론 2-3문장]

**권장 순서**:
1. [출처 A] 먼저 읽기 (개념 이해)
2. [출처 B] 실전 예제 확인
3. [출처 C] 커뮤니티 베스트 프랙티스 참고

Sources:
- [All URLs]
```

### 실제 예시

```markdown
## Tier 1: 공식 문서

### Server Components - React - 신뢰도: 95/100

React 팀의 공식 블로그 포스트로, Server Components의 개념과 기본 사용법을 설명합니다.
클라이언트 컴포넌트와의 차이점, 'use client' 디렉티브 사용법, 데이터 페칭 패턴을 다룹니다.

**주요 내용**:
- Server Components는 기본적으로 서버에서만 실행
- 클라이언트 상태/이벤트 필요 시 'use client' 사용
- async 컴포넌트로 직접 데이터 페칭 가능

**장점**: React 코어 팀의 공식 설명, 정확성 보장
**한계**: 실전 예제는 제한적, Next.js 통합 내용 부족

---

## Tier 2: 준공식 자료

### Vercel: Introduction to React Server Components - 신뢰도: 85/100

Next.js를 개발한 Vercel의 가이드로, App Router와 Server Components 통합 예제를 제공합니다.

**주요 내용**:
- Next.js 13 App Router에서의 사용법
- 파일 시스템 기반 라우팅과 통합
- 데이터 페칭 및 캐싱 전략

**장점**: 실전 예제 풍부, Next.js 특화
**한계**: Vercel 플랫폼 중심적

---

## Tier 3: 커뮤니티

### Dev.to: Migrating to React Server Components - 신뢰도: 68/100

기존 React 앱을 Server Components로 마이그레이션한 개발자의 경험담.

**주의**: 커뮤니티 콘텐츠이므로 공식 문서와 교차 검증 필요

---

## 종합 의견

Server Components를 처음 학습한다면 공식 문서로 개념을 잡고,
Next.js 사용자라면 Vercel 가이드로 실전 패턴을 익히는 것을 추천합니다.
커뮤니티 자료는 마이그레이션 시 참고용으로 활용하세요.

**권장 순서**:
1. React 공식 문서 먼저 읽기 (개념 이해)
2. Vercel 가이드로 실전 예제 확인
3. 커뮤니티 경험담으로 실전 팁 습득

Sources:
- [Server Components - React](https://react.dev/blog/...)
- [Introduction to React Server Components](https://vercel.com/blog/...)
- [Migrating to React Server Components](https://dev.to/...)
```

### 규칙

- 각 tier별로 섹션 분리
- 신뢰도 점수 명시 (XX/100)
- 장점/한계 명시 (객관성 확보)
- Tier 3 이하는 주의 문구 필수

---

## 3. 대화형 탐색 (Progressive Discovery)

**사용 시기**: 초기 검색 후 사용자가 특정 영역을 drill-down 하고 싶을 때

### 템플릿

```markdown
## 초기 검색 결과

총 X개 결과 발견 (Tier 1: Y개, Tier 2: Z개, ...)

### Top 5 추천

1. **[Title 1](url1)** - tier 1, 신뢰도: 95/100
   - [1줄 요약]

2. **[Title 2](url2)** - tier 2, 신뢰도: 80/100
   - [1줄 요약]

3. **[Title 3](url3)** - tier 3, 신뢰도: 65/100
   - [1줄 요약]

...

---

## 더 알아보고 싶은 영역

다음 중 원하는 항목을 선택하세요:

- [ ] **공식 문서 상세 보기** - Tier 1 결과 Y개 전체 확인
- [ ] **실전 예제 찾기** - 튜토리얼/샘플 코드 중심 검색
- [ ] **커뮤니티 의견 확인** - Stack Overflow, Reddit 등
- [ ] **특정 프레임워크** - Next.js/Remix 등 특정 환경
- [ ] **비교 분석** - 유사 기술과 비교

Sources:
- [All URLs from Top 5]
```

### 실제 예시

```markdown
## 초기 검색 결과

총 15개 결과 발견 (Tier 1: 3개, Tier 2: 5개, Tier 3: 7개)

### Top 5 추천

1. **Server Components - React** - tier 1, 신뢰도: 95/100
   - React 팀의 공식 설명, 기본 개념과 사용법

2. **React Server Components RFC** - tier 1, 신뢰도: 92/100
   - 설계 의도와 상세 스펙, 기술적 배경

3. **Vercel: Introduction to React Server Components** - tier 2, 신뢰도: 85/100
   - Next.js 통합 가이드, 실전 예제 포함

4. **Dev.to: Understanding React Server Components** - tier 3, 신뢰도: 68/100
   - 초보자 친화적 설명, 도식 자료 풍부

5. **Stack Overflow: RSC vs SSR** - tier 3, 신뢰도: 62/100
   - SSR과의 차이점 Q&A, 실무 팁

---

## 더 알아보고 싶은 영역

다음 중 원하는 항목을 선택하세요:

- [ ] **공식 문서 상세 보기** - Tier 1 결과 3개 전체 확인
- [ ] **실전 예제 찾기** - Next.js App Router 튜토리얼 검색
- [ ] **커뮤니티 의견 확인** - Stack Overflow 관련 질문 탐색
- [ ] **특정 프레임워크** - Remix에서 사용 가능한지 확인
- [ ] **비교 분석** - SSR, SSG와 비교

Sources:
- [Server Components - React](https://react.dev/blog/...)
- [React Server Components RFC](https://github.com/reactjs/rfcs/...)
- [Introduction to React Server Components](https://vercel.com/blog/...)
- [Understanding React Server Components](https://dev.to/...)
- [RSC vs SSR](https://stackoverflow.com/questions/...)
```

### 후속 drill-down 예시

사용자가 "실전 예제 찾기"를 선택한 경우:

```markdown
## 실전 예제 검색 결과

키워드: "React Server Components tutorial example"
필터: code-heavy 콘텐츠 우선

### 추천 예제 (총 8개)

1. **Next.js Examples: Server Components** - tier 1
   - GitHub 공식 예제, 바로 실행 가능
   - https://github.com/vercel/next.js/tree/canary/examples/app-dir-mdx

2. **Vercel Templates: App Router** - tier 2
   - 프로덕션 템플릿, deploy 버튼 포함
   - https://vercel.com/templates/next.js/app-template

...

Sources:
- [all example URLs]
```

---

## 형식 선택 가이드

| 사용자 질문 유형 | 추천 형식 | 이유 |
|-----------------|----------|------|
| "X가 뭐야?" | 요약 형식 | 빠른 답변 필요 |
| "X 공식 문서 찾아줘" | 요약 형식 | Tier 1 결과만 필요 |
| "X vs Y 비교해줘" | 상세 분석 | 다양한 출처 비교 필요 |
| "X 배우고 싶어" | 대화형 탐색 | 학습 경로 제시 필요 |
| "X 문제 해결 방법" | 상세 분석 | 신뢰도 평가 중요 |
| "X 관련 자료 찾아줘" | 대화형 탐색 | 추가 탐색 가능성 높음 |

---

## 공통 규칙

### 1. Sources 섹션 (필수)

WebSearch/WebFetch 사용 시 반드시 포함:

```markdown
Sources:
- [Title 1](url1)
- [Title 2](url2)
```

### 2. Tier 표시

각 결과에 tier 명시 (사용자 신뢰도 판단 지원):

```markdown
- **[공식 문서]** Title - tier 1
- **[가이드]** Title - tier 2
- **[커뮤니티]** Title - tier 3
```

### 3. 신뢰도 점수 (상세 분석 시)

0-100 점수로 객관성 확보:

```markdown
신뢰도: 95/100 (공식 문서)
신뢰도: 68/100 (커뮤니티, 교차 검증 필요)
```

### 4. 주의 문구 (Tier 3 이하)

커뮤니티/개인 블로그는 경고 포함:

```markdown
**주의**: 커뮤니티 콘텐츠이므로 공식 문서와 교차 검증 필요
```

---

## 변경 이력

- **2025-11-29**: 초기 생성 (3가지 출력 형식 템플릿)
