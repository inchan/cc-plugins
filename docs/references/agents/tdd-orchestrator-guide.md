# TDD Orchestrator 가이드

> **참조용 문서**. 실제 조율은 `/tdd-team` 커맨드가 수행합니다.
>
> **아키텍처 변경 (2025-11-29)**: Claude Code 제약("서브에이전트가 다른 서브에이전트 호출 불가")으로 인해 `/tdd-team`이 메인 스레드에서 직접 조율합니다.

---

## 역할

5개 에이전트 조율: task-planner, test-writer, implementer, refactorer, reviewer

**핵심 책임**: 워크플로우 제어, 에이전트 조율, 예외 처리, 진행 추적, 결과 통합, 병렬 실행

---

## 배치 그룹화 알고리즘

```javascript
function groupTasksIntoBatches(tasks, maxBatchSize = 4) {
    const batches = [], completed = new Set();
    let remaining = [...tasks];

    while (remaining.length > 0) {
        // 의존성 충족된 작업
        const ready = remaining.filter(t =>
            t.dependencies.every(d => completed.has(d))
        );

        if (ready.length === 0) throw "Circular dependency";

        // 파일 충돌 없는 배치 (최대 4개)
        const batch = [], files = new Map();
        for (const task of ready) {
            if (batch.length >= maxBatchSize) break;
            const { implementation: impl, test } = task.files;
            if (files.has(impl) || files.has(test)) continue;
            batch.push(task);
            files.set(impl, task.id).set(test, task.id);
        }

        batches.push(batch);
        batch.forEach(t => {
            completed.add(t.id);
            remaining = remaining.filter(r => r.id !== t.id);
        });
    }
    return batches;
}
```

**예시**:
```
입력: TASK-001~004 (독립), TASK-005 (depends: 001,002)
출력: Batch 1: [001,002,003,004], Batch 2: [005]
```

---

## Red-Green-Refactor 사이클

```javascript
function executeRGRCycle(task, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        // RED
        const red = Task("tdd-test-writer", { task_id, success_criteria, files });
        if (!red.includes("STATUS: red")) continue;

        // GREEN
        const green = Task("tdd-implementer", { task_id, test_file, impl_file });
        if (!green.includes("STATUS: green")) continue;

        // REFACTOR
        const refactor = Task("tdd-refactorer", { task_id, impl_file, test_file });
        if (!refactor.includes("STATUS: refactored")) continue;

        // REVIEW
        const review = Task("tdd-reviewer", { task_id, files });
        if (review.includes("DECISION: approved")) return { success: true };
    }
    return { success: false, reason: "max_retries_exceeded" };
}
```

---

## 병렬 실행

- **Red 단계만 병렬**: 단일 응답에서 여러 Task 호출
- **Green/Refactor/Review**: 순차 실행
- **최대 4개** 동시

```
// 병렬 실행 예시
Task(test-writer, TASK-001)
Task(test-writer, TASK-002)
Task(test-writer, TASK-003)
Task(test-writer, TASK-004)
```

---

## 실패 처리

### 개별 작업 실패
AskUserQuestion: 스킵 / 재시도 / 중단

### 배치 부분 실패
AskUserQuestion: 실패 작업만 재시도 / 건너뛰기 / 중단

---

## TodoWrite 구조

```json
[
  { "content": "전체: <feature> (<n>개 작업)", "status": "in_progress" },
  { "content": "TASK-001: <title>", "status": "completed" },
  { "content": "  ├─ Red", "status": "completed" },
  { "content": "  ├─ Green", "status": "in_progress" },
  { "content": "  ├─ Refactor", "status": "pending" },
  { "content": "  └─ Review", "status": "pending" }
]
```

---

## 성능

```
순차: 20 작업 × 15분 = 300분
병렬: 5 배치 × 15분 = 75분
→ 4배 향상
```

---

## 제약

- `max_retries = 3`
- `max_tasks = 20`
- `max_batch_size = 4`

---

## 변경 이력

- **2025-11-29**: 가이드 문서로 변환 (orchestrator 에이전트 → tdd-team 커맨드)
