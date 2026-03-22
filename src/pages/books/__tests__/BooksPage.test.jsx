import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import BooksPage from '../BooksPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <BooksPage />
    </MemoryRouter>,
  )
}

describe('BooksPage', () => {
  describe('초기 렌더링', () => {
    it('should render the page header', () => {
      renderPage()
      expect(screen.getByText('추천 도서')).toBeInTheDocument()
      expect(screen.getByText('HSP에 도움되는 책을 큐레이션하여 소개합니다.')).toBeInTheDocument()
    })

    it('should render all 12 mock books', () => {
      renderPage()
      // Each BookCard has a unique title; count scrap buttons as a proxy for card count
      const scrapButtons = screen.getAllByRole('button', { name: /스크랩/ })
      expect(scrapButtons).toHaveLength(12)
    })

    it('should render the first book title', () => {
      renderPage()
      expect(screen.getByText('The Highly Sensitive Person')).toBeInTheDocument()
    })

    it('should render author names', () => {
      renderPage()
      expect(screen.getByText('Elaine N. Aron')).toBeInTheDocument()
      expect(screen.getByText('Susan Cain')).toBeInTheDocument()
    })

    it('should render publisher names', () => {
      renderPage()
      expect(screen.getByText('Broadway Books')).toBeInTheDocument()
    })

    it('should render pre-scraped books with "스크랩 취소" button', () => {
      renderPage()
      // Books with id=3 (오늘도 예민하게) and id=8 (혼자 있고 싶은데) have scraped=true
      const cancelButtons = screen.getAllByRole('button', { name: '스크랩 취소' })
      expect(cancelButtons).toHaveLength(2)
    })
  })

  describe('스크랩 토글', () => {
    it('should toggle a book from un-scraped to scraped on button click', async () => {
      const user = userEvent.setup()
      renderPage()

      // Book 1 (The Highly Sensitive Person) starts with scraped=false
      const firstScrapBtn = screen.getAllByRole('button', { name: '스크랩' })[0]
      await user.click(firstScrapBtn)

      // After toggling, the same button should now read "스크랩 취소"
      // The book that was previously at index 0 is now scraped
      const cancelButtons = screen.getAllByRole('button', { name: '스크랩 취소' })
      expect(cancelButtons).toHaveLength(3) // was 2, now 3
    })

    it('should increment scrapCount when un-scraped book is scrapped', async () => {
      const user = userEvent.setup()
      renderPage()

      // Book 1 starts with scrapCount=45
      expect(screen.getByText('45')).toBeInTheDocument()

      const firstScrapBtn = screen.getAllByRole('button', { name: '스크랩' })[0]
      await user.click(firstScrapBtn)

      expect(screen.getByText('46')).toBeInTheDocument()
    })

    it('should decrement scrapCount when scraped book is un-scraped', async () => {
      const user = userEvent.setup()
      renderPage()

      // Book 3 (오늘도 예민하게) starts with scraped=true and scrapCount=62
      expect(screen.getByText('62')).toBeInTheDocument()

      const cancelBtn = screen.getAllByRole('button', { name: '스크랩 취소' })[0]
      await user.click(cancelBtn)

      expect(screen.getByText('61')).toBeInTheDocument()
    })

    it('should toggle back to un-scraped when "스크랩 취소" is clicked', async () => {
      const user = userEvent.setup()
      renderPage()

      const cancelButtons = screen.getAllByRole('button', { name: '스크랩 취소' })
      const initialCount = cancelButtons.length

      await user.click(cancelButtons[0])

      const updatedCancelButtons = screen.getAllByRole('button', { name: '스크랩 취소' })
      expect(updatedCancelButtons).toHaveLength(initialCount - 1)
    })
  })
})
