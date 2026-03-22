import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import PostCard from '../PostCard'

const mockPost = {
  id: 42,
  title: 'HSP인 나, 감정을 어떻게 관리할까요?',
  content: '주변 사람들의 기분이 나에게 영향을 미치는 것을 느껴요.',
  author: { name: 'Kim J' },
  createdAt: '2026-03-20',
  comments: 5,
  empathy: 12,
  category: 'question',
}

function renderPostCard(post = mockPost) {
  return render(
    <MemoryRouter>
      <PostCard post={post} />
    </MemoryRouter>,
  )
}

describe('PostCard', () => {
  it('should render post title', () => {
    renderPostCard()
    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
  })

  it('should render post content preview', () => {
    renderPostCard()
    expect(screen.getByText(mockPost.content)).toBeInTheDocument()
  })

  it('should render author name', () => {
    renderPostCard()
    expect(screen.getByText('Kim J')).toBeInTheDocument()
  })

  it('should render createdAt date', () => {
    renderPostCard()
    expect(screen.getByText('2026-03-20')).toBeInTheDocument()
  })

  it('should render comment count', () => {
    renderPostCard()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should render empathy count', () => {
    renderPostCard()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('should render category badge with Korean label', () => {
    renderPostCard()
    // 'question' category maps to '질문/고민'
    expect(screen.getByText('질문/고민')).toBeInTheDocument()
  })

  it('should render category badge for all known categories', () => {
    const categories = [
      { value: 'daily', label: '일상 이야기' },
      { value: 'empathy', label: '공감과 위로' },
      { value: 'tips', label: '민감함 다루기' },
      { value: 'question', label: '질문/고민' },
    ]
    for (const { value, label } of categories) {
      const { unmount } = renderPostCard({ ...mockPost, category: value })
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    }
  })

  it('should render raw category value when category is unknown', () => {
    renderPostCard({ ...mockPost, category: 'unknown_cat' })
    expect(screen.getByText('unknown_cat')).toBeInTheDocument()
  })

  it('should link to the correct detail page', () => {
    renderPostCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/community/${mockPost.id}`)
  })
})
