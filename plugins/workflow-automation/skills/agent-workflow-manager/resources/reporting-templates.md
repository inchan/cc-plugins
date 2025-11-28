# 진행 상황 리포팅 템플릿

## 실시간 상태 표시

### Simple Workflow 진행 상황

```
╔══════════════════════════════════════════════════════╗
║  Workflow Progress: ${TASK_ID}                      ║
╚══════════════════════════════════════════════════════╝

패턴: Simple
진행도: [████████░░░░] 65% (Step 2/3)

✓ Router: Classification 완료
  • Category: ${CATEGORY}
  • Complexity: ${COMPLEXITY}
  • Target: ${TARGET_SKILL}

🔄 Sequential: 처리 중...
  • Step 1/5: Requirements ✓
  • Step 2/5: Design ✓
  • Step 3/5: Implementation [진행중]
  • Step 4/5: Testing [대기]
  • Step 5/5: Documentation [대기]

⏳ Evaluator: 대기 중...

예상 완료 시간: ${ETA}
```

### Parallel Workflow 진행 상황

```
╔══════════════════════════════════════════════════════╗
║  Workflow Progress: ${TASK_ID}                      ║
╚══════════════════════════════════════════════════════╝

패턴: Parallel
진행도: [██████░░░░░░] 50% (Step 2/3)

✓ Router: 병렬 가능 여부 판단 완료
  • Parallelizable: true
  • Task Count: ${TASK_COUNT}
  • Target: Parallel

🔄 Parallel: 병렬 실행 중...
  • Task 1/4: Unit Tests [완료] ✓
  • Task 2/4: Integration Tests [실행중] 🔄
  • Task 3/4: E2E Tests [대기] ⏳
  • Task 4/4: Performance Tests [대기] ⏳

⏳ Evaluator: 대기 중...

예상 완료 시간: ${ETA}
```

### Complex Workflow 진행 상황

```
╔══════════════════════════════════════════════════════╗
║  Workflow Progress: ${PROJECT_ID}                   ║
╚══════════════════════════════════════════════════════╝

패턴: Complex
진행도: [█████░░░░░░░] 40% (Step 2/3)

✓ Router: 프로젝트 분석 완료
  • Complexity: ${COMPLEXITY}
  • Project ID: ${PROJECT_ID}
  • Components: ${COMPONENT_COUNT}개
  • Target: Orchestrator

🔄 Orchestrator: 프로젝트 조율 중...

  ✓ Worker 1: Code Analyzer [완료]
  ✓ Worker 2: System Architect [완료]

  병렬 개발 중:
  🔄 Worker 3: Backend Developer [65%]
  🔄 Worker 4: Frontend Developer [80%]
  🔄 Worker 5: Database Developer [50%]

  대기 중:
  ⏳ Worker 6: Test Engineer
  ⏳ Worker 7: Documentation Writer

⏳ Evaluator: 대기 중...

예상 완료 시간: ${ETA}
```

## 최종 리포트

### Simple Workflow 완료 리포트

```
╔══════════════════════════════════════════════════════╗
║  Simple Workflow 완료! 🎉                           ║
╚══════════════════════════════════════════════════════╝

📊 실행 요약:
   • Workflow: Simple
   • Task ID: ${TASK_ID}
   • Duration: ${TOTAL_DURATION}
   • Skills Used: 3개 (Router, Sequential, Evaluator)

📈 단계별 소요 시간:
   • Router: ${ROUTER_TIME}
   • Sequential: ${SEQUENTIAL_TIME}
     - Requirements: ${REQ_TIME}
     - Design: ${DESIGN_TIME}
     - Implementation: ${IMPL_TIME}
     - Testing: ${TEST_TIME}
     - Documentation: ${DOC_TIME}
   • Evaluator: ${EVAL_TIME}

📁 산출물:
   • 수정된 파일: ${MODIFIED_FILES}
   • 추가된 파일: ${ADDED_FILES}
   • 테스트 케이스: ${TEST_COUNT}개
   • 문서: ${DOC_FILES}

📊 품질 평가:
   • Functionality: ${FUNC_SCORE}/1.0
   • Code Quality: ${QUALITY_SCORE}/1.0
   • Documentation: ${DOC_SCORE}/1.0
   • Total Score: ${TOTAL_SCORE}/1.0
   • Status: ${STATUS}

📝 상세 로그:
   .agent_skills/logs/$(date +%Y%m%d).log
```

### Parallel Workflow 완료 리포트

```
╔══════════════════════════════════════════════════════╗
║  Parallel Workflow 완료! 🎉                         ║
╚══════════════════════════════════════════════════════╝

📊 실행 요약:
   • Workflow: Parallel
   • Task ID: ${TASK_ID}
   • Duration: ${TOTAL_DURATION}
   • Skills Used: 3개 (Router, Parallel, Evaluator)
   • Tasks Executed: ${TASK_COUNT}개 (병렬)

📈 단계별 소요 시간:
   • Router: ${ROUTER_TIME}
   • Parallel: ${PARALLEL_TIME} (전체)
     - Task 1: ${TASK1_TIME}
     - Task 2: ${TASK2_TIME}
     - Task 3: ${TASK3_TIME}
     - Task 4: ${TASK4_TIME}
   • Evaluator: ${EVAL_TIME}

📁 작업별 산출물:
   • Task 1: ${TASK1_OUTPUT}
   • Task 2: ${TASK2_OUTPUT}
   • Task 3: ${TASK3_OUTPUT}
   • Task 4: ${TASK4_OUTPUT}

📊 품질 평가:
   • Task 1 Score: ${TASK1_SCORE}/1.0
   • Task 2 Score: ${TASK2_SCORE}/1.0
   • Task 3 Score: ${TASK3_SCORE}/1.0
   • Task 4 Score: ${TASK4_SCORE}/1.0
   • Total Score: ${TOTAL_SCORE}/1.0
   • Status: ${STATUS}

⚡ 성능 지표:
   • Sequential 예상 시간: ${SEQ_TIME}
   • Parallel 실제 시간: ${PARALLEL_TIME}
   • Time Saved: ${TIME_SAVED} (${SPEEDUP}x faster)

📝 상세 로그:
   .agent_skills/logs/$(date +%Y%m%d).log
```

