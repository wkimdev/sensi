import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/common/EmptyState'

export default function CommunityDetailPage() {
  const { id } = useParams()

  // TODO: API 연동 — useApi로 게시글 상세 조회
  // const { data: post, loading, error, execute } = useApi(() => api.get(`/posts/${id}`))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>게시글 #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="게시글을 불러오는 중입니다"
            description="API 연동 후 게시글 상세 내용이 표시됩니다."
          />
        </CardContent>
      </Card>

      {/* 댓글 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">댓글</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="아직 댓글이 없습니다"
            description="첫 번째 댓글을 남겨보세요."
          />
        </CardContent>
      </Card>
    </div>
  )
}
