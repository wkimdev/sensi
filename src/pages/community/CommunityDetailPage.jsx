import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Heart, User, Trash2, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import EmptyState from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS = {
  daily: '일상 이야기',
  empathy: '공감과 위로',
  tips: '민감함 다루기',
  question: '질문/고민',
}

const mockPost = {
  id: 1,
  title: 'HSP인 나, 감정을 어떻게 관리할까요?',
  category: 'question',
  author: { id: 1, name: 'Kim J', email: 'kim@example.com' },
  createdAt: '2026-03-20',
  updatedAt: null,
  content:
    '최근에 주변 사람들의 감정을 너무 많이 흡수해서 지쳐가고 있어요. 직장에서 동료가 힘들어하면 나도 같이 힘들어지고, 뉴스를 보면 감정이 요동쳐서 일상이 힘들 때가 많습니다.\n\nHSP로서 감정 조절을 위해 어떤 방법을 쓰고 계신가요? 특히 타인의 감정에 과도하게 영향받는 것을 줄이는 방법이 있으면 공유해주세요.',
  empathyCount: 12,
  comments: [
    {
      id: 1,
      author: { id: 2, name: 'Lee M' },
      content: '정말 공감합니다! 저도 같은 고민을 했는데, 명상이 많이 도움이 됐어요.',
      createdAt: '2026-03-21',
    },
    {
      id: 2,
      author: { id: 3, name: 'Park S' },
      content:
        '혼자만의 회복 시간을 매일 확보하는 게 중요한 것 같아요. 하루 30분이라도 조용한 공간에서 쉬는 시간을 갖고 있어요.',
      createdAt: '2026-03-21',
    },
  ],
}

// 임시 현재 사용자 (API 연동 전)
const currentUser = { id: 2, name: 'Lee M' }

// Module-level counter for temporary comment IDs (replaced by server-assigned IDs after API integration)
let _nextCommentId = mockPost.comments.length + 1

const commentSchema = z.object({
  content: z
    .string()
    .min(1, '댓글을 입력해주세요.')
    .max(500, '댓글은 500자 이하로 입력해주세요.'),
})

function makeCommentId() {
  _nextCommentId += 1
  return _nextCommentId
}

export default function CommunityDetailPage() {
  const { id } = useParams()

  // TODO: API 연동 시 id로 게시글 조회
  const [post] = useState({ ...mockPost, id: Number(id) || mockPost.id })
  const [comments, setComments] = useState(mockPost.comments)
  const [empathyCount, setEmpathyCount] = useState(mockPost.empathyCount)
  const [userEmpathy, setUserEmpathy] = useState(false)

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  })

  const handleEmpathy = () => {
    setEmpathyCount((prev) => (userEmpathy ? prev - 1 : prev + 1))
    setUserEmpathy((prev) => !prev)
  }

  const onCommentSubmit = form.handleSubmit(async (values) => {
    try {
      // TODO: API 연동 — api.post(`/posts/${post.id}/comments`, values)
      await new Promise((r) => setTimeout(r, 300))
      setComments((prev) => [
        ...prev,
        {
          id: makeCommentId(),
          author: currentUser,
          content: values.content,
          createdAt: '2026-03-22',
        },
      ])
      form.reset()
      toast.success('댓글이 등록되었습니다.')
    } catch {
      toast.error('댓글 등록에 실패했습니다.')
    }
  })

  const handleDeleteComment = (commentId) => {
    // TODO: API 연동 — api.delete(`/posts/${post.id}/comments/${commentId}`)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    toast.success('댓글이 삭제되었습니다.')
  }

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Link>
      </Button>

      {/* 게시글 Card */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl leading-snug">{post.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {categoryLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{post.author.name}</span>
            <span className="mx-1">·</span>
            <span>{post.createdAt}</span>
            {post.updatedAt && (
              <>
                <span className="mx-1">·</span>
                <span className="text-xs">(수정됨 {post.updatedAt})</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 본문 */}
          <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>

          {/* 공감 버튼 */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant={userEmpathy ? 'default' : 'outline'}
              size="sm"
              onClick={handleEmpathy}
              className={cn(
                'gap-1.5',
                userEmpathy && 'bg-rose-500 hover:bg-rose-600 border-rose-500',
              )}
            >
              <Heart className={cn('h-4 w-4', userEmpathy && 'fill-current')} />
              공감 {empathyCount}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            댓글 {comments.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 댓글 작성 폼 */}
          <Form {...form}>
            <form onSubmit={onCommentSubmit} className="space-y-3">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>댓글 작성</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="따뜻한 댓글을 남겨보세요... (최대 500자)"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? '등록 중...' : '댓글 등록'}
                </Button>
              </div>
            </form>
          </Form>

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <EmptyState
              title="아직 댓글이 없습니다"
              description="첫 번째 댓글을 남겨보세요."
              className="py-8"
            />
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-medium text-foreground">{comment.author.name}</span>
                      <span className="mx-1">·</span>
                      <span>{comment.createdAt}</span>
                    </div>
                    {comment.author.id === currentUser.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                        aria-label="댓글 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