### Complex Workflow 완료 리포트

```
╔══════════════════════════════════════════════════════╗
║  Complex Workflow 완료! 🎉                          ║
╚══════════════════════════════════════════════════════╝

📊 실행 요약:
   • Workflow: Complex
   • Project ID: ${PROJECT_ID}
   • Duration: ${TOTAL_DURATION}
   • Skills Used: 3개 (Router, Orchestrator, Evaluator)
   • Workers: 7개
   • Components: ${COMPONENT_COUNT}개

📈 단계별 소요 시간:
   • Router: ${ROUTER_TIME}
   • Orchestrator: ${ORCHESTRATOR_TIME} (전체)
     - Code Analyzer: ${ANALYZER_TIME}
     - System Architect: ${ARCHITECT_TIME}
     - Backend Developer: ${BACKEND_TIME}
     - Frontend Developer: ${FRONTEND_TIME}
     - Database Developer: ${DATABASE_TIME}
     - Test Engineer: ${TEST_TIME}
     - Documentation Writer: ${DOC_TIME}
   • Evaluator: ${EVAL_TIME}

📁 워커별 산출물:
   • Code Analyzer: ${ANALYZER_OUTPUT}
   • System Architect: ${ARCHITECT_OUTPUT}
   • Backend Developer: ${BACKEND_OUTPUT}
   • Frontend Developer: ${FRONTEND_OUTPUT}
   • Database Developer: ${DATABASE_OUTPUT}
   • Test Engineer: ${TEST_OUTPUT}
   • Documentation Writer: ${DOC_OUTPUT}

📊 5차원 품질 평가:
   • Functionality: ${FUNC_SCORE}/1.0
   • Performance: ${PERF_SCORE}/1.0
   • Code Quality: ${QUALITY_SCORE}/1.0
   • Security: ${SEC_SCORE}/1.0
   • Documentation: ${DOC_SCORE}/1.0
   • Total Score: ${TOTAL_SCORE}/1.0
   • Status: ${STATUS}

🏗️  프로젝트 구조:
   ${PROJECT_TREE}

⚡ 성능 지표:
   • Total Files Changed: ${FILES_CHANGED}
   • Lines Added: ${LINES_ADDED}
   • Lines Removed: ${LINES_REMOVED}
   • Test Coverage: ${COVERAGE}%

📝 상세 로그:
   .agent_skills/logs/$(date +%Y%m%d).log

💾 프로젝트 상태:
   .agent_skills/shared_context/projects/${PROJECT_ID}/
```

## 에러 리포트

### 스킬 실행 실패

```
╔══════════════════════════════════════════════════════╗
║  ⚠️  Workflow 에러 발생                              ║
╚══════════════════════════════════════════════════════╝

❌ 실패 정보:
   • Task ID: ${TASK_ID}
   • Failed Skill: ${FAILED_SKILL}
   • Error Type: ${ERROR_TYPE}
   • Retry Count: ${RETRY_COUNT}/3

📋 에러 메시지:
   ${ERROR_MESSAGE}

📊 진행 상황:
   • Completed: ${COMPLETED_STEPS}
   • Failed: ${FAILED_STEP}
   • Remaining: ${REMAINING_STEPS}

🔄 복구 옵션:
   1. 재시도: ${RETRY_COMMAND}
   2. 스킵: ${SKIP_COMMAND}
   3. 체크포인트에서 복구: ${RECOVER_COMMAND}

📝 에러 로그:
   .agent_skills/logs/$(date +%Y%m%d).log | grep ${TASK_ID}
```

### 품질 기준 미달

```
╔══════════════════════════════════════════════════════╗
║  ⚠️  품질 기준 미달                                  ║
╚══════════════════════════════════════════════════════╝

📊 평가 결과:
   • Total Score: ${TOTAL_SCORE}/1.0 (기준: 0.85)
   • Status: Needs Improvement

📉 미달 항목:
   • ${DIMENSION_1}: ${SCORE_1}/1.0 (기준: ${THRESHOLD_1})
   • ${DIMENSION_2}: ${SCORE_2}/1.0 (기준: ${THRESHOLD_2})

💡 개선사항:
   ${IMPROVEMENTS_LIST}

🔄 Next Action:
   ${NEXT_ACTION}

📝 재최적화 명령:
   ${REOPTIMIZE_COMMAND}
```

## 상태별 아이콘

- ✓ 완료
- 🔄 진행 중
- ⏳ 대기 중
- ⚠️  경고
- ❌ 실패
- 💡 제안
- 📊 통계
- 📁 파일
- 📈 차트
- 🚀 시작
- 🎉 성공
