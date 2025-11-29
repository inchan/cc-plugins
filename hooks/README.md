# Hooks (훅)

> 특정 이벤트 발생 시 실행되는 자동화 스크립트

---

## 디렉토리 구조

```
hooks/
├── hooks.json        # 훅 정의 (필수)
├── {hook-name}.py    # Python 훅
└── {hook-name}.sh    # Shell 훅
```

---

## 훅 생성 가이드

자세한 생성 방법은 다음 문서 참고:
- [도구 생성 가이드](../docs/guidelines/tool-creation.md#4-hook-생성)
- [Requirements](../docs/requirements.md#22-hooks-훅)
- [이벤트 타입 레퍼런스](../docs/references/hooks/event-types.md)
- [PreToolUse 패턴](../docs/references/hooks/pretooluse-pattern.md)

---

## 참고 자료

- [Tool Creation Guide](../docs/guidelines/tool-creation.md)
- [Hooks 공식 문서](https://docs.anthropic.com/claude-code/hooks)

---

## 사용 가능한 훅

현재 등록된 훅이 없습니다.

---

## 변경 이력

- **2025-11-29**: 문서 최신화 (훅 목록 추가)
- **2025-11-28**: hooks 디렉토리 생성
