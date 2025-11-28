# Dynamic Task Orchestrator 리팩토링 사전 설계

**작성일**: 2025-11-27
**상태**: 완료 (실행됨)

---

## 1. 현재 상태 분석

**파일**: `skills/dynamic-task-orchestrator/SKILL.md`
**리팩토링 전**: 703줄 (40% 초과)
**리팩토링 후**: 281줄 (44% 사용)

---

## 2. 6개 워커 사양 구조

| 워커 | 역할 | 입력 | 출력 |
|------|------|------|------|
| **Code Analyzer** | 기존 코드 분석 | codebase_path | 구조, 의존성, 품질 이슈 |
| **System Architect** | 시스템 설계 | requirements | 아키텍처, API 스펙, DB 스키마 |
| **Code Developer** | 구현 | specification | 파일 목록, 구현 세부사항 |
| **Test Engineer** | 테스트 작성 | code_under_test | 테스트 목록, 커버리지 |
| **Documentation Writer** | 문서 작성 | target | 문서 목록 |
| **Performance Optimizer** | 성능 최적화 | target_code | 병목점, 최적화 결과 |

---

## 3. Orchestrator API 계약

```typescript
interface WorkerMessage {
  task_id: string;
  worker_type: string;
  task: { type: string; context: any };
  expected_output: string[];
}

interface WorkerResponse {
  status: 'complete' | 'partial' | 'blocked' | 'failed';
  results: any;
  discoveries: string[];
  new_subtasks: any[];
}
```

---

## 4. 추출 경계

| 섹션 | 줄 수 | 분리 위치 |
|------|-------|----------|
| 6개 워커 상세 | 196줄 | `resources/worker-specifications.md` |
| E-Commerce 예제 | 173줄 | `examples/ecommerce-orchestration.md` |
| Error Handling | 37줄 | `resources/error-handling-guide.md` |

**실제 결과**: 703 → 281줄 (422줄 감소)

---

## 5. 실행 완료

- [x] 디렉토리 구조 준비
- [x] Worker Specifications 분리
- [x] E-Commerce Example 분리
- [x] Error Handling 분리
- [x] SKILL.md 리팩토링
- [x] 검증 (281줄 < 500줄)
