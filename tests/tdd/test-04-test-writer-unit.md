# Test 04: Test Writer 단독 테스트 (Red 단계)

**테스트 ID**: test-04
**Category**: Phase 2 - 개별 에이전트 (Level 0)
**소요 시간**: 4분
**난이도**: ⭐⭐⭐⭐ (어려움)

---

## 목적

Test Writer 에이전트를 단독으로 호출하여 실패하는 테스트 작성 기능 검증

---

## 사전 조건

- Test 03 통과 (Task Planner)
- 테스트 환경: `/tmp/claude/tdd-test-04`
- Jest 설치 완료
- **구현 파일 없음** (Red 단계이므로)

---

## 테스트 환경 준비

```bash
# 테스트 디렉토리 생성
mkdir -p /tmp/claude/tdd-test-04/src
cd /tmp/claude/tdd-test-04

# package.json 생성
cat > package.json << 'EOF'
{
  "name": "tdd-test-04",
  "version": "1.0.0",
  "scripts": { "test": "jest" },
  "devDependencies": { "jest": "^29.0.0" }
}
EOF

# Jest 설치
npm install

echo "✓ 환경 준비 완료"
echo "⚠️ 주의: src/sum.js 파일은 생성하지 마세요 (Red 단계 테스트)"
```

---

## 테스트 절차

### 1. Test Writer 직접 호출

**Claude Code에서 실행**:
```
Task 도구 사용:
- subagent_type: "tdd-test-writer"
- description: "Red 단계 테스트 작성"
- prompt: "다음 작업에 대해 실패하는 테스트를 작성하세요:

  TASK-001: 배열 합계 함수

  Success Criteria:
  - Input: number[] (숫자 배열)
  - Output: number (총합)
  - Edge Cases:
    1. 빈 배열 [] → 0
    2. 단일 요소 [5] → 5
    3. 음수 포함 [-1, 2] → 1
    4. 소수점 포함 [1.5, 2.5] → 4.0

  파일:
  - 구현 파일: src/sum.js
  - 테스트 파일: src/sum.test.js

  테스트 프레임워크: Jest
  프로젝트 루트: /tmp/claude/tdd-test-04

  요구사항:
  1. src/sum.test.js 파일 생성
  2. 모든 Edge Cases를 테스트 케이스로 작성
  3. npm test 실행하여 모든 테스트 실패 확인
  4. 실패 이유가 '모듈 없음' 또는 '함수 정의 없음'인지 확인

  응답 마지막에 다음 형식으로 상태 표시:
  ---STATUS: red--- (성공)
  ---STATUS: error--- (실패)"
```

### 2. 예상 동작

#### 2.1 테스트 파일 생성

**src/sum.test.js**:
```javascript
const { sum } = require('./sum');

describe('sum', () => {
  it('returns 0 for empty array', () => {
    expect(sum([])).toBe(0);
  });

  it('returns the element for single element array', () => {
    expect(sum([5])).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(sum([-1, 2])).toBe(1);
  });

  it('handles decimal numbers', () => {
    expect(sum([1.5, 2.5])).toBe(4.0);
  });
});
```

#### 2.2 테스트 실행

```bash
cd /tmp/claude/tdd-test-04
npm test
```

**예상 출력**:
```
FAIL  src/sum.test.js
  ● Test suite failed to run

    Cannot find module './sum' from 'src/sum.test.js'

      1 | const { sum } = require('./sum');
      >

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.5 s
```

#### 2.3 에이전트 응답

```
테스트 파일 생성 완료

## 생성된 파일

**경로**: src/sum.test.js
**테스트 케이스 수**: 4개

## 테스트 실행 결과

```
npm test

FAIL src/sum.test.js
● Test suite failed to run
  Cannot find module './sum'
```

**통과**: 0개
**실패**: 4개
**실패 이유**: 모듈 './sum'을 찾을 수 없음

✓ Red 단계 성공: 모든 테스트가 예상대로 실패했습니다.

---STATUS: red---
```

