import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageHeader from '@/components/common/PageHeader'

const postSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  content: z.string().min(10, '본문은 10자 이상이어야 합니다.'),
})

const categories = [
  { value: 'daily', label: '일상 이야기' },
  { value: 'empathy', label: '공감과 위로' },
  { value: 'tips', label: '민감함 다루기' },
  { value: 'question', label: '질문/고민' },
]

export default function CommunityNewPage() {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', category: '', content: '' },
  })

  const onSubmit = async (_values) => {
    try {
      // TODO: API 연동 — api.post('/posts', values)
      await new Promise((r) => setTimeout(r, 500))
      toast.success('게시글이 등록되었습니다.')
      navigate('/community')
    } catch {
      toast.error('게시글 등록에 실패했습니다.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title="글쓰기" description="당신의 이야기를 나눠보세요." />

      <Card>
        <CardHeader>
          <CardTitle>새 게시글</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>본문</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="당신의 이야기를 자유롭게 적어주세요..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  취소
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? '등록 중...' : '등록'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
