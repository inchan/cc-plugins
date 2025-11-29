---
description: TDD 방식으로 기능을 개발하는 다중 에이전트 시스템 (Red-Green-Refactor)
allowed-tools: Task, TodoWrite, Read, Grep, Glob, AskUserQuestion, Bash
argument-hint: <feature-description> [requirements...]
---

# TDD Team

`$ARGUMENTS` 기반으로 TDD Red-Green-Refactor 사이클을 자동화합니다.

## 사용법

```bash
/tdd-team "배열 합계 함수"
/tdd-team "사용자 인증 API" "JWT 토큰" "bcrypt 해싱"
```

---

## Implementation

### 1. 입력 검증

1. `feature_description` = `$ARGUMENTS` 전체
2. 10자 미만이면 에러 출력 후 종료

### 2. 테스트 프레임워크 감지

1. Read로 `package.json` 확인
2. Grep으로 `jest|vitest|mocha` 검색
3. 없으면 설치 안내 후 종료

### 3. Task Planner 호출

```json
{
  "subagent_type": "tdd-developer:tdd-task-planner",
  "description": "작업 분해",
  "prompt": "{\"feature_description\":\"<$ARGUMENTS>\",\"project_root\":\"<CWD>\",\"max_tasks\":20}"
}
```

- 응답: `tasks[]` (각 task: id, title, dependencies, files, success_criteria)
- `total_tasks > 20`이면 AskUserQuestion (첫 20개 / 기능 분할 / 전체 실행)

### 4. 배치 그룹화

**의존성 없는 작업을 배치로 묶기 (최대 4개)**:

```
batches = [], completed = Set(), remaining = tasks

WHILE remaining.length > 0:
  # 실행 가능한 작업 (의존성 충족)
  ready = remaining.filter(t => t.dependencies.every(d => completed.has(d)))

  IF ready.length == 0: ERROR "순환 의존성"

  # 파일 충돌 없는 배치 (최대 4개)
  batch = [], files = Map()
  FOR task IN ready:
    IF batch.length >= 4: BREAK
    IF files.has(task.files.impl) OR files.has(task.files.test): CONTINUE
    batch.push(task)
    files.set(task.files.impl, task.id)
    files.set(task.files.test, task.id)

  batches.push(batch)
  batch.forEach(t => { completed.add(t.id); remaining.remove(t) })
```

TodoWrite로 배치 정보 표시

### 5. 배치별 실행

**FOR EACH batch**:

#### 5.1 실행 방식

- `batch.length == 1`: 순차 실행
- `batch.length >= 2`: **Red 단계만 병렬**, 나머지 순차

#### 5.2 Red-Green-Refactor 사이클

`attempt = 1, max = 3`

**WHILE attempt <= 3**:

1. **RED**: Task(tdd-test-writer) → "STATUS: red" 확인
2. **GREEN**: Task(tdd-implementer) → "STATUS: green" 확인
3. **REFACTOR**: Task(tdd-refactorer) → "STATUS: refactored" 확인
4. **REVIEW**: Task(tdd-reviewer) → "DECISION: approved" 확인

실패 시 `attempt++`, 3회 초과 시 실패 반환

#### 5.3 Task 호출 형식

```json
{
  "subagent_type": "tdd-developer:tdd-<agent>",
  "description": "<Stage>: <task.id>",
  "prompt": "{\"task_id\":\"<id>\",\"files\":<files>,...}"
}
```

#### 5.4 실패 처리

`failed_tasks.length > 0`이면 AskUserQuestion:
- 재시도 / 건너뛰기 / 중단

### 6. 최종 리포트

```markdown
# TDD 완료

## 요약
- 완료: <completed>/<total> 작업
- 배치: <batches>개

## 생성 파일
<file list>

## 다음 단계
npm test && git commit
```

---

## 주의사항

- 테스트 프레임워크 필수
- 20개 초과 시 사용자 선택
- 병렬 실행: Red 단계만, 최대 4개
- 최대 3회 재시도
