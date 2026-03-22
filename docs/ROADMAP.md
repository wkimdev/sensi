# 센시(Sensi) 개발 로드맵

## 개요

**프로젝트**: 센시 — HSP를 위한 공감 커뮤니티 웹 서비스 MVP
**목표**: PRD v1.0 기반 9개 기능 완전 구현 및 출시
**총 기간**: 8주 (4 Sprint × 2주)
**팀 규모**: 3-5명 (프론트엔드 2-3명, 백엔드 1-2명)
**현황** (2026-03-22): Phase 1 구현 완료, Phase 2 완전 완료 (92개 테스트 통과)

### 진행 요약
- ✅ **Phase 1**: 백엔드 기반 + 인증 시스템 완료 (Google OAuth + JWT)
- ✅ **Phase 2**: 프론트엔드 화면 개발 완료 (5개 페이지 + 재사용 컴포넌트)
- ⏳ **Phase 3**: API 연동 (다음 단계)
- ⏳ **Phase 4**: 통합 테스트 + 배포

## Phase 구조 & 크리티컬 패스

```
Phase 1: 기반 인프라 + 인증 (Sprint 1)
         ↓
Phase 2: 화면 개발 (Sprint 2)
         ↓
Phase 3: API 연동 (Sprint 3)
         ↓
Phase 4: 완성 + 배포 (Sprint 4)
```

---

## Phase 1: 기반 인프라 + 인증 (Sprint 1)

**Duration**: 2주
**Priority**: Critical
**목표**:
- ✅ 백엔드 기반 환경 구축 (Node.js, Express, SQLite with Prisma)
- ✅ Google OAuth 2.0 서버 연동 완료
- ✅ JWT 토큰 발급/검증 미들웨어 완성
- ✅ 프론트엔드 LoginPage Google OAuth 연동
- ⏳ Google OAuth 통합 테스트 (대기 중)

### 구현 과제

| 작업명 | 타입 | 담당 | 노력도 | 상태 | 의존성 | 상세 |
|--------|------|------|--------|------|--------|------|
| Node.js + Express + SQLite 세팅 | 백엔드 구현 | BE | H | ✅ Completed | - | Express + Prisma ORM 세팅, SQLite 개발 DB 구성 |
| Google OAuth 2.0 서버 구현 | 백엔드 구현 | BE | H | ✅ Completed | Node.js 세팅 | google-auth-library 사용, ID 토큰 검증 구현 |
| 사용자 테이블 스키마 설계 | 백엔드 구현 | BE | M | ✅ Completed | Node.js 세팅 | User 모델(id, email, name, googleId), Prisma migration 완료 |
| JWT 토큰 발급/검증 미들웨어 | 백엔드 구현 | BE | M | ✅ Completed | Google OAuth 구현 | signToken(), verifyToken(), refreshToken() 모두 구현 |
| Google OAuth 엔드포인트 구현 | 백엔드 API | BE | H | ✅ Completed | Google OAuth 구현 | POST /auth/google, POST /auth/refresh, GET /auth/me 완료 |
| LoginPage Google OAuth 연동 | 프론트 구현 | FE | M | ✅ Completed | Google OAuth 엔드포인트 | @react-oauth/google 설치, GoogleLogin 컴포넌트 연동 |
| Google OAuth E2E 테스트 | 테스트 (E2E) | QA | M | ⏳ On Hold | LoginPage 구현 | **대기**: Google Cloud OAuth 설정 필요 (docs/INTEGRATION_TEST.md 참조) |
| JWT 토큰 관리 테스트 | 테스트 (vitest) | QA | M | ⏳ On Hold | JWT 미들웨어 | **대기**: Google OAuth 통합 후 테스트 작성 예정 |

### 기술 고려사항

- Google OAuth 리다이렉트 URI는 환경별(dev/staging/prod) 다르게 설정
- JWT 토큰 TTL: 액세스 토큰 15분, 리프레시 토큰 7일
- Axios 인터셉터에서 자동 토큰 헤더 첨부 + 401 리다이렉트

### 테스트 계획

- [ ] **Google OAuth 플로우 E2E** — Playwright MCP
  - 로그인 → 토큰 저장 → localStorage 확인

- [ ] **JWT 검증** — vitest
  - 토큰 저장/불러오기, 만료 처리

### 수용 기준

- ✅ Google OAuth 로그인 성공 (Playwright E2E 통과)
- ✅ JWT 토큰 발급 + localStorage 저장
- ✅ 로그아웃 시 토큰 삭제 + `/login` 리다이렉트
- ✅ 모든 테스트 성공

