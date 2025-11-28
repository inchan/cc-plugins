#!/usr/bin/env python3
"""
스킬 추천 훅: UserPromptSubmit 이벤트에서 프롬프트를 분석하여 관련 스킬을 추천

v2.0: cache_builder 모듈 사용, hidden 스킬 필터링 지원

스킬 로드 전략:
1. 캐시된 메타데이터 사용 (plugins/cache/skill-metadata.json) - 가장 빠름
2. 캐시 미존재 시 직접 로드 (fallback)
"""
import json
import sys
from pathlib import Path
from typing import List, Dict

# 모듈 경로 추가
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from lib.cache_builder import CacheBuilder

# 경로 설정
PLUGINS_DIR = SCRIPT_DIR.parent
CACHE_DIR = PLUGINS_DIR / "cache"
SKILL_METADATA_CACHE = CACHE_DIR / "skill-metadata.json"
HIDDEN_SKILLS_FILE = SCRIPT_DIR / "config" / "hidden-skills.json"


def build_output_json(matched: List[Dict], total_skills: int) -> Dict:
    """매칭 결과를 systemMessage 형식으로 변환"""
    matched_count = len(matched)

    if matched_count == 0:
        user_msg = f"\n💡 매칭된 스킬이 없습니다 (전체: {total_skills}개)"
    else:
        display_count = min(matched_count, 3)
        if matched_count >= 3:
            user_msg = f"\n🎯 {total_skills}개 스킬 중 {matched_count}개 매칭 → 상위 {display_count}개 추천:\n"
        else:
            user_msg = f"\n🎯 {total_skills}개 스킬 중 {matched_count}개 매칭:\n"

        for m in matched[:3]:
            name = m.get("name", "")
            plugin = m.get("plugin", "")
            keyword = m.get("matchedKeyword", "")
            priority = m.get("priority", 10)

            icon = "🔑"
            conf_pct = max(0, min(100, 100 - (priority - 1) * 10))
            user_msg += f"  {icon} {plugin}:{name} [{conf_pct}%] ('{keyword}')\n"

    return {"systemMessage": user_msg.rstrip("\n")}


def output_and_exit(data: Dict, exit_code: int = 0):
    """JSON 출력 후 종료"""
    print(json.dumps(data, ensure_ascii=False))
    sys.exit(exit_code)


def load_skills() -> List[Dict]:
    """캐시에서 visible 스킬 로드 (hidden=false만)"""
    builder = CacheBuilder(PLUGINS_DIR, SKILL_METADATA_CACHE, HIDDEN_SKILLS_FILE)

    # 캐시에서 visible 스킬만 로드
    skills = builder.load_visible_skills()

    if skills:
        # 캐시 형식을 매칭용 형식으로 변환
        result = []
        priority_map = {"critical": 1, "high": 5, "medium": 10, "low": 20}

        for item in skills:
            keywords_str = item.get("keywords", "")
            keywords = [k.strip() for k in keywords_str.split(",") if k.strip()]
            priority = priority_map.get(item.get("priority", "medium"), 10)

            result.append({
                "name": item.get("skill", ""),
                "plugin": item.get("plugin", ""),
                "keywords": keywords,
                "priority": priority
            })
        return result

    # 캐시 없으면 직접 스캔 후 hidden 필터링
    all_skills = builder.scan_skills()
    result = []
    priority_map = {"critical": 1, "high": 5, "medium": 10, "low": 20}

    for item in all_skills:
        if item.get("hidden", False):
            continue

        keywords_str = item.get("keywords", "")
        keywords = [k.strip() for k in keywords_str.split(",") if k.strip()]
        priority = priority_map.get(item.get("priority", "medium"), 10)

        result.append({
            "name": item.get("skill", ""),
            "plugin": item.get("plugin", ""),
            "keywords": keywords,
            "priority": priority
        })

    return result


def keyword_match(prompt: str, skills: List[Dict]) -> List[Dict]:
    """키워드 기반 빠른 매칭"""
    prompt_lower = prompt.lower()
    matched = []

    for skill in skills:
        keywords = skill.get("keywords", [])
        skill_name = skill.get("name", "").lower()
        all_keywords = keywords + [skill_name]

        for kw in all_keywords:
            if kw and kw.lower() in prompt_lower:
                matched.append({
                    "name": skill.get("name"),
                    "plugin": skill.get("plugin", ""),
                    "matchedKeyword": kw,
                    "priority": skill.get("priority", 10),
                    "method": "keyword"
                })
                break

    return sorted(matched, key=lambda x: x.get("priority", 10))


def main():
    # stdin 읽기
    try:
        stdin_data = sys.stdin.read()
    except Exception:
        stdin_data = ""

    if not stdin_data or not stdin_data.strip():
        output_and_exit({
            "systemMessage": "\n💡 매칭된 스킬이 없습니다 (stdin 데이터 없음)"
        })

    # JSON 파싱
    try:
        input_data = json.loads(stdin_data)
    except json.JSONDecodeError:
        output_and_exit({
            "systemMessage": "\n💡 매칭된 스킬이 없습니다 (JSON 파싱 오류)"
        })

    # 프롬프트 추출
    prompt = input_data.get("prompt", "")
    if not prompt or len(prompt) < 3:
        output_and_exit({
            "systemMessage": "\n💡 매칭된 스킬이 없습니다 (프롬프트 없음)"
        })

    # 스킬 로드 (visible만)
    skills = load_skills()

    if not skills:
        output_and_exit({
            "systemMessage": "\n💡 매칭된 스킬이 없습니다 (로드된 스킬 없음)"
        })

    # 매칭
    matched = keyword_match(prompt, skills)

    # 결과 출력
    output_and_exit(build_output_json(matched, len(skills)))


if __name__ == "__main__":
    main()
