# Sensi 프로젝트 개발 표준

## 프로젝트 개요

**Sensi**는 React, Vite, Zustand로 구축한 HSP(극도로 민감한 사람)를 위한 공감 커뮤니티 웹 서비스 MVP입니다.

| 속성 | 값 |
|----------|-------|
| 유형 | React Router v7이 포함된 React SPA |
| 상태 | MVP(최소 기능 제품) |
| 대상 | HSP 커뮤니티의 인증된 사용자 |
| 빌드 도구 | Vite 7.3.1 |
| 주요 프레임워크 | React 19.2.4 |

## 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── components/
│   ├── ui/                    # shadcn/ui 컴포넌트 (불변)
│   ├── layout/                # Header, Footer (레이아웃 수준의 조합)
│   └── common/                # 여러 페이지에서 재사용 가능
├── pages/                     # 기능별 라우트 페이지
│   ├── auth/                  # LoginPage
│   ├── community/             # CommunityListPage, CommunityNewPage, CommunityDetailPage
│   ├── books/                 # BooksPage
│   ├── mypage/                # MyPage
│   ├── HomePage.jsx
│   ├── NotFoundPage.jsx
│   └── ErrorPage.jsx
├── layouts/                   # RootLayout, AuthLayout
├── stores/                    # Zustand 스토어 (authStore)
├── services/                  # API 레이어 (api.js)
├── hooks/                     # 커스텀 훅 (useApi)
├── router/                    # 라우터 설정 (index.jsx)
├── lib/                       # 유틸리티 (cn() 함수가 있는 utils.js)
├── index.css                  # CSS 변수 및 Tailwind 전역 스타일
└── main.jsx                   # React 진입점
```

### 레이아웃 계층

| 레이아웃 | 경로 | 컴포넌트 |
|--------|--------|-----------|
| `RootLayout` | `/`, `/community/*`, `/books`, `/mypage` | Header + Footer + Toaster |
| `AuthLayout` | `/login` | 중앙 카드 + Toaster |

## 기술 스택

| 패키지 | 버전 | 목적 |
|---------|---------|---------|
| react | 19.2.4 | UI 프레임워크 |
| react-router | 7.13.1 | 클라이언트 측 라우팅 |
| zustand | 5.0.11 | 상태 관리 |
| axios | 1.13.6 | HTTP 클라이언트 |
| react-hook-form | 7.71.2 | 폼 상태 관리 |
| zod | 4.3.6 | 스키마 검증 |
| @tailwindcss/vite | 4.2.1 | Vite 플러그인이 포함된 Tailwind CSS v4 |
| @radix-ui/* | 다양함 | 헤드리스 UI 기본 요소 (shadcn 기반) |
| sonner | 2.0.7 | 토스트 알림 |
| lucide-react | 0.577.0 | 아이콘 라이브러리 |
| vite | 7.3.1 | 빌드 도구 |
| vitest | 3.2.4 | 테스트 러너 (jsdom 환경) |

## 코드 표준

### Import 규칙 (중요)

- **반드시** 모든 `src/` import에 `@/` 별칭 접두사 사용
- **절대** 상대 경로(`../`, `./`) 사용 금지
- **예시**: `import Button from '@/components/ui/button'` ✅ (`from '../../components/ui/button'`이 아님)
- 별칭 매핑: `@ → src/` (`vite.config.js`와 `jsconfig.json`에 설정)

### 명명 규칙

- **컴포넌트**: PascalCase (React에서 필수)
- **파일**: 컴포넌트 이름과 일치 (`HomePage.jsx`, `LoginPage.jsx`)
- **변수/함수**: camelCase
- **상수**: UPPER_SNAKE_CASE (내보낸 경우) 또는 camelCase (내부)
- **스토어 파일**: Store 접미사가 있는 소문자 (`authStore.js`)

### 파일 확장자

- React 컴포넌트: `.jsx`
- 일반 JavaScript: `.js`
- 스타일: 별도의 CSS 파일 없음 — Tailwind 및 `src/index.css` @layer 사용

## 컴포넌트 아키텍처

### 컴포넌트 계층

```
shadcn/ui (src/components/ui/)
├─ 목적: 미리 빌드된 헤드리스 컴포넌트
├─ 규칙: 불변 — 직접 수정 금지
└─ 업데이트: `npx shadcn@latest add <name>` 사용

공통 컴포넌트 (src/components/common/)
├─ 목적: 2개 이상의 페이지에서 재사용
├─ 예시: PageHeader, EmptyState, Spinner, ProtectedRoute
└─ 규칙: 단일 책임, 조합 가능

페이지 컴포넌트 (src/pages/{feature}/)
├─ 목적: 한 페이지 내에서만 사용
├─ 규칙: 페이지 디렉토리에 유지 (common/ 아님)
└─ 구성: 페이지 수준의 기능 조율

레이아웃 컴포넌트 (src/components/layout/)
├─ 목적: Header, Footer (레이아웃 수준의 조합)
└─ 사용: 라우터 레이아웃 요소로 감싸짐
```

### 컴포넌트 의사결정 트리

| 질문 | 답변 | 조치 |
|----------|--------|--------|
| shadcn/ui에 이 컴포넌트가 있나요? | 예 | `npx shadcn@latest add <component-name>` |
| 2개 이상의 페이지에서 사용되나요? | 예 | `src/components/common/`에서 생성 |
| 1개 페이지에서만 사용되나요? | 예 | 페이지 디렉토리에 유지 |
| 비즈니스 로직을 포함하나요? | 예 | `src/hooks/`에서 커스텀 훅 추출 |

## 상태 관리 (Zustand)

### 스토어 패턴

```jsx
// src/stores/authStore.js
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        setAuth: ({ user, token }) => set({ user, token }),
        clearAuth: () => set({ user: null, token: null }),
      }),
      {
        name: 'auth-storage', // localStorage 키
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    ),
    { name: 'auth-store' }
  )
)
```

### 스토어 사용 규칙

- **컴포넌트 내**: 훅 사용: `const { user, token } = useAuthStore()`
- **훅 아닌 컨텍스트**: `useAuthStore.getState()` 사용 (예: API 인터셉터)
- **Persist 미들웨어**: 자동으로 `localStorage('auth-storage')`에 동기화
- **새 스토어**: `persist` 미들웨어를 포함한 동일한 패턴 준수 필수

## API 레이어

### Axios 설정 (src/services/api.js)

- **단일 인스턴스**: 모든 API 호출이 이 인스턴스를 통과
- **기본 URL**: `VITE_API_BASE_URL` 환경 변수에서 (기본값: `/api`)
- **요청 인터셉터**: 자동으로 `Authorization: Bearer {token}` 헤더 추가
- **응답 인터셉터**: 자동으로 `response.data` 언래핑 (데이터 직접 반환)
- **401 핸들러**: `clearAuth()` 호출 후 `/login`으로 리다이렉트

### API 호출 패턴

```jsx
// 컴포넌트 상태 관리를 위해 useApi 훅 사용
const { data, loading, error, execute } = useApi(async () => {
  return await api.post('/posts', { title, content })
})

// 응답이 이미 언래핑됨 (.data 필요 없음)
const result = await execute()
// result = { id: 1, title: '...', ... } NOT { data: { id: 1, ... } }
```

### useApi 훅 패턴

```jsx
// src/hooks/useApi.js 서명:
// useApi(apiFunction) → { data, loading, error, execute, reset }

const { data: posts, loading, error, execute } = useApi(
  async () => api.get('/posts')
)

// Execute는 데이터를 직접 반환 (이미 언래핑됨)
const newPost = await execute()
```

## 폼 처리

### 패턴 (참조: CommunityNewPage)

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const schema = z.object({
  title: z.string().min(1, '필수'),
  content: z.string().min(10),
})

export default function Page() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { title: '', content: '' } })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>제목</FormLabel>
            <FormControl><input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  )
}
```

### 규칙

- **반드시** `react-hook-form` + `zod` 조합 사용
- **반드시** `@hookform/resolvers/zod`에서 `zodResolver` 사용
- **반드시** shadcn/ui Form 컴포넌트 사용 (Form, FormField, FormItem 등)
- **스키마** 정의: 먼저 `z.object({...})` 생성, 그 후 `useForm({ resolver: zodResolver(schema) })`에 전달

## 라우팅 & 레이아웃

### 라우터 설정 (src/router/index.jsx)

- **구조**: 레이아웃 감싸기를 포함한 중첩 라우트
- **RootLayout**: 인증된 라우트 + 홈 감싸기
- **AuthLayout**: 로그인 전용 라우트 감싸기
- **ProtectedRoute**: 인증된 페이지용 래퍼 컴포넌트

### 새 페이지 추가 (다중 파일 조정)

**단계 1**: 페이지 파일 생성
```
src/pages/{feature}/{PageName}.jsx
```

**단계 2**: 레이아웃으로 라우터에 등록
```jsx
// src/router/index.jsx
{
  path: '/',
  element: <RootLayout />,
  children: [
    {
      path: 'myfeature',
      element: <ProtectedRoute><MyFeaturePage /></ProtectedRoute>,
    },
  ],
}
```

**단계 3**: 레이아웃 선택
- 인증된 경우: `RootLayout` + `ProtectedRoute`
- 로그인 페이지: `AuthLayout` (보호 없음)

### 라우트 경로 규칙

- 루트 라우트: `/`
- 기능 라우트: `/feature`
- 중첩 (상세): `/feature/:id`
- 생성 동작: `/feature/new`

## 스타일 표준

### Tailwind CSS v4 설정

- **설정 파일 없음**: Vite에서 `@tailwindcss/vite` 플러그인 사용 (`tailwind.config.js` 없음)
- **CSS 변수**: `src/index.css` @layer base에 정의 (shadcn 테마 토큰 따름)
- **유틸리티 병합**: `@/lib/utils.js`에서 `cn()` 사용 (clsx + tailwind-merge)

### CSS 변수 패턴

```css
/* src/index.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    /* ... */
  }
}
```

### 클래스 병합

```jsx
import { cn } from '@/lib/utils'

