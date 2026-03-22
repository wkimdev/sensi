import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/common/PageHeader'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Mock 데이터
// ---------------------------------------------------------------------------

const QUOTES = [
  {
    id: 1,
    text: '당신의 예민함은 약점이 아니라 강점입니다.',
    author: 'Elaine Aron',
    role: '심리학자, HSP 개념 창시자',
    category: '영감',
  },
  {
    id: 2,
    text: '예민함의 선물은 세상에 대한 깊은 인식입니다.',
    author: 'Thich Nhat Hanh',
    role: '불교 승려, 평화 활동가',
    category: '지혜',
  },
  {
    id: 3,
    text: '내향적인 사람들은 세상을 바꿀 수 있다. 단지 말하지 않을 뿐이다.',
    author: 'Susan Cain',
    role: '작가, 조용한 혁명 저자',
    category: '내향성',
  },
  {
    id: 4,
    text: '혼자 있는 시간은 자신을 발견하는 가장 강력한 방법이다.',
    author: 'Virginia Woolf',
    role: '소설가, 모더니즘 문학의 거장',
    category: '고독',
  },
  {
    id: 5,
    text: '감수성이 풍부한 사람은 세상의 아름다움을 더 깊이 느낍니다.',
    author: 'Rainer Maria Rilke',
    role: '시인, 문학가',
    category: '예민함',
  },
  {
    id: 6,
    text: '자신을 돌보는 것은 이기적인 일이 아니라 생존의 행위입니다.',
    author: 'Audre Lorde',
    role: '시인, 사회 운동가',
    category: '자기돌봄',
  },
  {
    id: 7,
    text: '느리게 걷는 사람이 더 많은 것을 보고, 더 깊이 이해한다.',
    author: 'Lao Tzu',
    role: '도가 철학의 창시자',
    category: '지혜',
  },
  {
    id: 8,
    text: '공감 능력은 세상에서 가장 혁명적인 힘 중 하나입니다.',
    author: 'Brené Brown',
    role: '연구자, 작가',
    category: '공감',
  },
  {
    id: 9,
    text: '우리의 가장 큰 두려움은 우리 자신의 힘을 발견하는 것입니다.',
    author: 'Marianne Williamson',
    role: '작가, 영적 지도자',
    category: '영감',
  },
  {
    id: 10,
    text: '민감성은 창의성의 어머니입니다.',
    author: 'Carl Jung',
    role: '분석심리학의 창시자',
    category: '예민함',
  },
  {
    id: 11,
    text: '침묵 속에서 우리는 가장 중요한 것들을 듣습니다.',
    author: 'Mother Teresa',
    role: '성인, 인도주의자',
    category: '내면',
  },
  {
    id: 12,
    text: '깊이 느끼는 사람은 깊이 생각하고, 깊이 사랑합니다.',
    author: 'André Gide',
    role: '프랑스 작가, 노벨문학상 수상자',
    category: '감수성',
  },
  {
    id: 13,
    text: '자신을 완전히 이해하는 것이 진정한 지혜의 시작입니다.',
    author: 'Confucius',
    role: '철학자, 사상가',
    category: '지혜',
  },
  {
    id: 14,
    text: '예민한 사람들은 세상의 시인들입니다.',
    author: 'Khalil Gibran',
    role: '시인, 철학자',
    category: '예민함',
  },
  {
    id: 15,
    text: '진정한 용기는 자신의 감정에 솔직해지는 것입니다.',
    author: 'Brené Brown',
    role: '연구자, 작가',
    category: '용기',
  },
  {
    id: 16,
    text: '조용한 마음이 가장 강한 마음입니다.',
    author: 'Ralph Waldo Emerson',
    role: '철학자, 시인',
    category: '내면',
  },
  {
    id: 17,
    text: '감정을 느끼는 것은 인간이 살아있다는 증거입니다.',
    author: 'Viktor Frankl',
    role: '정신과 의사, 로고테라피 창시자',
    category: '감수성',
  },
  {
    id: 18,
    text: '나 자신을 사랑하는 법을 배우는 것이 가장 위대한 여정입니다.',
    author: 'Louise Hay',
    role: '자기계발 작가',
    category: '자기돌봄',
  },
  {
    id: 19,
    text: '예민함은 세상과 더 깊이 연결되는 능력입니다.',
    author: 'Alanis Morissette',
    role: '가수, 작곡가',
    category: '공감',
  },
  {
    id: 20,
    text: '혼자만의 시간은 재충전이 아니라 성장의 시간입니다.',
    author: 'Paulo Coelho',
    role: '소설가, 연금술사 저자',
    category: '고독',
  },
]

const CATEGORY_COLORS = {
  영감: 'bg-violet-100 text-violet-700',
  지혜: 'bg-blue-100 text-blue-700',
  내향성: 'bg-indigo-100 text-indigo-700',
  고독: 'bg-slate-100 text-slate-700',
  예민함: 'bg-pink-100 text-pink-700',
  자기돌봄: 'bg-green-100 text-green-700',
  공감: 'bg-rose-100 text-rose-700',
  내면: 'bg-amber-100 text-amber-700',
  감수성: 'bg-purple-100 text-purple-700',
  용기: 'bg-orange-100 text-orange-700',
}

// 카드마다 그래디언트를 순환
const CARD_GRADIENTS = [
  'from-violet-50 to-purple-100',
  'from-blue-50 to-indigo-100',
  'from-rose-50 to-pink-100',
  'from-emerald-50 to-teal-100',
  'from-amber-50 to-orange-100',
]

// ---------------------------------------------------------------------------
// QuoteCard 컴포넌트
// ---------------------------------------------------------------------------

function QuoteCard({ quote, gradientIndex }) {
  const gradient = CARD_GRADIENTS[gradientIndex % CARD_GRADIENTS.length]
  const categoryColor = CATEGORY_COLORS[quote.category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div
      className={cn(
        'rounded-2xl bg-gradient-to-br p-6 space-y-4',
        'border border-border/40 shadow-sm',
        'hover:shadow-md transition-shadow duration-200',
        gradient,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Quote className="h-6 w-6 text-primary/60 shrink-0 mt-0.5" />
        <Badge
          variant="secondary"
          className={cn('text-xs font-medium shrink-0', categoryColor)}
        >
          {quote.category}
        </Badge>
      </div>

      <p className="text-base sm:text-lg font-medium leading-relaxed text-foreground">
        {quote.text}
      </p>

      <div className="text-right space-y-0.5">
        <p className="text-sm font-semibold text-foreground/80">— {quote.author}</p>
        <p className="text-xs text-muted-foreground">{quote.role}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QuotesPage
// ---------------------------------------------------------------------------

const PAGE_SIZE = 6

export default function QuotesPage() {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(QUOTES.length / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const visibleQuotes = QUOTES.slice(start, start + PAGE_SIZE)

  function handlePrev() {
    setPage((p) => Math.max(0, p - 1))
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="위인 명언"
        description="HSP 기질을 가진 위인들의 명언으로 영감과 위로를 전달합니다."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleQuotes.map((quote, idx) => (
          <QuoteCard key={quote.id} quote={quote} gradientIndex={start + idx} />
        ))}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={page === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          이전
        </Button>

        <span className="text-sm text-muted-foreground">
          {page + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="gap-1"
        >
          다음
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
