---
name: sequential-task-processor
description: Implements Anthropic's Prompt Chaining pattern for complex multi-step tasks. Decomposes requests into sequential steps where each LLM call processes the previous output, with validation gates between stages. Use for tasks requiring systematic breakdown like "Build a React app" or "Create a REST API".
---

# Sequential Task Processor (Prompt Chaining Pattern)

## Overview

This skill implements the **Prompt Chaining** workflow pattern from Anthropic's "Building Effective Agents". The core principle is to decompose complex tasks into a sequence of steps, where each step's output becomes the next step's input, with **programmatic validation gates** ensuring quality at each transition.

**Reference**: https://www.anthropic.com/engineering/building-effective-agents

### Key Principle

> "Prompt chaining decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one. You can add programmatic checks (see 'gate' in the diagram) on any intermediate steps."

**Trade-off**: Latency for higher accuracy by making each subtask simpler and more focused.

## When to Use This Skill

**Ideal scenarios:**
- Tasks that can be decomposed into **fixed, cleanly-separated subtasks**
- Scenarios where **accuracy is prioritized over speed**
- Complex implementations requiring **validation checkpoints**
- Multi-phase work (analysis → design → implementation → testing → documentation)

**Concrete examples:**
- "Build a React dashboard with authentication" → 5-step chain
- "Create a REST API for booking system" → 4-step chain
- "Refactor monolithic service to microservices" → 6-step chain
- "Generate marketing copy and translate it" → 3-step chain

**Do NOT use when:**
- Task is simple and doesn't need decomposition
- Real-time response is critical (latency-sensitive)
- Subtasks have no clear sequential dependency

## Core Workflow

### Step 1: Task Decomposition

When given a complex task, decompose it into **3-7 sequential steps**:

```
[User Request]
    ↓
[Step 1: Analysis] → [Gate 1: Requirements Complete?]
    ↓ (pass)
[Step 2: Design] → [Gate 2: Architecture Valid?]
    ↓ (pass)
[Step 3: Implementation] → [Gate 3: Code Compiles?]
    ↓ (pass)
[Step 4: Testing] → [Gate 4: Tests Pass?]
    ↓ (pass)
[Step 5: Documentation] → [Gate 5: Complete?]
    ↓ (pass)
[Final Output]
```

**Standard decomposition template:**

```markdown
## Task Decomposition: [Task Name]

### Step 1: Requirements Analysis
- **Input**: User request
- **Output**: Structured requirements document
- **Gate**: All requirements identified? Constraints clear?

### Step 2: Architecture Design
- **Input**: Requirements document
- **Output**: Technical architecture
- **Gate**: Design satisfies all requirements? Feasible?

### Step 3: Implementation
- **Input**: Architecture document
- **Output**: Working code
- **Gate**: Code compiles? Matches architecture?

### Step 4: Testing
- **Input**: Code implementation
- **Output**: Test results
- **Gate**: All tests pass? Coverage adequate?

### Step 5: Documentation
- **Input**: All previous outputs
- **Output**: Final documentation
- **Gate**: Documentation complete? Accurate?
```

### Step 2: Sequential Execution with Gates

Execute each step following this pattern:

#### A. Execute Current Step

```markdown
## Step [N]: [Step Name]

### Input from Previous Step
[Summarize the key outputs from Step N-1]

### Processing
[Perform the specific work for this step]

### Output Artifact
[Document the deliverable from this step]

### Validation Checklist
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

#### B. Validation Gate Check

After completing each step, perform a **gate check**:

```markdown
## Gate [N] Validation

**Step**: [Step Name]
**Status**: [PASS/FAIL/BLOCKED]

### Checks Performed
- [x] Required output present
- [x] Output quality sufficient
- [x] Consistency with previous steps
- [ ] Ready for next step

### Gate Decision
- **PASS**: Proceed to Step [N+1]
- **FAIL**: Retry Step [N] with feedback
- **BLOCKED**: Request user clarification
```

**Detailed gate patterns**: See [resources/gate-validation-patterns.md](resources/gate-validation-patterns.md) for:
- Gate-specific validation criteria
- Common failure patterns and resolutions
- Multi-tier and conditional gate strategies
- Recovery protocols and optimization metrics

### Step 3: Artifact Management

Maintain clear artifact trail:

```markdown
## Artifact Registry

### Task ID: [unique_identifier]

