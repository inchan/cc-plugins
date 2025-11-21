# Quality Review Plugin

코드 품질 평가 및 성찰 기반 리뷰

## 포함 스킬 (2개)

- **iterative-quality-enhancer** - 5차원 품질 평가 및 반복 개선
- **reflection-review** - 6영역 성찰 기반 리뷰

## 에이전트 (2개)

- **code-reviewer** - 코드 리뷰 전문 에이전트
- **architect** - 아키텍처 설계 전문 에이전트

## iterative-quality-enhancer

5가지 차원 평가:
1. **Functionality** - 기능 정확성
2. **Performance** - 성능 최적화
3. **Code Quality** - 코드 품질
4. **Security** - 보안 취약점
5. **Documentation** - 문서화

반복 루프:
```
평가 → 피드백 → 개선 → 재평가 (최대 3회)
```

## reflection-review

6개 영역 평가 (0-100 점수):
1. 기능 구현
2. 코드 품질
3. 에러 처리
4. 테스트
5. 문서화
6. 보안

우선순위:
- **P0**: Critical (즉시 수정)
- **P1**: High (필수)
- **P2**: Medium (권장)

## 사용 예시

```
"코드 리뷰해줘"
→ reflection-review 활성화
→ 6영역 점수 산출
→ P0/P1/P2 피드백 제공
```
