# Gate Validation Patterns

This document provides detailed patterns and strategies for implementing validation gates in Sequential Task Processing.

## Core Gate Structure

Every validation gate follows this structure:

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
- **FAIL**: Retry Step [N] with feedback: [specific issues]
- **BLOCKED**: Request user clarification: [questions]
```

## Gate Status Types

### PASS
- All validation criteria met
- Output quality sufficient for next step
- Proceed immediately to next step

### FAIL
- One or more criteria not met
- Specific issues identified
- Retry current step with corrective feedback (max 3 retries)

### BLOCKED
- Missing information from user
- Ambiguous requirements
- External dependency unavailable
- Pause workflow and request clarification

## Gate Failure Recovery Protocol

```markdown
## Recovery Protocol

1. **First Failure**: Retry with specific feedback
2. **Second Failure**: Attempt alternative approach
3. **Third Failure**: Pause and request user input
4. **Persistent Failure**: Escalate with full context
```

### Example: Gate 3 Failure Recovery

```markdown
## Gate 3 Failure: Implementation

**Failure Reason**: TypeScript compilation errors (3 issues)

**Corrective Action**:
1. Fix type mismatch in useAuth hook (User vs UserDTO)
2. Add missing return type to login function
3. Correct import path for authService

**Retry Attempt**: 1/3

---

## Gate 3 Retry: Implementation

**Changes Applied**:
- Updated User interface to match backend contract
- Added explicit Promise<void> return type
- Corrected import from '../services/authService'

**Validation Result**: PASS
**Proceed to Step 4**
```

## Common Failure Patterns

| Issue | Detection | Resolution |
|-------|-----------|------------|
| Incomplete requirements | Gate 1 fails completeness check | Re-analyze with clarifying questions |
| Architecture mismatch | Gate 2 fails consistency check | Revise design to match requirements |
| Implementation errors | Gate 3 fails compile/lint | Fix errors based on feedback |
| Test failures | Gate 4 reports failures | Debug and fix implementation |
| Missing documentation | Gate 5 fails completeness | Add missing sections |

## Gate-Specific Validation Criteria

### Gate 1: Requirements Analysis
**Criteria:**
- [ ] All functional requirements identified
- [ ] Non-functional requirements specified
- [ ] Technical constraints documented
- [ ] Success criteria measurable
- [ ] Stakeholder concerns addressed

**Common Failures:**
- Vague requirements ("should be fast" instead of "< 3s load time")
- Missing edge cases
- Unstated assumptions
- Conflicting requirements

### Gate 2: Architecture Design
**Criteria:**
- [ ] Design satisfies all requirements
- [ ] Component boundaries clear
- [ ] Data flow documented
- [ ] Technology choices justified
- [ ] Scalability considered

**Common Failures:**
- Over-engineering (premature optimization)
- Under-engineering (ignoring known constraints)
- Missing error handling strategy
- Unclear service boundaries

### Gate 3: Implementation
**Criteria:**
- [ ] Code compiles/runs without errors
- [ ] Follows architecture design
- [ ] Adheres to coding standards
- [ ] Error handling implemented
- [ ] Core functionality complete

**Common Failures:**
- Type errors (TypeScript/Python)
- Import/dependency issues
- Incomplete error handling
- Divergence from architecture

### Gate 4: Testing
**Criteria:**
- [ ] Test strategy covers critical paths
- [ ] Unit tests for business logic
- [ ] Integration tests for workflows
- [ ] Coverage target realistic
- [ ] Tests are maintainable

**Common Failures:**
- Insufficient coverage
- Flaky tests
- Missing edge case tests
- Over-reliance on mocks

### Gate 5: Documentation
**Criteria:**
- [ ] Setup instructions complete
- [ ] Usage examples provided
- [ ] Architecture documented
- [ ] API/interface documented
- [ ] Deployment guide included

**Common Failures:**
- Missing prerequisites
- Outdated examples
- Incomplete API docs
- No troubleshooting guide

## Advanced Gate Patterns

### Conditional Gates
Some gates may be conditional based on task type:

```markdown
## Gate 2: Architecture Design

**Standard Checks**: [as above]

**Additional Checks (if task_type == "security_critical")**:
- [ ] Threat model documented
- [ ] Security controls identified
- [ ] Compliance requirements addressed

**Additional Checks (if task_type == "performance_critical")**:
- [ ] Performance targets specified
- [ ] Bottleneck analysis completed
- [ ] Load testing strategy defined
```

### Multi-Tier Gates
For complex steps, implement multi-tier validation:

```markdown
## Gate 3: Implementation (Multi-Tier)

### Tier 1: Syntax Validation (automated)
- [ ] Code compiles
- [ ] Linting passes
- [ ] Type checking passes

### Tier 2: Semantic Validation (manual)
- [ ] Logic correctness
- [ ] Architecture adherence
- [ ] Best practices followed

### Tier 3: Quality Validation (automated + manual)
- [ ] Unit tests pass
- [ ] Code coverage > 80%
- [ ] No critical security issues
```

### Parallel Gate Validation
When multiple artifacts are produced in a step:

```markdown
## Gate 3: Parallel Implementation

### Backend Gate
- [x] API endpoints implemented
- [x] Database schema deployed
- [x] Integration tests pass

### Frontend Gate
- [x] UI components implemented
- [x] State management working
- [x] Component tests pass

### Integration Gate (requires both above to PASS)
- [ ] Frontend can call backend
- [ ] Authentication flow works
- [ ] End-to-end test passes

**Combined Status**: BLOCKED (waiting on integration environment)
```

## Gate Metrics and Optimization

### Typical Gate Pass Rates
- **Gate 1 (Requirements)**: 85-95% first-pass rate
- **Gate 2 (Architecture)**: 70-85% first-pass rate
- **Gate 3 (Implementation)**: 60-75% first-pass rate
- **Gate 4 (Testing)**: 80-90% first-pass rate
- **Gate 5 (Documentation)**: 90-95% first-pass rate

### When to Optimize Gates

If a gate has persistent low pass rate (<50%):
1. **Simplify the step**: Break into smaller substeps
2. **Improve previous gate**: Better validation earlier
3. **Add examples**: Provide reference artifacts
4. **Refine criteria**: Criteria may be too strict or unclear

### Gate Performance Impact

- **Time overhead per gate**: 30-90 seconds
- **Total overhead for 5-step chain**: 2-8 minutes
- **Quality improvement**: 30-50% fewer issues in final output
- **Rework reduction**: 40-60% fewer major revisions

## Summary

Effective gate validation requires:
1. **Clear criteria** for each gate
2. **Specific feedback** on failures
3. **Systematic retry** protocols
4. **Escalation paths** for persistent issues
5. **Continuous optimization** based on metrics

The gates are the critical differentiator of Sequential Task Processing - they transform simple chaining into quality-assured workflows.
