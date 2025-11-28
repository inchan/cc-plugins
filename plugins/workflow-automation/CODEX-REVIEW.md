# Codex Review: Phase 1B 계획

**검토 날짜**: 2025-11-26
**검토자**: OpenAI Codex (gpt-5.1-codex-max)
**검토 대상**: Phase 1B 리팩토링 계획

---

## 📊 전체 평가

**결론**: 계획은 대체로 건전하고 범위가 명확하지만, 몇 가지 리스크를 보완해야 합니다. 특히 dynamic 스킬 대규모 수정, 복잡도 로직 drift, Progressive Disclosure 일관성 유지에 주의가 필요합니다.

**전체 점수**: 7/10 (실행 가능하지만 개선 여지 있음)

---

## 🚨 주요 발견사항 (위험도 순)

### 1. dynamic 리팩토링 (HIGH RISK)
**문제**: 203줄 제거는 "깊은 수술"이며, 4시간은 낙관적

**분석**:
- Worker/Orchestrator 계약이 명시적이지 않으면 scope creep 및 regression 위험
- 6개 워커 사양 + orchestrator 추출 경계가 사전에 식별되지 않음

**권장 사항**:
```
1. dynamic 리팩토링 전 계약 스케치 작성
   - 6개 워커 사양 구조
   - Orchestrator API 인터페이스
   - 미니 설계 문서 (30분 투자로 4시간 리스크 감소)

2. 예상 시간 조정: 4 → 6시간 (버퍼 +50%)
```

---

### 2. 복잡도 로직 divergence (MEDIUM RISK)
**문제**: router vs advisor의 철학적 차이가 테스트 없이 drift 가능

**현재 상황**:
- **router**: 복잡도 → 모델 선택 (Haiku < 0.4 < Sonnet < 0.7 < Opus)
- **advisor**: 구조 우선, 복잡도는 tie-breaker

**권장 사항**:
```
Option A (분리 유지)는 적절하지만, 다음을 추가:

1. 명확한 문서화
   - 목적, 임계값, 차이점 이유 설명
   - "통합 금지" 가드레일 주석 추가

2. Pinning 테스트 추가 (2시간 → 4시간)
   - Table-driven 테스트: 입력 → 선택된 모델/구조
   - 임계값 변경 방지

3. 경량 가드레일
   - 주석: "X/Y 제약 재검토 없이 통합 금지"
```

**조정된 작업량**: 2시간 → 4시간 (테스트 추가)

---

### 3. sequential 리팩토링 (MEDIUM RISK)
**문제**: Gate validation이 예제보다 더 얽혀 있을 가능성

**위험**:
- Validation 로직이 예상보다 coupling 되어 있으면 시간 초과
- 48줄 제거가 "예제 + gate validation 패턴 분리"로 충분한지 불확실

**권장 사항**:
```
1. Gate validation을 작은 인터페이스로 격리
   - 예제가 entanglement 없이 이동 가능하도록

2. 예상 시간 조정: 2 → 3시간 (검증 +50%)
```

---

### 4. router 리팩토링 (LOW RISK)
**문제**: 2줄만 제거하면 되는데 1시간은 과도할 수 있음

**권장 사항**:
```
- Over-handling 주의
- 1시간에 빠른 sanity test 포함 확인
- 실제 소요: 0.5시간 예상
```

---

### 5. integration.py 삭제 (LOW-MEDIUM RISK)
**문제**: Dynamic imports/late bindings 존재 시 잠재적 break

**권장 사항**:
```
1. 빠른 grep/import 스캔 실행
   find . -name "*.py" -o -name "*.md" | xargs grep -l "integration"

2. Smoke test로 미사용 증명

3. 예상 시간 조정: 0.5 → 1시간 (검증 강화)
```

---

### 6. manager 버퍼 (LOW RISK)
**문제**: 70줄 제거 후 80줄 버퍼 확보는 타당하나, 테스트 없이 로직 이동 위험

**권장 사항**:
```
- 버퍼를 위해 불안정성을 교환하지 않도록 주의
- 간단한 validation pass 추가
```

---

### 7. Progressive Disclosure 일관성 (CROSS-CUTTING RISK)
**문제**: 각 추출이 동일한 affordance 유지하지 못하면 regression

**권장 사항**:
```
1. 기본 경로(default path) 유지 확인
2. 고급 경로(advanced path)가 intent 뒤에 있는지 검증
3. 각 리팩토링 후 Progressive Disclosure 체크리스트 실행
```

---

## ✅ Option A vs B 권장사항

### Codex 결론: **Option A (분리 유지) 승인**

**이유**:
- 서로 다른 의도: router = 모델 비용/품질 선택, advisor = 구조 우선
- 통합하면 관심사가 blur되고 10시간 소요
- 분리 유지가 합리적

**단, 다음 조건 추가**:
1. 명확한 문서화 (목적, 임계값, 차이점)
2. Pinning 테스트 (table-driven)
3. 경량 가드레일 ("통합 금지" 주석)

**조정된 작업량**: 2시간 → 4시간 (문서화 + 테스트)

---

## 🔧 개선 제안

### 1. CI Hook 추가
```bash
# Pre-commit hook: 500줄 제한 자동 검증
.git/hooks/pre-commit:
#!/bin/bash
bash plugins/workflow-automation/scripts/validate-500-line-limit.sh
```

### 2. Dynamic 리팩토링 사전 설계
```
Before dynamic refactor:
1. 6개 워커 사양 구조 스케치 (15분)
2. Orchestrator API 계약 정의 (15분)
3. 추출 경계 명확화 (30분)

Total: 1시간 투자 → 4시간 리스크 감소
```

