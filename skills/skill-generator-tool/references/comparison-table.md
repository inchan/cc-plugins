# Claude Code Tools - Complete Comparison

Side-by-side comparison of all Claude Code tool types.

## Overview Comparison

| Aspect | Command | Skill | Subagent | Hook |
|--------|---------|-------|----------|------|
| **Purpose** | Prompt/workflow shortcut | Domain expertise + resources | Focused AI agent | Event automation |
| **Invocation** | User types `/name` | Claude decides when needed | Task tool or user request | System events |
| **Location** | `.claude/commands/` | `.claude/skills/` | `.claude/agents/` | `.claude/hooks/` |
| **Format** | Single .md file | Directory with SKILL.md | Single .md file | Shell script |
| **Intelligence** | Template expansion | Full Claude capabilities | Focused Claude agent | External script |

## Technical Specifications

### File Structure

| Tool | Structure | Example |
|------|-----------|---------|
| Command | `name.md` | `review-pr.md` |
| Skill | `name/SKILL.md` + resources | `pdf-editor/SKILL.md` |
| Subagent | `name.md` | `security-reviewer.md` |
| Hook | `name.sh` (or .py, .js) | `auto-lint.sh` |

### YAML Frontmatter Fields

| Field | Command | Skill | Subagent | Hook |
|-------|---------|-------|----------|------|
| name | - | Required | Required | - |
| description | Optional | Required | Required | - |
| allowed-tools | Optional | - | - | - |
| tools | - | - | Optional | - |
| model | Optional | - | Optional | - |
| argument-hint | Optional | - | - | - |

### Argument Support

| Tool | Method | Example |
|------|--------|---------|
| Command | `$1`, `$2`, `$ARGUMENTS` | `/deploy $1` → `/deploy staging` |
| Skill | N/A | - |
| Subagent | Task tool prompt | Via Task tool invocation |
| Hook | JSON stdin | `{"parameters": {"file": "..."}}` |

## Capabilities Comparison

### Tool Access

| Capability | Command | Skill | Subagent | Hook |
|------------|---------|-------|----------|------|
| Configurable tools | Yes | No (full) | Yes | N/A |
| Default tools | All | All | All | External |
| Tool restrictions | `allowed-tools` | - | `tools` | - |

### Model Selection

| Tool | Options | Default |
|------|---------|---------|
| Command | sonnet, opus, haiku | Parent |
| Skill | N/A (uses Claude) | Parent |
| Subagent | sonnet, opus, haiku, inherit | sonnet |
| Hook | N/A (shell) | - |

### Context Access

| Access Type | Command | Skill | Subagent | Hook |
|-------------|---------|-------|----------|------|
| Conversation history | Yes | Yes | No | No |
| Project files | Yes | Yes | Yes | Via JSON |
| Can ask questions | Yes | Yes | No | No |
| External tools | Via allowed-tools | Yes | Via tools | Any |

## Use Case Comparison

### When to Use Each

| Use Case | Best Tool | Why |
|----------|-----------|-----|
| Format code shortcut | Command | Simple, user-invoked |
| Company coding standards | Skill | Domain knowledge + references |
| Security vulnerability scan | Subagent | Focused, read-only |
| Auto-lint after edit | Hook | Event-driven automation |
| PR review workflow | Command | Multi-step, user-invoked |
| Database schema knowledge | Skill | References + query patterns |
| Parallel code reviewers | Subagent | Focused, parallelizable |
| File protection | Hook | Pre-operation validation |

### Complexity Fit

| Complexity | Best Fit | Example |
|------------|----------|---------|
| Simple action | Command | `/format`, `/lint` |
| Domain knowledge | Skill | BigQuery, GraphQL |
| Focused analysis | Subagent | Security review |
| Automated checks | Hook | Linting, tests |
| Complex workflow | Command + Subagents | PR review pipeline |

## Template Availability

### Command Templates (6)

| Template | Purpose | Example |
|----------|---------|---------|
| basic | Empty structure | Custom commands |
| simple-action | Single action | Format, lint |
| workflow | Multi-step process | PR review, deploy |
| prompt-expansion | Long prompt shortcut | Detailed criteria |
| agent-caller | Invoke subagent | Delegate to specialist |
| full-power | Complex multi-feature | Full deployment |

### Subagent Templates (7)

| Template | Purpose | Permissions |
|----------|---------|-------------|
| basic | Empty structure | Custom |
| code-reviewer | Code review | Read, Grep, Glob |
| debugger | Bug diagnosis | Read, Edit, Bash, Grep |
| architect | System design | Read, Write, Grep, Glob |
| implementer | Feature building | Full |
| researcher | Investigation | Read, Grep, WebSearch |
| tester | Test execution | Read, Bash, Grep |

### Hook Templates (5)

| Template | Event | Purpose |
|----------|-------|---------|
| pre-tool-use | PreToolUse | Validation/blocking |
| post-tool-use | PostToolUse | Automation |
| stop | Stop | End-of-response tasks |
| user-prompt-submit | UserPromptSubmit | Prompt handling |
| notification | Notification | Event notifications |

### Skill Structure (No templates, pattern-based)

| Resource Type | Purpose | Examples |
|---------------|---------|----------|
| scripts/ | Deterministic code | `rotate_pdf.py` |
| references/ | Domain knowledge | `schema.md`, `api.md` |
| assets/ | Output files | `template.pptx`, `logo.png` |

## Integration Patterns

### Tool Combinations

| Pattern | Components | Use Case |
|---------|------------|----------|
| Command + Subagents | Orchestration | Parallel reviews |
| Skill + Commands | Knowledge + shortcuts | Domain workflows |
| Command + Hooks | UI + automation | Deploy with validation |
| Full stack | All four types | Complete dev workflow |

### Communication Flow

```
User ──► Command ──► Skill ──► Subagent
           │            │
           └── Hook ◄───┘
               (events)
```

## Best Practices Comparison

### Universal Practices

| Practice | Applies to |
|----------|------------|
| Single responsibility | All |
| Clear naming (lowercase-hyphen) | All |
| Descriptive descriptions | Command, Skill, Subagent |
| Minimal permissions | Command, Subagent |
| Test before use | All |

### Tool-Specific Practices

| Tool | Key Practices |
|------|---------------|
| Command | Use templates, validate, restrict tools |
| Skill | Progressive disclosure, bundle resources, keep SKILL.md lean |
| Subagent | Detailed prompts, include examples, match model to task |
| Hook | Validate JSON, use absolute paths, test with sample input |

## Validation Tools

| Tool | Validation Script | Test Script |
|------|------------------|-------------|
| Command | `validate_command.py` | Manual testing |
| Skill | Built into `package_skill.py` | Manual testing |
| Subagent | `validate_subagent.py` | Manual testing |
| Hook | `validate_hook.sh` | `test_hook.sh` |

## Quick Selection Guide

### By Trigger Type

- **User invokes** → Command
- **Claude decides** → Skill
- **Orchestrator invokes** → Subagent
- **System event** → Hook

### By Primary Need

- **Prompt shortcut** → Command
- **Domain expertise** → Skill
- **Focused analysis** → Subagent
- **Automation** → Hook

### By Resource Requirements

- **No resources** → Command or Subagent
- **Scripts/references** → Skill
- **External tools** → Hook

### By Team Usage

- **Personal shortcuts** → User-level Command
- **Team workflows** → Project-level Command/Skill
- **Shared agents** → Project-level Subagent
- **Standard enforcement** → Project-level Hook
