# 워크플로우 실행 상세 가이드

## Simple Workflow 상세

### 1단계: 요청 분석

```bash
# 사용자 요청 파싱
USER_REQUEST="${입력}"

# Task ID 생성
TASK_ID=$(uuidgen)
echo "🚀 Workflow 시작: ${TASK_ID}"
```

### 2단계: Router 실행

```bash
echo "📍 Simple Workflow 실행"
echo "🔄 [1/3] Router로 classification..."

# Router 메시지 전송
.agent_skills/scripts/send_message.sh router sequential execute_task ${TASK_ID} '{
  "user_request": "'"${USER_REQUEST}"'",
  "workflow_pattern": "simple"
}'

# 진행 상황 표시
echo "   ✓ Category: ${CATEGORY}"
echo "   ✓ Complexity: ${COMPLEXITY}"
echo "   ✓ Target: Sequential"
```

### 3단계: Sequential 실행

```bash
echo ""
echo "💡 다음 명령어를 실행하세요:"
echo "   'Sequential 스킬을 사용해서 ${TASK_ID} 작업을 처리해줘'"
echo ""

# Sequential 스킬이 메시지 확인 및 처리
echo "🔄 [2/3] Sequential 처리 중..."

# Sequential 5단계 진행
# 1. Requirements
# 2. Design
# 3. Implementation
# 4. Testing
# 5. Documentation
```

### 4단계: Evaluator 실행

```bash
echo ""
echo "💡 다음 명령어를 실행하세요:"
echo "   'Evaluator 스킬로 ${TASK_ID} 작업을 평가해줘'"
echo ""

echo "🔄 [3/3] Evaluator 평가 중..."
# Evaluator 스킬이 평가 수행

echo "✅ Simple Workflow 완료!"
```

## Parallel Workflow 상세

### 1단계: Router 실행

```bash
echo "📍 Parallel Workflow 실행"
echo "🔄 [1/3] Router로 병렬 가능 여부 판단..."

# Router 메시지 전송
.agent_skills/scripts/send_message.sh router parallel execute_task ${TASK_ID} '{
  "user_request": "'"${USER_REQUEST}"'",
  "workflow_pattern": "parallel",
  "parallelizable": true
}'

echo "   ✓ Parallelizable: true"
echo "   ✓ Task Count: ${TASK_COUNT}"
echo "   ✓ Target: Parallel"
```

### 2단계: Parallel 실행

```bash
echo ""
echo "💡 다음 명령어를 실행하세요:"
echo "   'Parallel 스킬로 ${TASK_ID} 작업을 병렬 처리해줘'"
echo ""

# Parallel 스킬이 작업 분할 및 병렬 실행
echo "🔄 [2/3] Parallel 실행 중..."

# N개 작업 동시 실행
# Task 1: ...
# Task 2: ...
# Task N: ...
```

### 3단계: Evaluator 실행

```bash
echo ""
echo "💡 Parallel 완료 후 실행하세요:"
echo "   'Evaluator로 병렬 결과를 집계하고 평가해줘'"
echo ""

echo "✅ Parallel Workflow 완료!"
```

## Complex Workflow 상세

### 1단계: Router 실행

```bash
echo "📍 Complex Workflow 실행"
echo "🔄 [1/3] Router로 프로젝트 분석..."

# Project ID 생성
PROJECT_ID="project_${TASK_ID}"

# Router 메시지 전송
.agent_skills/scripts/send_message.sh router orchestrator execute_task ${TASK_ID} '{
  "user_request": "'"${USER_REQUEST}"'",
  "workflow_pattern": "complex",
  "project_id": "'"${PROJECT_ID}"'",
  "complexity": '${COMPLEXITY}'
}'

echo "   ✓ Complexity: ${COMPLEXITY}"
echo "   ✓ Project ID: ${PROJECT_ID}"
echo "   ✓ Target: Orchestrator"
```

### 2단계: Orchestrator 실행

```bash
echo ""
echo "💡 다음 명령어를 실행하세요:"
echo "   'Orchestrator 스킬로 ${PROJECT_ID} 프로젝트를 조율해줘'"
echo ""

# Orchestrator 스킬이 워커 조율
echo "🔄 [2/3] Orchestrator 조율 중..."

# 워커 할당 및 실행
# Worker 1: Code Analyzer (순차)
# Worker 2: System Architect (순차)
# Workers 3-5: Developers (병렬)
# Worker 6: Test Engineer (순차)
# Worker 7: Documentation Writer (순차)
```

### 3단계: Evaluator 실행

