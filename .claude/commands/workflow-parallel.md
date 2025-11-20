---
allowed-tools: Task, Read, Glob, Grep
description: 독립적인 작업들을 병렬로 실행하여 효율성을 극대화합니다
argument-hint: <작업 설명>
model: sonnet
---

# Parallel Workflow - 병렬 작업 처리

독립적인 여러 작업을 동시에 실행하여 처리 속도를 극대화하는 워크플로우입니다.

## 적합한 작업 유형

- 여러 컴포넌트 동시 개발
- 다중 파일 리팩토링
- 병렬 테스트 실행
- 다양한 형식으로 문서 생성
- 독립적인 기능 구현

## 실행 흐름

```
intelligent-task-router → parallel-task-executor → iterative-quality-enhancer
```

### 1. 작업 라우팅 (intelligent-task-router)
- 작업을 독립적인 단위로 분해
- 병렬 처리 가능성 분석
- 리소스 할당 계획 수립

### 2. 병렬 실행 (parallel-task-executor)
두 가지 모드 지원:

#### Sectioning 모드
- 작업을 독립적인 섹션으로 분할
- 각 섹션을 동시 처리
- 2-10x 속도 향상 가능

#### Voting 모드
- 여러 접근 방식을 동시 실행
- 결과 비교 및 최적안 선택
- 품질과 신뢰성 극대화

### 3. 품질 검증 (iterative-quality-enhancer)
- 병렬 처리 결과 통합 검증
- 일관성 확인
- 충돌 해결

## 사용 예시

```
/workflow-parallel React 컴포넌트 3개 동시 개발 및 테스트
```

## 병렬 처리 예시

```
┌─────────────┐
│   Router    │
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┐
   ▼       ▼       ▼       ▼
[Task 1] [Task 2] [Task 3] [Task 4]
   │       │       │       │
   └───┬───┴───────┴───────┘
       ▼
┌─────────────┐
│  Evaluator  │
└─────────────┘
```

## 특징

- **고속 처리**: 병렬 실행으로 2-10x 속도 향상
- **자원 효율**: CPU/메모리 활용 극대화
- **유연한 모드**: Sectioning/Voting 선택 가능
- **스마트 통합**: 자동 결과 병합

## 제약사항

- 작업 간 의존성이 있으면 비효율적
- 순차적 검증이 필요한 작업에 부적합
- 리소스 경합 가능성 존재