---

## Phase 2: 화면 개발 (Sprint 2)

**Duration**: 2주
**Priority**: High
**목표**:
- ✅ 미완성 페이지 4개 UI 개발 완료
- ✅ HomePage 명언 피드 카드 UI 완성
- ✅ Mock 데이터로 모든 화면 렌더링 검증
- ✅ 92개 테스트 모두 통과

### 구현 과제

| 작업명 | 타입 | 담당 | 노력도 | 상태 | 의존성 | 상세 |
|--------|------|------|--------|------|--------|------|
| CommunityListPage UI 개발 | FE 구현 | FE | H | ✅ Completed | - | 게시글 카드 리스트 + PostCard 컴포넌트, 카테고리 필터, 페이지네이션 |
| CommunityDetailPage UI 개발 | FE 구현 | FE | H | ✅ Completed | - | 게시글 상세 + 댓글 폼(react-hook-form + zod) + 공감 버튼 |
| BooksPage UI 개발 | FE 구현 | FE | H | ✅ Completed | - | 도서 카드 Grid + BookCard 컴포넌트, 반응형(2/3/4열), 스크랩 기능 |
| QuotesPage 신규 개발 | FE 구현 | FE | H | ✅ Completed | - | 명언 피드 + QuoteCard, 이전/다음 네비게이션 (20개 mock) |
| HomePage 명언 피드 완성 | FE 구현 | FE | M | ✅ Completed | - | "오늘의 명언" 프리뷰 섹션 + /quotes 링크 |
| Mock 데이터 작성 | FE 구현 | FE | M | ✅ Completed | UI 개발 | 각 페이지에 통합됨 — 게시글 12개, 도서 12개, 명언 20개 |
| 반응형 검증 (320-1024px) | FE 검증 | FE | M | ✅ Completed | UI 개발 | grid-cols-{1,2,3,4} + sm:/lg: breakpoints 적용 |
| CommunityListPage 화면 테스트 | 테스트 (vitest) | QA | M | ✅ Completed (18 tests) | UI 개발 | 카드 렌더링, 필터 동작, 페이지네이션 검증 |
| CommunityDetailPage 화면 테스트 | 테스트 (vitest) | QA | M | ✅ Completed (23 tests) | UI 개발 | 게시글/댓글 렌더링, 공감 토글, 댓글 CRUD |
| BooksPage 화면 테스트 | 테스트 (vitest) | QA | M | ✅ Completed (10 tests) | UI 개발 | 도서 카드 렌더링, 스크랩 토글 |
| QuotesPage 화면 테스트 | 테스트 (vitest) | QA | M | ✅ Completed (17 tests) | 명언 개발 | 명언 카드 렌더링, 페이지 네비게이션 |
| PostCard/BookCard 컴포넌트 테스트 | 테스트 (vitest) | QA | M | ✅ Completed (24 tests) | UI 개발 | 재사용 컴포넌트 렌더링 + 상호작용 |

### 기술 고려사항

- ✅ Mock 데이터 구조 백엔드 API 스펙과 일치
- ✅ 댓글 폼은 react-hook-form + zod 패턴 (CommunityNewPage 참조)
- ✅ Tailwind v4 그리드/flex 활용, CSS 파일 없음
- ✅ 모든 컴포넌트 @/ 경로 alias 사용

### 테스트 계획 (완료)

- ✅ **CommunityListPage 렌더링** — 18 tests passed
  - Mock 게시글 12개 노출, 필터/페이지네이션 동작 검증

- ✅ **CommunityDetailPage 렌더링** — 23 tests passed
  - 게시글/댓글 렌더링, 공감 토글, 댓글 CRUD 검증

- ✅ **BooksPage 렌더링** — 10 tests passed
  - 도서 12개 Grid, 스크랩 토글 검증

- ✅ **QuotesPage 렌더링** — 17 tests passed
  - 명언 카드 + 인물명, 페이지 네비게이션 검증

### 수용 기준 (완료)

- ✅ 4개 페이지 + HomePage 명언 UI 완성
- ✅ Mock 데이터로 모든 화면 렌더링 검증 완료
- ✅ 반응형 레이아웃 구현 (320/768/1024px)
- ✅ 92개 단위 테스트 모두 통과
- ✅ 백엔드 API 스펙과 Mock 데이터 일치
- ✅ 프로덕션 빌드 성공 (dist/ 생성)

---

## Phase 3: API 연동 (Sprint 3)

