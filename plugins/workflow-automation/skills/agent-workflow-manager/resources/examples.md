# Workflow Manager 사용 예시

## 예시 1: 버그 수정 (Simple Workflow)

```
사용자: "로그인 버튼 클릭 시 에러 수정"

Workflow Manager:
  1. 분석: Simple Workflow 선택
  2. Router 실행 → Sequential 호출 가이드
  3. Sequential 실행 → Evaluator 호출 가이드
  4. Evaluator 평가 → 완료

실행 흐름:
  사용자 요청
    ↓
  [Router] "버그 수정" 키워드 감지
    • Category: bug_fix
    • Complexity: 0.3
    • Target: Sequential
    ↓
  [Sequential] 5단계 순차 처리
    • Requirements: 에러 로그 분석
    • Design: 수정 방안 설계
    • Implementation: 코드 수정
    • Testing: 테스트 케이스 작성 및 실행
    • Documentation: 수정 내역 문서화
    ↓
  [Evaluator] 품질 평가
    • Functionality: 0.95
    • Code Quality: 0.90
    • Total Score: 0.88
    ↓
  완료: 로그인 버튼 정상 작동
```

## 예시 2: 테스트 실행 (Parallel Workflow)

```
사용자: "전체 테스트 스위트를 병렬로 실행"

Workflow Manager:
  1. 분석: Parallel Workflow 선택
  2. Router 실행 → Parallel 호출 가이드
  3. Parallel 병렬 실행 → Evaluator 호출 가이드
  4. Evaluator 집계 및 평가 → 완료

실행 흐름:
  사용자 요청
    ↓
  [Router] "병렬" 키워드 감지
    • Category: testing
    • Parallelizable: true
    • Target: Parallel
    ↓
  [Parallel] N개 테스트 동시 실행
    • Task 1: Unit Tests (100% 성공)
    • Task 2: Integration Tests (95% 성공)
    • Task 3: E2E Tests (100% 성공)
    • Task 4: Performance Tests (90% 성공)
    ↓
  [Evaluator] 결과 집계
    • Total Tests: 450
    • Success Rate: 96.25%
    • Failed Tests: 17 (Integration)
    ↓
  완료: 테스트 리포트 생성
```

## 예시 3: 전체 스택 개발 (Complex Workflow)

```
사용자: "Todo 앱 전체 스택 개발"

Workflow Manager:
  1. 분석: Complex Workflow 선택
  2. Router 실행 → Orchestrator 호출 가이드
  3. Orchestrator 워커 조율 → 각 워커 실행
  4. Evaluator 프로젝트 평가 → 완료

실행 흐름:
  사용자 요청
    ↓
  [Router] 프로젝트 복잡도 분석
    • Category: feature_development
    • Complexity: 0.85
    • Components: Frontend, Backend, DB, Tests, Docs
    • Target: Orchestrator
    ↓
  [Orchestrator] 프로젝트 분해 및 워커 할당
    • Project ID: project_abc123
    ↓
  [Worker 1: Code Analyzer]
    • 기존 코드베이스 분석
    • 아키텍처 패턴 파악
    ↓
  [Worker 2: System Architect]
    • DB 스키마 설계
    • API 엔드포인트 설계
    • 컴포넌트 구조 설계
    ↓
  [Workers 3-5: Developers] (병렬 실행)
    • Worker 3: Backend API (Node.js/Express)
    • Worker 4: Frontend UI (React)
    • Worker 5: Database (PostgreSQL)
    ↓
  [Worker 6: Test Engineer]
    • Unit Tests 작성
    • Integration Tests 작성
    • E2E Tests 작성
    ↓
  [Worker 7: Documentation Writer]
    • API 문서 작성
    • README 업데이트
    • 배포 가이드 작성
    ↓
  [Evaluator] 프로젝트 종합 평가
    • Functionality: 0.92
    • Performance: 0.88
    • Code Quality: 0.90
    • Security: 0.85
    • Documentation: 0.95
    • Total Score: 0.90
    ↓
  완료: Todo 앱 배포 준비 완료
```

## 예시 4: 혼합 워크플로우

복잡한 프로젝트에서는 여러 패턴이 조합될 수 있습니다:

```
사용자: "결제 시스템 리팩토링 및 테스트"

Workflow Manager:
  1. Router → Complex (Complexity: 0.75)
  2. Orchestrator 조율
    ├─ Worker 1-3: Sequential 리팩토링
    └─ Worker 4: Parallel 테스트 실행
  3. Evaluator 종합 평가

이 경우 Orchestrator 내부에서 Sequential과 Parallel이 조합됨
```
