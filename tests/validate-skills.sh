#!/bin/bash

# Claude Code Skills Validation Script
# Validates skills against official standards and best practices

# Don't exit on error - we want to complete all validations
# set -e

SKILLS_DIR="${1:-../skills}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "============================================================"
echo "Claude Code Skills - Official Standards Validation"
echo "============================================================"
echo ""

# Agent Pattern Skills to validate
AGENT_SKILLS=(
  "intelligent-task-router"
  "sequential-task-processor"
  "parallel-task-executor"
  "dynamic-task-orchestrator"
  "iterative-quality-enhancer"
  "agent-workflow-advisor"
  "agent-workflow-orchestrator"
)

TOTAL_SCORE=0
MAX_SCORE=0
CRITICAL_ISSUES=()
WARNINGS=()

validate_skill() {
  local skill_name=$1
  local skill_path="$SKILLS_DIR/$skill_name"
  local skill_file="$skill_path/SKILL.md"
  local score=0
  local max=100
  local issues=""

  echo -e "${BLUE}Validating: $skill_name${NC}"

  # Check if skill exists
  if [[ ! -d "$skill_path" ]]; then
    echo -e "  ${RED}✗ CRITICAL: Skill directory not found${NC}"
    CRITICAL_ISSUES+=("$skill_name: Directory not found")
    return
  fi

  # Check for SKILL.md (required)
  if [[ ! -f "$skill_file" ]]; then
    echo -e "  ${RED}✗ CRITICAL: SKILL.md file missing${NC}"
    CRITICAL_ISSUES+=("$skill_name: SKILL.md missing")
    return
  fi
  score=$((score + 10))

  # Extract frontmatter
  local frontmatter=$(sed -n '/^---$/,/^---$/p' "$skill_file" | sed '1d;$d')

  # Validate name field (required)
  local name=$(echo "$frontmatter" | grep "^name:" | sed 's/^name:[[:space:]]*//' | tr -d '\r')
  if [[ -z "$name" ]]; then
    echo -e "  ${RED}✗ CRITICAL: name field missing in frontmatter${NC}"
    CRITICAL_ISSUES+=("$skill_name: name field missing")
  else
    score=$((score + 10))

    # Check name format (lowercase, numbers, hyphens only)
    if [[ ! "$name" =~ ^[a-z0-9-]+$ ]]; then
      echo -e "  ${RED}✗ MAJOR: name contains invalid characters (must be lowercase, numbers, hyphens)${NC}"
      issues="$issues\n  - Invalid name format"
    else
      score=$((score + 5))
    fi

    # Check name length (max 64)
    if [[ ${#name} -gt 64 ]]; then
      echo -e "  ${YELLOW}⚠ MAJOR: name exceeds 64 characters${NC}"
      issues="$issues\n  - Name too long"
    else
      score=$((score + 5))
    fi

    # Check name matches directory
    if [[ "$name" == "$skill_name" ]]; then
      score=$((score + 5))
    else
      echo -e "  ${YELLOW}⚠ WARNING: name '$name' differs from directory '$skill_name'${NC}"
      WARNINGS+=("$skill_name: name differs from directory")
    fi
  fi

  # Validate description field (required)
  local desc=$(echo "$frontmatter" | grep "^description:" | sed 's/^description:[[:space:]]*//' | tr -d '\r')
  if [[ -z "$desc" ]]; then
    echo -e "  ${RED}✗ CRITICAL: description field missing in frontmatter${NC}"
    CRITICAL_ISSUES+=("$skill_name: description field missing")
  else
    score=$((score + 10))

    # Check description length (max 1024)
    if [[ ${#desc} -gt 1024 ]]; then
      echo -e "  ${YELLOW}⚠ MAJOR: description exceeds 1024 characters${NC}"
      issues="$issues\n  - Description too long"
    else
      score=$((score + 5))
    fi

    # Check for specific triggers
    if echo "$desc" | grep -qi "use when\|use for\|use this\|use as"; then
      score=$((score + 5))
    else
      echo -e "  ${YELLOW}⚠ WARNING: description lacks usage triggers${NC}"
      WARNINGS+=("$skill_name: Add 'Use when...' to description")
    fi

    # Check for action verbs
    if echo "$desc" | grep -qi "implement\|create\|build\|analyze\|optimize\|fix\|validate\|route\|execute\|evaluate"; then
      score=$((score + 5))
    else
      echo -e "  ${YELLOW}⚠ WARNING: description lacks action verbs${NC}"
      WARNINGS+=("$skill_name: Add action verbs to description")
    fi

    # Check for vague language (bad)
    if echo "$desc" | grep -qi "helps with\|assists\|useful for"; then
      echo -e "  ${YELLOW}⚠ WARNING: description uses vague language${NC}"
      WARNINGS+=("$skill_name: Avoid vague terms like 'helps with'")
    else
      score=$((score + 5))
    fi
  fi

  # Validate markdown content
  local content=$(sed -n '/^---$/,/^---$/!p' "$skill_file" | tail -n +2)

  # Check for Overview section
  if echo "$content" | grep -qi "^#.*overview\|^#.*introduction"; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ MINOR: No Overview section found${NC}"
    WARNINGS+=("$skill_name: Add Overview section")
  fi

  # Check for When to Use section
  if echo "$content" | grep -qi "^#.*when to use\|^#.*usage"; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ MINOR: No 'When to Use' section found${NC}"
    WARNINGS+=("$skill_name: Add 'When to Use' section")
  fi

  # Check for Examples
  if echo "$content" | grep -qi "^#.*example"; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ MINOR: No Examples section found${NC}"
    WARNINGS+=("$skill_name: Add Examples section")
  fi

  # Check for code blocks
  local code_blocks=$(grep -c '```' "$skill_file" || echo 0)
  if [[ $code_blocks -ge 2 ]]; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ WARNING: Few or no code examples${NC}"
    WARNINGS+=("$skill_name: Add code examples")
  fi

  # Check for trade-offs documentation
  if echo "$content" | grep -qi "trade-off\|trade off\|cost\|limitation"; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ WARNING: No trade-off analysis${NC}"
    WARNINGS+=("$skill_name: Document trade-offs")
  fi

  # Check for do NOT use cases
  if echo "$content" | grep -qi "do not use\|don't use\|avoid\|not suitable"; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ WARNING: No negative use cases${NC}"
    WARNINGS+=("$skill_name: Add 'when NOT to use' guidance")
  fi

  # Check for reference to official docs
  if echo "$content" | grep -qi "anthropic\|reference\|https://"; then
    score=$((score + 5))
  else
    echo -e "  ${YELLOW}⚠ WARNING: No reference to source docs${NC}"
    WARNINGS+=("$skill_name: Cite reference sources")
  fi

  # Calculate percentage
  local percent=$((score * 100 / max))

  if [[ $percent -ge 80 ]]; then
    echo -e "  ${GREEN}✓ SCORE: $score/$max ($percent%)${NC}"
  elif [[ $percent -ge 60 ]]; then
    echo -e "  ${YELLOW}⚠ SCORE: $score/$max ($percent%)${NC}"
  else
    echo -e "  ${RED}✗ SCORE: $score/$max ($percent%)${NC}"
  fi

  TOTAL_SCORE=$((TOTAL_SCORE + score))
  MAX_SCORE=$((MAX_SCORE + max))
  echo ""
}

# Contract validation (check if skill documentation supports expected outputs)
validate_contracts() {
  echo "============================================================"
  echo "Input/Output Contract Validation"
  echo "============================================================"
  echo ""

  local passed=0
  local total=0

  # Router contracts
  echo -e "${BLUE}intelligent-task-router:${NC}"
  if grep -q "primary_category\|category" "$SKILLS_DIR/intelligent-task-router/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has category classification${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing category classification${NC}"
  fi
  ((total++))

  if grep -q "complexity" "$SKILLS_DIR/intelligent-task-router/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has complexity scoring${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing complexity scoring${NC}"
  fi
  ((total++))

  if grep -qi "haiku\|sonnet\|opus" "$SKILLS_DIR/intelligent-task-router/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has model recommendation${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing model recommendation${NC}"
  fi
  ((total++))
  echo ""

  # Sequential contracts
  echo -e "${BLUE}sequential-task-processor:${NC}"
  if grep -qi "gate\|validation" "$SKILLS_DIR/sequential-task-processor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has gate validation${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing gate validation${NC}"
  fi
  ((total++))

  if grep -qi "step.*pass\|step.*fail" "$SKILLS_DIR/sequential-task-processor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has step completion tracking${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing step completion tracking${NC}"
  fi
  ((total++))
  echo ""

  # Parallel contracts
  echo -e "${BLUE}parallel-task-executor:${NC}"
  if grep -qi "sectioning" "$SKILLS_DIR/parallel-task-executor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has sectioning mode${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing sectioning mode${NC}"
  fi
  ((total++))

  if grep -qi "voting" "$SKILLS_DIR/parallel-task-executor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has voting mode${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing voting mode${NC}"
  fi
  ((total++))

  if grep -qi "merge\|aggregate" "$SKILLS_DIR/parallel-task-executor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has merge strategy${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing merge strategy${NC}"
  fi
  ((total++))
  echo ""

  # Orchestrator contracts
  echo -e "${BLUE}dynamic-task-orchestrator:${NC}"
  if grep -qi "discover" "$SKILLS_DIR/dynamic-task-orchestrator/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has dynamic discovery${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing dynamic discovery${NC}"
  fi
  ((total++))

  if grep -qi "worker" "$SKILLS_DIR/dynamic-task-orchestrator/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has worker coordination${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing worker coordination${NC}"
  fi
  ((total++))

  if grep -qi "replan\|cycle" "$SKILLS_DIR/dynamic-task-orchestrator/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has replanning cycles${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing replanning cycles${NC}"
  fi
  ((total++))
  echo ""

  # Evaluator contracts
  echo -e "${BLUE}iterative-quality-enhancer:${NC}"
  if grep -qi "dimension\|criteria" "$SKILLS_DIR/iterative-quality-enhancer/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has evaluation dimensions${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing evaluation dimensions${NC}"
  fi
  ((total++))

  if grep -qi "threshold\|target" "$SKILLS_DIR/iterative-quality-enhancer/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has quality threshold${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing quality threshold${NC}"
  fi
  ((total++))

  if grep -qi "iteration\|loop" "$SKILLS_DIR/iterative-quality-enhancer/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has iteration loop${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing iteration loop${NC}"
  fi
  ((total++))
  echo ""

  # Advisor contracts
  echo -e "${BLUE}agent-workflow-advisor:${NC}"
  if grep -qi "no pattern\|trivial" "$SKILLS_DIR/agent-workflow-advisor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has 'no pattern' option${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing 'no pattern' option${NC}"
  fi
  ((total++))

  if grep -qi "recommend\|confidence" "$SKILLS_DIR/agent-workflow-advisor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has recommendation with confidence${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing recommendation confidence${NC}"
  fi
  ((total++))

  if grep -qi "alternative\|trade-off" "$SKILLS_DIR/agent-workflow-advisor/SKILL.md" 2>/dev/null; then
    echo -e "  ${GREEN}✓ Has alternative patterns${NC}"; ((passed++))
  else
    echo -e "  ${RED}✗ Missing alternative patterns${NC}"
  fi
  ((total++))
  echo ""

  local percent=$((passed * 100 / total))
  echo -e "${BLUE}Contract Compliance: $passed/$total ($percent%)${NC}"
  echo ""

  CONTRACT_PASSED=$passed
  CONTRACT_TOTAL=$total
}

# Run validation
echo "Phase 1: Structure & Standards Validation"
echo "------------------------------------------------------------"
for skill in "${AGENT_SKILLS[@]}"; do
  validate_skill "$skill"
done

# Run contract validation
validate_contracts

# Final report
echo "============================================================"
echo "FINAL COMPLIANCE REPORT"
echo "============================================================"
echo ""

STRUCTURE_PERCENT=$((TOTAL_SCORE * 100 / MAX_SCORE))
CONTRACT_PERCENT=$((CONTRACT_PASSED * 100 / CONTRACT_TOTAL))
OVERALL_PERCENT=$(((STRUCTURE_PERCENT + CONTRACT_PERCENT) / 2))

echo -e "📊 Structure Compliance: $TOTAL_SCORE/$MAX_SCORE (${STRUCTURE_PERCENT}%)"
echo -e "📊 Contract Compliance: $CONTRACT_PASSED/$CONTRACT_TOTAL (${CONTRACT_PERCENT}%)"
echo ""
echo -e "🎯 ${GREEN}OVERALL COMPLIANCE: ${OVERALL_PERCENT}%${NC}"
echo ""

# Critical issues summary
if [[ ${#CRITICAL_ISSUES[@]} -gt 0 ]]; then
  echo -e "${RED}🚨 CRITICAL ISSUES:${NC}"
  for issue in "${CRITICAL_ISSUES[@]}"; do
    echo "   - $issue"
  done
  echo ""
fi

# Top warnings
if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  echo -e "${YELLOW}📝 TOP RECOMMENDATIONS:${NC}"
  # Get unique warnings (first 5)
  printf '%s\n' "${WARNINGS[@]}" | sort -u | head -5 | while read -r warning; do
    echo "   - $warning"
  done
  echo ""
fi

# Compliance status
if [[ $OVERALL_PERCENT -ge 90 ]]; then
  echo -e "${GREEN}✅ EXCELLENT: Skills meet or exceed official standards${NC}"
elif [[ $OVERALL_PERCENT -ge 75 ]]; then
  echo -e "${GREEN}✅ GOOD: Skills comply with most official standards${NC}"
elif [[ $OVERALL_PERCENT -ge 60 ]]; then
  echo -e "${YELLOW}⚠️ FAIR: Skills partially comply, improvements needed${NC}"
else
  echo -e "${RED}❌ POOR: Significant compliance issues found${NC}"
fi

echo ""
echo "============================================================"
