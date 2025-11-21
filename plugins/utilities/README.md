# Utilities Plugin

개발 워크플로우 유틸리티 도구

## 포함 스킬 (1개)

- **route-tester** - JWT cookie 기반 인증 라우트 테스트

## route-tester

**목적**: 인증된 API 라우트 테스트

기능:
- JWT 토큰 생성
- Cookie 기반 인증 설정
- API 엔드포인트 테스트
- 응답 검증

사용 예시:
```
"POST /api/users 라우트 테스트해줘"
→ route-tester 활성화
→ 인증 토큰 생성
→ 요청 전송
→ 응답 검증
```

자동 트리거:
- "test route", "test endpoint"
- "API testing", "authenticated route"
- "**/routes/**/*.ts" 파일 작업 시

## 지원 패턴

- Express.js routes
- JWT authentication
- Cookie-based auth
- RESTful API testing

## 향후 확장

추가 유틸리티:
- Database seeder
- Mock data generator
- Performance profiler
- Log analyzer
