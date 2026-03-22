import { BookOpen } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'

export default function BooksPage() {
  // TODO: API 연동 — useApi로 도서 목록 조회
  // const { data: books, loading, execute } = useApi(() => api.get('/books'))

  return (
    <div className="space-y-6">
      <PageHeader
        title="추천 도서"
        description="HSP에 도움되는 책을 큐레이션하여 소개합니다."
      />

      <EmptyState
        icon={BookOpen}
        title="도서 목록을 준비 중입니다"
        description="곧 HSP를 위한 추천 도서가 등록됩니다."
      />
    </div>
  )
}
