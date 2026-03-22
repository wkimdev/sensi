import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  const handleGoogleLogin = async () => {
    try {
      // TODO: Google OAuth 2.0 연동
      // 실제 구현 시 api.get('/auth/google') → OAuth 리다이렉트
      await new Promise((r) => setTimeout(r, 800))
      setAuth({
        user: { name: 'HSP 사용자', email: 'user@example.com' },
        token: 'demo-token',
      })
      toast.success('로그인 성공!')
      const redirect = searchParams.get('redirect') || '/'
      navigate(redirect)
    } catch {
      toast.error('로그인에 실패했습니다.')
    }
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">센시에 오신 걸 환영합니다</CardTitle>
        <CardDescription>
          Google 계정으로 간편하게 시작하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={handleGoogleLogin}
        >
          Google로 계속하기
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          로그인 시 서비스 이용약관에 동의하게 됩니다.
        </p>
      </CardContent>
    </>
  )
}
