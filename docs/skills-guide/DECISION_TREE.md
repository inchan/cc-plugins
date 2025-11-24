# Decision Tree: Skills vs Commands vs Sub-agents

**When should you use what? This guide helps you choose the right tool for your task.**

## 목차

1. [Quick Decision Flow](#quick-decision-flow)
2. [Detailed Decision Matrix](#detailed-decision-matrix)
3. [Side-by-Side Comparison](#side-by-side-comparison)
4. [Context Window Considerations](#context-window-considerations)
5. [Common Patterns](#common-patterns)
6. [Red Flags: When You're Using the Wrong Tool](#red-flags-when-youre-using-the-wrong-tool)
7. [Quick Reference Card](#quick-reference-card)
8. [Final Advice](#final-advice)

---

## Quick Decision Flow

```
START: What do you need?

[1] Claude should automatically know something when relevant
    → Use SKILL

[2] You want to trigger a specific action with a shortcut
    → Use COMMAND

[3] You need to delegate a complex task to an independent worker
    → Use SUB-AGENT

[4] You need to automatically run something when an event occurs
    → Use HOOK
```

---

## Detailed Decision Matrix

### Use SKILLS When:

✅ **You have domain-specific knowledge Claude should know**
- React best practices when editing .tsx files
- Database patterns when using Prisma
- Security guidelines when handling auth

✅ **Information should load automatically based on context**
- User mentions "backend API" → Load backend guidelines
- Editing frontend file → Load React patterns
- Working on auth → Load security checklist

✅ **You need Progressive Disclosure (load info on-demand)**
- Too much knowledge to fit in system prompt
- Different tasks need different subsets of knowledge
- Context window efficiency is critical

✅ **The guidance applies to multiple different requests**
- Same patterns used across many tasks
- Consistent application of standards
- Team-wide best practices

**Example Scenarios:**
```
- "Create React component" → Frontend Guidelines skill activates
- "Add API endpoint" → Backend patterns skill activates
- "Database query" → DB verification skill activates
```

---

### Use COMMANDS When:

✅ **You want explicit user control (Human-in-the-Loop)**
- User decides when to run
- Predictable behavior
- No surprise activations

✅ **You have a repeatable workflow/shortcut**
- Code formatting: `/format`
- PR review: `/review-pr 123`
- Deploy: `/deploy production`

✅ **You need tool restrictions or model override**
- Commands support `allowed-tools`
- Commands support `model` selection
- Skills do not support these

✅ **You want to save long prompts as shortcuts**
- `/audit-security` → Expands to full security checklist
- `/code-review` → Expands to comprehensive review criteria

✅ **You need argument substitution**
- `/commit Fixed bug` → Creates commit with message
- `/search keyword` → Searches codebase for keyword

**Example Scenarios:**
```
/format         → Format current file with ESLint/Prettier
/test           → Run test suite
/deploy staging → Deploy to staging environment
/review-pr 456  → Review PR #456
```

---

### Use SUB-AGENTS When:

✅ **You need isolated context (independent reasoning)**
- Task shouldn't pollute main conversation
- Parallel independent analysis
- Complex multi-step delegation

✅ **Task is complex and multi-step**
- Architecture design decisions
- Comprehensive code review
- Bug diagnosis and fixing

✅ **You want specialized model selection**
- Use Haiku for quick searches (cost-efficient)
- Use Opus for complex architecture (most capable)
- Use Sonnet for balanced tasks

✅ **You need parallel execution**
- Multiple reviewers analyzing simultaneously
- Different aspects of code checked concurrently
- Voting/consensus mechanisms

✅ **You want minimal tools for security**
- Code reviewer: Read-only tools only
- Implementer: Full write access
- Researcher: Search tools only

**Example Scenarios:**
```
Task: "Use code-reviewer agent to analyze auth.ts"
      → Launches independent reviewer with isolated context

Task: "Run security-scanner and performance-analyzer in parallel"
      → Two sub-agents run concurrently, each with own context
```

---

## Side-by-Side Comparison

### Scenario 1: Code Review

| Approach | How It Works | Pros | Cons |
|----------|--------------|------|------|
| **Skill** | Auto-loads review guidelines | Zero setup, consistent | Can't isolate reasoning |
| **Command** | `/review` triggers checklist | User controls when | Must remember to use |
| **Sub-agent** | Dedicated reviewer agent | Isolated analysis | More latency |

**Recommendation**: Skill for guidelines + Command for trigger + Sub-agent for detailed review

---

### Scenario 2: Database Operations

| Approach | How It Works | Pros | Cons |
|----------|--------------|------|------|
| **Skill** | Auto-loads when Prisma detected | Prevents mistakes | May over-trigger |
| **Command** | `/verify-db` manual check | Explicit control | May forget |
| **Sub-agent** | DB expert agent | Deep analysis | Overkill for simple ops |

**Recommendation**: Guardrail Skill (blocks until verified)

---

### Scenario 3: Deployment

| Approach | How It Works | Pros | Cons |
|----------|--------------|------|------|
| **Skill** | Not ideal (too generic) | - | Too broad scope |
| **Command** | `/deploy prod` | Explicit, safe | Best choice |
| **Sub-agent** | Deploy orchestrator | Complex multi-step | Overkill usually |

**Recommendation**: Command for standard deploys, Sub-agent for complex orchestration

---

## Context Window Considerations

### Skills

```
Context Impact: Moderate (~1000-5000 tokens)
When Loaded: On-demand during conversation
Persistence: Until conversation ends
```

Best when:
- You need the info available throughout conversation
- Multiple questions might reference same knowledge
- Progressive disclosure benefits apply

### Commands

```
Context Impact: Low (~100-500 tokens)
When Loaded: Only when /command invoked
Persistence: Prompt expansion is temporary
```

Best when:
- One-time action needed
- Don't need persistent knowledge
- Quick in-and-out operation

### Sub-agents

```
Context Impact: None (isolated context)
When Loaded: Spawns new context window
Persistence: Independent session
```

Best when:
- Don't want to pollute main context
- Task is complex enough to warrant isolation
- Parallel processing needed

---

## Common Patterns

### Pattern 1: Guardrail Skill

**Use Case**: Prevent common mistakes
**Example**: Database verification before Prisma operations

```
1. Skill detects Prisma code
2. Blocks edit until skill acknowledged
3. Forces developer to verify column names
4. Prevents runtime errors
```

**Why Skill?** Auto-detection is critical for prevention.

### Pattern 2: Workflow Command

**Use Case**: Multi-step repeatable process
**Example**: PR review workflow

```
1. /review-pr 123
2. Fetches PR info
3. Analyzes changes
4. Checks security
5. Reports findings
```

**Why Command?** User explicitly wants review now.

### Pattern 3: Delegated Sub-agent

**Use Case**: Complex independent analysis
**Example**: Architecture review

```
1. Task: architect-reviewer
2. Agent analyzes in isolation
3. Returns comprehensive report
4. Main conversation continues
```

**Why Sub-agent?** Needs deep, isolated reasoning.

### Pattern 4: Combined Approach

**Use Case**: Production-ready feature
**Example**: Implementing new API endpoint

```
1. SKILL: Auto-loads backend patterns (guidelines)
2. COMMAND: /create-endpoint invoked (trigger)
3. SUB-AGENT: security-reviewer checks result (validation)
4. HOOK: post-edit runs linting (automation)
```

**Why combined?** Different tools for different phases.

---

## Red Flags: When You're Using the Wrong Tool

### Using Skill When Should Use Command

❌ **Red Flag**: Skill triggers when not wanted
- Solution: Use Command for explicit control
- Example: Deployment shouldn't auto-trigger

### Using Command When Should Use Skill

❌ **Red Flag**: Forgetting to run command before mistakes
- Solution: Use Guardrail Skill (auto-blocks)
- Example: DB verification needs automation

### Using Sub-agent When Should Use Skill

❌ **Red Flag**: Simple knowledge lookup taking too long
- Solution: Use Skill for shared context lookup
- Example: Checking coding standards doesn't need isolation

### Using Skill When Should Use Sub-agent

❌ **Red Flag**: Context window getting cluttered
- Solution: Use Sub-agent for isolated reasoning
- Example: Complex analysis polluting conversation

---

## Quick Reference Card

```
                        SKILLS          COMMANDS        SUB-AGENTS
Activation:             Auto            Manual (/cmd)   Task delegation
Context:                Shared          Shared          Isolated
Tool Restrictions:      No              Yes             Yes
Model Override:         No              Yes             Yes
Progressive Disclosure: Yes             No              No
Parallel Execution:     No              No              Yes

Best For:
- Domain knowledge      ✅              ❌              ❌
- User shortcuts        ❌              ✅              ❌
- Complex delegation    ❌              ❌              ✅
- Auto-prevention       ✅              ❌              ❌
- Explicit control      ❌              ✅              ❌
- Isolated reasoning    ❌              ❌              ✅
```

---

## Final Advice

**Start simple:**
1. First try a Skill (auto-invoked knowledge)
2. If need explicit control, use Command
3. If need isolation/delegation, use Sub-agent
4. Combine as needed for complex workflows

**Remember:**
- Skills = Knowledge Provider
- Commands = Action Shortcut
- Sub-agents = Independent Worker
- Hooks = Event Automation

Each tool has its place. Master when to use each, and your workflows will be both powerful and maintainable.

---

**Next**: See [LATEST_INFO_SOURCES.md](LATEST_INFO_SOURCES.md) for staying updated
