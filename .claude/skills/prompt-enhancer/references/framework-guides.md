# Framework-Specific Guides

Quick reference for enhancing prompts in popular frameworks.

## Frontend Frameworks

### Next.js

**Key context to gather:**
- App Router vs Pages Router
- TypeScript usage
- API route patterns
- Server/Client component split
- State management approach
- CSS solution (Tailwind, CSS Modules, styled-components)

**Enhancement focus:**
```
- Route structure: app/[route]/page.tsx or pages/[route].tsx
- Server components: Default in App Router
- Client components: 'use client' directive
- Data fetching: async components, fetch, SWR, React Query
- Metadata: generateMetadata for SEO
- API routes: app/api/[route]/route.ts or pages/api/[route].ts
```

### React (Create React App / Vite)

**Key context to gather:**
- State management (Context, Redux, Zustand)
- Routing library (React Router)
- Component patterns (functional vs class)
- Build tool (Webpack, Vite)
- CSS approach

**Enhancement focus:**
```
- Component location: src/components/
- Hooks usage: useState, useEffect, custom hooks
- Route definitions: React Router configuration
- State structure: Global vs local state
- Build configuration: vite.config.ts or webpack config
```

### Vue.js

**Key context to gather:**
- Vue 2 vs Vue 3
- Composition API vs Options API
- State management (Vuex, Pinia)
- TypeScript integration
- Component style (SFC structure)

**Enhancement focus:**
```
- Component structure: <template>, <script>, <style>
- Composition API: setup(), ref, reactive
- Store: Vuex modules or Pinia stores
- Router: vue-router configuration
- Props and emits: defineProps, defineEmits
```

### Angular

**Key context to gather:**
- Angular version
- Module structure
- Component/Service patterns
- RxJS usage
- TypeScript strict mode

**Enhancement focus:**
```
- Module organization: feature modules
- Component structure: @Component decorator
- Services: @Injectable and dependency injection
- Observables: RxJS operators
- Forms: Reactive vs template-driven
```

## Backend Frameworks

### Express.js

**Key context to gather:**
- Middleware patterns
- Route organization
- Database/ORM (Prisma, TypeORM, Sequelize)
- Authentication approach
- TypeScript usage

**Enhancement focus:**
```
- Route structure: /routes directory
- Middleware: auth, validation, error handling
- Controllers: separation of concerns
- Database: ORM models and migrations
- Error handling: centralized error middleware
```

### FastAPI (Python)

**Key context to gather:**
- Router organization
- Pydantic models
- Database/ORM (SQLAlchemy, Tortoise)
- Authentication (OAuth2, JWT)
- Async patterns

**Enhancement focus:**
```
- Routers: APIRouter organization
- Models: Pydantic schemas vs SQLAlchemy models
- Dependencies: Depends() for injection
- Async routes: async def endpoints
- Documentation: automatic OpenAPI docs
```

### Django

**Key context to gather:**
- Django version
- App structure
- ORM usage
- Django REST Framework (if API)
- Template vs API approach

**Enhancement focus:**
```
- Apps: Django app organization
- Models: ORM model definitions
- Views: function-based vs class-based
- URLs: url patterns
- Migrations: makemigrations workflow
```

### Spring Boot (Java)

**Key context to gather:**
- Spring Boot version
- Maven vs Gradle
- JPA/Hibernate usage
- Controller patterns
- Service layer structure

**Enhancement focus:**
```
- Controllers: @RestController patterns
- Services: @Service and business logic
- Repositories: JPA repositories
- Configuration: application.properties/yml
- DTOs: data transfer objects
```

## Full-Stack Frameworks

### Ruby on Rails

**Key context to gather:**
- Rails version
- MVC structure
- ActiveRecord patterns
- Asset pipeline vs Webpacker
- Testing framework (RSpec, Minitest)

**Enhancement focus:**
```
- Models: ActiveRecord associations
- Controllers: RESTful actions
- Views: ERB templates or API mode
- Routes: config/routes.rb
- Migrations: db/migrate/
```

### Laravel (PHP)

**Key context to gather:**
- Laravel version
- Eloquent ORM usage
- Blade templates
- API vs full-stack
- Testing approach

**Enhancement focus:**
```
- Models: Eloquent model patterns
- Controllers: resource controllers
- Routes: web.php vs api.php
- Migrations: database/migrations/
- Middleware: app/Http/Middleware/
```

## Mobile Frameworks

### React Native

