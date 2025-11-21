# Tool Type Decision Matrix - Detailed Guide

This document provides comprehensive decision criteria for selecting the optimal Claude Code tool type.

## Decision Flowchart

```
START: What do you want to create?
│
├─ Q1: Is it triggered by a system event (edit, stop, session)?
│   │
│   YES ──► HOOK
│   │
│   NO ──► Q2: Is it a shortcut for prompts/workflows you type repeatedly?
│           │
│           YES ──► COMMAND
│           │
│           NO ──► Q3: Does it need bundled resources (scripts, docs, assets)?
│                   │
│                   YES ──► SKILL
│                   │
│                   NO ──► Q4: Does it need focused AI with restricted permissions?
│                           │
│                           YES ──► SUBAGENT
│                           │
│                           NO ──► Re-evaluate requirements
```

## Detailed Decision Criteria

### When to Choose COMMAND

**Primary Indicators:**
- User-invoked via `/command-name`
- Reusable prompt or workflow template
- Frequently typed sequences
- Team-shared workflows

**Complexity Indicators:**
- Simple: Single action (format, lint)
- Medium: Multi-step workflow (PR review)
- Complex: Multi-feature with arguments (deploy)

**Examples by Complexity:**

| Complexity | Example | Template |
|------------|---------|----------|
| Simple | `/format` - Format current file | simple-action |
| Medium | `/review-pr 123` - PR review workflow | workflow |
| Complex | `/deploy staging --dry-run` - Full deployment | full-power |

