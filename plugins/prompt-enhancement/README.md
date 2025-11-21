# Prompt Enhancement Plugin

프롬프트 생성 및 품질 향상

## 포함 스킬 (2개)

- **meta-prompt-generator** - 슬래시 커맨드용 메타 프롬프트 생성
- **prompt-enhancer** - 프로젝트 컨텍스트 기반 프롬프트 상세화

## meta-prompt-generator

**목적**: 간결하고 실용적인 슬래시 커맨드 프롬프트 생성

특징:
- 500줄 이하 권장
- 명확한 구조
- 실행 가능한 지침
- 예시 포함

사용 예시:
```
"코드 리뷰 커맨드 만들어줘"
→ meta-prompt-generator 활성화
→ /code-review 프롬프트 생성
```

## prompt-enhancer

**목적**: 짧은 요청을 프로젝트 컨텍스트 기반으로 상세화

프로세스:
1. 프로젝트 컨텍스트 분석
2. 기술 스택 파악
3. 아키텍처 이해
4. 상세 요구사항 생성

입력 예시:
```
"로그인 페이지 만들어줘"
```

출력 예시:
```
## 요구사항
- React + TypeScript
- MUI v7 Grid2 사용
- TanStack Router 통합
- Zod 폼 검증
- Sentry 에러 추적
...
```

## 자동 트리거

키워드:
- "프롬프트 생성", "메타 프롬프트" → meta-prompt-generator
- "요구사항", "상세화", "구체화" → prompt-enhancer
