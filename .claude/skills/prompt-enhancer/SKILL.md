---
name: prompt-enhancer
description: Enhance user prompts by analyzing project context (code structure, dependencies, conventions, existing patterns). Use when users provide brief development requests that would benefit from project-specific context to generate more accurate, contextually-aware prompts.
---

# Prompt Enhancer

Transform brief development requests into clear, detailed requirements by analyzing project context. Present the enhanced requirements to the user for confirmation before implementation.

## When to Use This Skill

Use this skill when:
- User provides a brief development request like "로그인 기능 만들어줘", "API 추가해줘"
- Request lacks specific implementation details
- User uploads project files or mentions "the project"
- Task requires understanding project architecture

---

## GOD Framework (Simplified from GOLDEN)

모든 향상된 요구사항은 GOD 프레임워크를 따릅니다:

| 요소 | 설명 | 예시 |
|------|------|------|
| **G**oal | 명확한 목표 정의 | 로그인 기능 구현, API 엔드포인트 추가 |
| **O**utput | 예상 결과물 | TypeScript 컴포넌트, REST API 엔드포인트 |
| **D**ata | 프로젝트 컨텍스트 데이터 | 기존 패턴, 의존성, 코드 규칙 |

---

## Core Workflow

### Step 1: Analyze Project Context

**프로젝트 컨텍스트 수집:**
```bash
view /mnt/user-data/uploads
```

**수집할 핵심 정보:**
- Project structure and organization
- Technology stack (package.json, pubspec.yaml, requirements.txt, etc.)
- Existing patterns (state management, API calls, routing)
- Code conventions (naming, file structure)
- Similar existing features

### Step 2: Extract Request Intent

From the user's brief request, identify:
- **Feature type**: New feature, bug fix, refactoring, API integration
- **Scope**: Single screen, full flow, backend + frontend
- **Dependencies**: Related features or systems

### Step 3: Build Enhanced Requirements (2-Stage Structure)

간소화된 2단계 구조로 요구사항을 구성합니다:

```markdown
# [기능명] 구현 요구사항

## 📋 컨텍스트
- **Framework**: [detected framework and version]
- **Architecture**: [detected pattern]
- **Key Libraries**: [list relevant dependencies]
- **기존 패턴**: [existing similar features]

## 🎯 요구사항

### 구현 범위
1. [Main feature 1]
2. [Main feature 2]
3. [Main feature 3]

### 파일 구조
```
[Expected file structure]
```

### 상세 구현
#### [Component/Module 1]
- **위치**: [File path]
- **목적**: [What it does]
- **구현 내용**: [Specific requirements]
- **참조 패턴**: [Reference to existing pattern]

#### [Component/Module 2]
...

## ✅ 성공 기준
- [ ] [Main success criterion 1]
- [ ] [Main success criterion 2]
- [ ] 기존 코드 스타일 유지
- [ ] 테스트 작성

## 🔍 확인 사항
- [Questions needing clarification]
- [Assumptions made]

---
이 요구사항으로 진행할까요? 수정이 필요한 부분이 있다면 말씀해주세요.
```

### Step 4: Present to User

**Important**: After creating the enhanced requirements, present them to the user and ask for confirmation:

```
위 요구사항을 분석해서 정리했습니다.

이대로 진행해도 될까요?
수정하거나 추가할 내용이 있으면 말씀해주세요!
```

**Do NOT implement** until the user confirms. The goal is to clarify requirements first.

---

## Templates

### Standard Template (Most Common)

대부분의 작업에 적합한 표준 템플릿입니다.

```markdown
# [기능명] 구현 요구사항

## 📋 컨텍스트
- **Framework**: [framework and version]
- **Architecture**: [pattern]
- **Dependencies**: [key libraries]

## 🎯 요구사항

### 구현 범위
1. [Component 1]
2. [Component 2]

### 상세 구현
[Detailed specifications per component]

## ✅ 성공 기준
- [ ] 기능 요구사항 충족
- [ ] 코드 품질 (테스트, 린트)
- [ ] 기존 패턴 일관성

---
진행할까요?
```

---

## Analysis Patterns by Stack

### Flutter Projects

**Detect**: pubspec.yaml, lib/ directory

**Key context to gather:**
- State management (Riverpod, Bloc, Provider, GetX)
- Architecture (Clean Architecture, MVVM, MVC)
- Navigation (go_router, auto_route, Navigator)
- Network (Dio, http)
- Local storage (Hive, SharedPreferences, SQLite)

**Enhanced requirements should include:**
```markdown
## 구현 범위

### Presentation Layer
- 화면: lib/presentation/[feature]/[screen]_screen.dart
- 상태: [StateNotifier/Bloc/Controller] with [state pattern]
- 위젯: 재사용 가능한 컴포넌트

### Domain Layer
- Entity: lib/domain/entities/[name].dart
- UseCase: lib/domain/usecases/[action]_usecase.dart
- Repository Interface: lib/domain/repositories/

### Data Layer
- Model: lib/data/models/[name]_model.dart (fromJson/toJson)
- Repository Implementation: lib/data/repositories/
- DataSource: lib/data/datasources/

## 성공 기준
✅ [State management]로 상태 관리
✅ [Existing widget] 스타일 일관성 유지
✅ API 응답 에러 처리
✅ 로딩 상태 표시
✅ Widget test 작성
```

### Next.js/React Projects

**Detect**: package.json with "next" or "react"

**Key context to gather:**
- Next.js version (App Router vs Pages Router)
- State management (Zustand, Redux, Context)
- Styling (Tailwind, CSS Modules, styled-components)
- API approach (Next.js API routes, external API)
- TypeScript usage

