# Complexity Analysis Guide

이 문서는 `intelligent-task-router`의 복잡도 분석 방법론을 상세히 설명합니다.

## Overview

복잡도 점수(0.0-1.0)는 작업의 기술적 난이도를 정량화하여 최적의 모델(Haiku/Sonnet/Opus)과 처리 전략을 선택하는 데 사용됩니다.

## Complexity Assessment Framework

### 4가지 평가 차원

복잡도는 다음 4가지 요소의 가중 평균으로 계산됩니다:

```markdown
## Complexity = (Scope × 0.3) + (Dependencies × 0.25) + (Technical Depth × 0.3) + (Risk × 0.15)
```

#### 1. Scope (범위) - 30% 가중치

작업이 영향을 미치는 코드베이스의 범위:

| 점수 | 설명 | 예시 |
|------|------|------|
| **0.1-0.3** | 단일 파일/컴포넌트 | 함수 하나 수정, 단일 페이지 버그 수정 |
| **0.4-0.6** | 여러 관련 파일 | 모듈 내 여러 파일, 관련 컴포넌트들 |
| **0.7-0.9** | 시스템 전체 | 아키텍처 변경, 다중 모듈 영향 |
| **1.0** | 전체 시스템 재설계 | 마이그레이션, 프레임워크 교체 |

**평가 질문:**
- 몇 개의 파일이 영향을 받나요?
- 변경이 다른 모듈에 파급되나요?
- 기존 API 계약이 깨지나요?

#### 2. Dependencies (의존성) - 25% 가중치

작업 완료에 필요한 외부 요소들:

| 점수 | 설명 | 예시 |
|------|------|------|
| **0.1-0.3** | 독립적 작업 | 자체 완결적 기능, 외부 의존 없음 |
| **0.4-0.6** | 소수 의존성 | 1-2개 라이브러리, 단순 API 호출 |
| **0.7-0.9** | 다수 의존성 | 여러 서비스 통합, 복잡한 데이터 흐름 |
| **1.0** | 복잡한 통합 | 레거시 시스템, 다중 외부 서비스 |

**평가 질문:**
- 몇 개의 외부 라이브러리가 필요한가요?
- 다른 서비스/API와 통합되나요?
- 데이터베이스 스키마 변경이 필요한가요?
- 인프라 변경(클라우드, DevOps)이 필요한가요?

#### 3. Technical Depth (기술 깊이) - 30% 가중치

해결에 필요한 기술적 전문성:

| 점수 | 설명 | 예시 |
|------|------|------|
| **0.1-0.3** | 기본 수준 | CRUD 작업, 간단한 UI 변경 |
| **0.4-0.6** | 중급 수준 | 비즈니스 로직, 상태 관리 |
| **0.7-0.9** | 고급 수준 | 알고리즘 최적화, 동시성 처리 |
| **1.0** | 전문가 수준 | 분산 시스템, 보안 설계 패턴 |

**평가 질문:**
- 어떤 도메인 지식이 필요한가요?
- 복잡한 알고리즘이 필요한가요?
- 성능/보안/확장성 고려가 중요한가요?

#### 4. Risk (위험도) - 15% 가중치

실패 또는 부작용의 잠재적 영향:

| 점수 | 설명 | 예시 |
|------|------|------|
| **0.1-0.3** | 낮은 위험 | 문서화, 로깅 추가 |
| **0.4-0.6** | 중간 위험 | 비핵심 기능 변경 |
| **0.7-0.9** | 높은 위험 | 인증, 결제, 데이터 마이그레이션 |
| **1.0** | 매우 높은 위험 | 보안 취약점 수정, 프로덕션 데이터 조작 |

**평가 질문:**
- 실패 시 어떤 영향이 있나요?
- 롤백이 가능한가요?
- 사용자 데이터가 영향을 받나요?
- 다운타임이 발생할 수 있나요?

## Complexity Calculation Examples

