# 공식 문서 검색 전략

공식 출처(Tier 1-2)만 검색하여 신뢰도 90점 이상의 정보를 제공하는 전략입니다.

---

## 목적

- 최신 공식 API 문서 확인
- 공식적으로 권장하는 방법 찾기
- 신뢰할 수 있는 정보만 제공
- 비공식 정보 배제

---

## Tier 필터

**허용**: Tier 1-2만
**제외**: Tier 3-4 (커뮤니티, 개인 블로그)

---

## 도메인 화이트리스트

### Tier 1: 공식 문서 (신뢰도 95-100점)

**도메인 패턴**:
- `*.org` (python.org, reactjs.org)
- `docs.*` (docs.python.org, docs.rs)
- `*.dev` (react.dev, web.dev)

**기술별 공식 도메인 예시**:
- JavaScript/TypeScript: MDN, react.dev, nextjs.org
- Python: docs.python.org, pypi.org
- Database: postgresql.org, mongodb.com/docs
- Cloud: GCP/AWS/Azure 공식 문서

**상세 목록**: `skills/search-core/resources/source-filters.md#Tier-1-공식-문서` 참조

### Tier 2: 공식 저장소 및 블로그 (신뢰도 90-94점)

**GitHub 공식 조직**:
- facebook (React, Jest)
- vercel (Next.js, SWR)
- microsoft (TypeScript, VS Code)
- google (Angular, Material Design)

**공식 블로그**:
- `blog.{공식도메인}` (blog.cloudflare.com)
- `{공식도메인}/blog` (react.dev/blog)

---

## 검색 쿼리 최적화

### 공식 출처 키워드 추가

```
사용자: "Next.js data fetching"
최적화: "Next.js data fetching site:nextjs.org OR site:github.com/vercel/next.js"
```

### 버전 정보 포함

- 사용자가 버전 미명시 시 "latest" 추가
- 예: "React hooks" → "React hooks latest version"

### site: 연산자 활용

```javascript
WebSearch({
  query: "{쿼리} site:{공식도메인}",
  allowed_domains: ["{공식도메인1}", "{공식도메인2}"]
})
```

---

## 신뢰도 평가 기준

### 도메인 점수 (50점)
- Tier 1 도메인: 50점
- Tier 2 도메인: 45점
- 기타: 0점 (필터링)

### 콘텐츠 품질 점수 (30점)
- 코드 예제 포함: +10점
- 업데이트 1년 이내: +10점
- 공식 인증 마크: +10점

### 관련성 점수 (20점)
- 제목에 키워드 포함: +10점
- 설명에 키워드 포함: +5점
- 정확한 버전 매칭: +5점

### 필터링 기준

```
total_score = domain_score + content_score + relevance_score

IF total_score >= 90:
    RETURN result
ELSE:
    FILTER OUT
```

---

## 결과 정렬 순서

1. 신뢰도 점수 (내림차순)
2. Tier 레벨 (Tier 1 > Tier 2)
3. 업데이트 날짜 (최신순)
4. 관련성 점수 (내림차순)

---

## 품질 기준

- **신뢰도**: 90점 이상만
- **최대 결과 수**: 10개
- **중복 제거**: 동일 도메인 유사 페이지는 최신 버전만

---

## 출력 권장

- **요약 형식** (빠른 답변)
- 공식 출처 2-5개
- 핵심 내용 2-3문장

참고: `skills/search-core/resources/output-formats.md#1`

---

## 변경 이력

- **2025-11-30**: 초기 생성 (기존 official-docs.md에서 전략 추출)