**Duration**: 2주
**Priority**: Critical
**목표**:
- 백엔드 CRUD API 전체 구현
- Phase 2 UI에 실제 API 데이터 연동
- useApi 훅 활성화 및 로딩/에러 처리

### 구현 과제

| 작업명 | 타입 | 담당 | 노력도 | 상태 | 의존성 | 상세 |
|--------|------|------|--------|------|--------|------|
| 게시글 CRUD API | BE 구현 | BE | H | Pending | Phase 1 완료 | GET /posts, POST /posts, GET /posts/:id, DELETE /posts/:id |
| 댓글 CRUD API | BE 구현 | BE | H | Pending | 게시글 API | GET /posts/:id/comments, POST /posts/:id/comments, DELETE /comments/:id |
| 공감(좋아요) API | BE 구현 | BE | M | Pending | 게시글 API | POST /posts/:id/likes, DELETE /posts/:id/likes, GET /posts/:id/likes |
| 도서 목록 API | BE 구현 | BE | M | Pending | Phase 1 완료 | GET /books (페이지네이션) |
| 명언 목록 API | BE 구현 | BE | M | Pending | Phase 1 완료 | GET /quotes (무한 스크롤) |
| CommunityListPage 연동 | FE 구현 | FE | M | Pending | 게시글 API | useApi → GET /posts, 필터/페이지 관리 |
| CommunityDetailPage 연동 | FE 구현 | FE | M | Pending | 게시글/댓글/공감 API | useApi → 실시간 댓글/공감 반영 |
| CommunityNewPage 연동 | FE 구현 | FE | M | Pending | 게시글 API | form.handleSubmit → POST /posts, 성공 시 /community 리다이렉트 |
| BooksPage 연동 | FE 구현 | FE | M | Pending | 도서 API | useApi → GET /books, 스크롤 감지 |
| HomePage 명언 연동 | FE 구현 | FE | M | Pending | 명언 API | useApi → GET /quotes, 네비게이션 로드 |
| 로딩/에러 상태 UI | FE 구현 | FE | M | Pending | 모든 API 연동 | Spinner, 에러 메시지 |
| 게시글 CRUD E2E 테스트 | 테스트 (E2E) | QA | H | Pending | 게시글 API | Playwright: 작성 → 목록 갱신 → 상세 → 삭제 |
| 댓글/공감 E2E 테스트 | 테스트 (E2E) | QA | H | Pending | 댓글/공감 API | Playwright: 댓글 추가/삭제, 공감 카운트 갱신 |
| API 응답 단위 테스트 | 테스트 (vitest) | QA | M | Pending | 모든 API | 엔드포인트 성공/실패 응답 검증 |

### 기술 고려사항

- useApi 훅의 로딩/에러 상태로 UI 처리
- 낙관적 업데이트 (선택사항): 댓글/공감 즉시 UI 갱신
- 401 → 자동 로그아웃 + /login (Axios 인터셉터)

### 테스트 계획

- [ ] **게시글 CRUD E2E** — Playwright MCP
  - 로그인 → 작성 → 목록 갱신 → 상세 조회 → 삭제

- [ ] **댓글/공감 E2E** — Playwright MCP
  - 댓글 작성/삭제, 공감 카운트 갱신

- [ ] **API 응답 검증** — vitest
  - HTTP 200/201/204/401/400/500 처리

### 수용 기준

- ✅ 모든 API 구현 완료
- ✅ 모든 페이지에서 실제 데이터 로드
- ✅ 로딩/에러 상태 UI 적용
- ✅ 모든 E2E 및 단위 테스트 성공

---

## Phase 4: 마이페이지 + 통합 테스트 + 배포 (Sprint 4)

**Duration**: 2주
**Priority**: High
**목표**:
- MyPage API 연동
- 반응형/접근성 검증
- 통합 회귀 테스트
- 프로덕션 배포

### 구현 과제