### Example 1: Simple Bug Fix (0.25)

**Task**: "Fix typo in header component"

```
Scope: 0.1 (단일 파일)
Dependencies: 0.1 (독립적)
Technical Depth: 0.2 (기본)
Risk: 0.1 (매우 낮음)

Complexity = (0.1 × 0.3) + (0.1 × 0.25) + (0.2 × 0.3) + (0.1 × 0.15)
           = 0.03 + 0.025 + 0.06 + 0.015
           = 0.13 → rounded to 0.15
```

**→ Model: Claude Haiku (< 0.4)**

### Example 2: Feature Development (0.55)

**Task**: "Add user notification preferences page"

```
Scope: 0.5 (프론트엔드 + 백엔드 여러 파일)
Dependencies: 0.6 (DB 스키마 변경, 이메일 서비스)
Technical Depth: 0.5 (중급 - 상태 관리, API 설계)
Risk: 0.4 (사용자 설정 변경)

Complexity = (0.5 × 0.3) + (0.6 × 0.25) + (0.5 × 0.3) + (0.4 × 0.15)
           = 0.15 + 0.15 + 0.15 + 0.06
           = 0.51 → rounded to 0.55
```

**→ Model: Claude Sonnet (0.4-0.7)**

### Example 3: Security Implementation (0.85)

**Task**: "Implement OAuth2 authentication with refresh tokens"

```
Scope: 0.8 (시스템 전체 인증 흐름)
Dependencies: 0.9 (OAuth provider, 세션 저장소, 토큰 관리)
Technical Depth: 0.9 (고급 - 보안 패턴, 암호화)
Risk: 0.9 (인증 실패 시 전체 시스템 접근 불가)

Complexity = (0.8 × 0.3) + (0.9 × 0.25) + (0.9 × 0.3) + (0.9 × 0.15)
           = 0.24 + 0.225 + 0.27 + 0.135
           = 0.87 → rounded to 0.85
```

**→ Model: Claude Opus (> 0.7)**

### Example 4: Image Processing Feature (0.78)

**Task**: "Add profile image upload with cropping and thumbnail generation"

```
Scope: 0.7 (프론트엔드 UI + 백엔드 처리 + 인프라)
Dependencies: 0.8 (S3, 이미지 처리 라이브러리, DB)
Technical Depth: 0.8 (고급 - 이미지 알고리즘, 비동기 처리)
Risk: 0.7 (파일 업로드 실패, 저장소 접근 이슈)

Complexity = (0.7 × 0.3) + (0.8 × 0.25) + (0.8 × 0.3) + (0.7 × 0.15)
           = 0.21 + 0.20 + 0.24 + 0.105
           = 0.755 → rounded to 0.78
```

**→ Model: Claude Opus (> 0.7)**

## Model Selection Based on Complexity

### Claude Haiku (complexity < 0.4)

**특징:**
- 가장 빠름 (~3-5초 응답)
- 가장 저렴함
- 기본적인 작업에 충분

**적합한 작업:**
- 간단한 문서 업데이트
- 기본적인 CRUD 구현
- 명확한 버그 수정
- 정보 검색 및 요약

**부적합한 작업:**
- 복잡한 아키텍처 설계
- 고급 알고리즘 구현
- 보안 설계

### Claude Sonnet (complexity 0.4-0.7)

**특징:**
- 균형 잡힌 성능 (~5-10초)
- 합리적인 비용
- **대부분의 작업에 권장 (DEFAULT)**

**적합한 작업:**
- 일반적인 기능 개발
- 중급 난이도 리팩토링
- 대부분의 테스트 작성
- 성능 분석 및 개선

**부적합한 작업:**
- 매우 복잡한 시스템 설계
- 고급 보안 구현

### Claude Opus (complexity > 0.7)

**특징:**
- 가장 강력함 (~15-30초)
- 가장 비쌈
- 복잡한 문제에만 사용

