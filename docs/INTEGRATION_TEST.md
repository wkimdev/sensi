# 통합 테스트 가이드 (Phase 1 - 인증)

## 현재 상태
- ✅ 백엔드 기본 환경 구축 완료 (Express + Prisma + SQLite)
- ✅ Google OAuth 서비스 구현 완료
- ✅ JWT 토큰 관리 구현 완료
- ✅ 프론트엔드 LoginPage 구현 완료
- ✅ 환경 변수 파일 생성 완료
- ⏳ 통합 테스트 진행 중

## 1단계: 서버 시작

### 터미널 1 - 백엔드 시작
```bash
npm run dev
```
예상 출력:
```
Server is running on http://localhost:3001
Environment: development
Frontend URL: http://localhost:5173
```

### 터미널 2 - 프론트엔드 시작
```bash
cd ..  # 프론트엔드 루트로 이동
npm run dev
```
예상 출력:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## 2단계: 백엔드 상태 확인

### /health 엔드포인트 확인
```bash
curl http://localhost:3001/health
```

응답:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### POST /auth/google 엔드포인트 (테스트 토큰 없이)
```bash
curl -X POST http://localhost:3001/auth/google \
  -H 'Content-Type: application/json' \
  -d '{"idToken": "test-token"}'
```

응답 (예상, 실패):
```json
{
  "error": "...",
  "message": "..."
}
```

## 3단계: Google 로그인 설정 (필수)

Google OAuth를 실제로 테스트하려면:

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com

2. **OAuth 2.0 클라이언트 ID 생성**
   - 프로젝트 선택 또는 생성
   - API 및 서비스 > 사용자 인증 정보
   - 클라이언트 ID 생성 (웹 애플리케이션)

3. **리다이렉트 URI 설정**
   - 인가된 JavaScript 원본: `http://localhost:5173`
   - 인가된 리다이렉트 URI: `http://localhost:5173`

4. **.env 파일 업데이트**
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

5. **프론트엔드 재시작**
   ```bash
   # 터미널 2에서 Ctrl+C로 중단 후
   npm run dev
   ```

## 4단계: 프론트엔드에서 로그인 테스트

1. **LoginPage 접속**
   ```
   http://localhost:5173/login
   ```

2. **Google 로그인 버튼 클릭**
   - Google 팝업 또는 리다이렉트
   - 테스트 계정으로 로그인

3. **개발자 도구에서 확인 (F12)**
   ```
   콘솔 탭:
   - 에러 메시지 확인
   - Network 탭에서 /auth/google 요청 확인

   Application 탭:
   - localStorage에서 'auth-storage' 확인
   - { user: {...}, state: {...}, version: 0 } 형태
   ```

4. **예상 결과**
   - ✅ 로그인 성공 시 `/` (홈페이지)로 자동 리다이렉트
   - ✅ localStorage에 `{ user, token }` 저장
   - ✅ 새로고침 후에도 로그인 상태 유지
   - ✅ 토스트 메시지: "환영합니다, [사용자명]!"

## 5단계: 로그아웃 테스트

1. **마이페이지 접속**
   ```
   http://localhost:5173/mypage
   ```

2. **로그아웃 버튼 클릭**
   - 확인: localStorage 초기화
   - 확인: `/login`으로 리다이렉트
   - 확인: authStore.clearAuth() 실행

## 검증 체크리스트

### 백엔드
- [ ] 서버 포트 3001 시작
- [ ] /health 엔드포인트 200 응답
- [ ] /auth/google 엔드포인트 정의됨
- [ ] Prisma SQLite DB 생성됨 (dev.db)

### 프론트엔드
- [ ] 포트 5173 시작
- [ ] LoginPage 접속 가능
- [ ] GoogleLogin 컴포넌트 렌더링
- [ ] 환경 변수 로드됨

### 통합 (Google OAuth 필요)
- [ ] Google 로그인 성공
- [ ] accessToken authStore에 저장
- [ ] user 정보 authStore에 저장
- [ ] localStorage('auth-storage') 저장됨
- [ ] 자동 리다이렉트 완료 (/)
- [ ] 새로고침 후 로그인 상태 유지
- [ ] 로그아웃 완료

## 문제 해결

### 포트 충돌
```bash
# 포트 사용 확인
lsof -i :3001
lsof -i :5173

# 강제 종료
kill -9 <PID>
```

### CORS 에러
```
프론트엔드 → 백엔드 요청 시 CORS 에러
확인: backend/.env의 FRONTEND_URL이 올바른지 확인
```

### 로그인 실패
```
일반적 원인:
1. Google 클라이언트 ID 잘못됨
2. 리다이렉트 URI 등록 안됨
3. 백엔드 응답 지연

콘솔 확인: Network 탭에서 /auth/google 응답 코드 확인
```

## 다음 단계 (테스트 작성)

통합 테스트 확인 후:
- [ ] Vitest 단위 테스트 작성
- [ ] Playwright E2E 테스트 작성
- [ ] CI/CD 파이프라인 구축

