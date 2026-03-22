import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import BookCard from '@/components/common/BookCard'

// ---------------------------------------------------------------------------
// Mock 데이터
// ---------------------------------------------------------------------------

const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'The Highly Sensitive Person',
    author: 'Elaine N. Aron',
    publisher: 'Broadway Books',
    description: 'HSP 개념을 처음으로 체계화한 필독서. 예민함을 강점으로 바라보는 시각을 제공합니다.',
    imageUrl: 'https://via.placeholder.com/200x300/e0d7f5/6b4fa0?text=HSP',
    scraped: false,
    scrapCount: 45,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Quiet: The Power of Introverts',
    author: 'Susan Cain',
    publisher: 'Crown Publishers',
    description: '내향인의 힘을 다룬 글로벌 베스트셀러. HSP와 내향성의 교차점을 탐구합니다.',
    imageUrl: 'https://via.placeholder.com/200x300/d7e8f5/2d6a9f?text=Quiet',
    scraped: false,
    scrapCount: 88,
    rating: 4.7,
  },
  {
    id: 3,
    title: '오늘도 예민하게 살았습니다',
    author: '전지현',
    publisher: '위즈덤하우스',
    description: '한국 HSP 독자들이 공감하는 에세이. 일상 속 예민함을 따뜻하게 풀어냅니다.',
    imageUrl: 'https://via.placeholder.com/200x300/f5e8d7/9f6b2d?text=예민',
    scraped: true,
    scrapCount: 62,
    rating: 4.5,
  },
  {
    id: 4,
    title: 'The Empath\'s Survival Guide',
    author: 'Judith Orloff',
    publisher: 'Sounds True',
    description: '공감 능력이 강한 사람들을 위한 실용적인 생존 가이드. 감정 경계 설정법을 안내합니다.',
    imageUrl: 'https://via.placeholder.com/200x300/d7f5e8/2d9f6b?text=Empath',
    scraped: false,
    scrapCount: 37,
    rating: 4.6,
  },
  {
    id: 5,
    title: 'Sensitive: The Hidden Power',
    author: 'Jenn Granneman',
    publisher: 'Harmony Books',
    description: '예민함이 어떻게 창의성·공감·직관력의 원천이 되는지 과학적으로 풀어낸 책입니다.',
    imageUrl: 'https://via.placeholder.com/200x300/f5d7e8/9f2d6b?text=Sensitive',
    scraped: false,
    scrapCount: 29,
    rating: 4.4,
  },
  {
    id: 6,
    title: '나는 왜 이렇게 예민할까',
    author: '카트린 젠킨스',
    publisher: '갈매나무',
    description: 'HSP의 신경과학적 배경을 알기 쉽게 설명하고, 일상 속 관리 방법을 제시합니다.',
    imageUrl: 'https://via.placeholder.com/200x300/e8f5d7/6b9f2d?text=예민why',
    scraped: false,
    scrapCount: 51,
    rating: 4.3,
  },
  {
    id: 7,
    title: 'Boundaries',
    author: 'Henry Cloud & John Townsend',
    publisher: 'Zondervan',
    description: '건강한 경계선을 세우는 방법을 구체적으로 다룹니다. HSP에게 특히 유용한 실용서입니다.',
    imageUrl: 'https://via.placeholder.com/200x300/f5f0d7/9f8b2d?text=Boundaries',
    scraped: false,
    scrapCount: 74,
    rating: 4.7,
  },
  {
    id: 8,
    title: '혼자 있고 싶은데 외로운 건 싫어',
    author: '쏭이',
    publisher: '위즈덤하우스',
    description: '혼자이고 싶지만 연결도 원하는 내향인·HSP의 심리를 솔직하게 담은 에세이입니다.',
    imageUrl: 'https://via.placeholder.com/200x300/d7d7f5/4a4a9f?text=혼자',
    scraped: true,
    scrapCount: 93,
    rating: 4.9,
  },
  {
    id: 9,
    title: 'Emotional Intelligence',
    author: 'Daniel Goleman',
    publisher: 'Bantam Books',
    description: '감성지능의 고전. 자기감정 인식과 타인 공감 능력이 삶의 성공에 미치는 영향을 다룹니다.',
    imageUrl: 'https://via.placeholder.com/200x300/f5d7d7/9f4a4a?text=EQ',
    scraped: false,
    scrapCount: 110,
    rating: 4.6,
  },
  {
    id: 10,
    title: '지금 이 순간을 살아라',
    author: '에크하르트 톨레',
    publisher: '양문',
    description: '마음챙김과 현재 순간에 집중하는 법을 알려줍니다. 감각 과부하를 겪는 HSP에게 큰 도움이 됩니다.',
    imageUrl: 'https://via.placeholder.com/200x300/d7f5f0/2d9f8b?text=NOW',
    scraped: false,
    scrapCount: 58,
    rating: 4.5,
  },
  {
    id: 11,
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    publisher: 'Viking',
    description: '트라우마가 몸과 뇌에 미치는 영향을 연구한 명저. 예민한 신체 반응의 근원을 이해하는 데 도움을 줍니다.',
    imageUrl: 'https://via.placeholder.com/200x300/e8d7f5/7b4a9f?text=Body',
    scraped: false,
    scrapCount: 66,
    rating: 4.8,
  },
  {
    id: 12,
    title: '자기 돌봄의 기술',
    author: '최지은',
    publisher: '다산북스',
    description: 'HSP가 지치지 않고 자기 자신을 돌보는 실천법을 담은 국내 저자 작품입니다.',
    imageUrl: 'https://via.placeholder.com/200x300/f5ecd7/9f7b2d?text=돌봄',
    scraped: false,
    scrapCount: 42,
    rating: 4.4,
  },
]

// ---------------------------------------------------------------------------
// 컴포넌트
// ---------------------------------------------------------------------------

export default function BooksPage() {
  // TODO: API 연동 시 useApi(() => api.get('/books'))로 교체
  const [books, setBooks] = useState(INITIAL_BOOKS)

  function handleScrapToggle(id, currentlyScraped) {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? {
              ...book,
              scraped: !currentlyScraped,
              scrapCount: currentlyScraped ? book.scrapCount - 1 : book.scrapCount + 1,
            }
          : book,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="추천 도서"
        description="HSP에 도움되는 책을 큐레이션하여 소개합니다."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onScrapToggle={handleScrapToggle} />
        ))}
      </div>
    </div>
  )
}
