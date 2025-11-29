# Test 11: 병렬 실행 - 배치 그룹화

**테스트 ID**: test-11
**Category**: Phase 2.5 - 병렬 실행 기능 (Level 0)
**소요 시간**: 5분
**난이도**: ⭐⭐⭐ (보통)

---

## 목적

orchestrator의 배치 그룹화 알고리즘이 의존성과 파일 충돌을 올바르게 처리하는지 검증

---

## 사전 조건

- orchestrator.md v2.0 (병렬 실행 기능 포함)
- Task Planner가 dependencies 필드를 포함한 작업 목록 출력

---

## 테스트 시나리오

### 시나리오 1: 독립 작업 4개 (이상적 케이스)

**입력 (Task Planner 출력)**:
```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "sum 함수",
      "dependencies": [],
      "files": {
        "implementation": "src/math/sum.js",
        "test": "src/math/sum.test.js"
      }
    },
    {
      "id": "TASK-002",
      "title": "multiply 함수",
      "dependencies": [],
      "files": {
        "implementation": "src/math/multiply.js",
        "test": "src/math/multiply.test.js"
      }
    },
    {
      "id": "TASK-003",
      "title": "divide 함수",
      "dependencies": [],
      "files": {
        "implementation": "src/math/divide.js",
        "test": "src/math/divide.test.js"
      }
    },
    {
      "id": "TASK-004",
      "title": "subtract 함수",
      "dependencies": [],
      "files": {
        "implementation": "src/math/subtract.js",
        "test": "src/math/subtract.test.js"
      }
    }
  ]
}
```

**예상 배치 그룹화 결과**:
```
Batch 1: [TASK-001, TASK-002, TASK-003, TASK-004]
총 배치 수: 1
배치 1 크기: 4 (최대)
```

**검증 항목**:
- [ ] 모든 작업이 1개 배치에 포함
- [ ] 배치 크기 = 4 (maxBatchSize)
- [ ] 파일 충돌 없음

---

### 시나리오 2: 의존성 체인 (순차적 의존성)

**입력**:
```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "User 모델",
      "dependencies": [],
      "files": {
        "implementation": "src/models/User.js",
        "test": "src/models/User.test.js"
      }
    },
    {
      "id": "TASK-002",
      "title": "인증 함수",
      "dependencies": ["TASK-001"],
      "files": {
        "implementation": "src/auth/authenticate.js",
        "test": "src/auth/authenticate.test.js"
      }
    },
    {
      "id": "TASK-003",
      "title": "토큰 생성",
      "dependencies": ["TASK-002"],
      "files": {
        "implementation": "src/auth/token.js",
        "test": "src/auth/token.test.js"
      }
    }
  ]
}
```

**예상 배치 그룹화 결과**:
```
Batch 1: [TASK-001]
Batch 2: [TASK-002]
Batch 3: [TASK-003]
총 배치 수: 3
```

**검증 항목**:
- [ ] 3개 배치로 분리 (의존성 체인)
- [ ] 각 배치에 1개 작업만 포함
- [ ] 실행 순서: TASK-001 → TASK-002 → TASK-003

---

### 시나리오 3: 파일 충돌 (같은 파일 수정)

**입력**:
```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "utils에 sum 추가",
      "dependencies": [],
      "files": {
        "implementation": "src/math/utils.js",
        "test": "src/math/utils.test.js"
      }
    },
    {
      "id": "TASK-002",
      "title": "utils에 multiply 추가",
      "dependencies": [],
      "files": {
        "implementation": "src/math/utils.js",  // 충돌!
        "test": "src/math/utils.test.js"       // 충돌!
      }
    },
    {
      "id": "TASK-003",
      "title": "독립 함수",
      "dependencies": [],
      "files": {
        "implementation": "src/math/divide.js",
        "test": "src/math/divide.test.js"
      }
    }
  ]
}
```

**예상 배치 그룹화 결과**:
```
Batch 1: [TASK-001, TASK-003]  // TASK-002는 파일 충돌로 제외
Batch 2: [TASK-002]
총 배치 수: 2
```

**검증 항목**:
- [ ] TASK-001과 TASK-002가 다른 배치에 분리
- [ ] TASK-003은 TASK-001과 같은 배치 (독립 + 파일 충돌 없음)
- [ ] 파일 충돌 검증 로직 작동

---

### 시나리오 4: 혼합 (의존성 + 독립 작업)

