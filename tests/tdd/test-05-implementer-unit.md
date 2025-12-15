# Test 05: Implementer 단독 테스트 (Green 단계)

**테스트 ID**: test-05
**Category**: Phase 2 - 개별 에이전트 (Level 0)
**소요 시간**: 4분
**난이도**: ⭐⭐⭐⭐ (어려움)

---

## 목적

Implementer 에이전트를 단독으로 호출하여 테스트 통과 코드 작성 기능 검증

---

## 사전 조건

- Test 04 통과 (Test Writer)
- 테스트 환경: `/tmp/claude/tdd-test-05`
- Jest 설치 + **테스트 파일 생성 완료**
- **구현 파일 없음** (Implementer가 생성할 것)

---

## 테스트 환경 준비

```bash
# 테스트 디렉토리 생성
mkdir -p /tmp/claude/tdd-test-05/src
cd /tmp/claude/tdd-test-05

# package.json 생성
cat > package.json << 'EOF'
{
  "name": "tdd-test-05",
  "version": "1.0.0",
  "scripts": { "test": "jest" },
  "devDependencies": { "jest": "^29.0.0" }
}
EOF

# Jest 설치
npm install

# 테스트 파일 생성 (Test Writer 출력 모방)
cat > src/sum.test.js << 'EOF'
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
EOF

# Red 상태 확인
npm test
# 예상: FAIL (Cannot find module './sum')

echo "✓ 환경 준비 완료 (Red 상태)"
```

---

## 테스트 절차

### 1. Implementer 직접 호출

**Claude Code에서 실행**:
```
Task 도구 사용:
- subagent_type: "tdd-implementer"
- description: "Green 단계 구현"
- prompt: "다음 실패하는 테스트를 통과시키는 최소한의 코드를 작성하세요:

  TASK-001: 배열 합계 함수

  테스트 파일: src/sum.test.js
  구현 파일: src/sum.js (생성 필요)

  현재 상태: Red (모든 테스트 실패)
  실패 이유: Cannot find module './sum'

  요구사항:
  1. src/sum.js 파일 생성
  2. sum 함수 구현 (최소한의 코드)
  3. 모든 테스트 통과 확인 (npm test)
  4. YAGNI 원칙 준수 (불필요한 기능 추가 금지)
  5. 복잡도 제한 준수:
     - 함수 길이: 40줄 미만
     - 조건문 깊이: 3단계 미만

  프로젝트 루트: /tmp/claude/tdd-test-05

  응답 마지막에 상태 표시:
  ---STATUS: green--- (모든 테스트 통과)
  ---STATUS: error--- (테스트 여전히 실패)"
```

### 2. 예상 동작

#### 2.1 구현 파일 생성

**src/sum.js**:
```javascript
function sum(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => acc + num, 0);
}

module.exports = { sum };
```

#### 2.2 테스트 실행

```bash
cd /tmp/claude/tdd-test-05
npm test
```

**예상 출력**:
```
PASS  src/sum.test.js
  sum
    ✓ returns 0 for empty array (2 ms)
    ✓ returns the element for single element array (1 ms)
    ✓ handles negative numbers (1 ms)
    ✓ handles decimal numbers (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.5 s
```

#### 2.3 에이전트 응답

```
구현 파일 생성 완료

## 생성된 파일

**경로**: src/sum.js
**함수 길이**: 3줄
**복잡도**: 낮음

## 구현 코드

```javascript
function sum(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => acc + num, 0);
}

module.exports = { sum };
```

## 테스트 실행 결과

```
npm test

PASS src/sum.test.js
✓ returns 0 for empty array
✓ returns the element for single element array
✓ handles negative numbers
✓ handles decimal numbers
```

**통과**: 4/4개
**실패**: 0개

✓ Green 단계 성공: 모든 테스트가 통과했습니다.

## 복잡도 검증

- 함수 길이: 3줄 (< 40줄 ✓)
- 조건문 깊이: 1단계 (< 3단계 ✓)
- YAGNI 준수: 불필요한 기능 없음 ✓

---STATUS: green---
```

---

## 검증 체크리스트

### 필수 항목

