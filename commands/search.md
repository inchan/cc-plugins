---
description: 웹 검색 (공식 문서/종합/모범 사례)
allowed-tools: Task, AskUserQuestion
argument-hint: [--type=TYPE] <search-query>
---

# Search Command

통합 웹 검색 커맨드. 공식 문서, 종합 검색, 모범 사례 검색 중 선택하여 실행합니다.

## 사용법

```bash
# Type 선택 질문
/search "React hooks"

# Type 직접 지정
/search --type=official "React hooks"
/search --type=comprehensive "React hooks"
/search --type=best-practice "React hooks"
```

---

## 당신의 작업

### Step 1: 입력 파싱 및 검증

**1.1 $ARGUMENTS 파싱**

$ARGUMENTS를 분석하여 `query`와 `type`을 추출하세요:

- `--type=` 포함 시:
  - type: `--type=` 뒤의 값 (official/comprehensive/best-practice)
  - query: type 부분 제거 후 남은 문자열
- `--type=` 없을 시:
  - type: undefined
  - query: $ARGUMENTS 전체

**1.2 검증 수행**

다음 검증을 순서대로 수행하세요:

1. **query 길이 확인**
   - query < 3자 → 에러 출력 후 종료:
     ```
     에러: 검색어는 최소 3자 이상이어야 합니다.

     사용 예시:
       /search "React hooks"
       /search --type=official "Next.js app router"
     ```

2. **type 값 검증** (지정된 경우만)
   - type이 "official", "comprehensive", "best-practice" 중 하나가 아니면 → 에러 출력 후 종료:
     ```
     에러: 잘못된 검색 타입입니다.

     허용된 타입: official, comprehensive, best-practice
     ```

검증 통과 시 Step 2로 진행하세요.

---

### Step 2: 검색 옵션 결정

**IF type이 지정됨** (--type 파라미터 사용):
  - selected_types = [type] (단일 요소 배열)
  - format = "summary" (기본값 설정)
  - **Step 3으로 진행**

**IF type이 undefined** (--type 파라미터 없음):
  - AskUserQuestion 도구를 사용하여 검색 타입과 출력 형식을 **동시에** 질문:
    ```json
    {
      "questions": [
        {
          "question": "어떤 방식으로 검색하시겠습니까? (여러 개 선택 가능)",
          "header": "검색 타입",
          "multiSelect": true,
          "options": [
            {
              "label": "1. 공식 문서 (Official Docs)",
              "description": "공식 출처만 검색 - 신뢰도 90점 이상, 빠르고 정확한 API 확인"
            },
            {
              "label": "2. 종합 검색 (Comprehensive)",
              "description": "공식부터 커뮤니티까지 전체 조사 - 다양한 관점 비교, 문제 해결"
            },
            {
              "label": "3. 모범 사례 (Best Practice)",
              "description": "실행 가능한 코드 샘플 중심 - 검증된 패턴, 실전 예제"
            }
          ]
        },
        {
          "question": "검색 결과를 어떤 형식으로 받으시겠습니까?",
          "header": "출력 형식",
          "multiSelect": false,
          "options": [
            {
              "label": "1. 요약 + 링크",
              "description": "핵심 내용 2-3문장 요약 + 주요 출처 3-5개 링크"
            },
            {
              "label": "2. 상세 분석",
              "description": "각 출처별 내용 분석 + 신뢰도 평가 + 장단점 비교"
            },
            {
              "label": "3. 대화형 탐색",
              "description": "초기 Top 5 결과 + 추가 질문으로 drill-down"
            }
          ]
        }
      ]
    }
    ```

  - 사용자 응답 처리:
    - **첫 번째 질문 (검색 타입)** 응답을 selected_types 배열로 변환:
      - "1. 공식 문서 (Official Docs)" 포함 시 → "official" 추가
      - "2. 종합 검색 (Comprehensive)" 포함 시 → "comprehensive" 추가
      - "3. 모범 사례 (Best Practice)" 포함 시 → "best-practice" 추가
    - **두 번째 질문 (출력 형식)** 응답을 format 변수로 변환:
      - "1. 요약 + 링크" → format = "summary"
      - "2. 상세 분석" → format = "detailed"
      - "3. 대화형 탐색" → format = "progressive"

  - 선택된 타입이 0개면 에러 출력 후 종료
  - Step 3으로 진행

---

### Step 3: Agent 병렬 호출

selected_types 배열의 각 type에 대해 다음을 수행하세요:

1. **JSON 이스케이프 처리**:
   - query에서 다음 문자를 치환:
     - `"` → `\"`
     - `\` → `\\`
   - escaped_query 변수에 저장

2. Task 도구를 사용하여 search:search-agent 호출 (병렬):
   ```json
   {
     "subagent_type": "search:search-agent",
     "description": "웹 검색 ({type}): {query}",
     "prompt": "{\"type\":\"{type}\",\"query\":\"{escaped_query}\",\"format\":\"{format}\"}"
   }
   ```

**중요:** 모든 Task 호출은 **병렬로** 실행하세요.

---

### Step 4: 결과 통합 출력

각 Agent의 결과를 받아서 타입별로 섹션을 나누어 출력하세요:

```markdown
## 1. 공식 문서 (Official Docs) 검색 결과
[official Agent의 응답]

