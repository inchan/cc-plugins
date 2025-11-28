# 스킬 추천 시스템 테스트

이 디렉토리는 `skill-recommend-hook.py`의 자동화된 테스트를 포함합니다.

## 📋 테스트 파일 구조

```
tests/
├── README.md                          # 이 파일
├── fixtures/
│   └── test-prompts.json              # 테스트 케이스 정의 (26개)
├── run-skill-recommend-tests.py       # 기본 테스트 러너
├── detailed-test-runner.py            # 상세 분석 테스트 러너
├── SKILL-RECOMMEND-TEST-REPORT.md     # 최종 테스트 리포트
└── test-skill-recommend.sh            # Bash 래퍼 스크립트
```

## 🚀 테스트 실행 방법

### 1. 기본 테스트 실행
```bash
# plugins/hooks/tests 디렉토리에서
python3 run-skill-recommend-tests.py
```

### 2. 상세 분석 테스트 실행
```bash
# 키워드, 신뢰도, 매칭 패턴 분석 포함
python3 detailed-test-runner.py
```

### 3. Bash 스크립트 사용
```bash
bash test-skill-recommend.sh
```

## 📊 테스트 케이스 구성

### 카테고리별 테스트 수
- **frontend**: 3개
- **backend**: 3개
- **error-handling**: 2개
- **workflow**: 3개
- **tool-creation**: 4개
- **quality**: 3개
- **research**: 2개
- **ai-integration**: 2개
- **testing**: 2개
- **prompt**: 2개

**총 26개 테스트 케이스**

### 테스트 케이스 형식

```json
{
  "id": "frontend-1",
  "prompt": "React 컴포넌트를 만들고 싶어요",
  "expectedSkills": ["frontend-dev-guidelines"],
  "mustMatch": ["frontend-dev-guidelines"],
  "mustNotMatch": ["backend-dev-guidelines"]
}
```

#### 필드 설명
- `id`: 테스트 케이스 고유 식별자
- `prompt`: 테스트할 사용자 프롬프트
- `expectedSkills`: 기대되는 스킬 목록 (참고용)
- `mustMatch`: **반드시** 매칭되어야 하는 스킬 (테스트 성공 조건)
- `mustNotMatch`: **절대** 매칭되면 안 되는 스킬 (테스트 실패 조건)

## ✅ 성공 기준

테스트는 다음 조건을 **모두** 만족해야 통과합니다:
1. `mustMatch`의 모든 스킬이 매칭 결과에 포함
2. `mustNotMatch`의 모든 스킬이 매칭 결과에서 제외

## 📈 최근 테스트 결과

**실행 시각**: 2025-11-27 16:37:35

- **총 테스트**: 26개
- **성공**: 26개 (100.0%)
- **실패**: 0개 (0.0%)
- **평균 매칭 수**: 1.3개/테스트

상세 결과는 [`SKILL-RECOMMEND-TEST-REPORT.md`](./SKILL-RECOMMEND-TEST-REPORT.md)를 참조하세요.

## 🔧 새 테스트 케이스 추가 방법

1. `fixtures/test-prompts.json` 열기
2. 해당 카테고리에 새 테스트 추가:
   ```json
   {
     "id": "category-N",
     "prompt": "테스트할 프롬프트",
     "expectedSkills": ["skill-name"],
     "mustMatch": ["skill-name"],
     "mustNotMatch": ["unwanted-skill"]
   }
   ```
3. 테스트 실행하여 검증
4. 결과 확인 및 필요시 키워드 조정

## 🐛 문제 해결

### 테스트 실패 시
1. **SKILL-RECOMMEND-TEST-REPORT.md** 에서 실패 케이스 확인
2. **실패 이유** 분석:
   - `mustMatch 누락`: 키워드 추가 필요
   - `mustNotMatch 포함`: 키워드 너무 일반적, 제거 고려
3. 해당 스킬의 `skill-metadata.json` 또는 `skill.json` 수정
4. 캐시 갱신 후 재테스트

### JSON 파싱 오류
- `test-prompts.json` 문법 검증: `python3 -m json.tool fixtures/test-prompts.json`

### 실행 오류
- Python3 설치 확인: `python3 --version`
- 스크립트 실행 권한: `chmod +x *.py`

## 📝 커밋 전 체크리스트

새 스킬이나 키워드를 추가/수정한 경우:
- [ ] 테스트 케이스 추가/업데이트
- [ ] `python3 detailed-test-runner.py` 실행
- [ ] 모든 테스트 통과 확인
- [ ] 리포트 검토 및 커밋

## 🔗 관련 문서

- [skill-recommend-hook.py](../skill-recommend-hook.py) - 훅 구현체
- [skill-metadata.json](../../cache/skill-metadata.json) - 스킬 메타데이터 캐시
- [hooks.json](../hooks.json) - 훅 설정
