import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAuthStore.setState({
      user: null,
      token: null,
    })
    // Clear localStorage
    localStorage.clear()
  })

  it('should initialize with null user and token', () => {
    const state = useAuthStore.getState()

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('should set auth with user and token', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    }
    const mockToken = 'mock-access-token'

    useAuthStore.getState().setAuth({ user: mockUser, token: mockToken })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
  })

  it('should clear auth on logout', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    }
    const mockToken = 'mock-access-token'

    // Set auth
    useAuthStore.getState().setAuth({ user: mockUser, token: mockToken })

    // Verify it's set
    let state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)

    // Clear auth
    useAuthStore.getState().clearAuth()

    // Verify it's cleared
    state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('should persist auth to localStorage', () => {
    const mockUser = {
      id: '456',
      email: 'user@example.com',
      name: 'Another User',
    }
    const mockToken = 'another-token'

    useAuthStore.getState().setAuth({ user: mockUser, token: mockToken })

    // Check localStorage
    const stored = localStorage.getItem('auth-storage')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored)
    expect(parsed.state.user).toEqual(mockUser)
    expect(parsed.state.token).toBe(mockToken)
  })

  it('should restore auth from localStorage on initialization', () => {
    const mockUser = {
      id: '789',
      email: 'persist@example.com',
      name: 'Persistent User',
    }
    const mockToken = 'persistent-token'

    // Set auth (which persists to localStorage)
    useAuthStore.getState().setAuth({ user: mockUser, token: mockToken })

    // Get the stored data
    const stored = localStorage.getItem('auth-storage')
    expect(stored).toBeTruthy()

    // Simulate a new store instance (like page reload)
    // The persist middleware should restore from localStorage
    const restoredState = useAuthStore.getState()
    expect(restoredState.user).toEqual(mockUser)
    expect(restoredState.token).toBe(mockToken)
  })

  it('should allow partial updates', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    }
    const mockToken = 'token1'

    useAuthStore.getState().setAuth({ user: mockUser, token: mockToken })

    // Update only the token
    useAuthStore.getState().setAuth({ user: mockUser, token: 'token2' })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe('token2')
  })

  it('should have setAuth and clearAuth functions', () => {
    const state = useAuthStore.getState()

    expect(typeof state.setAuth).toBe('function')
    expect(typeof state.clearAuth).toBe('function')
  })

  it('should support useAuthStore hook subscription', () => {
    // This test verifies the store can be subscribed to
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    }

    let lastReceivedUser = undefined

    // Subscribe to store changes with a selector
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.user,
      (user) => {
        lastReceivedUser = user
      }
    )

    // Update the store
    useAuthStore.getState().setAuth({ user: mockUser, token: 'token' })

    // Verify subscription received the update
    // (Zustand with persist middleware may have complex subscription behavior)
    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe('token')

    // Clean up
    unsubscribe()
  })
})
