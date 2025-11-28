# Error Handling Guide

Strategies for handling errors in the Orchestrator-Workers pattern.

## Worker Failure Handling

### Recovery Protocol

```markdown
## Orchestrator: Worker Failure Handling

**Scenario**: [Worker type] failed on [task description]

**Recovery Options**:
1. **Retry**: Same worker, same task (transient failure)
2. **Reassign**: Different worker approach (systematic issue)
3. **Decompose further**: Break task into smaller pieces
4. **Escalate**: Request human input

**Action Taken**: [Choice with rationale]
**Impact on Plan**: [How this affects timeline/other tasks]
```

### Failure Types and Responses

| Failure Type | Symptoms | Recovery Action |
|--------------|----------|-----------------|
| Transient | Timeout, network error | Retry (max 3 attempts) |
| Systematic | Same error repeatedly | Reassign or decompose |
| Blocking | Missing dependency | Resolve dependency first |
| Critical | Data corruption risk | Escalate immediately |

---

## Scope Explosion

When subtask count grows uncontrollably:

```markdown
## Orchestrator: Scope Control

**Issue**: Subtask count growing uncontrollably (was 10, now 50)

**Assessment**:
- Is growth justified? [Analysis]
- Core requirements still met? [Check]
- Timeline impact acceptable? [Evaluation]

**Actions**:
- Prioritize must-haves vs. nice-to-haves
- Defer non-critical subtasks
- Communicate scope change to user
```

### Scope Control Strategies

1. **MoSCoW Prioritization**:
   - Must have: Core functionality
   - Should have: Important but not critical
   - Could have: Nice to have
   - Won't have: Explicitly deferred

2. **Timeboxing**: Set hard limits on discovery phases

3. **Early Warning Signs**:
   - Each worker suggests 5+ new subtasks
   - Replanning cycles exceed 10
   - Timeline doubled from initial estimate

---

## State Recovery

### Checkpoint Protocol

Save state after each worker completes:
- Current task list (completed, in-progress, pending)
- Worker outputs and discoveries
- Integration decisions made
- Rollback points identified

### Recovery from Failure

```bash
# If orchestrator fails mid-execution:
1. Load last checkpoint
2. Verify completed work integrity
3. Identify failed subtask
4. Apply failure handling strategy
5. Resume from last known good state
```
