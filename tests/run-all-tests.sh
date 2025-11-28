#!/bin/bash
#
# CC-Skills Full Test Suite Runner
#
# Runs all tests across three layers:
# 1. Root integration tests
# 2. Hooks plugin tests (skill recommendation)
# 3. Workflow-automation plugin tests (complexity pinning)
#
# Usage:
#   bash tests/run-all-tests.sh [options]
#
# Options:
#   --quick    Skip slow tests
#   --verbose  Show detailed output
#   --help     Show this help
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Options
QUICK_MODE=false
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --quick)
            QUICK_MODE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            head -20 "$0" | tail -15
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Results tracking
PASSED=0
FAILED=0
SKIPPED=0
declare -a FAILED_TESTS=()

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_subheader() {
    echo -e "${YELLOW}─── $1 ───${NC}"
}

run_test() {
    local name="$1"
    local cmd="$2"
    local dir="${3:-.}"

    print_subheader "$name"

    cd "$ROOT_DIR/$dir"

    if $VERBOSE; then
        if eval "$cmd"; then
            echo -e "${GREEN}✅ PASSED: $name${NC}"
            ((PASSED++))
            return 0
        else
            echo -e "${RED}❌ FAILED: $name${NC}"
            ((FAILED++))
            FAILED_TESTS+=("$name")
            return 1
        fi
    else
        if eval "$cmd" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PASSED: $name${NC}"
            ((PASSED++))
            return 0
        else
            echo -e "${RED}❌ FAILED: $name${NC}"
            ((FAILED++))
            FAILED_TESTS+=("$name")
            return 1
        fi
    fi
}

# Start
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           CC-Skills Full Test Suite                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Root directory: $ROOT_DIR"
echo "Quick mode: $QUICK_MODE"
echo "Verbose: $VERBOSE"
echo ""

# ============================================================================
# 1. ROOT TESTS
# ============================================================================
print_header "1/3 Root Integration Tests"

cd "$ROOT_DIR"

# Note: Legacy root tests (validate-skill-rules.js, validate-skills.sh, run-activation-tests.js)
# reference old path structure (/skills/skill-rules.json).
# Current structure uses plugins/*/skills/skill-rules.json.
# These tests are skipped until updated for multi-plugin architecture.

echo -e "${YELLOW}⚠️ Legacy root tests reference old path structure${NC}"
echo -e "${YELLOW}   Skipping: validate-skill-rules.js, validate-skills.sh, run-activation-tests.js${NC}"
echo -e "${YELLOW}   Current structure: plugins/*/skills/skill-rules.json${NC}"
echo ""

# Check plugin skill-rules.json files exist
PLUGIN_SKILL_RULES=$(find "$ROOT_DIR/plugins" -name "skill-rules.json" 2>/dev/null | wc -l | tr -d ' ')
if [ "$PLUGIN_SKILL_RULES" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $PLUGIN_SKILL_RULES skill-rules.json files in plugins/${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ No skill-rules.json files found in plugins/${NC}"
    ((FAILED++))
    FAILED_TESTS+=("Plugin skill-rules.json check")
fi

# ============================================================================
# 2. HOOKS PLUGIN TESTS
# ============================================================================
print_header "2/3 Hooks Plugin Tests (Skill Recommendation)"

HOOKS_TEST_DIR="plugins/hooks/tests"

if [ -d "$ROOT_DIR/$HOOKS_TEST_DIR" ]; then
    # Check if Python3 is available
    if command -v python3 &> /dev/null; then
        # Check if test runner exists
        if [ -f "$ROOT_DIR/$HOOKS_TEST_DIR/run-skill-recommend-tests.py" ]; then
            run_test "Skill Recommendation Tests" "python3 run-skill-recommend-tests.py" "$HOOKS_TEST_DIR"
        else
            echo -e "${YELLOW}⏭ SKIPPED: run-skill-recommend-tests.py not found${NC}"
            ((SKIPPED++))
        fi
    else
        echo -e "${YELLOW}⏭ SKIPPED: Python3 not available${NC}"
        ((SKIPPED++))
    fi
else
    echo -e "${YELLOW}⏭ SKIPPED: Hooks test directory not found${NC}"
    ((SKIPPED++))
fi

# ============================================================================
# 3. WORKFLOW-AUTOMATION PLUGIN TESTS
# ============================================================================
print_header "3/3 Workflow-Automation Plugin Tests"

WORKFLOW_DIR="plugins/workflow-automation"

if [ -d "$ROOT_DIR/$WORKFLOW_DIR" ]; then
    cd "$ROOT_DIR/$WORKFLOW_DIR"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install --silent
    fi

    # Run Jest tests
    run_test "Complexity Pinning Tests (Jest)" "npm test" "$WORKFLOW_DIR"

    # Run 500-line validation
    if [ -f "scripts/validate-500-line-limit.sh" ]; then
        run_test "500-Line Limit Validation" "bash scripts/validate-500-line-limit.sh" "$WORKFLOW_DIR"
    fi
else
    echo -e "${YELLOW}⏭ SKIPPED: Workflow-automation directory not found${NC}"
    ((SKIPPED++))
fi

# ============================================================================
# SUMMARY
# ============================================================================
print_header "Test Summary"

TOTAL=$((PASSED + FAILED + SKIPPED))

echo "Total tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Skipped: $SKIPPED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed tests:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "  - $test"
    done
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    TESTS FAILED                           ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 1
else
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                  ALL TESTS PASSED                         ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 0
fi