| Step | Artifact | Status | Validated |
|------|----------|--------|-----------|
| 1. Analysis | requirements.md | Complete | Yes |
| 2. Design | architecture.md | Complete | Yes |
| 3. Implementation | /src/* | Complete | Yes |
| 4. Testing | test_results.md | Complete | Yes |
| 5. Documentation | README.md | Complete | Yes |

### Validation Log
- Gate 1: PASS (2024-11-14 10:00)
- Gate 2: PASS (2024-11-14 10:30)
- Gate 3: FAIL → Retry → PASS (2024-11-14 11:15)
- Gate 4: PASS (2024-11-14 11:45)
- Gate 5: PASS (2024-11-14 12:00)
```

## Quick Example: React Dashboard

### User Request
"Build a React dashboard with user authentication and data visualization"

### Decomposition (5 steps)
1. Requirements Analysis → Gate 1: Requirements complete?
2. Architecture Design → Gate 2: Design valid?
3. Implementation → Gate 3: Code compiles?
4. Testing Strategy → Gate 4: Tests sufficient?
5. Documentation → Gate 5: Docs complete?

### Sample Output (Step 1)
```markdown
# Requirements: React Dashboard

## Functional Requirements
- FR-1: User registration and login
- FR-2: JWT-based authentication
- FR-3: Dashboard with charts (line, bar, pie)
- FR-4: Data fetching from REST API
- FR-5: Responsive design

## Success Criteria
- User can register, login, logout
- Dashboard displays real-time data
- Charts are interactive
- Works on mobile and desktop
```

**Gate 1**: PASS (all requirements captured) → Proceed to Step 2

### Final Summary
```markdown
**Task**: Build React Dashboard with Authentication
**Status**: SUCCESS
**Steps Completed**: 5/5
**Gates Passed**: 5/5
**Duration**: 52 minutes

### Deliverables
1. requirements.md - Requirements specification
2. architecture.md - System architecture
3. /src/* - Implementation code
4. test_plan.md - Testing strategy
5. README.md - Documentation
```

**Complete workflow example**: See [examples/complete-sequential-workflow.md](examples/complete-sequential-workflow.md) for:
- Full 5-step execution with all gates
- Complete architecture and implementation details
- Gate validation results and retry examples
- Lessons learned and optimization opportunities

## Integration with Other Skills

### From Router
When receiving from Intelligent Task Router:
```json
{
  "task_type": "feature_development",
  "complexity": "high",
  "recommended_skill": "sequential-task-processor",
  "task": "Build React dashboard..."
}
```
→ Accept and begin decomposition

### To Evaluator
After completion, send to Iterative Quality Enhancer:
```json
{
  "artifacts": ["requirements.md", "architecture.md", "src/", "test_plan.md", "README.md"],
  "validation_log": "5/5 gates passed",
  "request": "Evaluate quality and suggest improvements"
}
```

### With Orchestrator
When called as a worker by Dynamic Task Orchestrator:
- Report progress at each gate
- Return artifacts upon completion
- Accept dynamic step adjustments

### With Parallel Executor
For independent steps (e.g., testing frontend and backend):
- Parallel skill handles concurrent execution
- This skill maintains sequential dependencies

## Best Practices

### 1. Keep Steps Focused
Each step should have a **single, clear purpose**. If a step is doing too much, split it further.

### 2. Gates are Non-Negotiable
**Always** perform validation gates. They are the key differentiator of this pattern. Skip gates = skip quality.

### 3. Maintain Context Chain
Each step must reference the previous step's output explicitly. This maintains the "chain" in prompt chaining.

### 4. Fail Fast
If a gate fails multiple times, **escalate immediately**. Don't waste iterations on a fundamentally flawed approach.

### 5. Document Everything
The artifact trail is as important as the final output. It enables debugging, auditing, and learning.

## Error Handling

### Gate Failure Recovery

```markdown
1. **First Failure**: Retry with specific feedback
2. **Second Failure**: Attempt alternative approach
3. **Third Failure**: Pause and request user input
4. **Persistent Failure**: Escalate with full context
```

See [resources/gate-validation-patterns.md](resources/gate-validation-patterns.md) for detailed failure patterns, recovery strategies, and gate-specific validation criteria.

## Performance Considerations

### Latency vs. Accuracy Trade-off

This pattern **intentionally trades latency for accuracy**:
- More LLM calls = more time
- Each call is simpler = higher quality per step
- Gates catch errors early = less rework later

**Typical overhead**: 20-40% more time than monolithic approach
**Typical quality improvement**: 30-50% fewer errors in final output

### When to Optimize

1. **Merge adjacent simple steps** if they don't need gates
2. **Parallelize independent steps** using Parallel Task Executor
3. **Cache intermediate artifacts** for similar future tasks

## Summary

The Sequential Task Processor implements Anthropic's Prompt Chaining pattern by:

1. **Decomposing** complex tasks into manageable sequential steps
2. **Executing** each step with clear inputs and outputs
3. **Validating** through programmatic gates at each transition
4. **Maintaining** artifact trail for traceability
5. **Handling** failures gracefully with retries and escalation

This pattern excels when accuracy matters more than speed, and when tasks have natural sequential dependencies that benefit from validation checkpoints.

**Remember**: The power is in the **gates**. They transform a simple sequential execution into a quality-assured workflow.