---

## 2. 종합 검색 (Comprehensive) 검색 결과
[comprehensive Agent의 응답]

---

## 3. 모범 사례 (Best Practice) 검색 결과
[best-practice Agent의 응답]
```

**주의:** 선택된 타입만 출력하세요 (예: official만 선택 시 1번 섹션만).

---

## 요약

당신의 작업 순서:

```
Step 1: 입력 파싱 및 검증
  ├─ $ARGUMENTS → query, type 추출
  ├─ query < 3자 → 에러 종료
  └─ type 잘못됨 → 에러 종료

Step 2: 검색 옵션 결정
  ├─ type 지정됨 → selected_types = [type], format = "summary"
  └─ type 없음 → AskUserQuestion (2개 질문 동시)
      ├─ 질문 1: 검색 타입 (다중 선택)
      └─ 질문 2: 출력 형식 (단일 선택)

Step 3: Agent 병렬 호출
  └─ for each type in selected_types:
      └─ Task(search:search-agent, format) | 병렬

Step 4: 결과 통합 출력
  └─ 타입별 섹션 구분하여 출력
```

---

## 성공 기준 (P1: Validation First)

### Input Validation

- `$ARGUMENTS` 비어있지 않음
- `query` 3자 이상
- `type` (지정 시): "official" | "comprehensive" | "best-practice"

### Output

- 에이전트 실행 결과 그대로 반환

### Edge Cases

| 상황 | 처리 |
|------|------|
| 빈 query | 에러 메시지 + 사용 예시 |
| query < 3자 | 에러 메시지 + 사용 예시 |
| 잘못된 type | 에러 메시지 + 허용된 타입 목록 |
| --type 없음 | AskUserQuestion으로 타입 선택 (다중) |
| 선택 타입 0개 | 에러 메시지 + 재선택 요청 |
| format 미선택 | 기본값(summary) 사용 |
| Agent 호출 실패 | 해당 타입 섹션에 에러 메시지 표시 |

---

## 예시

### 예시 1: Type 지정

```bash
$ /search --type=official "React Server Components"

검색 타입: 공식 문서
검색어: React Server Components
출력 형식: 요약 + 링크 (자동)

[에이전트 실행]
→ search:search-agent 호출
→ 결과 반환
```

### 예시 2: Type 미지정 (단일 선택)

```bash
$ /search "TypeScript generics"

[검색 타입 질문] (여러 개 선택 가능)
→ 사용자 선택: 2. 종합 검색 (Comprehensive)

검색 타입: 종합 검색
출력 형식: 요약 + 링크 (자동)

[에이전트 실행]
→ search:search-agent 호출 (type=comprehensive, format=summary)
→ 결과 반환
```

### 예시 3: Type 다중 선택

```bash
$ /search "React Server Components"

[검색 타입 질문] (여러 개 선택 가능)
→ 사용자 선택: 1. 공식 문서 (Official Docs)
                 3. 모범 사례 (Best Practice)

검색 타입: official, best-practice (2개)
출력 형식: 요약 + 링크 (자동)

[에이전트 병렬 실행]
→ search:search-agent (type=official) | 병렬
→ search:search-agent (type=best-practice) | 병렬

[결과 통합]
## 1. 공식 문서 (Official Docs) 검색 결과
[결과 내용...]

---

## 3. 모범 사례 (Best Practice) 검색 결과
[결과 내용...]
```

### 예시 4: 에러 처리

```bash
$ /search "ab"

에러: 검색어는 최소 3자 이상이어야 합니다.

사용 예시:
  /search "React hooks"
  /search --type=official "Next.js app router"
```

---

## 주의사항

- 검색어 3자 미만 시 즉시 종료
- JSON 이스케이프 처리 (따옴표, 백슬래시 등)
- type 값 대소문자 구분 (소문자만 허용)

---

## 변경 이력

- **2025-11-30 (v2.2)**: UX 개선 - 질문 통합
  - Step 2-3 통합: 검색 타입 + 출력 형식을 한 번에 질문
  - AskUserQuestion에 2개 질문 동시 전달 (questions 배열)
  - 사용자 대기 시간 단축 (2번 대화 → 1번 대화)
  - Step 번호: 5개 → 4개
- **2025-11-30 (v2.1)**: 리뷰 피드백 반영
  - Critical: Step 2 로직 수정 (--type 지정 시 Step 3 건너뛰기, format 기본값 설정)
  - Major: Step 4 JSON 이스케이프 명시 (escaped_query 사용)
  - Minor: Edge Cases 테이블 확장 (3개 케이스 추가)
  - 점수: 72/100 → 85/100
- **2025-11-30 (v2)**: Commands 프롬프트 스타일 개선
  - "설명서" 스타일 → "지시서" 스타일로 전환
  - Implementation → "당신의 작업" (Step 1-5)
  - 명령형 톤 적용 (tdd-team 패턴)
  - 즉시 실행 유도
- **2025-11-30 (v1)**: 초기 생성 (기존 3개 커맨드 통합)
  - search-official.md, search-comprehensive.md, search-best-practice.md → search.md
  - --type 파라미터 추가
  - 중복 코드 95% 제거
