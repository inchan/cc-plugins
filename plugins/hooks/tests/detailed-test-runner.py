#!/usr/bin/env python3
"""
상세 테스트 러너: 각 테스트 케이스의 매칭 점수, 매칭 이유 등 상세 정보 수집
"""
import json
import sys
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple
from collections import defaultdict

# 경로 설정
SCRIPT_DIR = Path(__file__).parent
FIXTURES_DIR = SCRIPT_DIR / "fixtures"
TEST_PROMPTS = FIXTURES_DIR / "test-prompts.json"
HOOK_SCRIPT = SCRIPT_DIR.parent / "skill-recommend-hook.py"
REPORT_FILE = SCRIPT_DIR / "SKILL-RECOMMEND-TEST-REPORT.md"

def run_hook_detailed(prompt: str) -> Tuple[bool, Dict]:
    """
    훅 실행하고 상세 정보 반환
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
            return False, {"error": result.stderr}

        try:
            output = json.loads(result.stdout)
            system_msg = output.get("systemMessage", "")

            # 매칭 정보 파싱
            matched_skills = []
            for line in system_msg.split('\n'):
                if '🔑' in line or '📊' in line or '🧠' in line:
                    # "  🔑 dev-guidelines:frontend-dev-guidelines [60%] ('React')"
                    parts = line.strip().split()
                    if len(parts) >= 2:
                        skill_full = parts[1]

                        # 플러그인:스킬 분리
                        if ':' in skill_full:
                            plugin, skill_name = skill_full.split(':', 1)
                        else:
                            plugin = "unknown"
                            skill_name = skill_full

                        # 점수 추출
                        confidence = 0
                        keyword = ""
                        for part in parts[2:]:
                            if part.startswith('[') and part.endswith('%]'):
                                confidence = int(part[1:-2])
                            elif part.startswith("('") and part.endswith("')"):
                                keyword = part[2:-2]

                        matched_skills.append({
                            "plugin": plugin,
                            "skill": skill_name,
                            "confidence": confidence,
                            "keyword": keyword
                        })

            return True, {
                "systemMessage": system_msg,
                "matched": matched_skills
            }
        except json.JSONDecodeError:
            return False, {"error": "JSON 파싱 오류"}

    except subprocess.TimeoutExpired:
        return False, {"error": "Timeout"}
    except Exception as e:
        return False, {"error": str(e)}

def evaluate_test_case(test: Dict, matched_skills: List[Dict]) -> Tuple[bool, List[str], Dict]:
    """
    테스트 평가 및 상세 정보 반환
    """
    issues = []
    matched_names = [m["skill"] for m in matched_skills]

    # mustMatch 체크
    for skill in test.get("mustMatch", []):
        if skill not in matched_names:
            issues.append(f"mustMatch 누락: {skill}")

    # mustNotMatch 체크
    for skill in test.get("mustNotMatch", []):
        if skill in matched_names:
            issues.append(f"mustNotMatch 포함: {skill}")

    stats = {
        "total_matched": len(matched_skills),
        "expected_count": len(test.get("expectedSkills", [])),
        "must_match_count": len(test.get("mustMatch", [])),
        "must_not_match_count": len(test.get("mustNotMatch", []))
    }

    return len(issues) == 0, issues, stats

def generate_detailed_report(results: List[Dict]) -> str:
    """
    상세 리포트 생성
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

    lines = [
        "# 스킬 추천 시스템 테스트 결과 (상세)\n",
        f"**실행 시각**: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n",
        "## 📊 테스트 결과 요약\n",
        f"- **총 테스트**: {total}개",
        f"- **성공**: {passed}개 ({pass_rate:.1f}%)",
        f"- **실패**: {failed}개 ({100-pass_rate:.1f}%)\n"
    ]

    # 전체 통계
    total_matches = sum(r['stats']['total_matched'] for r in results)
    avg_matches = total_matches / total if total > 0 else 0

    lines.extend([
        "### 매칭 통계",
        f"- **총 매칭 수**: {total_matches}",
        f"- **평균 매칭 수**: {avg_matches:.1f}개/테스트\n"
    ])

    # 카테고리별 결과
    lines.extend([
        "## 📁 카테고리별 결과\n",
        "| 카테고리 | 총 | 성공 | 실패 | 성공률 | 평균 매칭 수 |",
        "|----------|----|----|------|--------|------------|"
    ])

    for cat, stats in sorted(category_stats.items()):
        total_cat = stats['total']
        passed_cat = stats['passed']
        failed_cat = total_cat - passed_cat
        rate = (passed_cat / total_cat * 100) if total_cat > 0 else 0

        cat_results = [r for r in results if r['category'] == cat]
        avg_match = sum(r['stats']['total_matched'] for r in cat_results) / total_cat if total_cat > 0 else 0

        lines.append(f"| {cat} | {total_cat} | {passed_cat} | {failed_cat} | {rate:.1f}% | {avg_match:.1f} |")

    # 실패 케이스 (있다면)
    failed_cases = [r for r in results if not r['passed']]
    if failed_cases:
        lines.append("\n## ❌ 실패 케이스 상세\n")
        for r in failed_cases:
            lines.extend([
                f"### [{r['id']}] {r['prompt']}\n",
                f"- **카테고리**: {r['category']}",
                f"- **기대 스킬**: {', '.join(r['expectedSkills'])}",
                f"- **실제 매칭**: {', '.join([m['skill'] for m in r['matched']]) if r['matched'] else '(없음)'}",
                f"- **문제**:"
            ])
            for issue in r['issues']:
                lines.append(f"  - {issue}")
            lines.append("")

    # 성공 케이스 상세
    passed_cases = [r for r in results if r['passed']]
    if passed_cases:
        lines.append("## ✅ 성공 케이스 상세\n")

        # 카테고리별로 그룹화
        for cat in sorted(category_stats.keys()):
            cat_passed = [r for r in passed_cases if r['category'] == cat]
            if cat_passed:
                lines.append(f"### {cat} ({len(cat_passed)}개)\n")

                for r in cat_passed:
                    lines.append(f"#### [{r['id']}] {r['prompt']}\n")

                    if r['matched']:
                        lines.append("**매칭된 스킬**:")
                        for m in r['matched']:
                            lines.append(f"- `{m['skill']}` ({m['plugin']}) - {m['confidence']}% - 키워드: '{m['keyword']}'")
                    else:
                        lines.append("**매칭 없음**")

                    lines.append("")

    # 키워드 분석
    lines.append("## 🔑 키워드 매칭 분석\n")

    keyword_usage = defaultdict(int)
    skill_keywords = defaultdict(set)

    for r in results:
        for m in r['matched']:
            if m['keyword']:
                keyword_usage[m['keyword']] += 1
                skill_keywords[m['skill']].add(m['keyword'])

    if keyword_usage:
        lines.append("### 자주 사용된 키워드\n")
        sorted_keywords = sorted(keyword_usage.items(), key=lambda x: x[1], reverse=True)
        for keyword, count in sorted_keywords[:10]:
            lines.append(f"- `{keyword}`: {count}회")
        lines.append("")

    if skill_keywords:
        lines.append("### 스킬별 매칭 키워드\n")
        for skill, keywords in sorted(skill_keywords.items()):
            lines.append(f"- **{skill}**: {', '.join(sorted(keywords))}")
        lines.append("")

    # 개선 제안
    lines.append("## 💡 개선 제안\n")
    if failed_cases:
        lines.append("### 누락된 키워드 추가 필요\n")

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
        lines.extend([
            "모든 테스트가 성공적으로 통과했습니다! 🎉\n",
            "### 현재 시스템 강점",
            "- ✅ 모든 카테고리에서 100% 성공률 달성",
            "- ✅ 키워드 매칭이 정확하게 작동",
            "- ✅ 캐시 기반 스킬 로딩으로 빠른 응답 시간\n"
        ])

    return '\n'.join(lines)

