---
name: dynamic-task-orchestrator
description: Implements Anthropic's Orchestrator-Workers pattern where a central LLM dynamically breaks down complex tasks, delegates to specialized worker LLMs, and synthesizes results. Use for open-ended problems where subtask number and nature are unpredictable. Ideal for complex projects (0.7+ complexity) requiring adaptive planning.
---

# Dynamic Task Orchestrator (Orchestrator-Workers Pattern)

## Overview

This skill implements the **Orchestrator-Workers** workflow pattern from Anthropic's "Building Effective Agents". The core principle is that a central orchestrator LLM **dynamically** breaks down tasks, delegates to worker LLMs, and synthesizes results - with the key distinction that **subtasks are not predetermined**.

**Reference**: https://www.anthropic.com/engineering/building-effective-agents

### Key Principle

> "Orchestrator-Workers: A central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results."

**Critical Distinction from Parallelization:**
> "The key difference from parallelization is its flexibility—subtasks aren't pre-defined, but determined by the orchestrator based on the specific input."

**Trade-off**: Complexity for adaptability in handling open-ended problems.

## When to Use This Skill

**Ideal scenarios:**
- **Open-ended problems** with unpredictable subtask requirements
- Complex projects where **number and nature of subtasks** depend on input
- Tasks requiring **adaptive decomposition** as work progresses
- **Multi-faceted projects** needing coordinated specialists

**Concrete examples:**
- "Build an e-commerce platform" → Unknown number of services until analyzed
- "Refactor this legacy codebase" → Discover issues during analysis
- "Create a data pipeline" → Requirements emerge from data inspection

**Do NOT use when:**
- Subtasks are **predetermined and fixed** → Use Sequential or Parallel
- Simple, well-defined tasks
- Low complexity (< 0.7) where overhead isn't justified

## Core Workflow: Dynamic Orchestration

### The Orchestration Loop

```
[Complex Task]
       ↓
[Orchestrator: Analyze & Plan]
       ↓
[Dynamic Decomposition] ─→ Subtask 1 → [Worker 1] → Result 1
       ↓                   Subtask 2 → [Worker 2] → Result 2
       ↓                   ...discovered as work progresses...
       ↓                   Subtask N → [Worker N] → Result N
       ↓
[Orchestrator: Synthesize Results]
       ↓
[Orchestrator: Assess Completion]
       ↓ (not complete)
[Orchestrator: Identify Next Subtasks] ← (loop back)
       ↓ (complete)
[Final Deliverable]
```

**Key Feature**: The orchestrator **discovers** subtasks as it goes, not all at once.

### Step 1: Initial Analysis

```markdown
## Orchestrator: Initial Analysis

### Task
[Complex task description]

### Initial Assessment
**Complexity**: [High - 0.7+]
**Type**: [open-ended / partially defined / evolving]
**Estimated Workers Needed**: [initial guess, will adapt]

### Known Requirements
1. [Requirement 1]
2. [Requirement 2]
3. ... (may discover more during execution)

### Unknown Factors
- [What needs investigation]
- [What will be discovered during work]

### Initial Subtask Identification
1. **Subtask A**: [Description] → Assign to [Worker type]
2. **Subtask B**: [Description] → Assign to [Worker type]
(More subtasks will emerge as we proceed)
```

### Step 2: Worker Delegation

```markdown
## Worker Assignment: [Subtask Name]

### Orchestrator → Worker Message
**Worker Type**: [Code Analyzer / Architect / Developer / Tester / Documenter / Optimizer]
**Task**: [Specific task for this worker]
**Context**: [What this worker needs to know]
**Expected Output**: [What to return]

### Worker → Orchestrator Report
**Status**: [Complete/Partial/Blocked]
**Results**: [What was accomplished]
**Discoveries**: [New information uncovered]
**New Subtasks Identified**: [Tasks discovered during this work]
```

> **Worker Details**: See [resources/worker-specifications.md](resources/worker-specifications.md)

### Step 3: Dynamic Replanning

After each worker completes:

```markdown
## Orchestrator: Replan

### Worker Results Integration
- Worker [X] completed [task]
- New information: [discoveries]
- New subtasks identified: [list]

### Updated Task List
1. [x] Subtask A - Complete
2. [x] Subtask B - Complete
3. [ ] Subtask C - **NEW** (discovered during A)
4. [ ] Subtask D - **NEW** (discovered during B)

### Next Actions
- **Immediate**: Assign Subtask C to [Worker type]
- **Following**: Subtask D depends on C, queue after
```

