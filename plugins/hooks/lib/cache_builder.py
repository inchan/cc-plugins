#!/usr/bin/env python3
"""
캐시 빌더 모듈: 스킬 메타데이터 캐시 생성 및 검증

사용법:
    from lib.cache_builder import CacheBuilder

    builder = CacheBuilder(plugins_dir, cache_file)
    if not builder.validate_cache():
        builder.build_cache()
"""
import json
import os
import subprocess
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class CacheBuilder:
    """스킬 메타데이터 캐시 빌더"""

    def __init__(
        self,
        plugins_dir: Path,
        cache_file: Path,
        hidden_skills_file: Optional[Path] = None
    ):
        self.plugins_dir = Path(plugins_dir)
        self.cache_file = Path(cache_file)
        self.hidden_skills_file = hidden_skills_file
        self._hidden_skills: Optional[List[str]] = None

    @property
    def hidden_skills(self) -> List[str]:
        """hidden 스킬 목록 로드 (lazy loading)"""
        if self._hidden_skills is None:
            self._hidden_skills = self._load_hidden_skills()
        return self._hidden_skills

    def _load_hidden_skills(self) -> List[str]:
        """hidden-skills.json에서 숨김 스킬 목록 로드"""
        if not self.hidden_skills_file or not self.hidden_skills_file.exists():
            return []
        try:
            with open(self.hidden_skills_file, encoding="utf-8") as f:
                data = json.load(f)
                return data.get("hiddenSkills", [])
        except Exception:
            return []

    def count_skill_files(self) -> int:
        """SKILL.md 파일 개수 카운트 (빠른 검증용)"""
        try:
            result = subprocess.run(
                ["find", str(self.plugins_dir), "-name", "SKILL.md", "-type", "f"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                lines = [l for l in result.stdout.strip().split("\n") if l]
                return len(lines)
        except Exception:
            pass
        return -1

    def get_cache_skill_count(self) -> int:
        """캐시된 스킬 개수 조회"""
        if not self.cache_file.exists():
            return -1
        try:
            with open(self.cache_file, encoding="utf-8") as f:
                data = json.load(f)
                return len(data.get("skills", []))
        except Exception:
            return -1

    def validate_cache(self) -> bool:
        """캐시 유효성 검사 (빠른 검증)"""
        if not self.cache_file.exists():
            return False

        actual_count = self.count_skill_files()
        cached_count = self.get_cache_skill_count()

        if actual_count < 0 or cached_count < 0:
            return False

        return actual_count == cached_count

    def scan_skills(self) -> List[Dict]:
        """모든 SKILL.md 스캔하여 메타데이터 추출"""
        skills = []

        for skill_md in self.plugins_dir.rglob("SKILL.md"):
            skill_info = self._parse_skill_md(skill_md)
            if skill_info:
                skills.append(skill_info)

        return skills

    def _parse_skill_md(self, skill_md: Path) -> Optional[Dict]:
        """SKILL.md 파일에서 메타데이터 추출"""
        try:
            content = skill_md.read_text(encoding="utf-8")
        except Exception:
            return None

        # 스킬 이름 및 플러그인 추출
        skill_name = skill_md.parent.name

        # plugins/PLUGIN_NAME/skills/... 구조에서 플러그인명 추출
        parts = skill_md.parts
        plugin_name = ""
        try:
            plugins_idx = parts.index("plugins")
            if plugins_idx + 1 < len(parts):
                plugin_name = parts[plugins_idx + 1]
        except ValueError:
            pass

        # frontmatter 파싱
        metadata = self._parse_frontmatter(content)

        # skill-rules.json에서 추가 정보 로드
        rules_info = self._load_skill_rules(skill_md.parent.parent, skill_name)

        # hidden 여부 결정
        is_hidden = skill_name in self.hidden_skills

        # 키워드 결정: rules > frontmatter > 기본값
        keywords = rules_info.get("keywords", [])
        if not keywords and "keywords" in metadata:
            kw = metadata["keywords"]
            if isinstance(kw, list):
                keywords = kw
            elif isinstance(kw, str):
                keywords = [k.strip() for k in kw.split(",") if k.strip()]

        # priority 결정
        priority = rules_info.get("priority", metadata.get("priority", "medium"))

        return {
            "skill": skill_name,
            "plugin": plugin_name,
            "keywords": ",".join(keywords) if isinstance(keywords, list) else keywords,
            "priority": priority,
            "hidden": is_hidden
        }

    def _parse_frontmatter(self, content: str) -> Dict:
        """YAML frontmatter 파싱"""
        lines = content.strip().split("\n")
        if not lines or lines[0] != "---":
            return {}

        end_idx = -1
        for i, line in enumerate(lines[1:], 1):
            if line == "---":
                end_idx = i
                break

        if end_idx < 0:
            return {}

        metadata = {}
        for line in lines[1:end_idx]:
            if ":" in line:
                key, value = line.split(":", 1)
                key = key.strip()
                value = value.strip()

                # 배열 형태 처리
                if value.startswith("[") and value.endswith("]"):
                    try:
                        metadata[key] = json.loads(value)
                    except json.JSONDecodeError:
                        metadata[key] = value
                else:
                    metadata[key] = value

        return metadata

    def _load_skill_rules(self, skills_dir: Path, skill_name: str) -> Dict:
        """skill-rules.json에서 스킬 정보 로드"""
        rules_file = skills_dir / "skill-rules.json"
        if not rules_file.exists():
            return {}

        try:
            with open(rules_file, encoding="utf-8") as f:
                data = json.load(f)

            skills = data.get("skills", {})
            skill_info = skills.get(skill_name, {})

            # promptTriggers에서 keywords 추출
            triggers = skill_info.get("promptTriggers", {})
            keywords = triggers.get("keywords", [])

            return {
                "keywords": keywords,
                "priority": skill_info.get("priority", "medium")
            }
        except Exception:
            return {}

    def build_cache(self) -> Tuple[bool, str]:
        """캐시 파일 생성"""
        try:
            skills = self.scan_skills()

            # priority 순으로 정렬
            priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
            skills.sort(key=lambda x: priority_order.get(x.get("priority", "medium"), 2))

            cache_data = {
                "skills": skills,
                "timestamp": int(time.time()),
                "version": "2.0.0"
            }

            # 캐시 디렉토리 생성
            self.cache_file.parent.mkdir(parents=True, exist_ok=True)

            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(cache_data, f, ensure_ascii=False, indent=None)

            return True, f"캐시 생성 완료: {len(skills)}개 스킬"

        except Exception as e:
            return False, f"캐시 생성 실패: {str(e)}"

    def load_cache(self) -> List[Dict]:
        """캐시에서 스킬 목록 로드"""
        if not self.cache_file.exists():
            return []

        try:
            with open(self.cache_file, encoding="utf-8") as f:
                data = json.load(f)
            return data.get("skills", [])
        except Exception:
            return []

    def load_visible_skills(self) -> List[Dict]:
        """캐시에서 visible 스킬만 로드 (hidden=false)"""
        skills = self.load_cache()
        return [s for s in skills if not s.get("hidden", False)]


# CLI 모드
if __name__ == "__main__":
    import sys

    script_dir = Path(__file__).parent.parent
    plugins_dir = script_dir.parent
    cache_dir = plugins_dir / "cache"
    cache_file = cache_dir / "skill-metadata.json"
    hidden_file = script_dir / "config" / "hidden-skills.json"

    builder = CacheBuilder(plugins_dir, cache_file, hidden_file)

    if len(sys.argv) > 1:
        cmd = sys.argv[1]

        if cmd == "validate":
            valid = builder.validate_cache()
            print(f"캐시 유효성: {'OK' if valid else 'INVALID'}")
            sys.exit(0 if valid else 1)

        elif cmd == "build":
            success, msg = builder.build_cache()
            print(msg)
            sys.exit(0 if success else 1)

        elif cmd == "count":
            actual = builder.count_skill_files()
            cached = builder.get_cache_skill_count()
            print(f"실제 SKILL.md: {actual}개")
            print(f"캐시된 스킬: {cached}개")
            sys.exit(0)

    # 기본: 검증 후 필요시 빌드
    if builder.validate_cache():
        print("캐시가 최신 상태입니다.")
    else:
        print("캐시 갱신 필요, 재생성 중...")
        success, msg = builder.build_cache()
        print(msg)
        sys.exit(0 if success else 1)
