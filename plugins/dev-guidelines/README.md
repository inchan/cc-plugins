# Development Guidelines Plugin

Frontend/Backend 개발 패턴 및 에러 추적 베스트 프랙티스

## 포함 스킬 (3개)

- **frontend-dev-guidelines** - React/TypeScript/MUI v7 패턴
- **backend-dev-guidelines** - Node.js/Express/Prisma 아키텍처
- **error-tracking** - Sentry v8 통합 패턴

## 주요 기능

### Frontend Guidelines
- React 18 + TypeScript
- MUI v7 (Grid2, Suspense)
- TanStack Router
- 성능 최적화 패턴

### Backend Guidelines
- Layered architecture (Controller/Service/Repository)
- Prisma ORM 패턴
- Zod validation
- Dependency injection

### Error Tracking
- Sentry 통합 (instrument.ts)
- 모든 에러 캡처
- Performance monitoring

## 자동 트리거

파일 패턴:
- `frontend/**/*.tsx` → frontend-dev-guidelines
- `backend/**/*.ts` → backend-dev-guidelines
- `**/instrument.ts` → error-tracking

키워드:
- "component", "MUI", "React" → frontend
- "controller", "service", "API" → backend
- "sentry", "error handling" → error-tracking
