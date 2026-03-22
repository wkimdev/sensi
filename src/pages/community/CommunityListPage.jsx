import { useState } from 'react'
import { Link } from 'react-router'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/common/PageHeader'
import PostCard from '@/components/common/PostCard'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Mock 데이터
// ---------------------------------------------------------------------------

const MOCK_POSTS = [
  {
    id: 1,
    title: 'HSP인 나, 감정을 어떻게 관리할까요?',
    content:
      '최근에 주변 사람들의 기분이 나에게 영향을 미치는 것을 느껴요. 누군가 화나 있으면 제 마음도 무거워지고, 슬픔을 느끼는 사람 옆에 있으면 저도 같이 울고 싶어져요. 이런 감정 전이를 어떻게 다루고 계신가요?',
    author: { name: 'Kim J' },
    createdAt: '2026-03-20',
    comments: 5,
    empathy: 12,
    category: 'question',
  },
  {
    id: 2,
    title: '소음에 예민해서 카페 공부가 힘들어요',
    content:
      '공부하러 카페에 가면 옆 테이블 대화 소리가 너무 신경 쓰여서 집중이 안 됩니다. 노이즈 캔슬링 이어폰도 써봤는데 그래도 느껴지는 진동이나 간간이 들리는 소리가... 혹시 비슷한 분들은 어떤 방법을 쓰시나요?',
    author: { name: 'Lena P' },
    createdAt: '2026-03-19',
    comments: 8,
    empathy: 20,
    category: 'question',
  },
  {
    id: 3,
    title: '혼자만의 시간이 너무 소중한 이유',
    content:
      '오늘 하루 종일 사람들과 있었더니 집에 돌아오자마자 기진맥진했어요. 혼자 조용히 앉아서 차 한 잔 마시며 마음을 비우는 시간이 HSP에게 얼마나 중요한지 다시 한번 느꼈습니다. 여러분의 재충전 방법은 무엇인가요?',
    author: { name: 'Sara M' },
    createdAt: '2026-03-18',
    comments: 14,
    empathy: 35,
    category: 'daily',
  },
  {
    id: 4,
    title: '명상이 감각 과부하에 도움이 된다는 걸 알았어요',
    content:
      '처음엔 명상이 별거 아닌 것 같았는데, 꾸준히 하다 보니 외부 자극에 휩쓸리는 정도가 줄었습니다. 특히 바디스캔 명상이 제게 잘 맞더라고요. 10분만 해도 마음이 한결 가라앉아요.',
    author: { name: 'Alex K' },
    createdAt: '2026-03-17',
    comments: 6,
    empathy: 18,
    category: 'tips',
  },
  {
    id: 5,
    title: '직장에서 HSP를 숨기고 지낸다는 것',
    content:
      '팀 회식 자리에서 웃고 떠드는 척하다 집에 오면 탈진 상태예요. "왜 이렇게 예민해"라는 말이 무서워서 민감하다는 걸 드러내지 않으려 노력하는데... 비슷한 경험 있으신 분 계세요?',
    author: { name: 'Jo H' },
    createdAt: '2026-03-16',
    comments: 22,
    empathy: 47,
    category: 'daily',
  },
  {
    id: 6,
    title: '공감 피로를 겪고 계신 분들께',
    content:
      '주변 사람들의 힘듦을 함께 느끼다 보면 나 자신이 소진되는 경험, 많이들 하시죠? 저는 일부러 "감정 경계선" 연습을 시작했어요. 공감하되 내 안으로 완전히 끌어들이지 않는 연습이에요.',
    author: { name: 'Min S' },
    createdAt: '2026-03-15',
    comments: 10,
    empathy: 30,
    category: 'empathy',
  },
  {
    id: 7,
    title: '아침 루틴이 하루를 바꿨어요',
    content:
      '예전엔 알람 소리에 화들짝 깨서 하루 종일 예민하게 지냈는데, 요즘은 자연광 알람과 5분 스트레칭으로 부드럽게 하루를 시작하고 있어요. 감각 친화적인 아침 루틴 공유해요!',
    author: { name: 'Yuki T' },
    createdAt: '2026-03-14',
    comments: 9,
    empathy: 25,
    category: 'tips',
  },
  {
    id: 8,
    title: '예민함이 강점이 될 수 있을까요?',
    content:
      '회사 프로젝트에서 제가 가장 먼저 팀원의 불만을 감지하고 중재한 적이 있어요. 나중에 팀장님이 "네 덕분에 갈등이 커지기 전에 해결됐다"고 하더라고요. 예민함이 부담이기도 하지만 이런 순간엔 감사해져요.',
    author: { name: 'Chris L' },
    createdAt: '2026-03-13',
    comments: 17,
    empathy: 52,
    category: 'empathy',
  },
  {
    id: 9,
    title: '강한 향수나 향에 힘드신 분 있나요?',
    content:
      '엘리베이터에 탄 사람의 향수가 너무 강하면 두통이 올 정도예요. 식당에서도 음식 냄새가 뒤섞이면 식욕이 사라지고요. 후각 과민감도를 가진 분들만의 어려움인지 궁금합니다.',
    author: { name: 'Dana W' },
    createdAt: '2026-03-12',
    comments: 11,
    empathy: 28,
    category: 'question',
  },
  {
    id: 10,
    title: '자연 속에 있으면 회복되는 느낌',
    content:
      '도시 소음에 지쳐있다가 주말에 산책로를 걸었더니 마음이 정리되는 느낌이 들었어요. 새소리, 바람 소리, 흙냄새... HSP에게 자연이 왜 그렇게 치유적인지 이해가 되더라고요.',
    author: { name: 'Rina B' },
    createdAt: '2026-03-11',
    comments: 7,
    empathy: 33,
    category: 'daily',
  },
  {
    id: 11,
    title: '친구에게 HSP를 설명하는 방법',
    content:
      '"왜 그렇게 피곤해해?"라는 말을 들을 때마다 설명하기가 어려워요. HSP를 잘 모르는 사람에게 어떻게 이야기하면 이해시킬 수 있을까요? 좋은 방법이 있으면 공유해 주세요.',
    author: { name: 'Noel G' },
    createdAt: '2026-03-10',
    comments: 19,
    empathy: 41,
    category: 'question',
  },
  {
    id: 12,
    title: '창의적인 작업이 감정 해소에 도움돼요',
    content:
      '그림 그리기나 글쓰기처럼 창의적인 활동이 제게 큰 감정 해소 채널이 되었어요. 분석적으로 생각하는 것보다 감각적으로 표현하는 게 더 편하더라고요. HSP와 창의성이 연결되는 것 같아 신기해요.',
    author: { name: 'Ella F' },
    createdAt: '2026-03-09',
    comments: 13,
    empathy: 39,
    category: 'empathy',
  },
]

// ---------------------------------------------------------------------------
// 카테고리 필터 설정
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'daily', label: '일상 이야기' },
  { value: 'empathy', label: '공감과 위로' },
  { value: 'tips', label: '민감함 다루기' },
  { value: 'question', label: '질문/고민' },
]

const POSTS_PER_PAGE = 6

// ---------------------------------------------------------------------------
// 컴포넌트
// ---------------------------------------------------------------------------

export default function CommunityListPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered =
    selectedCategory === 'all'
      ? MOCK_POSTS
      : MOCK_POSTS.filter((p) => p.category === selectedCategory)

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  function handleCategoryChange(value) {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  function handlePageChange(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="커뮤니티"
        description="서로의 경험을 나누고 공감하는 공간입니다."
        actions={
          <Button size="sm" asChild>
            <Link to="/community/new">
              <Plus className="mr-2 h-4 w-4" />
              글쓰기
            </Link>
          </Button>
        }
      />

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              selectedCategory === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 게시글 그리드 */}
      {paginated.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          해당 카테고리의 게시글이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="이전 페이지"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon"
              onClick={() => handlePageChange(page)}
              aria-label={`${page}페이지`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="다음 페이지"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
