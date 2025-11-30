# Skills (스킬)

> 사용자 프롬프트에 자동 또는 수동으로 활성화되는 확장 기능

---

## 디렉토리 구조

```
skills/
└── {skill-name}/
    ├── SKILL.md          # 스킬 정의 (필수)
    ├── resources/        # 참고 자료 (선택)
    │   └── *.md
    └── scripts/          # 실행 스크립트 (선택)
        └── *.py|*.sh
```

---

## 스킬 생성 가이드

자세한 생성 방법은 다음 문서 참고:
- [도구 생성 가이드](../docs/guidelines/tool-creation.md#1-skill-생성)
- [Requirements](../docs/requirements.md#21-skills-스킬)

---

## 참고 자료

- [Tool Creation Guide](../docs/guidelines/tool-creation.md)
- [Development Guidelines](../docs/guidelines/development.md)
- [Anthropic 공식 문서](https://docs.anthropic.com/claude-code)

---

## 사용 가능한 스킬

### search-core

> 웹 검색 및 출처 필터링 공통 로직

- **경로**: `skills/search-core/`
- **설명**: WebSearch/WebFetch 도구를 래핑하여 재사용 가능한 검색 인터페이스 제공
- **주요 기능**:
  - Tier 1-4 출처 신뢰도 분류
  - 검색 결과 정규화 및 중복 제거
  - 3가지 출력 형식 템플릿 (요약/상세/대화형)
- **활성화**: 공식 문서, 커뮤니티, 기술 블로그 검색 시 자동

---

## 변경 이력

- **2025-11-29**: project-guide 스킬을 .claude/skills/로 이동 (프로젝트 전용)
- **2025-11-29**: search-core 스킬 추가
- **2025-11-29**: 문서 최신화 (스킬 목록 추가)
- **2025-11-28**: skills 디렉토리 생성
