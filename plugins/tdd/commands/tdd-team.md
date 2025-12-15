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

### 2. 언어 및 테스트 프레임워크 감지

**언어 감지 알고리즘**:

**Step 1: TypeScript/JavaScript 확인**
- Read로 `package.json` 존재 확인
- Grep으로 devDependencies에서 `jest|vitest|mocha` 검색
- 발견 시: language="typescript", test_framework={발견된 프레임워크}

**Step 2: Python 확인**
- Read로 `pyproject.toml` 또는 `requirements.txt` 존재 확인
- Grep으로 `pytest|unittest` 검색
- 발견 시: language="python", test_framework={발견된 프레임워크}

**Step 3: 언어 선택**
- 1개만 감지: 자동 선택
- 2개 이상 감지: AskUserQuestion으로 사용자 선택 요청
  ```
  "프로젝트에서 TypeScript와 Python이 모두 감지되었습니다.
   TDD로 개발할 언어를 선택하세요."
  Options: ["TypeScript", "Python"]
  ```
- 0개 감지: 설치 안내 후 종료

**프레임워크별 설치 안내**:
- TypeScript: "npm install --save-dev jest (또는 vitest) 설치 필요"
- Python: "pip install pytest 설치 필요"

### 3. Task Planner 호출

```json
{
  "subagent_type": "tdd:tdd-task-planner",
  "description": "작업 분해",
  "prompt": "{
    \"feature_description\":\"<$ARGUMENTS>\",
    \"project_root\":\"<CWD>\",
    \"language\":\"<DETECTED_LANGUAGE>\",
    \"test_framework\":\"<DETECTED_FRAMEWORK>\",
    \"max_tasks\":20
  }"
}
```

**변수**:
- `<DETECTED_LANGUAGE>`: Step 2에서 감지된 언어 ("typescript" | "python")
- `<DETECTED_FRAMEWORK>`: Step 2에서 감지된 프레임워크 ("jest" | "vitest" | "pytest" | "unittest")

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

**언어별 명령어**:
- TypeScript/JavaScript: `npm test && git commit`
- Python: `pytest && git commit`
```

---

## 주의사항

- 테스트 프레임워크 필수
- 20개 초과 시 사용자 선택
- 병렬 실행: Red 단계만, 최대 4개
- 최대 3회 재시도

---

## 변경 이력

- **2025-11-30**: 언어 독립성 개선 - Python 지원 추가 (언어 감지 알고리즘, Task Planner 호출 확장, 언어별 명령어)

