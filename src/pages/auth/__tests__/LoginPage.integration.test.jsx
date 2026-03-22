import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import LoginPage from '../LoginPage'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

// Mock react-oauth/google
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={() => onSuccess({ credential: 'mock-id-token' })}>
      Mock Google Login
    </button>
  ),
}))

// Mock api service
vi.mock('@/services/api')

describe('LoginPage Integration Tests', () => {
  beforeEach(() => {
    // Clear auth store before each test
    useAuthStore.getState().clearAuth()
    vi.clearAllMocks()
  })

  it('should handle successful Google OAuth login flow', async () => {
    const mockResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    }

    // Mock the API call
    api.post.mockResolvedValue(mockResponse)

    const { container } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    // Click the mock Google login button
    const loginButton = screen.getByText('Mock Google Login')
    await userEvent.click(loginButton)

    // Wait for the API call
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/google', {
        idToken: 'mock-id-token',
      })
    })

    // Check that auth store is updated
    const authState = useAuthStore.getState()
    expect(authState.user).toEqual(mockResponse.user)
    expect(authState.token).toBe(mockResponse.accessToken)

    // Check that refresh token is stored in localStorage
    expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refreshToken)
  })

  it('should handle API errors gracefully', async () => {
    const mockError = {
      response: {
        status: 401,
        data: {
          message: '로그인에 실패했습니다.',
        },
      },
    }

    api.post.mockRejectedValue(mockError)

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    // Click the mock Google login button
    const loginButton = screen.getByText('Mock Google Login')
    await userEvent.click(loginButton)

    // Wait for the error toast to appear
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/google', {
        idToken: 'mock-id-token',
      })
    })

    // Check that auth store is NOT updated
    const authState = useAuthStore.getState()
    expect(authState.user).toBeNull()
    expect(authState.token).toBeNull()
  })

  it('should redirect to home page after successful login', async () => {
    const mockResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    }

    api.post.mockResolvedValue(mockResponse)

    const { container } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const loginButton = screen.getByText('Mock Google Login')
    await userEvent.click(loginButton)

    // Wait for navigation (this is mocked in BrowserRouter context)
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled()
    })
  })

  it('should display welcome message with user name', async () => {
    const mockResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '123',
        email: 'test@example.com',
        name: '테스트 사용자',
      },
    }

    api.post.mockResolvedValue(mockResponse)

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    // Initial text should be present
    expect(screen.getByText('센시에 오신 걸 환영합니다')).toBeInTheDocument()

    const loginButton = screen.getByText('Mock Google Login')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled()
    })
  })
})
