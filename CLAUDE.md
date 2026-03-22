# CLAUDE.md

센시(Sensi) - HSP를 위한 공감 커뮤니티 웹 서비스 MVP

## 명령어

```bash
npm run dev        # 개발 서버 (localhost:5173)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기
npm run lint       # ESLint 검사
```

## 아키텍처

### 레이아웃 계층

라우터에서 레이아웃을 중첩 라우트로 감싼다. 페이지를 새로 만들 때 반드시 어느 레이아웃에 속할지 결정하고 `src/router/index.jsx`에 등록해야 한다.

| 레이아웃 | 경로 | 구성 |
|---------|------|------|
| `RootLayout` | `/`, `/community/*`, `/books`, `/mypage` | Header + Footer + Toaster |
| `AuthLayout` | `/login` | 중앙 Card + Toaster |

### 사이트맵

```
비로그인
├── / (랜딩 페이지)
├── /login (Google 로그인)

로그인 후
├── / (홈 — 커뮤니티/도서/명언 바로가기)
├── /community (게시글 목록)
├── /community/new (게시글 작성)
├── /community/:id (게시글 상세 + 댓글)
├── /books (도서 목록)
└── /mypage (프로필 + 로그아웃)
```

### 컴포넌트 계층

- `src/components/ui/` — shadcn/ui 원본. **직접 수정 최소화**. 신규 컴포넌트는 `npx shadcn@latest add <name>` 패턴으로 추가한다.
- `src/components/layout/` — Header, Footer. 레이아웃 수준의 Organism.
- `src/components/common/` — 여러 페이지에서 재사용되는 조합 컴포넌트 (PageHeader, EmptyState, Spinner, ProtectedRoute).

### 상태 관리 (Zustand)

- `authStore` — `user`, `token` 보관. `persist` 미들웨어로 `localStorage('auth-storage')`에 자동 저장. 로그인: `setAuth({ user, token })`, 로그아웃: `clearAuth()`.

스토어 외부(인터셉터 등)에서 상태를 읽을 때는 `useAuthStore.getState()`를 사용한다 (훅 규칙 우회).

### API 레이어

`src/services/api.js`가 Axios 인스턴스 단일 진입점이다.

- 요청 시 `authStore`에서 토큰을 꺼내 `Authorization: Bearer` 헤더 자동 첨부.
- 응답은 `response.data`로 자동 unwrap되므로 호출부에서 `.data`를 다시 꺼낼 필요 없음.
- 401 응답 시 `clearAuth()` 호출 후 `/login`으로 리다이렉트.

API 호출 상태(`loading`, `error`, `data`)는 `src/hooks/useApi.js`의 `useApi(apiFunction)`로 관리한다.

### 폼 패턴

`react-hook-form` + `zod` + shadcn/ui `Form` 컴포넌트 조합을 표준으로 사용한다. `CommunityNewPage`가 참조 구현이다.

```jsx
const form = useForm({ resolver: zodResolver(schema), defaultValues: { ... } })
// <Form>, <FormField>, <FormItem>, <FormLabel>, <FormControl>, <FormMessage> 조합
```

### 경로 별칭

`@` → `src/` 로 매핑된다 (`vite.config.js` + `jsconfig.json`). 모든 import는 상대 경로 대신 `@/` 를 사용한다.

### CSS / 스타일

Tailwind CSS v4를 `@tailwindcss/vite` 플러그인으로 사용한다 (`tailwind.config.js` 없음). CSS 변수는 `src/index.css`의 `@layer base`에 정의되어 있으며 shadcn/ui 테마 토큰을 따른다. 클래스 병합은 `src/lib/utils.js`의 `cn()` (clsx + tailwind-merge) 함수를 사용한다.

### ESLint 주의사항

- `no-unused-vars`: 대문자 시작 변수(React 컴포넌트)와 `_` 접두사 변수는 무시됨.
- `react-refresh/only-export-components`: shadcn/ui `ui/` 파일은 variants와 컴포넌트를 같이 export하므로 warn으로 완화되어 있음 — 해당 경고는 무시해도 됨.

### PRD 기능 매핑 (docs/PRD.md)

| FID | 기능 | 페이지/컴포넌트 |
|-----|------|----------------|
| F-001 | Google 로그인 | `LoginPage` |
| F-003 | 로그인/로그아웃 | `authStore`, `Header`, `MyPage` |
| F-004 | 도서 목록 조회 | `BooksPage` |
| F-006 | 위인 명언 | `HomePage` (로그인 후) |
| F-007 | 게시글 조회/검색 | `CommunityListPage` |
| F-008 | 게시글 작성 | `CommunityNewPage` |
| F-009 | 댓글 작성/삭제 | `CommunityDetailPage` |
| F-010 | 공감 반응 | `CommunityDetailPage` |
| F-012 | 마이페이지 | `MyPage` |
