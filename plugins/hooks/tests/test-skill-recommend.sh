#!/bin/bash
################################################################################
# 스킬 추천 시스템 회귀 테스트 자동화 스크립트
#
# 사용법:
#   ./test-skill-recommend.sh               # 전체 테스트 실행
#   ./test-skill-recommend.sh --verbose     # 상세 출력
#   ./test-skill-recommend.sh --category frontend  # 특정 카테고리만
#   ./test-skill-recommend.sh --ci          # CI 모드 (간결한 출력)
#
# 종료 코드:
#   0: 모든 테스트 통과
#   1: 하나 이상의 테스트 실패
#   2: 스크립트 실행 오류 (파일 없음 등)
################################################################################

set -euo pipefail

# ============================================================
# 색상 정의 (CI 모드가 아닐 때만)
# ============================================================
if [[ "${CI:-false}" != "true" ]] && [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    BOLD='\033[1m'
    RESET='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    BOLD=''
    RESET=''
fi

# ============================================================
# 변수 설정
# ============================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK_SCRIPT="${SCRIPT_DIR}/../skill-recommend-hook.py"
TEST_PROMPTS="${SCRIPT_DIR}/fixtures/test-prompts.json"
REPORT_FILE="${SCRIPT_DIR}/SKILL-RECOMMEND-TEST-REPORT.md"

VERBOSE=false
CI_MODE=false
FILTER_CATEGORY=""

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# ============================================================
# 함수 정의
# ============================================================

usage() {
    cat <<EOF
사용법: $0 [옵션]

옵션:
    -h, --help              이 도움말 표시
    -v, --verbose           상세 출력 모드
    -c, --category CAT      특정 카테고리만 테스트 (예: frontend, backend)
    --ci                    CI 모드 (간결한 출력, 색상 없음)

예제:
    $0                      # 전체 테스트 실행
    $0 --verbose            # 상세 출력
    $0 --category frontend  # frontend 카테고리만
    $0 --ci                 # CI 환경에서 실행

종료 코드:
    0: 모든 테스트 통과
    1: 하나 이상의 테스트 실패
    2: 스크립트 실행 오류
EOF
}

log_info() {
    if [[ "$CI_MODE" == "false" ]]; then
        echo -e "${BLUE}ℹ${RESET} $*"
    fi
}

log_success() {
    echo -e "${GREEN}✓${RESET} $*"
}

log_error() {
    echo -e "${RED}✗${RESET} $*" >&2
}

log_warn() {
    echo -e "${YELLOW}⚠${RESET} $*"
}

log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[DEBUG]${RESET} $*"
    fi
}

# ============================================================
# 인자 파싱
# ============================================================
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -c|--category)
            FILTER_CATEGORY="$2"
            shift 2
            ;;
        --ci)
            CI_MODE=true
            shift
            ;;
        *)
            echo "알 수 없는 옵션: $1" >&2
            usage
            exit 2
            ;;
    esac
done

# ============================================================
# 사전 검증
# ============================================================
if [[ ! -f "$HOOK_SCRIPT" ]]; then
    log_error "훅 스크립트를 찾을 수 없습니다: $HOOK_SCRIPT"
    exit 2
fi

if [[ ! -f "$TEST_PROMPTS" ]]; then
    log_error "테스트 파일을 찾을 수 없습니다: $TEST_PROMPTS"
    exit 2
fi

if ! command -v python3 &> /dev/null; then
    log_error "python3가 설치되어 있지 않습니다"
    exit 2
fi

if ! command -v jq &> /dev/null; then
    log_error "jq가 설치되어 있지 않습니다 (brew install jq)"
    exit 2
fi

# ============================================================
# 테스트 실행
# ============================================================
log_info "🧪 스킬 추천 시스템 회귀 테스트 시작..."
log_info "📂 테스트 파일: $TEST_PROMPTS"

if [[ -n "$FILTER_CATEGORY" ]]; then
    log_info "🔍 필터: $FILTER_CATEGORY 카테고리만"
fi

echo ""

# 카테고리 목록 추출 (Bash 3.2 호환)
if [[ -n "$FILTER_CATEGORY" ]]; then
    categories=("$FILTER_CATEGORY")
else
    IFS=$'\n' read -r -d '' -a categories < <(jq -r '.categories | keys[]' "$TEST_PROMPTS" && printf '\0')
fi

# 실패 케이스 저장 배열
declare -a FAILED_CASES

