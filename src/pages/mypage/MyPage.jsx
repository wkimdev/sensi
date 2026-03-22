import { useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import PageHeader from '@/components/common/PageHeader'
import { useAuthStore } from '@/stores/authStore'

export default function MyPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <PageHeader title="마이페이지" description="프로필 정보를 확인합니다." />

      <Card>
        <CardHeader className="items-center">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarFallback className="text-xl">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{user?.name ?? '사용자'}</CardTitle>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">가입일</span>
            <span>{user?.joinedAt ?? '-'}</span>
          </div>
          <Separator />
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
