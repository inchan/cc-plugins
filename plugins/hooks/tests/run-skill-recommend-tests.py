#!/usr/bin/env python3
"""
스킬 추천 시스템 통합 테스트 실행기

test-prompts.json의 모든 테스트 케이스를 실행하고
결과를 SKILL-RECOMMEND-TEST-REPORT.md에 리포트 생성
"""
import json
import sys
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple
from collections import defaultdict

# ============================================================
# 경로 설정
# ============================================================
SCRIPT_DIR = Path(__file__).parent
FIXTURES_DIR = SCRIPT_DIR / "fixtures"
TEST_PROMPTS = FIXTURES_DIR / "test-prompts.json"
HOOK_SCRIPT = SCRIPT_DIR.parent / "skill-recommend-hook.py"
REPORT_FILE = SCRIPT_DIR / "SKILL-RECOMMEND-TEST-REPORT.md"

# ============================================================
# 테스트 실행
# ============================================================
def run_hook(prompt: str) -> Tuple[bool, List[str], str]:
    """
    skill-recommend-hook.py 실행하고 매칭된 스킬 목록 반환
    
    Returns:
        (success, matched_skills, raw_output)
    """
    try:
        input_json = json.dumps({"prompt": prompt})
        result = subprocess.run(
            ["python3", str(HOOK_SCRIPT)],
            input=input_json,
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode != 0:
            return False, [], result.stderr
        
        # JSON 출력 파싱
        try:
            output = json.loads(result.stdout)
            system_msg = output.get("systemMessage", "")
            
            # 매칭된 스킬 추출: "🎯 22개 스킬 중 1개 매칭 → 상위 3개 추천:\n  🔑 dev-guidelines:frontend-dev-guidelines [60%] ('React')"
            matched = []
            for line in system_msg.split('\n'):
                if '🔑' in line or '📊' in line or '🧠' in line:
                    # "  🔑 dev-guidelines:frontend-dev-guidelines [60%] ('React')"
                    # → "dev-guidelines:frontend-dev-guidelines"
                    parts = line.strip().split()
                    if len(parts) >= 2:
                        skill_full = parts[1]  # "dev-guidelines:frontend-dev-guidelines"
                        # 플러그인명 제거
                        if ':' in skill_full:
                            skill_name = skill_full.split(':')[1]
                        else:
                            skill_name = skill_full
                        matched.append(skill_name)
            
            return True, matched, system_msg
        except json.JSONDecodeError:
            return False, [], result.stdout
    
    except subprocess.TimeoutExpired:
        return False, [], "Timeout"
    except Exception as e:
        return False, [], str(e)


def evaluate_test_case(test: Dict, matched: List[str]) -> Tuple[bool, List[str]]:
    """
    테스트 케이스 평가
    
    Returns:
        (passed, issues)
    """
    issues = []
    
    # mustMatch 체크
    for skill in test.get("mustMatch", []):
        if skill not in matched:
            issues.append(f"mustMatch 누락: {skill}")
    
    # mustNotMatch 체크
    for skill in test.get("mustNotMatch", []):
        if skill in matched:
            issues.append(f"mustNotMatch 포함: {skill}")
    
    return len(issues) == 0, issues


# ============================================================
# 리포트 생성
# ============================================================
def generate_report(results: List[Dict]) -> str:
    """
    테스트 결과를 마크다운 리포트로 변환
    """
    total = len(results)
    passed = sum(1 for r in results if r['passed'])
    failed = total - passed
    pass_rate = (passed / total * 100) if total > 0 else 0
    
    # 카테고리별 통계
    category_stats = defaultdict(lambda: {'total': 0, 'passed': 0})
    for r in results:
        cat = r['category']
        category_stats[cat]['total'] += 1
        if r['passed']:
            category_stats[cat]['passed'] += 1
    
    # 마크다운 생성
    lines = [
        "# 스킬 추천 시스템 테스트 결과\n",
        f"**실행 시각**: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n",
        "## 테스트 결과 요약\n",
        f"- **총 테스트**: {total}개",
        f"- **성공**: {passed}개 ({pass_rate:.1f}%)",
        f"- **실패**: {failed}개 ({100-pass_rate:.1f}%)\n",
        "## 카테고리별 결과\n",
        "| 카테고리 | 총 | 성공 | 실패 | 성공률 |",
        "|----------|----|----|------|--------|"
    ]
    
    for cat, stats in sorted(category_stats.items()):
        total_cat = stats['total']
        passed_cat = stats['passed']
        failed_cat = total_cat - passed_cat
        rate = (passed_cat / total_cat * 100) if total_cat > 0 else 0
        lines.append(f"| {cat} | {total_cat} | {passed_cat} | {failed_cat} | {rate:.1f}% |")
    
    # 실패 케이스 상세
    failed_cases = [r for r in results if not r['passed']]
    if failed_cases:
        lines.append("\n## 실패 케이스 상세\n")
        for r in failed_cases:
            lines.append(f"### [{r['id']}] {r['prompt']}\n")
            lines.append(f"- **카테고리**: {r['category']}")
            lines.append(f"- **기대 스킬**: {', '.join(r['expectedSkills'])}")
            lines.append(f"- **실제 매칭**: {', '.join(r['matched']) if r['matched'] else '(없음)'}")
            lines.append(f"- **문제**:")
            for issue in r['issues']:
                lines.append(f"  - {issue}")
            lines.append("")
    
    # 성공 케이스 요약
    passed_cases = [r for r in results if r['passed']]
    if passed_cases:
        lines.append("## 성공 케이스 요약\n")
        for r in passed_cases:
            lines.append(f"- [{r['id']}] {r['prompt']} → {', '.join(r['matched'][:3])}")
    
    # 개선 제안
    lines.append("\n## 개선 제안\n")
    if failed_cases:
        lines.append("### 누락된 키워드 추가 필요\n")
        
        # 스킬별로 실패 케이스 그룹화
        skill_failures = defaultdict(list)
        for r in failed_cases:
            for issue in r['issues']:
                if 'mustMatch 누락' in issue:
                    skill = issue.split(': ')[1]
                    skill_failures[skill].append(r['prompt'])
        
        for skill, prompts in sorted(skill_failures.items()):
            lines.append(f"**{skill}**:")
            for p in prompts:
                lines.append(f"  - \"{p}\"")
            lines.append("")
    else:
        lines.append("모든 테스트 통과! 🎉\n")
    
    return '\n'.join(lines)


# ============================================================
# 메인 실행
# ============================================================
def main():
    """메인 실행 함수"""
    print("🧪 스킬 추천 시스템 테스트 시작...\n")
    
    # 테스트 케이스 로드
    if not TEST_PROMPTS.exists():
        print(f"❌ 테스트 파일 없음: {TEST_PROMPTS}")
        sys.exit(1)
    
    with open(TEST_PROMPTS, 'r', encoding='utf-8') as f:
        test_data = json.load(f)
    
    # 모든 테스트 실행
    all_results = []
    
    for category, tests in test_data['categories'].items():
        print(f"📂 카테고리: {category}")
        
        for test in tests:
            test_id = test['id']
            prompt = test['prompt']
            
            print(f"  ⏳ [{test_id}] {prompt[:50]}...", end='', flush=True)
            
            # 훅 실행
            success, matched, output = run_hook(prompt)
            
            if not success:
                print(f" ❌ 실행 실패")
                all_results.append({
                    'id': test_id,
                    'category': category,
                    'prompt': prompt,
                    'expectedSkills': test.get('expectedSkills', []),
                    'matched': [],
                    'passed': False,
                    'issues': [f"실행 오류: {output}"]
                })
                continue
            
            # 결과 평가
            passed, issues = evaluate_test_case(test, matched)
            
            status = "✅" if passed else "❌"
            print(f" {status} (매칭: {len(matched)}개)")
            
            all_results.append({
                'id': test_id,
                'category': category,
                'prompt': prompt,
                'expectedSkills': test.get('expectedSkills', []),
                'matched': matched,
                'passed': passed,
                'issues': issues
            })
    
    # 리포트 생성
    print(f"\n📝 리포트 생성: {REPORT_FILE}")
    report = generate_report(all_results)
    
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write(report)
    
    # 결과 요약
    total = len(all_results)
    passed = sum(1 for r in all_results if r['passed'])
    print(f"\n{'='*60}")
    print(f"총 {total}개 테스트 중 {passed}개 성공 ({passed/total*100:.1f}%)")
    print(f"{'='*60}\n")
    
    # 종료 코드
    sys.exit(0 if passed == total else 1)


if __name__ == '__main__':
    main()