for category in "${categories[@]}"; do
    log_info "📂 카테고리: $category"
    
    # 카테고리의 테스트 개수
    test_count=$(jq -r ".categories.\"$category\" | length" "$TEST_PROMPTS")
    
    for ((i=0; i<test_count; i++)); do
        # 테스트 케이스 정보 추출
        test_id=$(jq -r ".categories.\"$category\"[$i].id" "$TEST_PROMPTS")
        prompt=$(jq -r ".categories.\"$category\"[$i].prompt" "$TEST_PROMPTS")
        
        # Bash 3.2 호환 배열 읽기
        must_match=()
        while IFS= read -r line; do
            [[ -n "$line" ]] && must_match+=("$line")
        done < <(jq -r ".categories.\"$category\"[$i].mustMatch[]" "$TEST_PROMPTS" 2>/dev/null || true)
        
        must_not_match=()
        while IFS= read -r line; do
            [[ -n "$line" ]] && must_not_match+=("$line")
        done < <(jq -r ".categories.\"$category\"[$i].mustNotMatch[]" "$TEST_PROMPTS" 2>/dev/null || true)
        
        log_verbose "테스트 ID: $test_id"
        log_verbose "프롬프트: $prompt"
        log_verbose "mustMatch: ${must_match[*]:-}"
        log_verbose "mustNotMatch: ${must_not_match[*]:-}"
        
        # 훅 실행 (hooks 디렉토리에서 실행해야 올바른 경로 참조)
        input_json=$(jq -n --arg prompt "$prompt" '{"prompt": $prompt}')
        output=$(cd "$(dirname "$HOOK_SCRIPT")" && echo "$input_json" | python3 "$(basename "$HOOK_SCRIPT")" 2>&1 || true)
        
        log_verbose "훅 출력: $output"
        
        # 매칭된 스킬 추출
        matched_skills=()
        while IFS= read -r line; do
            [[ -n "$line" ]] && matched_skills+=("$line")
        done < <(echo "$output" | grep -oE '[a-z-]+:[a-z-]+' | cut -d':' -f2 || true)
        
        log_verbose "매칭된 스킬: ${matched_skills[*]:-}"
        
        # 검증
        test_passed=true
        issues=()
        
        # mustMatch 검증
        for skill in "${must_match[@]:-}"; do
            [[ -z "$skill" ]] && continue
            if [[ " ${matched_skills[*]:-} " != *" $skill "* ]]; then
                test_passed=false
                issues+=("mustMatch 누락: $skill")
            fi
        done
        
        # mustNotMatch 검증
        for skill in "${must_not_match[@]:-}"; do
            [[ -z "$skill" ]] && continue
            if [[ " ${matched_skills[*]:-} " == *" $skill "* ]]; then
                test_passed=false
                issues+=("mustNotMatch 포함: $skill")
            fi
        done
        
        # 결과 출력
        ((TOTAL_TESTS++))
        
        if [[ "$test_passed" == "true" ]]; then
            ((PASSED_TESTS++))
            if [[ "$CI_MODE" == "false" ]]; then
                log_success "[$test_id] $prompt (매칭: ${#matched_skills[@]}개)"
            fi
        else
            ((FAILED_TESTS++))
            log_error "[$test_id] $prompt"
            for issue in "${issues[@]}"; do
                log_error "  - $issue"
            done
            FAILED_CASES+=("[$test_id] $prompt")
        fi
    done
    
    echo ""
done

# ============================================================
# 결과 요약
# ============================================================
echo ""
echo "============================================================"
if [[ "$FAILED_TESTS" -eq 0 ]]; then
    log_success "${BOLD}모든 테스트 통과!${RESET} ($TOTAL_TESTS/$TOTAL_TESTS)"
else
    log_error "${BOLD}테스트 실패${RESET}: $FAILED_TESTS/$TOTAL_TESTS"
    echo ""
    log_warn "실패한 테스트:"
    for failed_case in "${FAILED_CASES[@]}"; do
        echo "  - $failed_case"
    done
fi
echo "============================================================"
echo ""

# CI 모드에서는 GitHub Actions 포맷으로도 출력
if [[ "$CI_MODE" == "true" ]]; then
    # GITHUB_OUTPUT 사용 (최신 방식)
    if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
        echo "total=$TOTAL_TESTS" >> "$GITHUB_OUTPUT"
        echo "passed=$PASSED_TESTS" >> "$GITHUB_OUTPUT"
        echo "failed=$FAILED_TESTS" >> "$GITHUB_OUTPUT"
        echo "success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))%" >> "$GITHUB_OUTPUT"
    else
        # 레거시 방식 (deprecated)
        echo "::set-output name=total::$TOTAL_TESTS"
        echo "::set-output name=passed::$PASSED_TESTS"
        echo "::set-output name=failed::$FAILED_TESTS"
    fi

    if [[ "$FAILED_TESTS" -gt 0 ]]; then
        echo "::error::$FAILED_TESTS/$TOTAL_TESTS 테스트 실패"
    fi
fi

# 종료 코드
if [[ "$FAILED_TESTS" -eq 0 ]]; then
    exit 0
else
    exit 1
fi
