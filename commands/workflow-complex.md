---
allowed-tools: Task, Read, Glob, Grep, AskUserQuestion
description: 복잡한 프로젝트를 전문 에이전트들이 협업하여 처리합니다
argument-hint: <프로젝트 설명>
model: sonnet
---

# Complex Workflow - 복잡한 프로젝트 처리

대규모 복잡한 프로젝트를 여러 전문 에이전트가 협업하여 처리하는 고급 워크플로우입니다.

## 적합한 프로젝트 유형

- 전체 스택 애플리케이션 개발
- 마이크로서비스 아키텍처 구축
- 대규모 리팩토링 프로젝트
- 시스템 마이그레이션
- 복잡한 통합 프로젝트

## 실행 흐름

```
intelligent-task-router → dynamic-task-orchestrator → iterative-quality-enhancer
```

### 1. 작업 라우팅 (intelligent-task-router)
- 프로젝트 복잡도 평가 (0.7 이상)
- 필요한 전문 분야 식별
- 우선순위 및 의존성 매핑

### 2. 동적 조율 (dynamic-task-orchestrator)
6개 전문 워커가 협업:

#### Code Analyzer
- 코드베이스 분석
- 기술 부채 식별
- 의존성 파악

#### System Architect
- 아키텍처 설계
- 기술 스택 선택
- 인터페이스 정의

#### Developer
- 핵심 기능 구현
- API 개발
- 통합 작업

#### Test Engineer
- 테스트 전략 수립
- 자동화 테스트 구현
- 품질 보증

#### Documentation Writer
- API 문서화
- 사용자 가이드 작성
- 아키텍처 문서

#### Performance Optimizer
- 성능 분석
- 병목 지점 개선
- 최적화 적용

### 3. 품질 검증 (iterative-quality-enhancer)
- 통합 테스트 실행
- 5차원 품질 평가
- 최대 5회 반복 개선

## 사용 예시

```
/workflow-complex 전자상거래 플랫폼 결제 시스템 전체 리팩토링
```

## 협업 구조

```
┌─────────────────────┐
│   Orchestrator      │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
[Analyzer]    [Architect]
    │             │
    └──────┬──────┘
           │
    ┌──────┼──────┬──────┬──────┐
    ▼      ▼      ▼      ▼      ▼
[Dev]  [Test]  [Docs] [Perf] [...]
    │      │      │      │      │
    └──────┴──────┴──────┴──────┘
                  │
           ┌──────▼──────┐
           │  Evaluator  │
           └─────────────┘
```

## 특징

- **전문성**: 각 분야 전문 에이전트 활용
- **적응성**: 프로젝트에 따라 동적 구성
- **완성도**: 아키텍처부터 최적화까지 종합 처리
- **협업**: 에이전트 간 자동 조율

## 고급 기능

### 동적 워커 할당
- 프로젝트 특성에 따라 워커 구성 변경
- 필요시 추가 전문 에이전트 투입

### 실시간 재조정
- 진행 중 우선순위 재평가
- 리소스 재할당
- 병목 지점 해결

### 멀티 페이즈 실행
- Phase 1: 분석 및 설계
- Phase 2: 구현 및 개발
- Phase 3: 테스트 및 최적화
- Phase 4: 문서화 및 배포

## 제약사항

- 실행 시간이 길 수 있음 (복잡도에 비례)
- 중간 확인 및 결정이 필요할 수 있음
- 높은 컴퓨팅 리소스 요구