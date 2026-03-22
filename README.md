# 센시 (Sensi) - HSP를 위한 공감 커뮤니티

> "민감한 영혼들이 모여 서로를 이해하고 위로받으며, 자신의 기질을 강점으로 재발견하는 따뜻한 공간"

**센시**는 HSP(Highly Sensitive Person, 민감한 기질을 가진 사람)들을 위한 공감 기반 커뮤니티 웹 서비스입니다.

## ✨ 주요 기능

- 🎬 **유튜브 콘텐츠 추천** - HSP에게 도움이 되는 유튜브 영상 큐레이션
- 📚 **도서 큐레이션** - 민감함을 이해하고 성장할 수 있는 도서 추천
- 💬 **공감 커뮤니티** - 비슷한 기질을 가진 사람들과 경험 공유 및 소통
- ✨ **위인 명언** - HSP 특성을 가진 역사적 인물들의 영감 있는 명언

## 🛠 기술 스택

### 프론트엔드
- **React 19** + **Vite 7** - 빠른 개발 서버와 최적화된 빌드
- **Tailwind CSS v4** - 유틸리티 기반 스타일링
- **shadcn/ui** - 접근성 높은 UI 컴포넌트
- **Zustand** - 가벼운 상태 관리
- **React Router v7** - 중첩 라우트 기반 라우팅
- **React Hook Form + Zod** - 폼 관리 및 타입 안전 검증
- **Axios** - HTTP 클라이언트

### 백엔드 (향후 구현)
- **Node.js** + **Express.js** / **Fastify**
- **TypeScript** - 타입 안전성
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스

## 📁 디렉토리 구조

```
src/
├── components/
│   ├── ui/          # shadcn/ui 컴포넌트
│   ├── layout/      # Header, Footer, Sidebar
│   └── common/      # DataTable, PageHeader, EmptyState, Spinner
├── layouts/         # RootLayout, AuthLayout, DashboardLayout
├── pages/
│   ├── auth/        # LoginPage, RegisterPage
│   ├── home/        # 홈 피드
│   ├── books/       # 도서 목록/상세
│   ├── videos/      # 유튜브 목록/상세
│   ├── quotes/      # 위인 명언
│   ├── community/   # 커뮤니티 게시판
│   └── mypage/      # 마이페이지
├── router/          # React Router 설정
├── stores/          # Zustand 상태 관리
├── services/        # API 클라이언트
├── hooks/           # 커스텀 훅
└── lib/             # 유틸리티 함수
```

## 🚀 시작하기

### 1. 환경 설정

```bash
# 저장소 클론
git clone https://github.com/wkimdev/sensi.git
cd sensi

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에서 필요한 변수 수정
```

### 2. 개발 실행

```bash
# 개발 서버 시작 (localhost:5173)
npm run dev

# ESLint 검사
npm run lint

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🎯 라우트 구조

### 비로그인 영역
| 경로 | 설명 |
|------|------|
| `/` | 홈/랜딩 페이지 |
| `/login` | 로그인 |
| `/register` | 회원가입 |

### 로그인 영역
| 경로 | 설명 |
|------|------|
| `/dashboard` | 홈 피드 |
| `/books` | 도서 목록/상세 |
| `/videos` | 유튜브 추천 목록/상세 |
| `/quotes` | 위인 명언 |
| `/community` | 커뮤니티 게시판 |
| `/community/new` | 게시글 작성 |
| `/community/:id` | 게시글 상세/댓글 |
| `/mypage` | 마이페이지 (프로필, 활동, 스크랩) |

## 🔐 인증

- **OAuth 2.0 로그인**: Google, Apple, Naver, Kakao
- **JWT 토큰 기반** 인증
- **자동 로그아웃**: 401 응답 시 자동 리다이렉트

## 📋 프로젝트 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md) - 상세한 기획서
- [CLAUDE.md](./CLAUDE.md) - Claude Code 개발 가이드

## 📦 개발 단계

### Phase 1 (MVP) - 현재
- ✅ 기본 CRUD 기능
- ✅ SNS 회원가입/로그인
- ✅ 콘텐츠 큐레이션 (도서, 유튜브, 명언)
- ✅ 커뮤니티 게시판
- ✅ 공감 반응 및 스크랩

### Phase 2 (1-2개월 후)
- 🔄 푸시 알림
- 🔄 게시글/댓글 수정 기능
- 🔄 신고/차단 기능
- 🔄 이미지 업로드

### Phase 3 (4-6개월 후)
- 🔄 팔로우 시스템
- 🔄 DM 기능
- 🔄 모바일 앱 (iOS/Android)
- 🔄 다국어 지원

## 🤝 기여

이 프로젝트에 기여하고 싶으신 분들을 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 라이선스

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 연락처

- 📧 이메일: contact@sensi.app (예정)
- 🐙 GitHub Issues: [이슈 제출](https://github.com/wkimdev/sensi/issues)

---

**Made with ♥ for Highly Sensitive People**