### Step 4: Result Synthesis

```markdown
## Orchestrator: Final Synthesis

### All Completed Subtasks
1. Subtask A by Code Analyzer → [result]
2. Subtask B by Architect → [result]
... (all N subtasks)

### Integration Points
- How Worker 1's output connects to Worker 2's
- Dependencies resolved

### Final Deliverable
[Synthesized output combining all worker results into cohesive whole]

### Execution Summary
- Total subtasks: N (started with estimate of M)
- Workers used: [list]
- Replanning cycles: [count]
```

## Specialized Workers

Six specialized workers handle different aspects of complex tasks:

| Worker | Purpose | Key Output |
|--------|---------|------------|
| **Code Analyzer** | Investigate existing code | Structure, dependencies, quality issues |
| **System Architect** | Design system structure | Components, APIs, data models |
| **Code Developer** | Implement features | Code, integrations |
| **Test Engineer** | Ensure quality | Tests, coverage, bugs found |
| **Documentation Writer** | Create docs | README, API docs |
| **Performance Optimizer** | Improve efficiency | Bottlenecks, optimizations |

> **Detailed Specifications**: See [resources/worker-specifications.md](resources/worker-specifications.md)

## Integration with Other Skills

### From Router
```
Router: Complex task detected (0.85 complexity)
→ Route to: dynamic-task-orchestrator
→ Context: Open-ended, needs adaptive planning
```

### With Sequential Processor
```
Orchestrator: "This subtask is sequential"
→ Delegate to: sequential-task-processor for Worker X
→ Return results to orchestrator
```

### With Parallel Executor
```
Orchestrator: "These subtasks are independent"
→ Delegate to: parallel-task-executor
→ Run Workers A, B, C simultaneously
→ Return merged results to orchestrator
```

### To Evaluator
```
Orchestrator: "All work complete"
→ Send to: iterative-quality-enhancer
→ Request: "Evaluate entire project quality"
```

## Best Practices

### 1. Embrace Adaptive Planning
The whole point is **dynamic decomposition**. Don't try to plan everything upfront - plan to replan.

### 2. Workers Report Discoveries
Every worker should report:
- What they accomplished
- What they discovered
- New subtasks needed

### 3. Maintain Coherent Context
Orchestrator must ensure all workers have necessary context:
- Shared decisions
- Common patterns
- Integration points

### 4. Checkpoint Progress
Save state after each worker completes for recovery and audit.

### 5. Know When to Stop
Recognize diminishing returns, scope creep, and "good enough".

### 6. Balance Workers
Don't over-specialize. One worker doing 80% defeats the purpose.

## Error Handling

Two main error scenarios:

1. **Worker Failure**: Retry → Reassign → Decompose → Escalate
2. **Scope Explosion**: Prioritize (MoSCoW) → Timebox → Communicate

> **Detailed Guide**: See [resources/error-handling-guide.md](resources/error-handling-guide.md)

## Performance Considerations

### Overhead
- Orchestration layer adds coordination cost
- Each worker delegation has context cost
- Replanning cycles take time

### When Worth It
- Complex, unpredictable problems
- High-stakes projects needing adaptability
- When discovery is part of the task

### When Too Much
- Simple, well-defined tasks
- Time-critical with no room for adaptation
- When subtasks are clearly predetermined

## Complete Example

> **E-Commerce Platform**: See [examples/ecommerce-orchestration.md](examples/ecommerce-orchestration.md)
>
> Shows full orchestration flow: 10 initial subtasks → 23 final (7 replanning cycles)

## Summary

The Dynamic Task Orchestrator implements Anthropic's Orchestrator-Workers pattern by:

1. **Dynamically analyzing** complex tasks without predetermined decomposition
2. **Delegating** to specialized workers based on emerging needs
3. **Synthesizing** worker results into coherent output
4. **Adaptively replanning** as new information emerges
5. **Coordinating** multiple specialists for complex work

**Remember**: The power is in **adaptability**. Unlike Sequential (fixed steps) or Parallel (predetermined splits), the Orchestrator **discovers** the work structure as it proceeds.

## Resources

- [Worker Specifications](resources/worker-specifications.md) - Detailed worker definitions
- [Error Handling Guide](resources/error-handling-guide.md) - Recovery strategies
- [E-Commerce Example](examples/ecommerce-orchestration.md) - Complete orchestration flow
- [SaaS Platform Example](references/saas_platform_example.md) - Additional reference