### 3. Sequential Gate Validation 격리
```
Sequential refactor:
1. Gate validation을 작은 인터페이스로 격리
2. 예제가 entanglement 없이 이동 가능 확인
3. 복잡하면 예상 시간 조기 상향 조정
```

### 4. integration.py 검증 강화
```bash
# 사용처 검색
find plugins/workflow-automation -type f \( -name "*.py" -o -name "*.md" -o -name "*.js" \) \
  -exec grep -l "integration" {} \;

# Smoke test (Python import 시도)
python3 -c "import sys; sys.path.insert(0, 'plugins/workflow-automation/skills/router'); import integration"
```

### 5. 소규모 utils 모듈 고려
```
lib/ 생성은 생략하지만, 진정한 공통 유틸리티는 고려:
- 로깅 헬퍼
- 입력 정규화
- 공통 프롬프트

단, 공유 복잡도 로직은 피하기 (명시적 인터페이스 없이)
```

---

## 📋 우선순위 조정

### Codex 권장 순서

**기존**: router → sequential → dynamic
**권장**: router → sequential → dynamic (유지)

**이유**:
1. router 먼저: 빠른 승리, 버퍼 확보
2. sequential 다음: 중간 규모 작업, 학습 기회
3. dynamic 마지막: 가장 어려운 작업, 보호된 시간 필요

**단, 조건**:
- Dynamic 추출 경계를 이미 알고 있으면 순서 변경 가능
- router/sequential에 hard timebox 설정하여 dynamic 시간 보호

---

## 🚩 주의 사항 (Red Flags)

### 1. Dynamic orchestrator/worker 숨겨진 coupling
- 계약이 명시적이지 않으면 break 가능성

### 2. 복잡도 임계값 unpinned
- 테스트 없이 실수로 통합될 위험

### 3. Progressive Disclosure 기본 흐름 변경
- 예제/validation 경로 제거 시 미묘한 변화 가능

### 4. Dynamic imports 미검증
- Dead-code 삭제 시 증명 없이 진행 위험

---

## 📦 lib/ 생성 결론

### Codex 권장: **Skip (승인)**

**이유**:
- 복잡도 로직 공유는 불가 (철학적 차이)
- 공유할 만한 다른 로직이 명확하지 않음

**대안**:
- 진정으로 generic한 유틸리티 발견 시 작은 `utils` 모듈 고려
- 로깅, I/O 헬퍼, 공통 프롬프트 등
- 단, 공유 복잡도 로직은 명시적 인터페이스 없이 피하기

---

## 🔄 조정된 Phase 1B 계획

### 작업 시간 재조정

| 작업 | 기존 예상 | Codex 조정 | 변경 이유 |
|------|-----------|------------|-----------|
| router 리팩토링 | 1시간 | 0.5시간 | Over-handling 주의 |
| sequential 리팩토링 | 2시간 | 3시간 | Gate validation 복잡도 |
| dynamic 리팩토링 | 4시간 | 6시간 | 사전 설계 + 버퍼 |
| manager 버퍼 | 2시간 | 2시간 | 유지 |
| integration.py 삭제 | 0.5시간 | 1시간 | 검증 강화 |
| 복잡도 로직 문서화 + 테스트 | 2시간 | 4시간 | Pinning 테스트 추가 |
| lib/ 생성 | 0시간 | 0시간 | Skip 유지 |
| **Phase 1B 총계** | **11.5시간** | **16.5시간** | **+43%** |

### 추가 작업

| 작업 | 예상 시간 | 비고 |
|------|-----------|------|
| Dynamic 사전 설계 | 1시간 | 리스크 감소 |
| CI Hook 설정 | 0.5시간 | 자동 검증 |
| **추가 총계** | **1.5시간** | |

**Phase 1B 최종**: **18시간** (기존 11.5시간 대비 +57%)

---

## ✅ 다음 단계

### 즉시 실행
1. ✅ Codex 리뷰 완료
2. [ ] Dynamic 사전 설계 작성 (1시간)
   - 6개 워커 사양 구조
   - Orchestrator API 계약
3. [ ] Pinning 테스트 작성 (2시간)
   - router 복잡도 → 모델 매핑
   - advisor 구조 → 패턴 매핑

### Phase 1B 실행 (조정된 계획)
1. [ ] router 리팩토링 (0.5시간)
2. [ ] sequential 리팩토링 (3시간)
3. [ ] dynamic 리팩토링 (6시간)
4. [ ] manager 버퍼 확보 (2시간)
5. [ ] integration.py 삭제 + 검증 (1시간)
6. [ ] 복잡도 로직 문서화 + 테스트 (4시간)

### 검증
- [ ] 각 리팩토링 후 Progressive Disclosure 체크리스트 실행
- [ ] 500줄 검증 스크립트 실행
- [ ] Smoke test 실행

---

## 📝 Codex 검토 요약

**긍정적 평가**:
- ✅ Progressive Disclosure 패턴 적용 방향 적절
- ✅ Option A (복잡도 로직 분리) 타당
- ✅ 우선순위 (router → sequential → dynamic) 적절
- ✅ lib/ 생략 합리적

**개선 필요**:
- ⚠️ Dynamic 리팩토링 시간 과소 평가 (4 → 6시간)
- ⚠️ 복잡도 로직 테스트 부재 (2 → 4시간)
- ⚠️ Sequential gate validation 복잡도 간과 (2 → 3시간)
- ⚠️ integration.py 검증 강화 필요 (0.5 → 1시간)

**최종 권장**:
- Phase 1B: 11.5시간 → **18시간** (+57%)
- 사전 작업: Dynamic 설계 + Pinning 테스트 (3시간)
- **총 Phase 1B**: **21시간**

---

**검토 완료**: 2025-11-26
**다음 업데이트**: Phase 1B 실행 시작 전
