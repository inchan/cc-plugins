---
allowed-tools: Task, Read, Glob, Grep, AskUserQuestion
description: 작업을 자동으로 분석하고 최적 워크플로우를 실행합니다
argument-hint: <작업 설명>
model: sonnet
---

# Auto Workflow - 통합 워크플로우 자동 실행

사용자 요청을 분석하여 최적 워크플로우를 자동으로 선택하고 실행합니다.

## 실행 프로세스

### 1. 작업 분석 (agent-workflow-advisor)
- 사용자 요청의 복잡도 평가
- 최적 워크플로우 패턴 추천
- 예상 실행 시간 및 리소스 추정

### 2. 패턴 확인
사용자에게 추천된 워크플로우 패턴 제시:
- **Simple Pattern** (복잡도 < 0.7): 순차 처리가 적합한 단순 작업
- **Parallel Pattern**: 독립적으로 실행 가능한 병렬 작업
- **Complex Pattern** (복잡도 >= 0.7): 여러 전문 에이전트가 필요한 복잡한 프로젝트

### 3. 워크플로우 실행 (agent-workflow-manager)
선택된 패턴에 따라 자동으로 워크플로우 체인 실행:

```
Router → Sequential/Parallel/Orchestrator → Evaluator
```

### 4. 품질 검증 (iterative-quality-enhancer)
실행 결과에 대한 5가지 차원 평가:
- Functionality: 기능적 완성도
- Performance: 성능 최적화
- Code Quality: 코드 품질
- Security: 보안 고려사항
- Documentation: 문서화 수준

## 사용 예시

```
/auto-workflow React 컴포넌트 리팩토링과 테스트 코드 작성
```

위 명령은:
1. 작업을 분석하여 병렬 처리 가능 여부 판단
2. 리팩토링과 테스트 작성을 병렬로 실행
3. 결과물에 대한 품질 검증 수행

## 주요 특징

- **자동 패턴 선택**: 작업 복잡도에 따라 최적 실행 패턴 자동 선택
- **투명한 실행**: 각 단계별 진행 상황 실시간 보고
- **품질 보증**: 자동 품질 검증 및 개선 제안
- **오류 처리**: 실패 시 자동 복구 및 대안 제시

## 참고사항

- 워크플로우 중간에 사용자 확인이 필요할 수 있습니다
- 복잡한 프로젝트의 경우 실행 시간이 길어질 수 있습니다
- 품질 검증 단계에서 개선 사항이 발견되면 추가 작업이 제안됩니다