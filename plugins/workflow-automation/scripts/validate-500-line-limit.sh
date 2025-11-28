#!/usr/bin/env bash
# validate-500-line-limit.sh
# Validates that all SKILL.md files comply with Anthropic's 500-line limit
# Reference: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$PLUGIN_ROOT/skills"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

LINE_LIMIT=500
VIOLATIONS=0
WARNINGS=0
PASSED=0

echo "=========================================="
echo "  500-Line Limit Validator"
echo "  Plugin: workflow-automation"
echo "=========================================="
echo ""

# Check if skills directory exists
if [[ ! -d "$SKILLS_DIR" ]]; then
    echo -e "${RED}ERROR: Skills directory not found: $SKILLS_DIR${NC}"
    exit 1
fi

# Find all SKILL.md files
SKILL_FILES=$(find "$SKILLS_DIR" -name "SKILL.md" -type f | sort)

if [[ -z "$SKILL_FILES" ]]; then
    echo -e "${YELLOW}WARNING: No SKILL.md files found in $SKILLS_DIR${NC}"
    exit 0
fi

echo "Checking SKILL.md files in: $SKILLS_DIR"
echo ""

# Deprecated skills (excluded from validation)
DEPRECATED_SKILLS="agent-workflow-orchestrator"

# Check each file
while IFS= read -r skill_file; do
    # Get relative path
    rel_path="${skill_file#$PLUGIN_ROOT/}"

    # Check if deprecated
    is_deprecated=false
    for dep in $DEPRECATED_SKILLS; do
        if [[ "$skill_file" == *"$dep"* ]]; then
            is_deprecated=true
            break
        fi
    done

    # Count lines (excluding empty lines at end)
    line_count=$(wc -l < "$skill_file" | tr -d ' ')

    # Skip deprecated with notice
    if $is_deprecated; then
        echo -e "${YELLOW}⏭ SKIP${NC}     $rel_path"
        echo "  Lines: $line_count (DEPRECATED - excluded from validation)"
        echo ""
        continue
    fi

    # Calculate percentage
    percentage=$((line_count * 100 / LINE_LIMIT))
    overage=$((line_count - LINE_LIMIT))
    overage_pct=$(( (line_count - LINE_LIMIT) * 100 / LINE_LIMIT ))

    # Status check
    if [[ $line_count -gt $LINE_LIMIT ]]; then
        echo -e "${RED}✗ VIOLATION${NC} $rel_path"
        echo "  Lines: $line_count / $LINE_LIMIT (${overage_pct}% over, +$overage lines)"
        ((VIOLATIONS++))
    elif [[ $line_count -gt $((LINE_LIMIT * 90 / 100)) ]]; then
        echo -e "${YELLOW}⚠ WARNING${NC}  $rel_path"
        echo "  Lines: $line_count / $LINE_LIMIT (${percentage}% of limit, buffer: $((LINE_LIMIT - line_count)) lines)"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ PASS${NC}     $rel_path"
        echo "  Lines: $line_count / $LINE_LIMIT (${percentage}% of limit)"
        ((PASSED++))
    fi
    echo ""
done <<< "$SKILL_FILES"

# Summary
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo -e "  ${GREEN}Passed:${NC}     $PASSED"
echo -e "  ${YELLOW}Warnings:${NC}   $WARNINGS (>90% of limit)"
echo -e "  ${RED}Violations:${NC} $VIOLATIONS (over limit)"
echo ""

# Exit code
if [[ $VIOLATIONS -gt 0 ]]; then
    echo -e "${RED}FAILED: $VIOLATIONS file(s) exceed 500-line limit${NC}"
    echo ""
    echo "📚 Recommendation: Use Progressive Disclosure pattern"
    echo "   - Keep SKILL.md under 500 lines (core concepts only)"
    echo "   - Move details to resources/ directory"
    echo "   - Move examples to examples/ directory"
    echo ""
    echo "See: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
    exit 1
elif [[ $WARNINGS -gt 0 ]]; then
    echo -e "${YELLOW}WARNING: $WARNINGS file(s) approaching limit${NC}"
    echo "Consider refactoring before they exceed 500 lines"
    exit 0
else
    echo -e "${GREEN}SUCCESS: All skills comply with 500-line limit${NC}"
    exit 0
fi