```bash
echo ""
echo "💡 Orchestrator 완료 후 실행하세요:"
echo "   'Evaluator로 전체 프로젝트를 종합 평가해줘'"
echo ""

echo "✅ Complex Workflow 완료!"
```

## 진행 상황 모니터링

### 메시지 큐 확인

```bash
# 전체 메시지 확인
.agent_skills/scripts/check_messages.sh

# 특정 Task ID 메시지 확인
.agent_skills/scripts/check_messages.sh --task-id ${TASK_ID}
```

### 로그 확인

```bash
# 실시간 로그 모니터링
tail -f .agent_skills/logs/$(date +%Y%m%d).log | grep ${TASK_ID}

# 특정 시간대 로그 조회
cat .agent_skills/logs/$(date +%Y%m%d).log | grep ${TASK_ID}
```

### 프로젝트 상태 확인 (Complex만)

```bash
# 프로젝트 전체 상태
cat .agent_skills/shared_context/projects/${PROJECT_ID}/state.json

# 워커별 상태
ls -la .agent_skills/shared_context/projects/${PROJECT_ID}/workers/

# 특정 워커 상태
cat .agent_skills/shared_context/projects/${PROJECT_ID}/workers/worker_1_state.json
```

## 헬퍼 스크립트 사용

### workflow_executor.sh

전체 워크플로우 자동 실행:

```bash
./scripts/workflow_executor.sh \
  --pattern simple \
  --task-id ${TASK_ID} \
  --request "${USER_REQUEST}"
```

옵션:
- `--pattern`: simple, parallel, complex
- `--task-id`: 고유 작업 ID
- `--request`: 사용자 요청 문자열
- `--auto`: 자동 단계 진행 (가능한 경우)

### monitor_queue.sh

메시지 큐 실시간 모니터링:

```bash
# 전체 큐 모니터링
./scripts/monitor_queue.sh

# 특정 Task ID 모니터링
./scripts/monitor_queue.sh --task-id ${TASK_ID}

# 특정 스킬 메시지만 모니터링
./scripts/monitor_queue.sh --skill sequential
```

### auto_skill_caller.sh

다음 스킬 자동 호출 가이드:

```bash
./scripts/auto_skill_caller.sh \
  --current-skill router \
  --task-id ${TASK_ID}
```

출력 예시:
```
💡 다음 스킬 호출 필요:
   스킬: Sequential
   명령: 'Sequential 스킬로 task_abc123 작업을 처리해줘'
   이유: Router가 Sequential을 target으로 지정함
```

## 에러 복구

### 재시도 로직

```bash
# 재시도 (최대 3회)
RETRY_COUNT=0
MAX_RETRIES=3

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "⚠️  재시도 중... ($RETRY_COUNT/$MAX_RETRIES)"

  # 스킬 재실행
  if execute_skill; then
    echo "✅ 성공!"
    break
  fi

  RETRY_COUNT=$((RETRY_COUNT + 1))
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ 실패: 최대 재시도 횟수 초과"
  echo "체크포인트에서 복구 가능"
fi
```

### 메시지 전송 실패 처리

```bash
# 메시지 큐 디렉토리 확인
if [ ! -d ".agent_skills/messages" ]; then
  echo "❌ 메시지 큐 디렉토리 없음"
  mkdir -p .agent_skills/messages
  echo "✓ 메시지 큐 디렉토리 생성"
fi

# 메시지 재전송
echo "🔄 메시지 재전송 중..."
.agent_skills/scripts/send_message.sh ${FROM} ${TO} ${ACTION} ${TASK_ID} "${PAYLOAD}"

# 전송 확인
if [ -f ".agent_skills/messages/${TO}_${TASK_ID}.json" ]; then
  echo "✅ 메시지 전송 성공"
else
  echo "❌ 메시지 전송 실패"
fi
```

### 품질 미달 시 재최적화

```bash
# Evaluator 피드백 확인
EVALUATION=$(cat .agent_skills/shared_context/evaluations/${TASK_ID}.json)
NEXT_ACTION=$(echo "$EVALUATION" | jq -r '.next_action')

if [ "$NEXT_ACTION" = "reoptimize" ]; then
  echo "⚠️  품질 기준 미달 - 재최적화 필요"

  # 개선사항 추출
  IMPROVEMENTS=$(echo "$EVALUATION" | jq -r '.improvements[]')
  echo "개선사항:"
  echo "$IMPROVEMENTS"

  # 해당 스킬 재실행
  TARGET_SKILL=$(echo "$EVALUATION" | jq -r '.target_skill')
  echo "🔄 ${TARGET_SKILL} 재실행 중..."

  # 재실행 로직...
fi
```
