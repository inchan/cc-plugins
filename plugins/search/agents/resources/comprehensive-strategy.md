# 종합 검색 전략

공식 출처부터 커뮤니티까지 전체 Tier(1-4)를 조사하고 비교 분석하는 전략입니다.

---

## 목적

- 공식 문서만으로 답을 찾을 수 없을 때
- 여러 출처의 의견 비교
- 커뮤니티 경험과 베스트 프랙티스 확인
- 실무적 해결 방법 탐색

---

## Tier 필터

**허용**: Tier 1-4 (모두)
**다양성 보장**: 각 Tier별 최소 2개 결과 수집

---

## Tier별 검색 범위

### Tier 1: 공식 문서 (신뢰도 95-100점)
- `*.org`, `docs.*`, `*.dev`
- 예: react.dev, nextjs.org, docs.python.org
- **목표**: 최소 2개

### Tier 2: 공식 저장소/블로그 (신뢰도 90-94점)
- github.com/{공식조직}
- blog.{공식도메인}
- **목표**: 최소 2개

### Tier 3: 신뢰 커뮤니티 (신뢰도 70-79점)
- Stack Overflow (점수 50+ 또는 accepted answer)
- Reddit (upvote 100+ 또는 moderator 답변)
- **목표**: 최소 3개

### Tier 4: 일반 커뮤니티 (신뢰도 60-69점)
- Medium, Dev.to, Hashnode
- 개인 블로그 (조회수 1000+)
- **목표**: 최소 3개

**총 목표**: 최소 10개 결과

---

## 검색 방식

### 다층 검색 전략

```javascript
// Tier별 쿼리 생성
tier1_2_query = "{쿼리} site:{공식도메인}"
tier3_query = "{쿼리} site:stackoverflow.com OR site:developer.mozilla.org"
tier4_query = "{쿼리} tutorial OR guide OR example"
```

### 병렬 검색 (성능 최적화)

```javascript
const [tier1, tier2, tier3, tier4] = await Promise.all([
  WebSearch({ query: tier1_query, allowed_domains: tier1_domains }),
  WebSearch({ query: tier2_query, allowed_domains: tier2_domains }),
  WebSearch({ query: tier3_query, allowed_domains: tier3_domains }),
  WebSearch({ query: tier4_query })
]);
```

### 점진적 확장

```
IF tier1.length >= 2 AND tier2.length >= 2:
    RETURN tier1 + tier2  // 공식 출처로 충분
ELSE:
    CONTINUE to tier3 and tier4
```

---

## 신뢰도 평가 기준

### 도메인 점수 (40점)
- Tier 1: 40점
- Tier 2: 35점
- Tier 3: 25점
- Tier 4: 15점

### 콘텐츠 품질 점수 (35점)
- 코드 예제 포함: +10점
- 테스트 결과 포함: +10점
- 업데이트 1년 이내: +10점
- 저자 신뢰도 (공식 인증, follower 1000+): +5점

### 커뮤니티 검증 점수 (15점)
- Stack Overflow: accepted +10점, 점수 50+ +5점
- GitHub: star 100+ +10점, 활발한 유지보수 +5점
- Reddit: upvote 100+ +10점, moderator 답변 +5점
- Medium/Dev.to: 조회수 5000+ +5점, reaction 100+ +5점

### 관련성 점수 (10점)
- 제목에 핵심 키워드: +5점
- 정확한 버전 매칭: +5점

### 필터링 기준

```
total_score = domain_score + content_score + community_score + relevance_score

IF total_score >= 60:
    RETURN result
ELSE:
    FILTER OUT
```

---

## 출처 다양성 보장

### 다양성 검증

```python
diversity_check = {
    "tier1_count": len([r for r in results if r.tier == 1]),
    "tier2_count": len([r for r in results if r.tier == 2]),
    "tier3_count": len([r for r in results if r.tier == 3]),
    "tier4_count": len([r for r in results if r.tier == 4])
}

IF tier1_count < 2 OR tier2_count < 2:
    WARNING("공식 출처 부족 - 추가 검색 필요")
```

### Tier별 최대 수집

| Tier | 최대 결과 | 이유 |
|------|----------|------|
| Tier 1 | 5개 | 공식 관점 충분 |
| Tier 2 | 5개 | 실전 예제 충분 |
| Tier 3 | 7개 | 다양한 해결법 |
| Tier 4 | 3개 | 참고용 |

**총 최대**: 20개

---

## 품질 기준

- **신뢰도**: 60점 이상
- **최대 결과 수**: 20개
- **Tier별 균형**: 각 Tier 최소 2개

---

## 출력 권장

- **상세 분석** (tier별 비교)
- Tier별 섹션 분리
- 신뢰도 점수 표시
- 장단점 비교

참고: `skills/search-core/resources/output-formats.md#2`

---

## 변경 이력

- **2025-11-30**: 초기 생성 (기존 comprehensive.md에서 전략 추출)
