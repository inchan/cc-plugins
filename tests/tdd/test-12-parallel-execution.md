# Test 12: 병렬 실행 - 전체 워크플로우

**테스트 ID**: test-12
**Category**: Phase 3 - 병렬 실행 통합 테스트 (Level 1)
**소요 시간**: 10분
**난이도**: ⭐⭐⭐⭐ (어려움)

---

## 목적

orchestrator가 실제로 4개 작업을 병렬로 실행하고 성능 향상을 달성하는지 검증

---

## 사전 조건

- Test 11 통과 (배치 그룹화 검증)
- `/tdd-team` 명령어 사용 가능
- orchestrator.md v2.0

---

## 테스트 환경 준비

```bash
# 테스트 디렉토리 생성
mkdir -p /tmp/claude/tdd-test-12-parallel
cd /tmp/claude/tdd-test-12-parallel

# package.json 생성
echo '{
  "name": "tdd-test-12-parallel",
  "version": "1.0.0",
  "scripts": { "test": "jest" },
  "devDependencies": { "jest": "^29.0.0" }
}' > package.json

# Git 초기화
git init
git config user.name "Test User"
git config user.email "test@example.com"

echo "✓ 환경 준비 완료"
```

---

## 테스트 절차

### Step 1: `/tdd-team` 명령어 실행

**입력**:
```
/tdd-team "4개의 독립적인 수학 함수를 만들어주세요: sum, multiply, divide, subtract"
```

**예상 동작**:
1. Orchestrator가 Task Planner 호출
2. Task Planner가 4개 작업 생성 (모두 dependencies: [])
3. Orchestrator가 배치 그룹화
4. **Batch 1에 4개 작업 병렬 실행** ← 핵심!

---

### Step 2: TodoWrite 출력 확인

**예상 TodoWrite**:
```json
{
  "todos": [
    {
      "content": "전체: 4개의 수학 함수 (4개 작업, 1개 배치)",
      "status": "in_progress"
    },
    {
      "content": "Batch 1: TASK-001, TASK-002, TASK-003, TASK-004 (병렬)",
      "status": "in_progress"
    },
    {
      "content": "  ├─ TASK-001 시작...",
      "status": "in_progress"
    },
    {
      "content": "  ├─ TASK-002 시작...",
      "status": "in_progress"
    },
    {
      "content": "  ├─ TASK-003 시작...",
      "status": "in_progress"
    },
    {
      "content": "  ├─ TASK-004 시작...",
      "status": "in_progress"
    }
  ]
}
```

**검증 포인트**:
- [ ] "1개 배치" 표시
- [ ] "병렬" 키워드 포함
- [ ] 4개 작업이 동시에 "in_progress" 상태

---

### Step 3: 생성된 파일 확인

**예상 파일**:
```bash
ls -la src/

# 예상 출력:
src/sum.js
src/sum.test.js
src/multiply.js
src/multiply.test.js
src/divide.js
src/divide.test.js
src/subtract.js
src/subtract.test.js
```

**검증**:
```bash
# 모든 테스트 통과 확인
npm test

# 예상 출력:
# PASS src/sum.test.js
# PASS src/multiply.test.js
# PASS src/divide.test.js
# PASS src/subtract.test.js
# Test Suites: 4 passed, 4 total
```

---

### Step 4: 성능 측정 (개념적)

**순차 실행 시간 추정**:
```
4 tasks × 15분/task = 60분
```

**병렬 실행 시간 실제** (실제 측정 어려움):
```
1 batch × 15분 = 15분
```

**이론적 개선**: 4배 빠름 ⚡

> **주의**: 실제로는 서브에이전트 제약으로 시간 측정이 어렵습니다.
> 대신 "배치 1개"로 실행되었는지 확인합니다.

---

## 성공 기준

### ✅ 완전 성공
- [ ] Batch 1개로 그룹화
- [ ] TodoWrite에 "병렬" 표시
- [ ] 4개 파일 모두 생성
- [ ] 모든 테스트 통과 (4/4)

### ⚠️ 부분 성공
- [ ] 2-3개 배치로 분할 (최적화 미달)
- [ ] 일부 파일 생성
- [ ] 일부 테스트 통과

### ❌ 실패
- [ ] 4개 배치로 분할 (순차 실행과 동일)
- [ ] 파일 생성 실패
- [ ] 테스트 실패

---

## 대안: 수동 시뮬레이션 테스트

서브에이전트 제약으로 실제 실행이 어려운 경우:

### 방법 A: 로직 검증 (추천)
```
1. orchestrator.md의 섹션 2.0 알고리즘 읽기
2. 4개 독립 작업 시나리오로 손으로 시뮬레이션
3. 배치 그룹화 결과 = 1개 배치 확인
4. 섹션 2.1의 병렬 실행 로직 확인
```

### 방법 B: 부분 테스트
```
1. Task Planner만 단독 호출
2. 출력에서 dependencies 확인
3. 수동으로 배치 그룹화
4. 예상 결과와 비교
```

---

## 예상 문제 및 해결

### 문제 1: 배치가 4개로 분할됨
**원인**: 파일 경로가 잘못 설정됨 (모두 같은 파일)
**해결**: Task Planner에게 "각각 독립적인 파일" 명시

### 문제 2: 병렬 실행 안 됨
**원인**: orchestrator.md v1.0 사용 중
**해결**: v2.0 확인 (섹션 2.0, 2.1, 2.1.1 존재 여부)

### 문제 3: 파일 미생성
**원인**: 서브에이전트 제약 (알려진 이슈)
**해결**: 방법 A (로직 검증) 사용

---

## 실제 사용 예시

```
사용자: /tdd-team "간단한 계산기: sum, multiply, divide, subtract"

Orchestrator:
  ✓ Task Planner 호출
  ✓ 4개 작업 분해
  ✓ 배치 그룹화: 1개 배치 (4개 작업 병렬)

  Batch 1: TASK-001, TASK-002, TASK-003, TASK-004 (병렬)
    [15분 경과]
    ✓ TASK-001 완료
    ✓ TASK-002 완료
    ✓ TASK-003 완료
    ✓ TASK-004 완료

  총 소요 시간: 15분 (순차: 60분)
  성능 향상: 4배 ⚡

✅ 완료!
```

---

## 다음 테스트

✅ 성공 시 → **Test 13: 병렬 실행 - 의존성 체인 테스트**

---

## 변경 이력

- **2025-11-29**: 초기 작성 - 병렬 실행 전체 워크플로우 테스트
