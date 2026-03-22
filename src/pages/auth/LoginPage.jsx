import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Heart } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send ID token to backend
      const response = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      })

      // Store auth info in Zustand store
      setAuth({
        user: response.user,
        token: response.accessToken,
      })

      // Save refresh token if provided
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken)
      }

      toast.success(`환영합니다, ${response.user.name}!`)

      // Redirect to intended page or home
      const redirect = searchParams.get('redirect') || '/'
      navigate(redirect)
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
      toast.error(errorMessage)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google 로그인에 실패했습니다.')
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
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          로그인 시 서비스 이용약관에 동의하게 됩니다.
        </p>
      </CardContent>
    </>
  )
}