**Key context to gather:**
- Expo vs bare workflow
- Navigation library (React Navigation)
- State management
- Native modules usage
- Platform-specific code

**Enhancement focus:**
```
- Components: React Native primitives
- Navigation: stack, tab, drawer navigators
- Platform code: Platform.select()
- Native modules: linking and configuration
- Styling: StyleSheet API
```

### Flutter

**Key context to gather:**
- Flutter version (2.x vs 3.x+)
- State management (Provider, Riverpod, Bloc, GetX, MobX)
- Null safety enabled
- Package dependencies (pubspec.yaml)
- Platform-specific code (iOS/Android)
- Architecture pattern (Clean Architecture, MVVM, MVC)
- Routing approach (Navigator 1.0, Navigator 2.0, go_router, auto_route)
- Network layer (Dio, http package)
- Local storage (Hive, SharedPreferences, SQLite)

**Enhancement focus:**
```
- Widgets: StatelessWidget vs StatefulWidget
  - Prefer StatelessWidget for UI-only components
  - Use StatefulWidget only when managing local state
  - Consider using Hooks (flutter_hooks) if in use

- State Management Pattern:
  - Provider: ChangeNotifier, Consumer, Provider.of
  - Riverpod: StateProvider, StateNotifierProvider, ConsumerWidget
  - Bloc: BlocProvider, BlocBuilder, BlocListener, BlocConsumer
  - GetX: GetxController, Obx, GetBuilder

- Navigation:
  - Navigator 1.0: Named routes in MaterialApp
  - Navigator 2.0: Router, RouterDelegate, RouteInformationParser
  - go_router: GoRoute configuration, nested routes
  - auto_route: @AutoRoute annotations, generated routing

- Project Structure:
  lib/
  ├── core/          (constants, themes, utils)
  ├── data/          (repositories, data sources, models)
  ├── domain/        (entities, use cases)
  ├── presentation/  (screens, widgets, state management)
  └── main.dart

- UI Components:
  - Material vs Cupertino widgets
  - Custom themes: ThemeData configuration
  - Responsive design: MediaQuery, LayoutBuilder
  - Custom widgets: reusable component patterns

- Data Layer:
  - Models: fromJson/toJson serialization
  - Repositories: abstraction layer
  - API clients: Dio interceptors, error handling
  - Local storage: async data persistence

- Platform Channels:
  - MethodChannel for platform-specific code
  - EventChannel for streaming data
  - Platform-specific implementations (iOS/Android)

- Assets and Resources:
  - pubspec.yaml: asset declarations
  - Image loading: AssetImage, NetworkImage, CachedNetworkImage
  - Fonts: custom font configuration
  - Localization: intl package, arb files
```

**Common Flutter Enhancement Patterns:**

**Example 1 - Feature Addition:**
```
Original: "로그인 화면 만들어줘"

Enhanced:
Create login screen following project architecture:

1. UI Layer (lib/presentation/auth/):
   - login_screen.dart: StatefulWidget with form
   - Use existing TextFormField styling from theme
   - Apply validation matching existing patterns
   - Follow project's responsive design approach

2. State Management (based on project):
   - Provider: Create AuthProvider with login method
   - Bloc: Create LoginBloc with LoginEvent and LoginState
   - Riverpod: Create loginProvider with StateNotifier
   - GetX: Create LoginController with login method

3. Data Layer (lib/data/):
   - auth_repository.dart: login API call
   - Use existing Dio instance and interceptors
   - Follow error handling pattern (try-catch, Either type)
   - user_model.dart: Add/update user model with serialization

4. Navigation:
   - After successful login, navigate to home
   - Use existing navigation pattern (context.go, Navigator.push)
   - Handle back button with WillPopScope if needed

5. Validation:
   - Email validator: match existing validation utils
   - Password strength: follow existing requirements
   - Form key: GlobalKey<FormState>

6. Error Handling:
   - Show SnackBar for errors (match existing UI feedback)
   - Loading state: CircularProgressIndicator
   - Disable button during loading

7. Testing:
   - Widget tests: test/presentation/auth/login_screen_test.dart
   - Unit tests: test/data/auth_repository_test.dart
   - Follow existing test patterns (mockito, mocktail)
```

