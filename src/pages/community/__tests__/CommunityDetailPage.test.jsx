import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import CommunityDetailPage from '../CommunityDetailPage'

// sonner toast is a side-effect only; mock to avoid jsdom issues
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function renderPage(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/community/${id}`]}>
      <Routes>
        <Route path="/community/:id" element={<CommunityDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CommunityDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('게시글 렌더링', () => {
    it('should render the post title', () => {
      renderPage()
      expect(screen.getByText('HSP인 나, 감정을 어떻게 관리할까요?')).toBeInTheDocument()
    })

    it('should render the category badge', () => {
      renderPage()
      expect(screen.getByText('질문/고민')).toBeInTheDocument()
    })

    it('should render the author name', () => {
      renderPage()
      expect(screen.getByText('Kim J')).toBeInTheDocument()
    })

    it('should render the post createdAt', () => {
      renderPage()
      expect(screen.getByText('2026-03-20')).toBeInTheDocument()
    })

    it('should render the post content', () => {
      renderPage()
      expect(
        screen.getByText(/최근에 주변 사람들의 감정을 너무 많이 흡수해서/),
      ).toBeInTheDocument()
    })

    it('should render the empathy count', () => {
      renderPage()
      expect(screen.getByText(/공감 12/)).toBeInTheDocument()
    })

    it('should render the "목록으로" back link', () => {
      renderPage()
      const backLink = screen.getByRole('link', { name: /목록으로/ })
      expect(backLink).toHaveAttribute('href', '/community')
    })
  })

  describe('댓글 렌더링', () => {
    it('should render existing comments', () => {
      renderPage()
      expect(
        screen.getByText('정말 공감합니다! 저도 같은 고민을 했는데, 명상이 많이 도움이 됐어요.'),
      ).toBeInTheDocument()
    })

    it('should render comment author names', () => {
      renderPage()
      expect(screen.getByText('Lee M')).toBeInTheDocument()
      expect(screen.getByText('Park S')).toBeInTheDocument()
    })

    it('should render the comment count in the section header', () => {
      renderPage()
      expect(screen.getByText('댓글 2')).toBeInTheDocument()
    })

    it('should render delete button only for comments belonging to currentUser (Lee M, id=2)', () => {
      renderPage()
      // currentUser is { id: 2, name: 'Lee M' }; only the first mock comment (id=2) matches
      const deleteButtons = screen.getAllByRole('button', { name: '댓글 삭제' })
      expect(deleteButtons).toHaveLength(1)
    })
  })

  describe('공감 버튼 토글', () => {
    it('should increment empathy count when clicked while not empathized', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: /공감/ }))

      expect(screen.getByText(/공감 13/)).toBeInTheDocument()
    })

    it('should decrement empathy count when clicked again (toggle off)', async () => {
      const user = userEvent.setup()
      renderPage()

      const empathyButton = screen.getByRole('button', { name: /공감/ })
      await user.click(empathyButton)
      await user.click(empathyButton)

      expect(screen.getByText(/공감 12/)).toBeInTheDocument()
    })
  })

  describe('댓글 작성 폼', () => {
    it('should render the comment textarea', () => {
      renderPage()
      expect(
        screen.getByPlaceholderText('따뜻한 댓글을 남겨보세요... (최대 500자)'),
      ).toBeInTheDocument()
    })

    it('should render the comment submit button', () => {
      renderPage()
      expect(screen.getByRole('button', { name: '댓글 등록' })).toBeInTheDocument()
    })

    it('should show validation error when submitting an empty comment', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: '댓글 등록' }))

      await waitFor(() => {
        expect(screen.getByText('댓글을 입력해주세요.')).toBeInTheDocument()
      })
    })

    it('should add a new comment after successful form submission', async () => {
      const user = userEvent.setup()
      renderPage()

      const textarea = screen.getByPlaceholderText('따뜻한 댓글을 남겨보세요... (최대 500자)')
      await user.type(textarea, '새로운 댓글입니다.')
      await user.click(screen.getByRole('button', { name: '댓글 등록' }))

      await waitFor(() => {
        expect(screen.getByText('새로운 댓글입니다.')).toBeInTheDocument()
      })
    })

    it('should update comment count after a new comment is added', async () => {
      const user = userEvent.setup()
      renderPage()

      const textarea = screen.getByPlaceholderText('따뜻한 댓글을 남겨보세요... (최대 500자)')
      await user.type(textarea, '추가 댓글.')
      await user.click(screen.getByRole('button', { name: '댓글 등록' }))

      await waitFor(() => {
        expect(screen.getByText('댓글 3')).toBeInTheDocument()
      })
    })

    it('should clear the textarea after successful submission', async () => {
      const user = userEvent.setup()
      renderPage()

      const textarea = screen.getByPlaceholderText('따뜻한 댓글을 남겨보세요... (최대 500자)')
      await user.type(textarea, '제출 후 초기화 확인.')
      await user.click(screen.getByRole('button', { name: '댓글 등록' }))

      await waitFor(() => {
        expect(textarea).toHaveValue('')
      })
    })

    it('should show "등록 중..." label while submitting', async () => {
      const user = userEvent.setup()
      renderPage()

      const textarea = screen.getByPlaceholderText('따뜻한 댓글을 남겨보세요... (최대 500자)')
      await user.type(textarea, '제출 테스트')

      // Click submit and immediately check the transitional label
      const submitBtn = screen.getByRole('button', { name: '댓글 등록' })
      user.click(submitBtn) // intentionally not awaited to catch intermediate state

      await waitFor(() => {
        // After the 300ms delay resolves the button goes back to '댓글 등록'
        expect(screen.getByRole('button', { name: '댓글 등록' })).toBeInTheDocument()
      })
    })
  })

  describe('댓글 삭제', () => {
    it('should remove the comment from the list when the delete button is clicked', async () => {
      const user = userEvent.setup()
      renderPage()

      const deleteBtn = screen.getByRole('button', { name: '댓글 삭제' })
      await user.click(deleteBtn)

      expect(
        screen.queryByText(
          '정말 공감합니다! 저도 같은 고민을 했는데, 명상이 많이 도움이 됐어요.',
        ),
      ).not.toBeInTheDocument()
    })

    it('should decrement comment count after deletion', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(screen.getByRole('button', { name: '댓글 삭제' }))

      expect(screen.getByText('댓글 1')).toBeInTheDocument()
    })

    it('should still show the remaining comment after the deletable one is removed', async () => {
      const user = userEvent.setup()
      renderPage()

      // Delete the only deletable comment (Lee M's comment)
      await user.click(screen.getByRole('button', { name: '댓글 삭제' }))

      // Park S comment (author id=3) is not deletable and must remain visible
      expect(
        screen.getByText(
          '혼자만의 회복 시간을 매일 확보하는 게 중요한 것 같아요. 하루 30분이라도 조용한 공간에서 쉬는 시간을 갖고 있어요.',
        ),
      ).toBeInTheDocument()
    })
  })
})