- [ ] **파일 생성**: src/sum.js 존재
- [ ] **함수 정의**: sum 함수 존재
- [ ] **Export**: module.exports로 내보냄
- [ ] **테스트 실행**: npm test 실행됨
- [ ] **모두 통과**: 4 passed, 0 failed
- [ ] **상태 태그**: "---STATUS: green---" 포함

### 코드 품질

- [ ] **KISS 원칙**: 단순하고 명확한 구현
- [ ] **YAGNI 원칙**: 테스트에 없는 기능 없음
- [ ] **함수 길이**: 40줄 미만
- [ ] **조건문 깊이**: 3단계 미만
- [ ] **Early Return**: 가능하면 사용

---

## 성공 기준

### ✅ 완전 성공

- 모든 필수 항목 충족
- 코드 품질 우수 (KISS/YAGNI)
- 복잡도 제한 준수

### ⚠️ 부분 성공

- 파일 생성 + 일부 테스트 통과
- 코드 품질 이슈 (복잡도 초과 등)
- 상태 태그 누락

### ❌ 실패

- 파일 생성 안 됨
- 테스트 여전히 실패
- 실행 에러

---

## 실패 패턴 분석

### 🔴 Critical: 테스트 여전히 실패

**증상**:
```
FAIL src/sum.test.js
  ✗ returns 0 for empty array
    Expected: 0
    Received: undefined
```

**문제**: 구현 로직 오류

**원인**:
1. 빈 배열 처리 누락
2. 반환값 없음 (return 빠짐)
3. 잘못된 로직

**해결**: 로직 수정 후 재실행

### 🟡 Warning: YAGNI 위반

**증상**:
```javascript
function sum(numbers, options = {}) {
  const precision = options.precision || 2;
  const onError = options.onError || (() => {});
  // 테스트에 없는 기능들...
}
```

**문제**: 과도한 기능 추가

**해결**: 테스트가 요구하는 최소 기능만 구현

### 🟡 Warning: 복잡도 초과

**증상**:
- 함수 길이 55줄
- 조건문 4단계 중첩

**문제**: P2 원칙 위반

**해결**: 함수 분리 또는 Early Return

---

## 수동 검증

### 1. 파일 확인

```bash
cd /tmp/claude/tdd-test-05
ls -la src/

# 예상:
# sum.js (존재)
# sum.test.js (존재)
```

### 2. 코드 리뷰

```bash
cat src/sum.js
```

**체크 포인트**:
- [ ] function sum(...) 정의
- [ ] module.exports = { sum }
- [ ] 빈 배열 처리
- [ ] reduce 또는 for 루프
- [ ] 불필요한 기능 없음

### 3. 복잡도 측정

```bash
# 함수 길이
wc -l src/sum.js
# 예상: < 10줄

# 조건문 깊이 (수동 확인)
cat src/sum.js | grep -E "if.*if"
# 예상: 없음 (단일 레벨 조건문만)
```

### 4. 테스트 실행

```bash
npm test

# 예상 출력:
# - 4 passed
# - 0 failed
```

---

## 테스트 결과 기록

**실행 일시**: _____________
**실행자**: _____________
**테스트 환경**: /tmp/claude/tdd-test-05

### 파일 확인

- [ ] src/sum.js 생성됨
- [ ] src/sum.test.js 존재 (사전 조건)

### 테스트 실행 결과

```
[npm test 출력 결과]
```

| 항목 | 예상 | 실제 | 통과 |
|------|------|------|------|
| 통과한 테스트 | 4개 | __ | [ ] |
| 실패한 테스트 | 0개 | __ | [ ] |
| 함수 길이 | < 10줄 | __줄 | [ ] |
| 조건문 깊이 | < 3단계 | __단계 | [ ] |

### 코드 품질

- [ ] KISS 원칙 준수
- [ ] YAGNI 원칙 준수
- [ ] 복잡도 제한 준수

### 최종 결과

- [ ] ✅ 완전 성공 (Green 상태 + 품질 우수)
- [ ] ⚠️ 부분 성공
- [ ] ❌ 실패

### 소요 시간

__분 __초

---

## 다음 테스트

✅ 성공 시 → **Test 06: Refactorer 단독 테스트**

---

## 변경 이력

- **2025-11-29**: 초기 작성