**Example 2 - State Management Integration:**
```
Original: "장바구니 기능 추가해줘"

Enhanced based on Riverpod project:

1. State (lib/presentation/cart/):
   - cart_state.dart: CartState class (items, total, loading)
   - cart_notifier.dart: StateNotifier<CartState>
   - cart_provider.dart: StateNotifierProvider definition

2. UI (lib/presentation/cart/):
   - cart_screen.dart: ConsumerWidget
   - Use ref.watch(cartProvider) for state
   - Use ref.read(cartProvider.notifier) for actions
   - cart_item_widget.dart: reusable cart item component

3. Models (lib/domain/):
   - cart_item.dart: CartItem entity with Freezed
   - Follow existing entity patterns
   - Include copyWith, toJson, fromJson

4. Repository (lib/data/):
   - cart_repository.dart: local storage operations
   - Use existing Hive box or SharedPreferences approach
   - Implement caching strategy

5. Actions:
   - addToCart(Product product)
   - removeFromCart(String productId)
   - updateQuantity(String productId, int quantity)
   - clearCart()
   - Match existing method naming conventions

6. UI Integration:
   - Add cart icon to AppBar with badge (item count)
   - Use existing badge widget if available
   - Navigate to cart on tap
```

**Flutter-Specific Considerations:**

- **Null Safety**: Use sound null safety (required, ?, !)
- **Async Operations**: FutureBuilder, StreamBuilder, or state management
- **Immutability**: Consider using Freezed for immutable models
- **Performance**: 
  - Use const constructors where possible
  - Implement shouldRepaint for CustomPainters
  - ListView.builder for long lists
- **Testing**:
  - Widget tests: testWidgets, find, expect
  - Golden tests: matchesGoldenFile
  - Integration tests: flutter_driver or integration_test

## Enhancement Strategies by Framework

### For Component-Based Frameworks (React, Vue, Angular)

1. Check existing component structure
2. Identify state management pattern
3. Review prop/event patterns
4. Check testing approach (component tests)
5. Verify styling solution

### For MVC Frameworks (Rails, Django, Laravel)

1. Understand model relationships
2. Check controller patterns
3. Review route organization
4. Identify view/template approach
5. Verify migration patterns

### For API Frameworks (Express, FastAPI)

1. Check route organization
2. Review middleware patterns
3. Identify validation approach
4. Check authentication/authorization
5. Verify error handling strategy

## Quick Detection Commands

```bash
# Next.js
ls app/ pages/ next.config.js

# React
ls src/App.tsx package.json vite.config.ts

# Vue
ls src/main.ts vue.config.js

# Angular  
ls angular.json src/app/app.module.ts

# Express
ls index.js routes/ middleware/

# FastAPI
ls main.py routers/ models/

# Django
ls manage.py settings.py

# Rails
ls config/routes.rb app/models/

# React Native
ls App.tsx app.json

# Flutter
ls pubspec.yaml lib/main.dart
```

## Framework Version Considerations

### Breaking Changes to Note

- **Next.js 13+**: App Router vs Pages Router
- **React 18+**: Concurrent features, automatic batching
- **Vue 3**: Composition API, Teleport
- **Angular 14+**: Standalone components
- **Django 3.2+**: Async views support
- **Rails 7+**: Hotwire/Turbo
- **Spring Boot 3+**: Jakarta EE namespace

When enhancing prompts, always note the framework version if it affects implementation patterns.

---

## Domain-Specific Pattern Catalog

보고서에서 제시한 스택별 세부 패턴입니다.

### Flutter State Management Patterns

각 상태 관리 라이브러리별 표준 요구사항 템플릿입니다.

#### Riverpod Pattern

```markdown
## 상태 관리 요구사항 (Riverpod)

### Provider 정의
- **위치**: lib/presentation/[feature]/providers/
- **타입**: StateNotifierProvider / FutureProvider / StreamProvider
- **네이밍**: [feature]Provider, [feature]Notifier

### 구현 패턴
```dart
// StateNotifier 패턴
class FeatureNotifier extends StateNotifier<FeatureState> {
  final Repository _repository;

  FeatureNotifier(this._repository) : super(FeatureState.initial());

  Future<void> loadData() async {
    state = state.copyWith(isLoading: true);
    final result = await _repository.getData();
    state = state.copyWith(data: result, isLoading: false);
  }
}
```

### UI 연결
- ConsumerWidget / ConsumerStatefulWidget 사용
- ref.watch() for reactive, ref.read() for actions
- ProviderScope 상단에 위치
```

#### Bloc Pattern

```markdown
## 상태 관리 요구사항 (Bloc)

### 파일 구조
- **bloc**: lib/presentation/[feature]/bloc/[feature]_bloc.dart
- **event**: lib/presentation/[feature]/bloc/[feature]_event.dart
- **state**: lib/presentation/[feature]/bloc/[feature]_state.dart

### Event 정의
```dart
abstract class FeatureEvent extends Equatable {}

