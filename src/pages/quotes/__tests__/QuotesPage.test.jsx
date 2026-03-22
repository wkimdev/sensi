import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import QuotesPage from '../QuotesPage'

// QUOTES mock data has 20 items; PAGE_SIZE = 6 → 4 pages (ceil(20/6))

function renderPage() {
  return render(
    <MemoryRouter>
      <QuotesPage />
    </MemoryRouter>,
  )
}

describe('QuotesPage', () => {
  describe('초기 렌더링', () => {
    it('should render the page header', () => {
      renderPage()
      expect(screen.getByText('위인 명언')).toBeInTheDocument()
      expect(
        screen.getByText('HSP 기질을 가진 위인들의 명언으로 영감과 위로를 전달합니다.'),
      ).toBeInTheDocument()
    })

    it('should render 6 quote cards on the first page', () => {
      renderPage()
      // Each card displays the quote text; use author names as a proxy for card count
      // Page 1 authors: Elaine Aron, Thich Nhat Hanh, Susan Cain, Virginia Woolf, Rilke, Audre Lorde
      expect(screen.getByText(/당신의 예민함은 약점이 아니라 강점입니다/)).toBeInTheDocument()
      expect(screen.getByText(/예민함의 선물은 세상에 대한 깊은 인식입니다/)).toBeInTheDocument()
      expect(screen.getByText(/내향적인 사람들은 세상을 바꿀 수 있다/)).toBeInTheDocument()
      expect(screen.getByText(/혼자 있는 시간은 자신을 발견하는 가장 강력한 방법이다/)).toBeInTheDocument()
      expect(screen.getByText(/감수성이 풍부한 사람은 세상의 아름다움을 더 깊이 느낍니다/)).toBeInTheDocument()
      expect(screen.getByText(/자신을 돌보는 것은 이기적인 일이 아니라 생존의 행위입니다/)).toBeInTheDocument()
    })

    it('should not render page-2 quotes on the initial render', () => {
      renderPage()
      // Quote 7 is on page 2
      expect(screen.queryByText(/느리게 걷는 사람이 더 많은 것을 보고/)).not.toBeInTheDocument()
    })

    it('should render author names', () => {
      renderPage()
      expect(screen.getByText('— Elaine Aron')).toBeInTheDocument()
      expect(screen.getByText('— Susan Cain')).toBeInTheDocument()
    })

    it('should render author roles', () => {
      renderPage()
      expect(screen.getByText('심리학자, HSP 개념 창시자')).toBeInTheDocument()
    })

    it('should render category badges', () => {
      renderPage()
      expect(screen.getByText('영감')).toBeInTheDocument()
      expect(screen.getByText('지혜')).toBeInTheDocument()
    })

    it('should render page counter as "1 / 4"', () => {
      renderPage()
      expect(screen.getByText('1 / 4')).toBeInTheDocument()
    })
  })

  describe('페이지 네비게이션', () => {
    it('should render "이전" and "다음" navigation buttons', () => {
      renderPage()
      expect(screen.getByRole('button', { name: /이전/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /다음/ })).toBeInTheDocument()
    })

    it('should disable the "이전" button on the first page', () => {
      renderPage()
      expect(screen.getByRole('button', { name: /이전/ })).toBeDisabled()
    })

    it('should enable the "다음" button on the first page', () => {
      renderPage()
      expect(screen.getByRole('button', { name: /다음/ })).not.toBeDisabled()
    })

    it('should show page-2 quotes after clicking "다음"', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: /다음/ }))

      expect(screen.getByText(/느리게 걷는 사람이 더 많은 것을 보고/)).toBeInTheDocument()
    })

    it('should update page counter to "2 / 4" after clicking "다음"', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: /다음/ }))

      expect(screen.getByText('2 / 4')).toBeInTheDocument()
    })

    it('should hide page-1 quotes after moving to page 2', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: /다음/ }))

      expect(
        screen.queryByText(/당신의 예민함은 약점이 아니라 강점입니다/),
      ).not.toBeInTheDocument()
    })

    it('should re-enable "이전" after moving past the first page', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: /다음/ }))

      expect(screen.getByRole('button', { name: /이전/ })).not.toBeDisabled()
    })

    it('should return to page 1 content when "이전" is clicked from page 2', async () => {
      const user = userEvent.setup()
      renderPage()

      const nextBtn = screen.getByRole('button', { name: /다음/ })
      await user.click(nextBtn)
      await user.click(screen.getByRole('button', { name: /이전/ }))

      expect(screen.getByText(/당신의 예민함은 약점이 아니라 강점입니다/)).toBeInTheDocument()
      expect(screen.getByText('1 / 4')).toBeInTheDocument()
    })

    it('should disable "다음" on the last page', async () => {
      const user = userEvent.setup()
      renderPage()

      const nextBtn = screen.getByRole('button', { name: /다음/ })
      // Navigate to last page (page 4 of 4)
      await user.click(nextBtn)
      await user.click(nextBtn)
      await user.click(nextBtn)

      expect(screen.getByRole('button', { name: /다음/ })).toBeDisabled()
      expect(screen.getByText('4 / 4')).toBeInTheDocument()
    })

    it('should show the last 2 quotes on page 4 (20 quotes, 6 per page)', async () => {
      const user = userEvent.setup()
      renderPage()

      const nextBtn = screen.getByRole('button', { name: /다음/ })
      await user.click(nextBtn)
      await user.click(nextBtn)
      await user.click(nextBtn)

      // Quotes 19 and 20 are on page 4
      expect(screen.getByText(/예민함은 세상과 더 깊이 연결되는 능력입니다/)).toBeInTheDocument()
      expect(screen.getByText(/혼자만의 시간은 재충전이 아니라 성장의 시간입니다/)).toBeInTheDocument()
    })
  })
})
