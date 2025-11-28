#!/usr/bin/env python3
"""
SessionStart 훅: 세션 시작 시 스킬 메타데이터 캐시 검증 및 갱신

입력: { "project_dir": string, "session_info": {...} }
출력: exit code 0 (성공)

캐시 검증 전략:
1. 캐시 파일 존재 여부 확인
2. SKILL.md 파일 개수와 캐시 스킬 개수 비교 (빠른 검증)
3. 불일치 시 캐시 재생성
"""
import json
import sys
import time
from pathlib import Path

# 모듈 경로 추가
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from lib.cache_builder import CacheBuilder


def log_message(msg: str, level: str = "info"):
    """로그 메시지 출력 (stderr로 출력하여 stdout 오염 방지)"""
    timestamp = time.strftime("%H:%M:%S")
    prefix = {"info": "ℹ️", "success": "✅", "warning": "⚠️", "error": "❌"}.get(level, "")
    print(f"{prefix} [{timestamp}] {msg}", file=sys.stderr)


def main():
    start_time = time.time()

    # stdin 읽기 (SessionStart 입력)
    try:
        stdin_data = sys.stdin.read()
        input_data = json.loads(stdin_data) if stdin_data.strip() else {}
    except Exception:
        input_data = {}

    # 경로 설정
    plugins_dir = SCRIPT_DIR.parent
    cache_dir = plugins_dir / "../cache"
    cache_file = cache_dir / "skill-metadata.json"
    hidden_file = SCRIPT_DIR / "config" / "hidden-skills.json"

    # CacheBuilder 인스턴스 생성
    builder = CacheBuilder(plugins_dir, cache_file, hidden_file)

    # 캐시 검증
    if builder.validate_cache():
        elapsed = (time.time() - start_time) * 1000
        log_message(f"캐시 유효 ({elapsed:.0f}ms)", "success")
        sys.exit(0)

    # 캐시 갱신 필요
    log_message("캐시 동기화 필요, 재생성 중...", "warning")

    success, msg = builder.build_cache()
    elapsed = (time.time() - start_time) * 1000

    if success:
        log_message(f"{msg} ({elapsed:.0f}ms)", "success")
        sys.exit(0)
    else:
        log_message(f"{msg} ({elapsed:.0f}ms)", "error")
        # 캐시 실패해도 세션은 계속 진행 (graceful fallback)
        sys.exit(0)


if __name__ == "__main__":
    main()