**Red Flags (Don't use Command):**
- Needs to bundle scripts/references
- Requires event-driven automation
- Needs specialized AI persona
- Too much knowledge to fit in prompt

---

### When to Choose SKILL

**Primary Indicators:**
- Domain-specific knowledge or procedures
- Bundled resources needed (scripts, references, assets)
- Claude needs "onboarding" to a domain
- Deterministic operations (scripts)

**Resource Indicators:**

| Resource Type | Use Case | Example |
|--------------|----------|---------|
| Scripts | Deterministic, reusable code | `rotate_pdf.py` |
| References | Domain knowledge Claude reads | `schema.md` |
| Assets | Output templates/files | `template.pptx` |

**Examples by Domain:**

| Domain | Skill Name | Key Resources |
|--------|------------|---------------|
| Data | `bigquery-expert` | `references/schema.md`, `scripts/query.py` |
| Brand | `brand-guidelines` | `assets/logo.png`, `references/style.md` |
| API | `rest-api-builder` | `references/conventions.md`, `assets/template/` |

**Red Flags (Don't use Skill):**
- Just a prompt shortcut
- No resources to bundle
- Better as focused agent
- Event-driven automation

---

### When to Choose SUBAGENT

**Primary Indicators:**
- Focused, single-responsibility agent
- Restricted tool permissions needed
- Parallel execution desired
- Isolated context beneficial

**Permission Patterns:**

| Agent Type | Tools | Rationale |
|------------|-------|-----------|
| Reviewer | Read, Grep, Glob | Read-only analysis |
| Implementer | Read, Write, Edit, Bash, Grep, Glob | Full modification |
| Researcher | Read, Grep, Glob, WebSearch, WebFetch | Investigation |
| Tester | Read, Bash, Grep, Glob | Execute and verify |

**Examples by Role:**

| Role | Name | Permissions | Purpose |
|------|------|-------------|---------|
| Security | `owasp-scanner` | Read, Grep, Glob | Vulnerability detection |
| Quality | `code-reviewer` | Read, Grep, Glob | Code quality check |
| Performance | `perf-analyzer` | Read, Bash, Grep | Performance testing |

**Red Flags (Don't use Subagent):**
- Needs to ask follow-up questions
- No clear single responsibility
- Full permissions needed
- Better as command or skill

---

### When to Choose HOOK

**Primary Indicators:**
- Triggered by system events
- Automated validation/enforcement
- Post-operation automation
- External tool integration

**Event Selection:**

| Event | Trigger | Use Cases |
|-------|---------|-----------|
| PreToolUse | Before tool runs | File protection, validation |
| PostToolUse | After tool completes | Formatting, linting |
| Stop | Claude finishes response | Testing, notifications |
| UserPromptSubmit | User sends message | Prompt validation, logging |
| SessionStart/End | Session boundaries | Init/cleanup |

**Examples by Event:**

| Event | Hook Name | Purpose |
|-------|-----------|---------|
| PreToolUse | `protect-env-files` | Block edits to .env |
| PostToolUse | `auto-format` | Run Prettier after edit |
| Stop | `run-tests` | Execute test suite |
| UserPromptSubmit | `log-prompts` | Track usage |

**Red Flags (Don't use Hook):**
- User-invoked (use Command)
- Needs Claude's intelligence (use Skill/Subagent)
- Complex logic (use Skill)
- Not event-driven

---

## Hybrid Solutions

Complex requirements often need multiple tool types working together.

### Pattern: Command + Subagents

**Scenario:** Comprehensive code review with multiple perspectives

```
/review-code (Command)
    │
    ├─► security-reviewer (Subagent)
    ├─► performance-reviewer (Subagent)
    └─► style-reviewer (Subagent)
```

**Implementation:**
1. Command orchestrates the workflow
2. Subagents provide focused analysis
3. Command aggregates results

---

### Pattern: Skill + Commands

**Scenario:** Domain expertise with convenient shortcuts

```
database-expert (Skill)
    │
    ├─► /query-users (Command)
    ├─► /analyze-schema (Command)
    └─► /optimize-query (Command)
```

**Implementation:**
1. Skill provides domain knowledge
2. Commands offer quick access to common operations
3. Commands can reference skill resources

---

### Pattern: Command + Hooks

**Scenario:** Deployment with automated validation

```
/deploy (Command)
    │
    ├─► PreToolUse Hook: validate-config
    ├─► Execution: deploy scripts
    └─► Stop Hook: notify-team
```

**Implementation:**
1. Command provides user interface
2. Hooks automate validation and notification
3. Separation of concerns

---

### Pattern: Full Stack

**Scenario:** Complete development workflow

```
dev-workflow (Skill)
    │
    ├─► /start-feature (Command)
    ├─► /review (Command) → code-reviewer (Subagent)
    ├─► PostToolUse Hook: auto-lint
    └─► Stop Hook: run-tests
```

---

## Decision Examples

### Example 1: "Auto-format code after editing"

**Analysis:**
- Triggered by event (edit) → Hook
- Post-operation automation → PostToolUse
- External tool (Prettier) → Shell script

**Decision:** Hook (PostToolUse)

---

### Example 2: "Create a PR review shortcut"

**Analysis:**
- User-invoked → Command or Subagent
- Needs Claude's intelligence → Skill/Subagent
- Multi-step workflow → Command with workflow template

**Decision:** Command (workflow template)

---

### Example 3: "Add company database knowledge"

**Analysis:**
- Domain expertise → Skill
- Needs references (schemas) → Skill
- Reusable across tasks → Skill

**Decision:** Skill with references/

---

### Example 4: "Parallel security scanning"

**Analysis:**
- Focused responsibility → Subagent
- Restricted permissions (read-only) → Subagent
- Multiple in parallel → Subagents

**Decision:** Multiple Subagents (code-reviewer template)

---

### Example 5: "Block commits with secrets"

**Analysis:**
- Event-driven (pre-commit) → Hook
- Validation/blocking → PreToolUse
- Deterministic check → Hook

**Decision:** Hook (PreToolUse on Bash)

---

## Quick Reference Card

| Need | Tool | Template/Event |
|------|------|---------------|
| Prompt shortcut | Command | basic |
| Workflow shortcut | Command | workflow |
| Domain knowledge | Skill | - |
| Bundled scripts | Skill | - |
| Focused reviewer | Subagent | code-reviewer |
| Focused implementer | Subagent | implementer |
| Pre-operation validation | Hook | PreToolUse |
| Post-operation automation | Hook | PostToolUse |
| End-of-response tasks | Hook | Stop |
