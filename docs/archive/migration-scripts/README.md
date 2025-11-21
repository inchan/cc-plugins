# Migration Scripts Archive

v1.x → v2.0.0 마이그레이션 스크립트 (참고용)

## 파일 목록

### migrate-to-multi-plugin.sh
- **용도**: 단일 플러그인 → 7개 독립 플러그인 자동 마이그레이션
- **상태**: ✅ 완료됨 (2025-11-21)
- **참고용**: 향후 유사 마이그레이션 시 참조

### rollback-migration.sh
- **용도**: 마이그레이션 롤백
- **상태**: 불필요 (v2.0.0 안정화됨)

## 현재 상태

프로젝트는 v2.0.0 Multi-Plugin Architecture로 완전히 전환되었습니다.
이 스크립트들은 더 이상 실행할 필요가 없으며, 역사적 참고용으로만 보관됩니다.

## 마이그레이션 기록

**실행일**: 2025-11-20
**결과**: 성공
**변경사항**:
- src/ → plugins/ (7개 플러그인)
- skill-rules.json 분할 (7개 파일)
- 빌드 프로세스 제거

자세한 내용은 [ARCHITECTURE_EVOLUTION.md](../ARCHITECTURE_EVOLUTION.md)를 참조하세요.
