---
name: agent-workflow-advisor
description: Analyzes tasks and recommends the optimal agent pattern from Anthropic's Building Effective Agents. Provides pattern selection guidance based on task complexity, structure, and requirements. Use this as the entry point when unsure which pattern (Sequential, Router, Parallel, Orchestrator, Evaluator) fits your task best.
---

<!--
⚠️ COMPLEXITY LOGIC GUARD
이 복잡도 사용은 router와 철학이 다릅니다.
- Advisor: 구조 우선, 복잡도는 보조 (< 0.3 = No Pattern 가능)
- Router: 복잡도 → 모델 선택 (0.4, 0.7 임계값)
통합하려면 먼저 docs/complexity-logic-philosophy.md를 검토하세요.
임계값 변경 시 tests/complexity-pinning.test.js 테스트 업데이트 필수.
-->

# Agent Workflow Advisor

## Overview

This skill serves as the **entry point** for the 5 agent pattern skills, helping you select the optimal workflow pattern for your task. It analyzes your request and provides a **recommendation with reasoning**, but you make the final decision.

**Reference**: https://www.anthropic.com/engineering/building-effective-agents

### Purpose

> "When building agents, you should start with the simplest solution possible, adding complexity only when needed."

This advisor helps you:
1. **Understand** your task's characteristics
2. **Match** to the best-fit pattern
3. **Decide** with confidence which skill to use

**This skill does NOT execute tasks** - it recommends the right tool for the job.

## When to Use This Skill

Use this advisor when:
- **Uncertain** which pattern fits your task
- **Starting** a complex project
- **Learning** the agent pattern system
- **Want validation** of your pattern choice

## Quick Pattern Reference

| Pattern | Best For | Key Characteristic |
|---------|----------|-------------------|
| **No Pattern** | Simple, single-step tasks | Direct execution, no overhead |
| **Sequential** (Prompt Chaining) | Fixed multi-step tasks | Validation gates between steps |
| **Router** (Routing) | Task classification & delegation | Categorize → Route to specialist |
| **Parallel** (Parallelization) | Independent work or voting | Concurrent execution, merge results |
| **Orchestrator** (Orchestrator-Workers) | Open-ended complex projects | Dynamic subtask discovery |
| **Evaluator** (Evaluator-Optimizer) | Quality improvement | Feedback loop until threshold met |

## Critical First Question: Do You Even Need a Pattern?

**Before recommending any pattern, I ask:**

> "Is this task simple enough that a pattern would add overhead without benefit?"

### When NO PATTERN is Best

**Complexity < 0.3** AND any of:
- Single file change
- One clear action (fix this bug, add this field)
- Less than 10 minutes of work
- No validation checkpoints needed
- No parallel opportunities

**Examples of "No Pattern" tasks:**
- "Fix null pointer in UserService line 45"
- "Add email field to User model"
- "Update README with new installation step"
- "Rename variable from 'temp' to 'userCount'"

**My response for simple tasks:**
```markdown
## Recommendation: No Pattern Needed

This task is straightforward enough to execute directly.

**Why no pattern:**
- Single action required
- No validation gates needed
- Complexity: 0.2 (Low)
- Estimated time: < 10 minutes

**Just do it:**
[Direct instructions for the task]

**If this turns out to be more complex:**
Come back and we'll reassess with more information.
```

**Philosophy**: Patterns are tools, not requirements. Simple tasks done simply.

## Analysis Framework

When you describe your task, I analyze it across 5 dimensions:

### 1. Task Structure
- **Fixed steps** → Sequential
- **Multiple categories** → Router
- **Independent parts** → Parallel
- **Unknown scope** → Orchestrator
- **Quality focus** → Evaluator

### 2. Complexity Score (0.0 - 1.0)
- **< 0.3** (Low): Simple, single-step task → Maybe no pattern needed
- **0.3 - 0.5** (Medium-Low): Clear steps → Sequential or Router
- **0.5 - 0.7** (Medium): Multiple components → Parallel or Sequential
- **0.7 - 0.9** (High): Complex, multi-faceted → Orchestrator
- **> 0.9** (Very High): System-level changes → Orchestrator + Evaluator

### 3. Predictability
- **Predictable subtasks** → Sequential or Parallel
- **Unpredictable subtasks** → Orchestrator
- **Known categories** → Router
- **Clear quality metrics** → Evaluator

### 4. Dependencies
- **Sequential dependencies** → Sequential
- **No dependencies** → Parallel
- **Dynamic dependencies** → Orchestrator

### 5. Success Criteria
- **Step completion** → Sequential
- **Correct routing** → Router
- **Speed/consensus** → Parallel
- **Adaptive delivery** → Orchestrator
- **Quality threshold** → Evaluator

