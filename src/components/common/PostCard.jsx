import { Link } from 'react-router'
import { MessageCircle, Heart, User } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS = {
  daily: '일상 이야기',
  empathy: '공감과 위로',
  tips: '민감함 다루기',
  question: '질문/고민',
}

/**
 * 커뮤니티 게시글 카드
 * @param {Object} post - 게시글 데이터
 * @param {number} post.id
 * @param {string} post.title
 * @param {string} post.content
 * @param {{ name: string }} post.author
 * @param {string} post.createdAt
 * @param {number} post.comments
 * @param {number} post.empathy
 * @param {string} post.category
 */
export default function PostCard({ post }) {
  const { id, title, content, author, createdAt, comments, empathy, category } = post
  const categoryLabel = CATEGORY_LABELS[category] ?? category

  return (
    <Link to={`/community/${id}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      <Card
        className={cn(
          'h-full flex flex-col transition-shadow duration-200',
          'group-hover:shadow-md',
        )}
      >
        <CardContent className="flex-1 pt-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-semibold leading-snug line-clamp-2 flex-1">
              {title}
            </h2>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {categoryLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {content}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-0 pb-4 px-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{author.name}</span>
            <span className="mx-1">·</span>
            <span>{createdAt}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {comments}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {empathy}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
