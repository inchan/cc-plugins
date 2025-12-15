# Test 02: YAML Frontmatter 파싱 확인

**테스트 ID**: test-02
**Category**: Phase 1 - 기본 검증
**소요 시간**: 2분
**난이도**: ⭐⭐ (쉬움)

---

## 목적

각 에이전트의 YAML frontmatter가 정상적으로 파싱되는지 확인
특히 `tools` 필드가 배열 형식인지 검증

---

## 사전 조건

- Test 01 통과 (에이전트 등록 확인)
- 6개 에이전트 파일 존재

---

## 테스트 절차

### 1. YAML frontmatter 추출

```bash
# 각 에이전트의 YAML 부분만 추출
for agent_file in agents/tdd/*.md; do
  echo "=== $(basename $agent_file) ==="
  sed -n '/^---$/,/^---$/p' "$agent_file" | head -10
  echo
done
```

**예상 출력 예시** (orchestrator.md):
```yaml
---
name: tdd-orchestrator
description: TDD 워크플로우 전체를 조율하고 Red-Green-Refactor 사이클을 제어하는 오케스트레이터
model: sonnet
tools: ["Read", "Grep", "Glob", "TodoWrite", "Task", "AskUserQuestion"]
color: cyan
---
```

### 2. tools 필드 형식 확인

```bash
# tools 필드가 배열 형식인지 확인 (대괄호 포함)
for agent_file in agents/tdd/*.md; do
  tools_line=$(grep "^tools:" "$agent_file")
  if echo "$tools_line" | grep -q '\[.*\]'; then
    echo "✓ $(basename $agent_file): 배열 형식"
  else
    echo "✗ $(basename $agent_file): 배열 아님 - $tools_line"
  fi
done
```

**예상 출력**:
```
✓ implementer.md: 배열 형식
✓ orchestrator.md: 배열 형식
✓ refactorer.md: 배열 형식
✓ reviewer.md: 배열 형식
✓ task-planner.md: 배열 형식
✓ test-writer.md: 배열 형식
```

### 3. 필수 필드 존재 확인

```bash
# 각 에이전트의 필수 필드 체크
for agent_file in agents/tdd/*.md; do
  echo "=== $(basename $agent_file) ==="

  if grep -q "^name:" "$agent_file"; then
    echo "  ✓ name"
  else
    echo "  ✗ name (MISSING)"
  fi

  if grep -q "^description:" "$agent_file"; then
    echo "  ✓ description"
  else
    echo "  ✗ description (MISSING)"
  fi

  if grep -q "^tools:" "$agent_file"; then
    echo "  ✓ tools"
  else
    echo "  ✗ tools (MISSING)"
  fi

  echo
done
```

**예상 출력**:
```
=== orchestrator.md ===
  ✓ name
  ✓ description
  ✓ tools

=== task-planner.md ===
  ✓ name
  ✓ description
  ✓ tools

...
```

### 4. YAML 유효성 검증 (Python 사용)

```bash
# Python으로 YAML 파싱 테스트
python3 << 'EOF'
import yaml
import glob

errors = []

for filepath in glob.glob("agents/tdd/*.md"):
    with open(filepath, 'r') as f:
        content = f.read()

    # YAML frontmatter 추출
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            yaml_content = parts[1]
            try:
                data = yaml.safe_load(yaml_content)

                # 필수 필드 확인
                if 'name' not in data:
                    errors.append(f"{filepath}: 'name' 필드 없음")
                if 'tools' not in data:
                    errors.append(f"{filepath}: 'tools' 필드 없음")
                elif not isinstance(data['tools'], list):
                    errors.append(f"{filepath}: 'tools'가 배열이 아님")

                print(f"✓ {filepath}")

            except yaml.YAMLError as e:
                errors.append(f"{filepath}: YAML 파싱 오류 - {e}")

if errors:
    print("\n⚠️ 오류:")
    for err in errors:
        print(f"  - {err}")
else:
    print("\n✅ 모든 YAML 파싱 성공")
EOF
```

---

## 성공 기준

- [ ] 모든 에이전트의 YAML frontmatter 파싱 성공
- [ ] `tools` 필드가 배열 형식 (`["tool1", "tool2"]`)
- [ ] 필수 필드 (`name`, `description`, `tools`) 모두 존재
- [ ] YAML 문법 오류 없음

---

## 흔한 오류 패턴

### ❌ 잘못된 형식

```yaml
# 1. tools가 문자열 (배열 아님)
tools: Read, Grep, Glob

# 2. tools에 따옴표 없음 (일부 파서에서 오류)
tools: [Read, Grep, Glob]

# 3. YAML 구조 오류
tools: ["Read", "Grep"
  "Glob"]  # 줄바꿈 오류
```

### ✅ 올바른 형식

```yaml
tools: ["Read", "Grep", "Glob"]

# 또는 (여러 줄)
tools:
  - "Read"
  - "Grep"
  - "Glob"
```

---

## 실패 시 조치

### 문제 1: tools가 배열이 아님

**증상**:
```
✗ orchestrator.md: 배열 아님 - tools: Read, Grep, Glob
```

**해결**:
```bash
# 파일 수정 필요
sed -i '' 's/tools: \(.*\)/tools: ["\1"]/' agents/tdd/orchestrator.md
# 수동으로 쉼표를 ", "로 변경
```

### 문제 2: YAML 파싱 오류

**증상**:
```
agents/tdd/test-writer.md: YAML 파싱 오류 - unexpected indent
```

**해결**:
- 들여쓰기 확인 (공백 vs 탭)
- 따옴표 짝 맞춤 확인

### 문제 3: 필수 필드 누락

**증상**:
```
✗ name (MISSING)
```

**해결**:
- YAML frontmatter에 필드 추가

---

## 테스트 결과 기록

**실행 일시**: _____________
**실행자**: _____________

### 체크리스트

- [ ] YAML frontmatter 추출 성공
- [ ] tools 배열 형식 확인
- [ ] 필수 필드 존재 확인
- [ ] Python YAML 파싱 성공

### 결과

- [ ] ✅ 성공 (모든 에이전트 정상)
- [ ] ⚠️ 부분 성공 (일부 에이전트 오류)
- [ ] ❌ 실패 (다수 에이전트 오류)

### 오류 상세 (해당 시)

| 에이전트 | 오류 유형 | 상세 |
|---------|---------|------|
|         |         |      |

---

## 다음 테스트

✅ 성공 시 → **Test 03: Task Planner 단독 테스트**

---

## 변경 이력

- **2025-11-29**: 초기 작성
