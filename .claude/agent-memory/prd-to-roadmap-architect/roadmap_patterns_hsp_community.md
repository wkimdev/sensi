---
name: 커뮤니티 서비스 MVP 로드맵 패턴 (테스트 포함)
description: 인증 + 콘텐츠 조회 + 인터랙션 + 출시품질 4-Phase 패턴 + Phase별 Testing Plan 필수 포함
type: project
---

커뮤니티/소셜 서비스 MVP에서 다음 4-Phase 구조가 논리적으로 유효했다:

1. **Phase 1 (인증 + 기반)**: OAuth + JWT + DB 스키마. 모든 Phase의 선행 조건. 2주.
2. **Phase 2 (읽기 전용 콘텐츠)**: 목록 조회, 검색, 필터. API 연동 플레이스홀더 교체. 2주.
3. **Phase 3 (쓰기 인터랙션)**: 게시글 작성, 댓글, 반응(좋아요/공감). 낙관적 업데이트 포함. 2주.
4. **Phase 4 (마이페이지 + 출시품질)**: 프로필, 반응형, 접근성, 배포. 통합 회귀 테스트. 2주.

**Why:** 읽기(Phase 2)를 쓰기(Phase 3)보다 먼저 두면 FE 팀이 실제 데이터로 UI를 확인하면서 쓰기 UX를 설계할 수 있다. 인증 없이는 어떤 API도 테스트 불가이므로 Phase 1이 Critical.

**테스트 통합 패턴 (2026-03-22 추가):**
- 각 Phase의 Features/Tasks 테이블에 "Type" 컬럼 추가 (Implementation / Test 구분)
- 구현 태스크 다음에 `[TEST]` 태스크를 1:1로 매핑
- 각 Phase에 **Testing Plan 섹션** 필수 — Playwright MCP 시나리오(단계별 스텝 상세 기술) + vitest 단위 테스트 목록
- Phase별 Playwright MCP 기대 시나리오 수: Phase 1(3개), Phase 2(4개), Phase 3(5개), Phase 4(4개 + 회귀)
- Acceptance Criteria 마지막 3개 항목은 항상: (1) Playwright MCP 시나리오 실행 성공, (2) vitest 통과, (3) "모든 구현 기능에 대응하는 테스트 작성 완료"
- Google OAuth Playwright 자동화 난이도 높음 → 백엔드에 `/auth/test-login` 우회 엔드포인트 준비 권고

**How to apply:** 유사한 커뮤니티/소셜 PRD가 입력되면 이 4-Phase 구조를 기본 템플릿으로 제안한다. 공감/반응 기능은 낙관적 업데이트 + 서버 멱등성(Upsert) 패턴을 항상 명시할 것. 테스트 전략은 선택이 아닌 필수 — 각 Phase에 Testing Plan 섹션 포함.