// 동적 클래스 구성을 위해 항상 cn() 사용
<div className={cn('bg-blue-500', isActive && 'opacity-50')}>
  내용
</div>
```

### 스타일 규칙

- **반드시** Tailwind 유틸리티 사용 (인라인 스타일 아님)
- **반드시** 조건부 클래스에 `cn()` 사용
- **절대** 새로운 CSS 파일 생성 금지 (전역은 `src/index.css` @layer 사용)
- **절대** `tailwind.config.js` 생성 금지 (v4 플러그인과 충돌)

## 파일 조정

### 중요한 다중 파일 변경

| 작업 | 업데이트할 파일 | 참고 사항 |
|------|-----------------|-------|
| 새 페이지 추가 | `src/pages/{feature}/{Page}.jsx` + `src/router/index.jsx` | 레이아웃을 선택하고 필요하면 ProtectedRoute로 감싸기 |
| 새 폼 추가 | 스키마 (zod) + 컴포넌트 + API 호출 (useApi) | CommunityNewPage 패턴 따르기 |
| 스토어 생성 | `src/stores/{name}Store.js` + 컴포넌트에 등록 | 항상 persist 미들웨어 추가 |
| API 엔드포인트 변경 | 컴포넌트의 모든 useApi 호출 확인 | 응답이 이미 언래핑됨 |
| shadcn/ui 업데이트 | `npx shadcn@latest add <name>` | ui/ 파일 직접 수정 금지 |
| 재사용 가능한 컴포넌트 추가 | `src/components/common/{Component}.jsx` | 2개 이상의 페이지에서 사용되는 경우만 |

## 해야 할 규칙 (필수 사항)

1. **해야 함** 모든 src/ import에 `@/` import 별칭 사용
2. **해야 함** `src/router/index.jsx`에 명시적 레이아웃으로 새 페이지 등록
3. **해야 함** 조건부 클래스에 `@/lib/utils.js`의 `cn()` 유틸리티 사용
4. **해야 함** 라우터에서 인증된 페이지를 `ProtectedRoute`로 감싸기
5. **해야 함** 인터셉터 (훅 아닌 컨텍스트)에서 `useAuthStore.getState()` 사용
6. **해야 함** 모든 폼에 react-hook-form + zod 패턴 준수
7. **해야 함** `src/components/ui/*`를 불변으로 유지 — 업데이트는 `npx shadcn@latest add` 사용
8. **해야 함** 재사용 가능한 컴포넌트를 `src/components/common/`에 추가
9. **해야 함** API 호출에 로딩/오류/데이터 상태를 포함하는 `useApi` 훅 사용
10. **해야 함** 페이지 특정 컴포넌트를 페이지 디렉토리에 배치
11. **해야 함** localStorage 동기화를 위해 Zustand `persist` 미들웨어 사용
12. **해야 함** API 응답을 언래핑된 데이터로 예상 (`.data` 접근자 필요 없음)
13. **해야 함** `src/test/setup.js` 파일 생성 (vitest 설정에서 참조)
14. **해야 함** 테스트 파일은 대상 파일과 같은 디렉토리에 배치 (`.test.jsx` 또는 `.test.js` 확장자)
15. **해야 함** 사용자 상호작용은 `@testing-library/user-event` 사용 (fireEvent 피함)
16. **해야 함** 비동기 작업은 React Testing Library의 `waitFor` 사용

## 하지 말아야 할 규칙 (금지 사항)

1. **하지 말 것** import에 상대 경로 사용 — `@/` 별칭 사용
2. **하지 말 것** shadcn/ui 컴포넌트 직접 수정 — `npx shadcn@latest add` 사용
3. **하지 말 것** `persist` 미들웨어 없이 새 Zustand 스토어 생성
4. **하지 말 것** React 컴포넌트 내부에서 `getState()` 호출 — 대신 훅 사용
5. **하지 말 것** 새 페이지의 라우터 등록 건너뛰기
6. **하지 말 것** 새 페이지의 레이아웃 선택 (RootLayout vs AuthLayout) 잊기
7. **하지 말 것** API 응답에 `.data` 접근자 추가 (인터셉터에서 이미 언래핑됨)
8. **하지 말 것** `tailwind.config.js` 생성 (v4 + @tailwindcss/vite와 충돌)
9. **하지 말 것** React 컴포넌트에 소문자 이름 사용
10. **하지 말 것** localStorage에 암호화 없이 민감한 데이터 저장
11. **하지 말 것** 인증된 페이지의 `ProtectedRoute` 우회
12. **하지 말 것** 새로운 CSS 파일 추가 — `src/index.css`의 `@layer` 또는 Tailwind 유틸리티 사용
13. **하지 말 것** `fireEvent` 사용 — `userEvent` 사용 (테스트)
14. **하지 말 것** 테스트 없이 새로운 기능 추가 (특히 폼, API 호출, 상태 관리)
15. **하지 말 것** `document.querySelector` 또는 직접 DOM 조작 (테스트에서) — React Testing Library 쿼리 사용
16. **하지 말 것** 테스트에서 구현 세부사항 테스트 — 사용자 동작과 출력 중심

## 의사결정 트리 (AI 의사결정)

### Q: 새 컴포넌트는 어디에 배치해야 하나요?

```
shadcn/ui에 있나요?
├─ 예 → npx shadcn@latest add <component-name>
└─ 아니오 → 계속

2개 이상의 페이지에서 사용되나요?
├─ 예 → src/components/common/{Component}.jsx
└─ 아니오 → src/pages/{feature}/{Component}.jsx
```

### Q: 인증 상태에 어떻게 접근하나요?

```
코드가 어디에 있나요?
├─ React 컴포넌트 내부 → useAuthStore() 훅 사용
└─ 컴포넌트 외부 (인터셉터, 유틸리티) → useAuthStore.getState() 사용
```

### Q: API 호출은 어떻게 하나요?

```
컴포넌트에서?
├─ 예 → useApi(apiFunction) 훅 사용
│       반환: { data, loading, error, execute }
│       API가 이미 response.data를 언래핑함
└─ 아니오 → api 직접 호출
        응답이 언래핑됨 (response.data)
```

### Q: 새 페이지 구조는 어떻게 하나요?

```
1. 파일 생성: src/pages/{feature}/{PageName}.jsx
2. 기본 컴포넌트 내보내기 (PascalCase)
3. src/router/index.jsx에 등록:
   ├─ 레이아웃 선택 (RootLayout 또는 AuthLayout)
   ├─ 인증된 경우 ProtectedRoute로 감싸기
   └─ 경로 및 요소 설정
4. 선택사항: 같은 디렉토리에 페이지 특정 컴포넌트 생성
```

### Q: 폼 검증은 어떻게 처리하나요?

```
1. zod 스키마 정의: z.object({ field: z.string().min(1) })
2. useForm 생성: useForm({ resolver: zodResolver(schema) })
3. Form, FormField, FormItem, FormLabel, FormControl, FormMessage 사용
4. CommunityNewPage 패턴 정확히 따르기
```

### Q: 이 컴포넌트는 어떻게 스타일링해야 하나요?

```
스타일 필요 사항 확인:
├─ 동적 클래스 → @/lib/utils.js의 cn() 사용
├─ 테마 색상 → src/index.css의 CSS 변수 사용 (--background, --foreground 등)
├─ 유틸리티 → Tailwind 클래스 (bg-blue-500, p-4 등)
└─ 전역 스타일 → src/index.css @layer base에 추가
```

### Q: 이 기능을 어떻게 테스트해야 하나요?

```
기능 유형 확인:
├─ React 컴포넌트 → React Testing Library 사용, userEvent로 상호작용 테스트
├─ 커스텀 훅 → renderHook 사용, 상태 변화 검증
├─ 폼 → react-hook-form + Zod 검증 테스트, CommunityNewPage.test.jsx 참조
├─ API 호출 → useApi 훅 테스트, vi.fn()으로 API 모의화
├─ Zustand 스토어 → getState() 사용 직접 테스트
└─ 유틸리티 함수 → 입출력 검증, 엣지 케이스 확인
```

### Q: 테스트는 어떻게 하나요?

```
테스트 환경: jsdom (vitest)
설정 파일: src/test/setup.js
테스트에서 별칭: @ = src/
명령어: npm run test (한 번), npm run test:watch (개발)
커버리지: npm run test:coverage
```

## 금지된 작업

- ❌ `src/components/ui/` 파일 직접 수정
- ❌ `tailwind.config.js` 생성
- ❌ import에 상대 경로 사용
- ❌ `persist` 미들웨어 없이 새 스토어 추가
- ❌ 인증된 페이지의 ProtectedRoute 건너뛰기
- ❌ 새로운 CSS 파일 생성
- ❌ React 컴포넌트에서 `getState()` 호출
- ❌ 업데이트를 위해 shadcn/ui add 명령어 우회
- ❌ API 응답에 `.data` 접근자 추가

## ESLint 설정

### 설정 파일

- **위치**: `eslint.config.js` (ESLint v9+ 플랫 설정)
- **명령**: `npm run lint`

### 이 프로젝트에 특정한 규칙

| 규칙 | 설정 | 이유 |
|------|--------|--------|
| `no-unused-vars` | varsIgnorePattern: `^[A-Z_]` | React 컴포넌트와 언더스코어로 시작하는 변수 무시 |
| `react-refresh/only-export-components` | warn (allowConstantExport) | shadcn/ui는 같은 파일에서 variants와 컴포넌트를 내보냄 |

### 의미하는 바

- 소문자 미사용 변수는 lint 오류 트리거
- 대문자 미사용 변수 (컴포넌트)는 오류 트리거하지 않음
- `_variable`은 오류 트리거하지 않음
- 이 경고 무시에 대한 조치 불필요

## 테스트 표준

### 테스트 환경

- **테스트 러너**: vitest 3.2.4
- **DOM 환경**: jsdom
- **테스트 라이브러리**: @testing-library/react 16.3.2
- **설정 파일**: vite.config.js (test 속성)

### 테스트 파일 위치 및 명명

```
src/
├── components/
│   ├── ui/Button.jsx
│   ├── ui/Button.test.jsx          # UI 컴포넌트 테스트
│   ├── common/
│   │   ├── PageHeader.jsx
│   │   └── PageHeader.test.jsx     # 공통 컴포넌트 테스트
│   └── layout/
│       ├── Header.jsx
│       └── Header.test.jsx         # 레이아웃 컴포넌트 테스트
├── pages/
│   ├── HomePage.jsx
│   ├── HomePage.test.jsx           # 페이지 테스트
│   └── community/
│       ├── CommunityNewPage.jsx
│       └── CommunityNewPage.test.jsx
├── hooks/
│   ├── useApi.js
│   └── useApi.test.js              # 훅 테스트
├── test/
│   └── setup.js                    # 테스트 초기화 (필수 생성)
```

**명명 규칙**: `.test.jsx` 또는 `.test.js` 확장자 사용

### 테스트 설정 파일 (src/test/setup.js)

필수 생성 파일:

```javascript
// src/test/setup.js
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 각 테스트 후 DOM 정리
afterEach(() => {
  cleanup()
})
```

### 테스트 패턴

#### 컴포넌트 테스트 (React Testing Library)

```javascript
// src/components/common/Button.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

#### 폼 테스트 (react-hook-form + Zod)

```javascript
// src/pages/community/CommunityNewPage.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommunityNewPage } from '@/pages/community/CommunityNewPage'

describe('CommunityNewPage', () => {
  it('should show validation errors when submitting empty form', async () => {
    render(<CommunityNewPage />)
    await userEvent.click(screen.getByText('등록'))
    expect(await screen.findByText('제목은 2자 이상이어야 합니다.')).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    render(<CommunityNewPage />)
    await userEvent.type(screen.getByPlaceholderText('제목을 입력하세요'), 'Test Title')
    // ... fill other fields ...
    await userEvent.click(screen.getByText('등록'))
    // assert success behavior
  })
})
```

#### API/Hook 테스트 (useApi)

```javascript
// src/hooks/useApi.test.js
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useApi } from '@/hooks/useApi'

describe('useApi Hook', () => {
  it('should handle successful API call', async () => {
    const mockApi = vi.fn().mockResolvedValue({ id: 1, title: 'Test' })
    const { result } = renderHook(() => useApi(mockApi))

    result.current.execute()

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1, title: 'Test' })
      expect(result.current.loading).toBe(false)
    })
  })

  it('should handle API errors', async () => {
    const mockApi = vi.fn().mockRejectedValue(new Error('API Error'))
    const { result } = renderHook(() => useApi(mockApi))

    try {
      await result.current.execute()
    } catch (e) {
      expect(result.current.error).toBeDefined()
    }
  })
})
```

#### Zustand 스토어 테스트

```javascript
// src/stores/authStore.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('should setAuth with user and token', () => {
    useAuthStore.getState().setAuth({ user: { id: 1 }, token: 'abc123' })
    const state = useAuthStore.getState()
    expect(state.user).toEqual({ id: 1 })
    expect(state.token).toBe('abc123')
  })

  it('should clearAuth', () => {
    useAuthStore.getState().setAuth({ user: { id: 1 }, token: 'abc123' })
    useAuthStore.getState().clearAuth()
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})
```

### 테스트 명령어

| 명령 | 목적 |
|------|------|
| `npm run test` | 모든 테스트 실행 (한 번) |
| `npm run test:watch` | 파일 변경 시 테스트 자동 재실행 |
| `npm run test:coverage` | 커버리지 보고서 생성 |

### 테스트 규칙

**해야 할 것**:
- API 호출은 Zustand `getState()` 사용해 모의화
- `vi.fn()` 사용해 콜백 또는 이벤트 핸들러 추적
- 비동기 작업은 `waitFor`로 대기
- 폼 입력은 `userEvent` 사용 (fireEvent 피함)
- 테스트는 사용자 동작 중심 (구현 세부사항 피함)

**하지 말 것**:
- 컴포넌트 내부 상태 직접 테스트 (props와 출력 테스트)
- DOM 노드 직접 조작 (`document.querySelector` 피함)
- API 응답 모의화 시 하드코딩된 URL 사용
- 타이밍 기반 테스트 (`sleep` 피함) — `waitFor` 사용

## 환경 변수

| 변수 | 목적 | 기본값 |
|----------|---------|---------|
| `VITE_API_BASE_URL` | API 엔드포인트 기본 URL | `/api` |

`.env` 또는 `.env.local`에서 설정 (git 무시됨)

## 마지막 업데이트

이 문서는 2026년 3월 22일 현재 Sensi 프로젝트 코드베이스를 반영합니다.
버전: 1.1

### 변경 사항 (v1.0 → v1.1)

- ✅ ESLint 설정 파일 위치 업데이트: `.eslintrc.cjs` → `eslint.config.js`
- ✅ 테스트 표준 섹션 추가 (vitest + React Testing Library)
- ✅ 테스트 파일 위치 및 명명 규칙 추가
- ✅ 컴포넌트, 폼, 훅, 스토어 테스트 패턴 예제 추가
- ✅ 테스트 설정 파일 (`src/test/setup.js`) 요구사항 문서화
- ✅ 테스트 관련 의사결정 트리 추가
- ✅ 테스트 관련 Do's 및 Don'ts 추가 (4개 규칙)