**입력**:
```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "sum",
      "dependencies": [],
      "files": {"implementation": "src/sum.js", "test": "src/sum.test.js"}
    },
    {
      "id": "TASK-002",
      "title": "multiply",
      "dependencies": [],
      "files": {"implementation": "src/multiply.js", "test": "src/multiply.test.js"}
    },
    {
      "id": "TASK-003",
      "title": "divide",
      "dependencies": [],
      "files": {"implementation": "src/divide.js", "test": "src/divide.test.js"}
    },
    {
      "id": "TASK-004",
      "title": "subtract",
      "dependencies": [],
      "files": {"implementation": "src/subtract.js", "test": "src/subtract.test.js"}
    },
    {
      "id": "TASK-005",
      "title": "calculator (sum, multiply 의존)",
      "dependencies": ["TASK-001", "TASK-002"],
      "files": {"implementation": "src/calculator.js", "test": "src/calculator.test.js"}
    },
    {
      "id": "TASK-006",
      "title": "advanced (divide, subtract 의존)",
      "dependencies": ["TASK-003", "TASK-004"],
      "files": {"implementation": "src/advanced.js", "test": "src/advanced.test.js"}
    },
    {
      "id": "TASK-007",
      "title": "utils (독립)",
      "dependencies": [],
      "files": {"implementation": "src/utils.js", "test": "src/utils.test.js"}
    }
  ]
}
```

**예상 배치 그룹화 결과**:
```
Batch 1: [TASK-001, TASK-002, TASK-003, TASK-004]  // 독립 작업 4개 (최대)
Batch 2: [TASK-005, TASK-006, TASK-007]            // 의존성 충족 + 독립 작업
총 배치 수: 2
```

**검증 항목**:
- [ ] 첫 번째 배치에 독립 작업 4개 (maxBatchSize)
- [ ] TASK-007(독립)이 TASK-005, TASK-006과 같은 배치
- [ ] 총 배치 수 = 2 (효율적 그룹화)

---

## 수동 검증 방법

### 1. orchestrator.md 읽기
```bash
# 섹션 2.0의 groupTasksIntoBatches 알고리즘 확인
cat agents/tdd/orchestrator.md | sed -n '/2.0 작업 배치 그룹화/,/2.1 배치별 병렬 실행/p'
```

### 2. 각 시나리오별 손으로 그룹화 시뮬레이션
```
시나리오 1:
  Ready tasks (Round 1): [001, 002, 003, 004] (모두 의존성 없음)
  Batch 1: 001, 002, 003, 004 (4개 선택, maxBatchSize 도달)
  Completed: {001, 002, 003, 004}
  Remaining: []
  → 총 1개 배치 ✓

시나리오 2:
  Ready tasks (Round 1): [001] (의존성 없음)
  Batch 1: 001
  Completed: {001}

  Ready tasks (Round 2): [002] (001 완료)
  Batch 2: 002
  Completed: {001, 002}

  Ready tasks (Round 3): [003] (002 완료)
  Batch 3: 003
  → 총 3개 배치 ✓

시나리오 3:
  Ready tasks (Round 1): [001, 002, 003] (모두 의존성 없음)
  파일 충돌 검사:
    001: utils.js → file_map에 추가
    002: utils.js → 충돌! 건너뜀
    003: divide.js → 충돌 없음, 추가
  Batch 1: 001, 003
  Completed: {001, 003}

  Ready tasks (Round 2): [002]
  Batch 2: 002
  → 총 2개 배치 ✓

시나리오 4:
  Ready tasks (Round 1): [001, 002, 003, 004, 007] (의존성 없음)
  Batch 1: 001, 002, 003, 004 (maxBatchSize=4)
  Completed: {001, 002, 003, 004}

  Ready tasks (Round 2): [005, 006, 007] (모두 의존성 충족)
  Batch 2: 005, 006, 007
  → 총 2개 배치 ✓
```

---

## 성공 기준

### ✅ 완전 성공
- 모든 시나리오의 배치 그룹화 결과가 예상과 일치
- 의존성 순서 보장
- 파일 충돌 정확히 감지
- maxBatchSize 제한 준수

### ⚠️ 부분 성공
- 3개 시나리오 통과
- 일부 최적화 미달 (배치 수가 예상보다 많음)

### ❌ 실패
- 의존성 순서 위반
- 파일 충돌 미감지
- 순환 의존성 무한 루프

---

## 예상 소요 시간

| 시나리오 | 시뮬레이션 시간 |
|----------|----------------|
| 시나리오 1 | 1분 |
| 시나리오 2 | 1분 |
| 시나리오 3 | 1.5분 |
| 시나리오 4 | 1.5분 |
| **총계** | **5분** |

---

## 다음 테스트

✅ 성공 시 → **Test 12: 병렬 실행 - 실제 Orchestrator 호출**

---

## 변경 이력

- **2025-11-29**: 초기 작성 - 병렬 실행 배치 그룹화 테스트