**Enhanced requirements should include:**
```markdown
## 구현 범위

### UI Components
- 컴포넌트: [path]/[ComponentName].tsx
- Props interface: [existing pattern]
- Styling: [Tailwind classes/CSS modules]

### State Management
- Store: [existing state structure]
- Actions: [action naming convention]

### API Layer
- Endpoint: [app/api or external]
- Method: [GET/POST/PUT/DELETE]
- Response type: [TypeScript interface]

## 성공 기준
✅ TypeScript 타입 안정성
✅ [Existing components] 재사용
✅ 반응형 디자인 (모바일/데스크톱)
✅ SEO 최적화 (메타데이터)
✅ Unit test + Integration test
```

### Python (Django/FastAPI) Projects

**Detect**: requirements.txt, manage.py, main.py

**Key context to gather:**
- Framework (Django, FastAPI, Flask)
- ORM (SQLAlchemy, Django ORM, Tortoise)
- Authentication approach
- API documentation (OpenAPI/Swagger)

**Enhanced requirements should include:**
```markdown
## 구현 범위

### Models/Schema
- Model: [app]/models.py or schemas/[name].py
- Fields: [field definitions with types]
- Relationships: [ForeignKey/relationships]

### Views/Endpoints
- Route: [path]
- Method: [HTTP method]
- Request/Response schema: [Pydantic models]

### Business Logic
- Service: [if applicable]
- Validation: [input validation]

## 성공 기준
✅ API documentation 자동 생성
✅ Request validation
✅ Error handling with proper status codes
✅ Unit test + Integration test
✅ [Authentication] 적용
```

## Example Enhancement

**User input:**
```
프로필 이미지 업로드 기능 추가해줘
```

**Skill output:**
```markdown
# 프로필 이미지 업로드 기능 구현 요구사항

## 📋 컨텍스트
- **Framework**: React 18.2 + Next.js 13.4 (App Router)
- **Architecture**: Feature-based structure
- **Key Libraries**: Zustand (state), Tailwind CSS, Axios
- **기존 패턴**: components/FileUpload 참조

## 🎯 요구사항

### 구현 범위
1. 이미지 업로드 UI 컴포넌트
2. 이미지 미리보기 기능
3. API 연동 및 상태 관리
4. 에러 처리 및 로딩 표시

### 파일 구조
```
app/
  profile/
    components/
      ProfileImageUploader.tsx
    api/
      upload/
        route.ts
lib/
  stores/
    profileStore.ts
  utils/
    imageValidation.ts
```

### 상세 구현

#### ProfileImageUploader 컴포넌트
- **위치**: app/profile/components/ProfileImageUploader.tsx
- **목적**: 이미지 선택 및 업로드 UI
- **구현 내용**:
  - 드래그 앤 드롭 지원
  - 파일 선택 버튼
  - 이미지 미리보기 (300x300)
  - 파일 크기 제한 (5MB)
  - 지원 형식: JPG, PNG, WebP
- **참조 패턴**: components/FileUpload/index.tsx

#### API 엔드포인트
- **위치**: app/profile/api/upload/route.ts
- **목적**: 이미지 업로드 처리
- **구현 내용**:
  - POST /api/profile/upload
  - 파일 유효성 검증
  - S3/로컬 스토리지 저장
  - 이미지 URL 반환
- **참조 패턴**: 기존 API route 구조

#### 상태 관리
- **위치**: lib/stores/profileStore.ts
- **목적**: 프로필 이미지 상태 관리
- **구현 내용**:
  - uploadImage() action
  - 업로드 진행률 상태
  - 에러 상태 관리
- **참조 패턴**: 다른 Zustand store 패턴

## ✅ 성공 기준
- [ ] 이미지 드래그 앤 드롭 또는 클릭으로 선택
- [ ] 선택한 이미지 미리보기 표시
- [ ] 업로드 진행률 표시 (프로그레스 바)
- [ ] 성공/실패 메시지 표시
- [ ] 파일 크기 및 형식 검증
- [ ] 기존 디자인 시스템과 일관성
- [ ] 모바일 반응형 UI
- [ ] 컴포넌트 테스트 작성

## 🔍 확인 사항
- 이미지 저장은 S3를 사용하나요, 아니면 로컬 스토리지인가요?
- 이미지 리사이징이 필요한가요? (썸네일 생성)
- 기존 프로필 이미지 삭제 기능도 필요한가요?

---
이 요구사항으로 진행할까요? 수정이 필요한 부분이 있다면 말씀해주세요.
```

## Tips for Effective Enhancement

### Always Ask for Clarification

If the project context is unclear or insufficient:
```
프로젝트 파일을 업로드해주시면 더 정확한 요구사항을 만들 수 있습니다.
또는 다음 정보를 알려주세요:
- 사용 중인 프레임워크
- 상태 관리 라이브러리
- 기존 프로젝트 구조
```

### Include Visual Examples

When helpful, mention existing screens/components:
```
기존 ProfileScreen과 유사한 레이아웃으로 구현
- AppBar 스타일 동일
- TextFormField 디자인 재사용
- PrimaryButton 컴포넌트 사용
```

### Highlight Dependencies

```
## 🔗 연관 기능
- UserRepository: 사용자 정보 조회에 재사용
- TokenStorage: 기존 토큰 저장 로직 활용
- ErrorHandler: 공통 에러 처리 적용
```

## Reference Files

For detailed patterns:
- **Enhancement patterns**: references/enhancement-patterns.md
- **Framework guides**: references/framework-guides.md

---