## How to Use This Skill

### Step 1: Describe Your Task

Provide:
- What you want to accomplish
- Any known constraints
- Quality requirements
- Time/resource constraints

**Example**: "I want to build a user authentication system with login, registration, password reset, and OAuth integration."

### Step 2: Receive Analysis

I'll provide:

```markdown
## Task Analysis

### Task Summary
[Your task restated for clarity]

### Characteristics Detected
- Structure: [Fixed/Variable/Unknown]
- Complexity: [Score with reasoning]
- Subtasks: [Predictable/Dynamic]
- Dependencies: [Sequential/Independent/Mixed]

### Pattern Recommendation

**Primary Recommendation**: [Pattern Name]

**Reasoning**:
1. [Why this pattern fits]
2. [Key characteristics match]
3. [Trade-offs considered]

**Alternative Patterns**:
- [Pattern B]: Use if [condition]
- [Pattern C]: Use if [different condition]

### Execution Guidance

If you choose [Recommended Pattern]:
1. First step: [What to do first]
2. Key considerations: [What to watch for]
3. Expected outcome: [What success looks like]

### Questions to Consider
- [Question that might change recommendation]
- [Clarification that could help]
```

### Step 3: Make Your Decision

You decide:
- Accept the recommendation
- Choose an alternative
- Ask for more analysis
- Proceed without a pattern (for simple tasks)

## Pattern Selection Decision Tree

```
Is the task simple enough to do in one shot? (Complexity < 0.3?)
├─ Yes → NO PATTERN - just do it directly
└─ No → Continue analysis
         │
         Is the task about categorizing/routing different inputs?
         ├─ Yes → ROUTER pattern
         └─ No → Continue
                  │
                  Are all subtasks known upfront?
                  ├─ Yes → Do subtasks have dependencies?
                  │         ├─ Yes (must do A before B) → SEQUENTIAL pattern
                  │         │
                  │         └─ No (A and B are independent)
                  │                  │
                  │                  Want to compare approaches or split work?
                  │                  ├─ Compare → PARALLEL (Voting mode)
                  │                  └─ Split → PARALLEL (Sectioning mode)
                  │
                  └─ No (subtasks emerge during work)
                           │
                           Is it about improving existing output?
                           ├─ Yes → EVALUATOR pattern
                           └─ No → ORCHESTRATOR pattern
                                    │
                                    Need quality validation after?
                                    ├─ Yes → Add EVALUATOR at end
                                    └─ No → Orchestrator alone
```

## Additional Resources

For deeper understanding of pattern selection:

### Critical Decision Points
See [resources/disambiguation-guide.md](resources/disambiguation-guide.md) for:
- Sequential vs Parallel: The Dependency Test
- Parallel(Voting) vs Evaluator: Compare or Improve?
- Sequential vs Orchestrator: Known vs Discovered
- Complexity Score: Guide, Not Gospel
- Pattern Combinations

### Advanced Scenarios
See [resources/advanced-scenarios.md](resources/advanced-scenarios.md) for:
- Mixed Dependencies: Phased Execution
- Partial Knowledge: Discovery Likelihood
- External Changes vs Internal Discovery
- Unclear Quality Criteria: Prerequisite Questions
- User Override: When You Disagree

### Complete Examples
See [examples/complete-analysis-example.md](examples/complete-analysis-example.md) for:
- Full analysis of microservices migration
- Common scenario recommendations (Bug Fix, New Feature, Performance, Code Review, Documentation, Multi-Component Build)

## Limitations

This advisor:
- **Cannot execute tasks** - only recommends
- **Based on analysis** - may miss nuances you know
- **Pattern-focused** - sometimes no pattern is best
- **General guidance** - your specific context matters

## When NOT to Follow Recommendations

Override the recommendation when:
1. **You have domain expertise** that changes the analysis
2. **Specific constraints** not captured in the description
3. **Learning purposes** - want to try a specific pattern
4. **Simple task** - overhead of pattern exceeds benefit
5. **Previous experience** - know what works for your project

## Next Steps After Receiving Recommendation

1. **Accept**: Activate the recommended skill
2. **Modify**: Use alternative pattern suggested
3. **Clarify**: Ask follow-up questions
4. **Skip**: Proceed without formal pattern (simple tasks)
5. **Combine**: Use multiple patterns in sequence (advanced)

---

## Summary

The Agent Workflow Advisor helps you:
1. **Analyze** your task's characteristics
2. **Match** to optimal agent pattern
3. **Understand** the trade-offs
4. **Decide** with confidence

**Remember**: This is guidance, not a mandate. You always have the final say in which approach to use. The goal is to help you make an informed decision, not to automate the choice away.

**Start simple, add complexity only when needed.**
