import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookCard from '../BookCard'

const mockBook = {
  id: 1,
  title: 'The Highly Sensitive Person',
  author: 'Elaine N. Aron',
  publisher: 'Broadway Books',
  description: 'HSP 개념을 처음으로 체계화한 필독서.',
  imageUrl: 'https://example.com/cover.jpg',
  scraped: false,
  scrapCount: 45,
  rating: 4.8,
}

function renderBookCard(book = mockBook, onScrapToggle = vi.fn()) {
  return { onScrapToggle, ...render(<BookCard book={book} onScrapToggle={onScrapToggle} />) }
}

describe('BookCard', () => {
  it('should render book title', () => {
    renderBookCard()
    expect(screen.getByText(mockBook.title)).toBeInTheDocument()
  })

  it('should render author name', () => {
    renderBookCard()
    expect(screen.getByText(mockBook.author)).toBeInTheDocument()
  })

  it('should render publisher name', () => {
    renderBookCard()
    expect(screen.getByText(mockBook.publisher)).toBeInTheDocument()
  })

  it('should render description', () => {
    renderBookCard()
    expect(screen.getByText(mockBook.description)).toBeInTheDocument()
  })

  it('should render rating when provided', () => {
    renderBookCard()
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  it('should not render rating section when rating is null', () => {
    renderBookCard({ ...mockBook, rating: null })
    expect(screen.queryByText(/4\.\d/)).not.toBeInTheDocument()
  })

  it('should render scrapCount', () => {
    renderBookCard()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('should render cover image when imageUrl is provided and no error', () => {
    renderBookCard()
    const img = screen.getByAltText(`${mockBook.title} 표지`)
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockBook.imageUrl)
  })

  it('should render scrap button with aria-label "스크랩" when not scraped', () => {
    renderBookCard()
    expect(screen.getByRole('button', { name: '스크랩' })).toBeInTheDocument()
  })

  it('should render scrap button with aria-label "스크랩 취소" when scraped', () => {
    renderBookCard({ ...mockBook, scraped: true })
    expect(screen.getByRole('button', { name: '스크랩 취소' })).toBeInTheDocument()
  })

  it('should call onScrapToggle with id and current scraped state on click', async () => {
    const user = userEvent.setup()
    const { onScrapToggle } = renderBookCard()

    await user.click(screen.getByRole('button', { name: '스크랩' }))

    expect(onScrapToggle).toHaveBeenCalledOnce()
    expect(onScrapToggle).toHaveBeenCalledWith(mockBook.id, false)
  })

  it('should call onScrapToggle with scraped=true when currently scraped', async () => {
    const user = userEvent.setup()
    const onScrapToggle = vi.fn()
    render(<BookCard book={{ ...mockBook, scraped: true }} onScrapToggle={onScrapToggle} />)

    await user.click(screen.getByRole('button', { name: '스크랩 취소' }))

    expect(onScrapToggle).toHaveBeenCalledWith(mockBook.id, true)
  })

  it('should have aria-pressed=true when scraped', () => {
    renderBookCard({ ...mockBook, scraped: true })
    const btn = screen.getByRole('button', { name: '스크랩 취소' })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('should have aria-pressed=false when not scraped', () => {
    renderBookCard()
    const btn = screen.getByRole('button', { name: '스크랩' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })
})