def main():
    """메인 실행"""
    print("🧪 상세 테스트 시작...\n")

    if not TEST_PROMPTS.exists():
        print(f"❌ 테스트 파일 없음: {TEST_PROMPTS}")
        sys.exit(1)

    with open(TEST_PROMPTS, 'r', encoding='utf-8') as f:
        test_data = json.load(f)

    all_results = []

    for category, tests in test_data['categories'].items():
        print(f"📂 {category}")

        for test in tests:
            test_id = test['id']
            prompt = test['prompt']

            print(f"  ⏳ [{test_id}] {prompt[:50]}...", end='', flush=True)

            success, data = run_hook_detailed(prompt)

            if not success:
                print(f" ❌ 실행 실패")
                all_results.append({
                    'id': test_id,
                    'category': category,
                    'prompt': prompt,
                    'expectedSkills': test.get('expectedSkills', []),
                    'matched': [],
                    'passed': False,
                    'issues': [f"실행 오류: {data.get('error', 'Unknown')}"],
                    'stats': {'total_matched': 0, 'expected_count': 0, 'must_match_count': 0, 'must_not_match_count': 0}
                })
                continue

            matched = data.get('matched', [])
            passed, issues, stats = evaluate_test_case(test, matched)

            status = "✅" if passed else "❌"
            print(f" {status} (매칭: {len(matched)}개)")

            all_results.append({
                'id': test_id,
                'category': category,
                'prompt': prompt,
                'expectedSkills': test.get('expectedSkills', []),
                'matched': matched,
                'passed': passed,
                'issues': issues,
                'stats': stats
            })

    # 리포트 생성
    print(f"\n📝 상세 리포트 생성: {REPORT_FILE}")
    report = generate_detailed_report(all_results)

    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write(report)

    # 요약
    total = len(all_results)
    passed = sum(1 for r in all_results if r['passed'])
    print(f"\n{'='*60}")
    print(f"총 {total}개 테스트 중 {passed}개 성공 ({passed/total*100:.1f}%)")
    print(f"{'='*60}\n")

    sys.exit(0 if passed == total else 1)

if __name__ == '__main__':
    main()