| 작업명 | 타입 | 담당 | 노력도 | 상태 | 의존성 | 상세 |
|--------|------|------|--------|------|--------|------|
| 사용자 정보 API | BE 구현 | BE | M | Pending | Phase 1 완료 | GET /users/me (로그인 사용자 정보) |
| MyPage 연동 | FE 구현 | FE | M | Pending | GET /users/me API | useApi → 실제 user 데이터 |
| 모바일 반응형 검증 | FE 검증 | FE | M | Pending | Phase 3 완료 | 320px, 480px, 640px 테스트 |
| 태블릿 반응형 검증 | FE 검증 | FE | M | Pending | Phase 3 완료 | 768px, 1024px 테스트 |
| WCAG 2.1 AA 접근성 검증 | FE 검증 | FE | H | Pending | 모든 페이지 | 키보드 네비게이션, 스크린리더, 명도 대비 4.5:1 |
| 성능 최적화 | FE 최적화 | FE | M | Pending | Phase 3 완료 | Code splitting, 지연 로딩, 번들 크기 |
| 보안 검토 | DevOps | DevOps | M | Pending | 모든 API | HTTPS, CORS, XSS/CSRF 방어 |
| 통합 회귀 E2E 테스트 | 테스트 (E2E) | QA | H | Pending | Phase 3 완료 | 전체 사용자 플로우: 로그인 → 피드 → 작성 → 댓글 → 공감 → 마이페이지 → 로그아웃 |
| Vercel/Railway 배포 | DevOps | DevOps | M | Pending | 모든 완성 | 프로덕션 환경 설정, 환경 변수, DB 마이그레이션 |
| 배포 후 검증 | QA | QA | M | Pending | 배포 완료 | 라이브 환경 스모크 테스트, API 응답 속도 |

### 기술 고려사항

- Lighthouse 점수 목표: 성능 > 80, 접근성 > 90
- 환경 변수: VITE_API_BASE_URL, Google OAuth 클라이언트 ID 등
- 배포 전 스테이징 환경에서 최종 검증

### 테스트 계획

- [ ] **전체 사용자 플로우 E2E** — Playwright MCP
  - 비로그인 → 로그인 → 피드 → 커뮤니티 → 작성 → 상세 → 도서 → 마이페이지 → 로그아웃

- [ ] **반응형 레이아웃** — 브라우저 개발자 도구
  - 320px, 768px, 1024px에서 모든 페이지 검증

- [ ] **접근성 검증** — axe DevTools / Lighthouse
  - 키보드 네비게이션, 명도 대비, 포커스 표시

- [ ] **성능 측정** — Lighthouse CI
  - FCP < 2s, LCP < 2.5s

### 수용 기준

- ✅ MyPage API 연동 완료
- ✅ 모든 페이지 반응형 검증 완료
- ✅ WCAG 2.1 AA 접근성 (Lighthouse > 90)
- ✅ 통합 E2E 테스트 통과
- ✅ 프로덕션 배포 완료
- ✅ 라이브 환경 스모크 테스트 성공

---

## 의존성 & 크리티컬 패스

```
Phase 1 (Google OAuth + JWT)
  ├─→ Phase 2 병렬 (UI 개발 독립)
  └─→ Phase 3 (API 연동)
         └─→ Phase 4 (통합 + 배포)
```

**Critical Path**: Phase 1 → Phase 3 (API 의존성)
**병렬 진행**: Phase 1 중 Phase 2 UI 동시 진행 가능

---

## 리스크 & 대응

| 리스크 | 영향 | 확률 | 대응 |
|--------|------|------|------|
| 백엔드 API 지연 | 높음 | 중간 | Phase 2 Mock 데이터로 UI 완성, 독립 진행 |
| 데이터 구조 불일치 | 중간 | 중간 | Phase 2에서 Mock ↔ API 스펙 동기화 |
| 성능 저하 | 중간 | 낮음 | Phase 3에서 로딩 UI, 재시도 로직 |
| 배포 실패 | 높음 | 낮음 | Phase 4 초반 테스트 환경 검증 |
| 접근성 미달 | 중간 | 중간 | Phase 4에서 Lighthouse 90+ 목표 |

---

## 기술 부채

| 항목 | 상태 | 계획 |
|------|------|------|
| 대댓글 | 스코프 아웃 | Phase 2 구조 설계 |
| 게시글 수정 | 스코프 아웃 | Phase 3.5 |
| 푸시 알림 | 스코프 아웃 | 규모 확대 후 |
| 이미지 업로드 | 스코프 아웃 | S3 인프라 구축 후 |

---

## 성공 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 기능 완성 | 9개 기능 100% | 수용 기준 체크 |
| 테스트 커버리지 | 60% 이상 | npm run test:coverage |
| 성능 | Lighthouse > 80 | Lighthouse CI |
| 접근성 | WCAG 2.1 AA | axe DevTools |
| 반응형 | 320-1024px 지원 | 브라우저 테스트 |

---

**마지막 업데이트**: 2026-03-22 (Phase 2 완료)
**버전**: 2.1 (Phase 2 완전 완료, 92개 테스트 통과)