---

## 검증 체크리스트

### 필수 항목

- [ ] **파일 생성**: src/sum.test.js 존재
- [ ] **테스트 개수**: 4개 (각 Edge Case당 1개)
- [ ] **테스트 실행**: npm test 실행됨
- [ ] **모두 실패**: 0 passed, 4 failed
- [ ] **실패 이유**: "Cannot find module" 또는 "is not defined"
- [ ] **상태 태그**: "---STATUS: red---" 포함

### 테스트 품질

- [ ] 명확한 테스트 이름 (`it('returns 0 for empty array', ...)`)
- [ ] AAA 패턴 (Arrange-Act-Assert)
- [ ] 독립적 테스트 (각 테스트 간 의존성 없음)

---

## 성공 기준

### ✅ 완전 성공

- 모든 필수 항목 충족
- 테스트 코드 품질 우수
- Red 상태 명확히 확인

### ⚠️ 부분 성공

- 파일 생성됨
- 테스트 일부 실패 (일부 통과 → 문제!)
- 상태 태그 누락

### ❌ 실패

- 파일 생성 안 됨
- 테스트가 통과함 (Green → Red 단계 실패)
- 실행 에러

---

## 실패 패턴 분석

### 🔴 Critical: 테스트가 통과함

**증상**:
```
PASS src/sum.test.js
  ✓ returns 0 for empty array
```

**문제**: 구현이 이미 존재하거나, 테스트가 잘못됨

**원인**:
1. src/sum.js 파일이 이미 존재
2. 테스트가 실제로 검증하지 않음

**해결**:
```bash
# 구현 파일 삭제
rm src/sum.js

# 테스트 재실행
npm test
```

### 🟡 Warning: 테스트 문법 오류

**증상**:
```
SyntaxError: Unexpected token '}'
```

**문제**: JavaScript 문법 오류

**해결**: 에이전트에게 재작성 요청

### 🟡 Warning: Edge Cases 누락

**증상**:
- 테스트 케이스 2개만 생성 (4개 예상)

**문제**: 프롬프트가 불명확

**해결**: Success Criteria 명확히 전달

---

## 수동 검증

### 1. 파일 확인

```bash
cd /tmp/claude/tdd-test-04
ls -la src/

# 예상:
# sum.test.js (존재)
# sum.js (존재하지 않아야 함!)
```

### 2. 테스트 코드 리뷰

```bash
cat src/sum.test.js
```

**체크 포인트**:
- require('./sum') 호출
- describe/it 구조
- expect 단언문
- 4개 테스트 케이스

### 3. 테스트 실행

```bash
npm test

# 예상 출력:
# - 0 passed
# - 4 failed (또는 suite failed to run)
```

---

## 테스트 결과 기록

**실행 일시**: _____________
**실행자**: _____________
**테스트 환경**: /tmp/claude/tdd-test-04

### 입력

- TASK-001: 배열 합계 함수
- Edge Cases: 4개

### 파일 확인

- [ ] src/sum.test.js 생성됨
- [ ] src/sum.js 없음 (Red 상태 유지)

### 테스트 실행 결과

```
[npm test 출력 결과]
```

| 항목 | 예상 | 실제 | 통과 |
|------|------|------|------|
| 테스트 케이스 수 | 4개 | __ | [ ] |
| 통과한 테스트 | 0개 | __ | [ ] |
| 실패한 테스트 | 4개 | __ | [ ] |
| 실패 이유 | Module not found | __ | [ ] |

### 최종 결과

- [ ] ✅ 완전 성공 (Red 상태 확인)
- [ ] ⚠️ 부분 성공
- [ ] ❌ 실패

### 소요 시간

__분 __초

---

## 다음 테스트

✅ 성공 시 → **Test 05: Implementer 단독 테스트**

---

## 변경 이력

- **2025-11-29**: 초기 작성