class LoadFeature extends FeatureEvent {
  @override
  List<Object> get props => [];
}
```

### State 정의
```dart
abstract class FeatureState extends Equatable {}

class FeatureLoading extends FeatureState {}
class FeatureLoaded extends FeatureState {
  final Data data;
}
```

### UI 연결
- BlocProvider / MultiBlocProvider
- BlocBuilder / BlocListener / BlocConsumer
```

#### Provider Pattern

```markdown
## 상태 관리 요구사항 (Provider)

### Provider 정의
- **위치**: lib/providers/
- **타입**: ChangeNotifierProvider / FutureProvider

### 구현 패턴
```dart
class FeatureProvider extends ChangeNotifier {
  Data? _data;
  bool _isLoading = false;

  Data? get data => _data;
  bool get isLoading => _isLoading;

  Future<void> loadData() async {
    _isLoading = true;
    notifyListeners();
    _data = await repository.getData();
    _isLoading = false;
    notifyListeners();
  }
}
```

### UI 연결
- Provider.of<T>(context) 또는 context.watch<T>()
- Consumer<T> 위젯 사용
```

---

### Next.js Routing Patterns

App Router와 Pages Router별 패턴입니다.

#### App Router (Next.js 13+)

```markdown
## 라우팅 요구사항 (App Router)

### 파일 구조
```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── [feature]/
│   ├── page.tsx        # Feature page
│   ├── loading.tsx     # Loading UI
│   ├── error.tsx       # Error boundary
│   └── [id]/
│       └── page.tsx    # Dynamic route
└── api/
    └── [route]/
        └── route.ts    # API endpoint
```

### Server Components (기본)
```typescript
// app/feature/page.tsx
export default async function FeaturePage() {
  const data = await fetchData(); // 서버에서 직접 fetch
  return <FeatureComponent data={data} />;
}
```

### Client Components
```typescript
'use client';

export default function InteractiveComponent() {
  const [state, setState] = useState();
  // 클라이언트 로직
}
```

### Metadata
```typescript
export const metadata: Metadata = {
  title: 'Feature Page',
  description: '...',
};
```
```

#### Pages Router (Next.js 12-)

```markdown
## 라우팅 요구사항 (Pages Router)

### 파일 구조
```
pages/
├── _app.tsx            # App wrapper
├── _document.tsx       # HTML document
├── index.tsx           # Home page
├── [feature]/
│   ├── index.tsx       # Feature page
│   └── [id].tsx        # Dynamic route
└── api/
    └── [route].ts      # API endpoint
```

### Data Fetching
```typescript
// getServerSideProps (SSR)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetchData();
  return { props: { data } };
};

// getStaticProps (SSG)
export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchData();
  return { props: { data }, revalidate: 60 };
};
```
```

---

### Python Backend Patterns

Django/FastAPI별 ORM, 인증, API 패턴입니다.

#### Django ORM Pattern

```markdown
## 데이터베이스 요구사항 (Django ORM)

### Model 정의
```python
# models.py
class Feature(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['name'])]
```

### QuerySet 패턴
```python
# 효율적 쿼리
Feature.objects.select_related('user').filter(...)
Feature.objects.prefetch_related('tags').all()
```

### Migration
```bash
python manage.py makemigrations
python manage.py migrate
```
```

#### FastAPI Authentication Pattern

```markdown
## 인증 요구사항 (FastAPI + JWT)

### 의존성
```python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401)
    return user
```

### 보호된 라우트
```python
@router.get("/protected")
async def protected_route(user: User = Depends(get_current_user)):
    return {"user": user.email}
```

### 토큰 생성
```python
from jose import jwt

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
```
```

#### FastAPI CRUD Pattern

```markdown
## API 요구사항 (FastAPI CRUD)

### 스키마 정의
```python
# schemas.py
class FeatureBase(BaseModel):
    name: str

class FeatureCreate(FeatureBase):
    pass

class FeatureResponse(FeatureBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
```

### CRUD 함수
```python
# crud.py
async def create_feature(db: AsyncSession, feature: FeatureCreate):
    db_feature = Feature(**feature.dict())
    db.add(db_feature)
    await db.commit()
    await db.refresh(db_feature)
    return db_feature
```

### 라우터
```python
@router.post("/", response_model=FeatureResponse)
async def create(
    feature: FeatureCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_feature(db, feature)
```
```

---
