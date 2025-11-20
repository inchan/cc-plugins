---
allowed-tools: Task, Read, Glob, Grep
description: 순차 처리가 적합한 단순 작업을 체계적으로 실행합니다
argument-hint: <작업 설명>
model: sonnet
---

# Simple Workflow - 순차 작업 처리

단순하고 순차적인 작업을 체계적으로 처리하는 워크플로우입니다.

## 적합한 작업 유형

- 단일 기능 구현
- 간단한 버그 수정
- 설정 파일 업데이트
- 단순 리팩토링
- 문서 업데이트

## 실행 흐름

```
intelligent-task-router → sequential-task-processor → iterative-quality-enhancer
```

### 1. 작업 라우팅 (intelligent-task-router)
- 작업 유형 분류 (bug_fix, feature, refactoring 등)
- 우선순위 설정
- 필요 리소스 파악

### 2. 순차 처리 (sequential-task-processor)
- 작업을 3-7개의 단계로 분해
- 각 단계별 검증 게이트 설정
- 단계별 순차 실행
- 실패 시 즉시 중단 및 보고

### 3. 품질 검증 (iterative-quality-enhancer)
- 기능적 완성도 확인
- 코드 품질 검토
- 간단한 개선 제안

## 사용 예시

```
/workflow-simple 로그인 폼에 입력 검증 추가하기
```

## 예상 처리 단계

1. **분석**: 현재 로그인 폼 구조 파악
2. **계획**: 검증 로직 설계
3. **구현**: 검증 함수 작성
4. **통합**: 폼에 검증 로직 연결
5. **테스트**: 검증 동작 확인
6. **문서화**: 변경사항 기록

## 특징

- **명확한 단계**: 각 단계가 명확하게 정의됨
- **빠른 실행**: 단순 작업에 최적화
- **즉각 피드백**: 각 단계 완료 시 즉시 보고
- **실패 안전**: 문제 발생 시 빠른 중단

## 제약사항

- 복잡한 아키텍처 변경에는 부적합
- 병렬 처리가 필요한 작업에는 비효율적