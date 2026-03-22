import { Link } from 'react-router'
import { Heart, BookOpen, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

// 홈 대시보드에 표시할 오늘의 명언 (날짜 기반으로 순환)
const DAILY_QUOTES = [
  {
    id: 1,
    text: '당신의 예민함은 약점이 아니라 강점입니다.',
    author: 'Elaine Aron',
  },
  {
    id: 2,
    text: '공감 능력은 세상에서 가장 혁명적인 힘 중 하나입니다.',
    author: 'Brené Brown',
  },
  {
    id: 3,
    text: '혼자 있는 시간은 자신을 발견하는 가장 강력한 방법이다.',
    author: 'Virginia Woolf',
  },
]

function getTodaysQuote() {
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  return DAILY_QUOTES[dayIndex % DAILY_QUOTES.length]
}

const features = [
  { icon: Heart, title: '공감 커뮤니티', desc: '비슷한 기질의 사람들과 안전하게 소통하고 공감받는 공간' },
  { icon: BookOpen, title: '추천 도서', desc: 'HSP에 도움되는 책을 큐레이션하여 자기 이해와 성장 지원' },
  { icon: Quote, title: '위인 명언', desc: 'HSP 특성의 위인들의 명언으로 영감과 위로를 전달' },
]

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const todayQuote = getTodaysQuote()

  // 로그인 사용자는 커뮤니티로 안내
  if (user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">안녕하세요, {user.name}님</h1>
          <p className="text-muted-foreground">
            오늘도 센시에서 따뜻한 이야기를 나눠보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Heart className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-base">커뮤니티</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>공감 게시글 읽기 및 작성</CardDescription>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link to="/community">바로가기</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <BookOpen className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-base">추천 도서</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>HSP를 위한 도서 목록</CardDescription>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link to="/books">바로가기</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Quote className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-base">위인 명언</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>영감과 위로의 명언 피드</CardDescription>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link to="/quotes">바로가기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 오늘의 명언 프리뷰 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">오늘의 명언</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/quotes" className="text-muted-foreground text-xs">
                전체 보기
              </Link>
            </Button>
          </div>
          <div
            className={cn(
              'rounded-2xl bg-gradient-to-br from-violet-50 to-purple-100',
              'border border-border/40 shadow-sm p-6 space-y-4',
            )}
          >
            <Quote className="h-6 w-6 text-primary/60" />
            <p className="text-base sm:text-lg font-medium leading-relaxed">
              {todayQuote.text}
            </p>
            <p className="text-right text-sm font-semibold text-foreground/70">
              — {todayQuote.author}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 비로그인 사용자는 랜딩 페이지
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          센시(Sensi)
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          민감한 영혼들이 모여 서로를 이해하고 위로받으며,
          자신의 기질을 강점으로 재발견하는 따뜻한 공간
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/login">시작하기</Link>
          </Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold text-center mb-8">센시가 제공하는 것</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <Icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
