---
name: agent-workflow-manager
version: 1.0.0
description: Agent Skills 통합 워크플로우를 자동으로 관리하고 조율합니다. 사용자 요청을 분석하여 Router, Sequential, Parallel, Orchestrator, Evaluator를 자동으로 순차 호출하며, 전체 프로세스를 모니터링하고 진행 상황을 리포팅합니다.
---

# Agent Workflow Manager

**전체 워크플로우 자동화 관리 스킬**

## 📋 개요

이 스킬은 5개의 Agent Skills 간 통합 워크플로우를 자동으로 관리하는 중앙 조율자입니다.
사용자의 단일 요청을 받아 전체 워크플로우를 처음부터 끝까지 자동으로 실행합니다.

### 주요 기능

1. **자동 워크플로우 선택** - 작업 특성에 따라 최적 패턴 선택
2. **메시지 큐 모니터링** - 스킬 간 통신 상태 실시간 추적
3. **진행 상황 추적** - 각 단계별 상태 및 진행도 표시
4. **자동 스킬 전환** - 다음 스킬 호출 가이드 제공
5. **에러 복구** - 실패 시 자동 재시도 및 복구

### 통합 스킬

- **Router (intelligent-task-router)** - 작업 분류 및 라우팅
- **Sequential (sequential-task-processor)** - 순차적 작업 처리
- **Parallel (parallel-task-executor)** - 병렬 작업 실행
- **Orchestrator (dynamic-task-orchestrator)** - 복잡한 프로젝트 조율
- **Evaluator (iterative-quality-enhancer)** - 품질 평가 및 최적화

## 🎯 사용 시점

**이 스킬은 5개 기존 스킬(Router, Sequential, Parallel, Orchestrator, Evaluator)을 연결하는 조율자입니다.**

이 스킬을 사용하세요:

- ✅ 작업이 여러 스킬의 협력이 필요할 때
- ✅ 자동화된 end-to-end 워크플로우가 필요할 때
- ✅ 수동 스킬 전환을 피하고 싶을 때
- ✅ 전체 프로세스를 한 번에 관리하고 싶을 때
- ✅ **Simple (복잡도 < 0.7) / Parallel (독립 작업) / Complex (복잡도 >= 0.7) 패턴 중 하나를 선택해야 할 때**

사용하지 마세요:

- ❌ 단일 스킬로 충분한 간단한 작업
- ❌ 특정 스킬만 필요한 경우
- ❌ 세밀한 단계별 제어가 필요한 경우
- ❌ **복잡도 0.7+ 프로젝트를 처음부터 분해해야 할 때 (이 경우 dynamic-task-orchestrator 직접 사용)**

## 🔄 워크플로우 패턴

### 패턴 1: Simple Workflow

**적용:** 간단한 작업 (버그 수정, 소규모 기능 추가)
**조건:** Complexity < 0.7
**흐름:** Router → Sequential → Evaluator

```
사용자 요청
  ↓
[Router] Classification (category, complexity)
  ↓
[Sequential] 5단계 순차 처리
  ↓
[Evaluator] 품질 평가
  ↓
최종 결과
```

### 패턴 2: Parallel Workflow

**적용:** 독립적인 작업들 (테스트 실행, 다중 컴포넌트)
**조건:** 작업이 독립적이고 병렬 가능
**흐름:** Router → Parallel → Evaluator

```
사용자 요청
  ↓
[Router] 병렬 가능 여부 판단
  ↓
[Parallel] N개 작업 동시 실행
  ↓
[Evaluator] 결과 집계 및 평가
  ↓
최종 결과
```

### 패턴 3: Complex Workflow

**적용:** 복잡한 프로젝트 (전체 스택, 마이크로서비스)
**조건:** Complexity >= 0.7
**흐름:** Router → Orchestrator → Workers → Evaluator

```
사용자 요청
  ↓
[Router] 프로젝트 복잡도 분석
  ↓
[Orchestrator] 프로젝트 분해 및 워커 할당
  ├─[Worker 1] Code Analyzer
  ├─[Worker 2] System Architect
  ├─[Workers 3-5] Developers (병렬)
  ├─[Worker 6] Test Engineer
  └─[Worker 7] Documentation Writer
  ↓
[Evaluator] 프로젝트 레벨 종합 평가
  ↓
최종 결과
```

## 🚀 워크플로우 실행 가이드

### 자동 실행 프로세스

이 스킬이 활성화되면 다음과 같이 자동으로 진행합니다:

#### 1단계: 요청 분석 및 Task ID 생성
- 사용자 요청 파싱
- 고유 Task ID 생성 (Simple/Parallel) 또는 Project ID 생성 (Complex)

#### 2단계: 워크플로우 패턴 선택

**분석 기준:**
- **키워드 분석**: "버그/수정" → Simple, "테스트/병렬" → Parallel, "전체/프로젝트" → Complex
- **복잡도 추정**: 단일 파일 → Simple, 다중 독립 → Parallel, 다중 통합 → Complex
- **의존성 분석**: 순차 → Simple, 독립 → Parallel, 복잡 → Complex

#### 3단계: 워크플로우 실행

