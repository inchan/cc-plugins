# Test 10: 단순화된 워크플로우 테스트

**테스트 ID**: test-10
**Category**: Phase 4 - 부분 워크플로우 (Level 2)
**소요 시간**: 15분
**난이도**: ⭐⭐⭐⭐⭐ (매우 어려움)

---

## 목적

Task Planner → Test Writer → Implementer를 순차적으로 실행하여 기본 워크플로우 검증
(Refactorer, Reviewer, 루프는 제외)

---

## 사전 조건

- Test 03, 04, 05 모두 통과
- 테스트 환경: `/tmp/claude/tdd-test-10`
- Jest 설치 완료

---

## 테스트 환경 준비

```bash
# 테스트 디렉토리 생성
mkdir -p /tmp/claude/tdd-test-10/src
cd /tmp/claude/tdd-test-10

# package.json 생성
cat > package.json << 'EOF'
{
  "name": "tdd-test-10",
  "version": "1.0.0",
  "scripts": { "test": "jest" },
  "devDependencies": { "jest": "^29.0.0" }
}
EOF

# Jest 설치
npm install

echo "✓ 환경 준비 완료"
```

---

## 테스트 절차

### 단계 1: Task Planner 호출

```
Task({
  subagent_type: "tdd-task-planner",
  description: "작업 분해",
  prompt: "기능 설명: 배열 합계 함수
  프로젝트 루트: /tmp/claude/tdd-test-10

  작업을 분해하고 success_criteria를 정의하세요."
})
```

**예상 출력**: 1개 작업 + success_criteria

**결과 저장**: Task Planner의 응답을 다음 단계에 사용

---

### 단계 2: Test Writer 호출

Task Planner의 출력을 사용하여:

```
Task({
  subagent_type: "tdd-test-writer",
  description: "Red 단계 실행",
  prompt: "[Task Planner 출력 복사]

  위 작업에 대해 실패하는 테스트를 작성하세요.
  파일: src/sum.test.js"
})
```

**예상 동작**:
1. src/sum.test.js 생성
2. npm test 실행 → 모두 실패 (Red)

**수동 확인**:
```bash
cd /tmp/claude/tdd-test-10
npm test
# 예상: FAIL (Cannot find module)
```

---

### 단계 3: Implementer 호출

Test Writer의 출력을 사용하여:

```
Task({
  subagent_type: "tdd-implementer",
  description: "Green 단계 실행",
  prompt: "테스트 파일: src/sum.test.js
  구현 파일: src/sum.js

  실패하는 테스트를 통과시키는 최소 코드를 작성하세요."
})
```

**예상 동작**:
1. src/sum.js 생성
2. npm test 실행 → 모두 통과 (Green)

**수동 확인**:
```bash
cd /tmp/claude/tdd-test-10
npm test
# 예상: PASS (4/4 passed)
```

---

## 검증 체크리스트

### 전체 워크플로우

- [ ] **단계 1 완료**: Task Planner 응답 수신
- [ ] **단계 2 완료**: src/sum.test.js 생성 + Red 상태
- [ ] **단계 3 완료**: src/sum.js 생성 + Green 상태

### 최종 상태

- [ ] **파일 존재**: src/sum.js, src/sum.test.js
- [ ] **테스트 통과**: npm test → 4 passed
- [ ] **코드 품질**: 함수 < 10줄, 복잡도 낮음

---

## 성공 기준

### ✅ 완전 성공

- 3단계 모두 에러 없이 완료
- Red → Green 전환 명확
- 최종 테스트 모두 통과

### ⚠️ 부분 성공

- 일부 단계 성공
- 수동 개입 필요 (파일 수정 등)

### ❌ 실패

- Task 도구 호출 실패
- 단계 간 데이터 전달 실패
- 최종 테스트 실패

---

## 알려진 문제

### 문제 1: Task 반환값 파싱

**증상**: Task Planner의 출력을 Test Writer에 전달할 때 형식 문제

**해결**: 수동으로 텍스트 복사하여 전달

### 문제 2: 긴 실행 시간

**증상**: 각 단계마다 LLM 대기 (1-2분)

**예상 총 시간**: 10-15분

---

## 테스트 결과 기록

**실행 일시**: _____________
**실행자**: _____________
**테스트 환경**: /tmp/claude/tdd-test-10

### 단계별 결과

| 단계 | 에이전트 | 소요 시간 | 결과 |
|------|---------|----------|------|
| 1 | Task Planner | __분 | [ ] |
| 2 | Test Writer | __분 | [ ] |
| 3 | Implementer | __분 | [ ] |

### 최종 파일

```bash
ls -la /tmp/claude/tdd-test-10/src/
```

```
[파일 목록]
```

### 최종 테스트

```bash
npm test
```

```
[npm test 출력]
```

### 최종 결과

- [ ] ✅ 완전 성공
- [ ] ⚠️ 부분 성공
- [ ] ❌ 실패

### 총 소요 시간

__분 __초

---

## 다음 단계

✅ 성공 시:
- Test 06, 07 (Refactorer, Reviewer) 추가
- 전체 워크플로우 재설계

❌ 실패 시:
- 실패 단계 분석
- 개별 에이전트 재테스트

---

## 변경 이력

- **2025-11-29**: 초기 작성
