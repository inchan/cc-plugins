# TOC Generator for Markdown Files

자동으로 Markdown 문서에 목차(Table of Contents)를 생성하는 스크립트입니다.

## 기능

- ✅ Markdown 파일에서 `## ` 헤더 자동 추출
- ✅ 번호 매김 + GitHub 앵커 링크 생성
- ✅ 한글/영어 헤딩 모두 지원
- ✅ 기존 목차 자동 교체
- ✅ 기존 콘텐츠 보존

## 사용법

### 단일 파일 처리

```bash
node scripts/generate-toc.js <file-path>
```

### 예시

```bash
# 특정 파일에 목차 추가
node scripts/generate-toc.js docs/SKILL-DEVELOPMENT-GUIDE.md

# 200줄 이상 문서에 일괄 적용
for file in $(find docs -name "*.md" -exec sh -c 'lines=$(wc -l < "$1"); if [ $lines -ge 200 ]; then echo "$1"; fi' _ {} \;); do
  node scripts/generate-toc.js "$file"
done
```

## 작동 원리

1. **헤더 추출**: `## ` 레벨 헤더만 추출 (# 와 ###는 제외)
2. **앵커 생성**: GitHub 호환 앵커 링크 자동 생성
   - 소문자 변환
   - 특수문자 제거 (한글, 영어, 숫자, 하이픈만 유지)
   - 공백을 하이픈(-)으로 변환
3. **목차 삽입**: 첫 번째 `# ` 헤더 다음에 삽입
4. **기존 목차 교체**: `## 목차`가 이미 있으면 자동 교체

## 생성되는 목차 형식

```markdown
## 목차

1. [첫 번째 섹션](#첫-번째-섹션)
2. [두 번째 섹션](#두-번째-섹션)
3. [Third Section](#third-section)

---
```

## 앵커 링크 예시

| 원본 헤더 | 생성된 앵커 |
|-----------|------------|
| `## 스킬이란?` | `#스킬이란` |
| `## Quick Start Guide` | `#quick-start-guide` |
| `## 1. Overview` | `#1-overview` |
| `## API 참조` | `#api-참조` |

## 요구사항

- Node.js 12 이상
- 200줄 이상 문서에 목차 추가 권장 (DOCUMENTATION_GUIDELINES.md 기준)

## 제한사항

- `# ` (H1) 헤더가 없는 파일은 처리 불가
- `## ` (H2) 헤더만 목차에 포함 (`###`는 제외)
- 기존 목차는 `## 목차`로 시작해야 인식됨

## 트러블슈팅

### "No # header found in file" 에러

- 파일에 `# ` (H1) 헤더가 없습니다
- 파일 첫 부분에 `# 제목`을 추가하세요

### 목차가 생성되지 않음

- `## ` 헤더가 없는지 확인
- 헤더 형식이 정확한지 확인 (공백 필수: `##제목` ❌, `## 제목` ✅)

## 개발자 노트

이 스크립트는 다음 규칙을 따릅니다:

- **DOCUMENTATION_GUIDELINES.md**: 200줄 이상 문서는 목차 필수
- **GitHub Markdown**: 앵커 링크는 GitHub 호환 형식
- **한글 지원**: 한글 헤더의 앵커 링크 정상 작동

## 관련 문서

- [DOCUMENTATION_GUIDELINES.md](../docs/DOCUMENTATION_GUIDELINES.md)
- [Markdown Guide](https://www.markdownguide.org/)
