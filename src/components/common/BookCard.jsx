import { useState } from 'react'
import { Heart, BookOpen, Star } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * 도서 카드 컴포넌트
 * @param {Object} book - 도서 데이터
 * @param {number} book.id
 * @param {string} book.title
 * @param {string} book.author
 * @param {string} book.publisher
 * @param {string} book.description
 * @param {string} [book.imageUrl]
 * @param {boolean} book.scraped
 * @param {number} book.scrapCount
 * @param {number} [book.rating]
 * @param {function} onScrapToggle - 스크랩 토글 핸들러 (id, scraped) => void
 */
export default function BookCard({ book, onScrapToggle }) {
  const { id, title, author, publisher, description, imageUrl, scraped, scrapCount, rating } = book
  const [imgError, setImgError] = useState(false)

  return (
    <Card
      className={cn(
        'h-full flex flex-col transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.03]',
      )}
    >
      {/* 도서 표지 이미지 */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-muted">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} 표지`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <CardContent className="flex-1 pt-4 pb-2 px-4 space-y-1.5">
        {/* 제목 */}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">{title}</h3>

        {/* 저자 */}
        <p className="text-xs text-foreground/80">{author}</p>

        {/* 출판사 */}
        <p className="text-xs text-muted-foreground">{publisher}</p>

        {/* 별점 */}
        {rating != null && (
          <div className="flex items-center gap-1 pt-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* 설명 */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-1">
          {description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 pb-3 px-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-2 gap-1.5 text-xs ml-auto',
            scraped ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground hover:text-rose-500',
          )}
          onClick={() => onScrapToggle(id, scraped)}
          aria-label={scraped ? '스크랩 취소' : '스크랩'}
          aria-pressed={scraped}
        >
          <Heart
            className={cn('h-3.5 w-3.5 transition-colors', scraped && 'fill-rose-500')}
          />
          <span>{scrapCount}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