각 패턴마다 Router → 메인 스킬 → Evaluator 순서로 실행하며, 단계별로 다음 명령어를 안내합니다.

**상세 실행 가이드**: `resources/workflow-execution-details.md` 참조

#### 4단계: 진행 상황 모니터링

```bash
# 메시지 큐 확인
.agent_skills/scripts/check_messages.sh

# 로그 확인
tail -f .agent_skills/logs/$(date +%Y%m%d).log | grep ${TASK_ID}
```

## 📊 진행 상황 리포팅

### 실시간 상태 표시

각 단계마다 진행 상황을 표시합니다:
- 워크플로우 패턴 및 진행도 (%)
- 완료된 단계 및 현재 실행 중인 단계
- 대기 중인 다음 단계
- 예상 완료 시간

### 최종 리포트

워크플로우 완료 시 다음 정보를 제공합니다:
- 실행 요약 (패턴, Task ID, 소요 시간, 사용된 스킬)
- 단계별 소요 시간
- 산출물 목록
- 품질 평가 결과
- 상세 로그 경로

**상세 템플릿**: `resources/reporting-templates.md` 참조

## 🛠️ 헬퍼 스크립트

이 스킬은 다음 헬퍼 스크립트들을 활용합니다:

### workflow_executor.sh

워크플로우 자동 실행:

```bash
./scripts/workflow_executor.sh \
  --pattern simple \
  --task-id ${TASK_ID} \
  --request "${USER_REQUEST}"
```

### monitor_queue.sh

메시지 큐 실시간 모니터링:

```bash
./scripts/monitor_queue.sh --task-id ${TASK_ID}
```

### auto_skill_caller.sh

다음 스킬 자동 호출 가이드:

```bash
./scripts/auto_skill_caller.sh \
  --current-skill router \
  --task-id ${TASK_ID}
```

## 📚 워크플로우 패턴 상세

각 패턴의 상세 가이드는 workflows/ 디렉토리에 있습니다:

- `workflows/simple_workflow.md` - Simple 패턴 상세 가이드
- `workflows/parallel_workflow.md` - Parallel 패턴 상세 가이드
- `workflows/complex_workflow.md` - Complex 패턴 상세 가이드

## ⚠️ 에러 처리

### 스킬 실행 실패

```bash
# 재시도 (최대 3회)
if [ $RETRY_COUNT -lt 3 ]; then
  echo "⚠️  재시도 중... ($RETRY_COUNT/3)"
  # 재실행
else
  echo "❌ 실패: 최대 재시도 횟수 초과"
  echo "체크포인트에서 복구 가능"
fi
```

### 메시지 전송 실패

```bash
# 메시지 큐 확인
if [ ! -d ".agent_skills/messages" ]; then
  echo "❌ 메시지 큐 디렉토리 없음"
  mkdir -p .agent_skills/messages
fi

# 재전송
echo "🔄 메시지 재전송 중..."
```

### 품질 미달

```bash
# Evaluator 피드백 확인
if [ "$NEXT_ACTION" = "reoptimize" ]; then
  echo "⚠️  품질 기준 미달 - 재최적화 필요"
  echo "개선사항: ${IMPROVEMENTS}"

  # 해당 스킬 재실행
  echo "🔄 ${TARGET_SKILL} 재실행 중..."
fi
```

## 🎓 사용 예시

### 예시 1: 버그 수정 (Simple)
- Simple Workflow 선택 → Router → Sequential → Evaluator

### 예시 2: 테스트 실행 (Parallel)
- Parallel Workflow 선택 → Router → Parallel → Evaluator

### 예시 3: 전체 스택 개발 (Complex)
- Complex Workflow 선택 → Router → Orchestrator → Evaluator

**상세 예시**: `resources/examples.md` 참조

## 🔗 통합 프로토콜

이 스킬은 `.agent_skills/` 통합 인프라를 활용합니다:

- **메시지 큐:** `.agent_skills/messages/`
- **로그:** `.agent_skills/logs/`
- **컨텍스트:** `.agent_skills/shared_context/`
- **헬퍼 스크립트:** `.agent_skills/scripts/`

## 📖 참조

- **통합 프로토콜:** `.agent_skills/integration_protocol.md`
- **사용 가이드:** `.agent_skills/CLAUDE_CODE_INTEGRATION.md`
- **슬래시 커맨드:**
  - `/workflow-simple`
  - `/workflow-parallel`
  - `/workflow-complex`

## 🎯 베스트 프랙티스

1. **워크플로우 패턴을 신중히 선택** - 작업 특성에 맞는 패턴 사용
2. **진행 상황을 추적** - 각 단계별 상태 확인
3. **에러 로그 확인** - 실패 시 로그 분석
4. **체크포인트 활용** - 복구 가능한 상태 유지
5. **메시지 큐 정리** - 완료 후 오래된 메시지 정리

## 📝 제약사항

- Claude는 자기 자신을 재귀적으로 호출할 수 없음
- 스킬 전환 시 사용자 명령 필요 (가이드 제공)
- 완전 자동화는 불가, 단계별 안내 제공

---

**버전:** 1.0.0
**최종 업데이트:** 2025-01-11
**관련 스킬:** Router, Sequential, Parallel, Orchestrator, Evaluator
