# Test 01: 에이전트 등록 확인

**테스트 ID**: test-01
**Category**: Phase 1 - 기본 검증
**소요 시간**: 1분
**난이도**: ⭐ (매우 쉬움)

---

## 목적

plugin.json에 6개 TDD 에이전트가 정상적으로 등록되었는지 확인

---

## 사전 조건

- `.claude-plugin/plugin.json` 파일 존재
- `agents` 섹션에 6개 에이전트 정의

---

## 테스트 절차

### 1. plugin.json 확인

```bash
cat .claude-plugin/plugin.json | jq '.agents'
```

**예상 출력**:
```json
[
  {
    "name": "tdd-orchestrator",
    "source": "agents/tdd/orchestrator.md"
  },
  {
    "name": "tdd-task-planner",
    "source": "agents/tdd/task-planner.md"
  },
  {
    "name": "tdd-test-writer",
    "source": "agents/tdd/test-writer.md"
  },
  {
    "name": "tdd-implementer",
    "source": "agents/tdd/implementer.md"
  },
  {
    "name": "tdd-refactorer",
    "source": "agents/tdd/refactorer.md"
  },
  {
    "name": "tdd-reviewer",
    "source": "agents/tdd/reviewer.md"
  }
]
```

### 2. 에이전트 파일 존재 확인

```bash
for agent in orchestrator task-planner test-writer implementer refactorer reviewer; do
  if [ -f "agents/tdd/${agent}.md" ]; then
    echo "✓ agents/tdd/${agent}.md"
  else
    echo "✗ agents/tdd/${agent}.md (MISSING)"
  fi
done
```

**예상 출력**:
```
✓ agents/tdd/orchestrator.md
✓ agents/tdd/task-planner.md
✓ agents/tdd/test-writer.md
✓ agents/tdd/implementer.md
✓ agents/tdd/refactorer.md
✓ agents/tdd/reviewer.md
```

### 3. 에이전트 이름 일치 확인

```bash
# YAML frontmatter의 name 필드 추출
for agent_file in agents/tdd/*.md; do
  agent_name=$(head -10 "$agent_file" | grep "^name:" | cut -d':' -f2 | tr -d ' ')
  echo "$agent_file → $agent_name"
done
```

**예상 출력**:
```
agents/tdd/implementer.md → tdd-implementer
agents/tdd/orchestrator.md → tdd-orchestrator
agents/tdd/refactorer.md → tdd-refactorer
agents/tdd/reviewer.md → tdd-reviewer
agents/tdd/task-planner.md → tdd-task-planner
agents/tdd/test-writer.md → tdd-test-writer
```

---

## 성공 기준

- [ ] plugin.json의 agents 배열에 6개 항목 존재
- [ ] 6개 에이전트 파일 모두 존재
- [ ] plugin.json의 name과 파일의 YAML name이 일치

---

## 실패 시 조치

### 문제 1: agents 섹션 없음

**증상**:
```bash
$ cat .claude-plugin/plugin.json | jq '.agents'
null
```

**해결**:
```bash
# plugin.json에 agents 섹션 추가 필요
```

### 문제 2: 파일 누락

**증상**:
```
✗ agents/tdd/test-writer.md (MISSING)
```

**해결**:
- 파일 생성 또는 경로 확인

### 문제 3: 이름 불일치

**증상**:
```
plugin.json: "tdd-test-writer"
YAML name: "test-writer"  (불일치!)
```

**해결**:
- YAML frontmatter 또는 plugin.json 수정

---

## 테스트 결과 기록

**실행 일시**: _____________
**실행자**: _____________

### 체크리스트

- [ ] plugin.json agents 섹션 확인
- [ ] 6개 파일 존재 확인
- [ ] 이름 일치 확인

### 결과

- [ ] ✅ 성공
- [ ] ❌ 실패

### 실패 사유 (해당 시)

```
[에러 메시지 또는 이슈]
```

---

## 다음 테스트

✅ 성공 시 → **Test 02: YAML 파싱 확인**

---

## 변경 이력

- **2025-11-29**: 초기 작성
