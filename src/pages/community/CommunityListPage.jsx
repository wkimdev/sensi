import { Link } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'

export default function CommunityListPage() {
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

      <EmptyState
        title="아직 게시글이 없습니다"
        description="첫 번째 이야기를 나눠보세요."
        action={
          <Button asChild>
            <Link to="/community/new">글쓰기</Link>
          </Button>
        }
      />
    </div>
  )
}
