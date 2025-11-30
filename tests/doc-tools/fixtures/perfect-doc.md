# Perfect Document

> 이 문서는 모든 검증 원칙을 준수하는 완벽한 예시입니다.

---

## 개요

이 문서는 4가지 원칙(추적가능성, 교차검증, 사용자중심, 완성도)을 모두 만족합니다.

---

## 사용 예시

```typescript
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}
```

**참조**: `src/utils.ts:123` (추적가능성 ✓)

---

## API 레퍼런스

### calculateTotal()

**시그니처**: `(items: number[]) => number`

**설명**: 배열의 모든 숫자를 합산합니다.

**예제**:
```typescript
const total = calculateTotal([1, 2, 3]); // 6
```

---

## 주의사항

⚠️ **경고**: `items` 배열이 비어있으면 `0`을 반환합니다. (사용자중심 ✓)

⚠️ **제약**: 정수만 지원합니다. 부동소수점은 정밀도 손실 가능성이 있습니다.

---

## 변경 이력

- **2025-11-30**: 초기 작성 (완성도 ✓)