**적합한 작업:**
- 복잡한 아키텍처 설계
- 보안 중요 구현
- 대규모 시스템 마이그레이션
- 새로운 문제 해결

**주의사항:**
- 과도하게 사용하면 비용 급증
- 간단한 작업에는 오히려 비효율적

## Complexity Adjustment Guidelines

### When to Increase Complexity

다음 경우 복잡도를 **0.1-0.2** 상향 조정:

- **보안 관련 작업**: 인증, 권한, 암호화
- **데이터 무결성 중요**: 금융, 의료, 개인정보
- **레거시 코드**: 문서화되지 않은 오래된 코드
- **프로덕션 긴급 수정**: 롤백 어려운 핫픽스

### When to Decrease Complexity

다음 경우 복잡도를 **0.1** 하향 조정:

- **명확한 패턴 존재**: 이미 유사한 구현이 있음
- **완전한 문서화**: 상세한 요구사항과 예제
- **격리된 환경**: 테스트/개발 환경 전용

## Common Pitfalls

### 1. Overestimating Simple Tasks

**문제**: "데이터베이스 추가"라는 키워드에 자동으로 높은 복잡도 부여

**해결**: 실제 변경 범위 확인
- 테이블 하나 추가 → 0.3
- 전체 스키마 재설계 → 0.8

### 2. Underestimating Dependencies

**문제**: "간단한 API 호출"로 보이지만 여러 서비스 조율 필요

**해결**: 의존성 트리 그리기
- 단일 REST 호출 → 0.3
- OAuth + 재시도 로직 + 에러 처리 → 0.6

### 3. Ignoring Risk

**문제**: 기술적으로 간단하지만 실패 시 치명적

**해결**: 영향 범위 분석
- 로그 포맷 변경 → 0.2
- 인증 로직 변경 → 0.7

## Template for Manual Analysis

복잡도를 수동으로 분석할 때 사용:

```markdown
## Task: [작업 설명]

### Scope Analysis
- Files affected: [숫자]
- Modules impacted: [목록]
- API changes: [Yes/No]
- **Score**: [0.0-1.0]

### Dependencies Analysis
- External libraries: [목록]
- Service integrations: [목록]
- Infrastructure changes: [목록]
- **Score**: [0.0-1.0]

### Technical Depth Analysis
- Domain knowledge required: [설명]
- Algorithms needed: [목록]
- Special considerations: [성능/보안/확장성]
- **Score**: [0.0-1.0]

### Risk Analysis
- Failure impact: [High/Medium/Low]
- Rollback difficulty: [Easy/Hard]
- User data affected: [Yes/No]
- **Score**: [0.0-1.0]

### Final Calculation
Complexity = (Scope × 0.3) + (Dependencies × 0.25) + (Technical Depth × 0.3) + (Risk × 0.15)
           = [계산 과정]
           = **[최종 점수]**

### Recommended Model
- [ ] Claude Haiku (< 0.4)
- [ ] Claude Sonnet (0.4-0.7)
- [ ] Claude Opus (> 0.7)
```

## Integration with Router

복잡도 점수는 다음 결정에 사용됩니다:

1. **Model Selection**: Haiku/Sonnet/Opus 선택
2. **Skill Routing**: Sequential/Parallel/Orchestrator 결정
3. **Effort Estimation**: 예상 소요 시간 계산
4. **Risk Assessment**: 추가 검토 필요성 판단

## Summary

- 복잡도는 **4가지 차원**(Scope, Dependencies, Technical Depth, Risk)의 가중 평균
- **0.0-1.0** 범위로 정량화
- **< 0.4**: Haiku (빠르고 저렴)
- **0.4-0.7**: Sonnet (균형, 권장)
- **> 0.7**: Opus (강력하지만 비쌈)

정확한 복잡도 평가는 비용 효율성과 작업 성공률을 모두 높입니다.
