# Worker Specifications

Specialized workers for the Dynamic Task Orchestrator pattern.

## Worker Interface

All workers follow a common interface:

```typescript
interface WorkerInput {
  task_id: string;
  task_type: string;
  context: Record<string, any>;
  expected_output: string[];
}

interface WorkerOutput {
  status: 'complete' | 'partial' | 'blocked' | 'failed';
  results: any;
  discoveries: string[];
  new_subtasks: SubtaskDefinition[];
  recommendations: string[];
}
```

---

## 1. Code Analyzer Worker

**Purpose**: Investigate and understand existing code

### Input
- Source code or codebase path
- Analysis type: structure, dependencies, quality, metrics

### Analysis Tasks
- Map dependencies and imports
- Identify architectural patterns
- Detect anti-patterns and tech debt
- Measure complexity metrics

### Output Template

```markdown
## Code Analysis Report

### Structure
[Directory layout and module organization]

### Dependencies
[External and internal dependency graph]

### Patterns Found
[Design patterns, architectural style]

### Quality Issues
[Anti-patterns, duplication, complexity hotspots]

### Recommendations
[Suggested improvements]

### Discovered Subtasks
- Refactor module X (high complexity)
- Update deprecated dependency Y
- Add missing tests for Z
```

---

## 2. System Architect Worker

**Purpose**: Design system structure and specifications

### Input
- Requirements and constraints
- Analysis reports from Code Analyzer

### Design Tasks
- Define component structure
- Create API contracts
- Design data models
- Document architecture decisions

### Output Template

```markdown
## Architecture Design

### System Components
[High-level component diagram]

### API Specification
[Endpoints, request/response formats]

### Data Models
[Entities, relationships, schemas]

### Technology Decisions
[Stack choices with rationale]

### Discovered Subtasks
- Implement authentication service
- Create database migrations
- Set up API gateway
```

---

## 3. Code Developer Worker

**Purpose**: Implement features and write code

### Input
- Architecture specs and requirements
- Design documents from Architect

### Implementation Tasks
- Write production code
- Implement business logic
- Create integrations
- Fix bugs

### Output Template

```markdown
## Implementation Complete

### Files Created/Modified
[List of changes]

### Key Implementation Details
[Important design choices made]

### Integration Points
[How this connects to other components]

### Discovered Subtasks
- Frontend needs error handling for API X
- Database needs index for query Y
- Need validation for input Z
```

---

## 4. Test Engineer Worker

**Purpose**: Ensure quality through testing

### Input
- Implementation and requirements
- Code from Developer Worker

### Testing Tasks
- Create unit tests
- Write integration tests
- Perform edge case testing
- Measure coverage

### Output Template

```markdown
## Test Report

### Tests Created
[List of test files]

### Coverage
[Coverage percentage and gaps]

### Issues Found
[Bugs or problems discovered]

### Discovered Subtasks
- Fix bug in authentication flow
- Add validation for edge case X
- Improve error messages for Y
```

---

## 5. Documentation Writer Worker

**Purpose**: Create clear documentation

### Input
- Code, architecture, and API specs
- All previous worker outputs

### Documentation Tasks
- Write README
- Create API docs
- Document setup process
- Add code comments

### Output Template

```markdown
## Documentation Complete

### Documents Created
[README.md, API.md, etc.]

### Coverage
[What's documented]

### Discovered Subtasks
- Need examples for complex API endpoint
- Missing deployment instructions
- Unclear error code documentation
```

---

## 6. Performance Optimizer Worker

**Purpose**: Improve performance and efficiency

### Input
- Code and performance requirements
- Profiling data (if available)

### Optimization Tasks
- Profile performance
- Identify bottlenecks
- Optimize algorithms
- Improve resource usage

### Output Template

```markdown
## Optimization Report

### Performance Analysis
[Profiling results]

### Bottlenecks Identified
[Slow operations, memory issues]

### Optimizations Applied
[Changes made]

### Discovered Subtasks
- Database queries need indexing
- Caching layer needed for API
- Memory leak in component X
```

---

## Worker Selection Guide

| Scenario | Primary Worker | Supporting Workers |
|----------|---------------|-------------------|
| New feature | Architect → Developer | Tester, Documenter |
| Bug fix | Code Analyzer → Developer | Tester |
| Refactoring | Code Analyzer → Developer | Tester, Optimizer |
| Performance issue | Optimizer | Developer |
| Legacy codebase | Code Analyzer | Architect, Developer |
| API development | Architect → Developer | Documenter, Tester |

## Worker Dependencies

```
[Code Analyzer] ──┐
                  ├──→ [System Architect] ──→ [Developer] ──→ [Tester]
[Requirements] ───┘                                              │
                                                                 ↓
                                                    [Documenter] ← [Optimizer]
```

**Rules**:
1. Code Analyzer/Requirements → Architect (필수)
2. Architect → Developer (필수)
3. Developer → Tester (필수)
4. Tester → Optimizer (선택)
5. All → Documenter (병렬 가능)
