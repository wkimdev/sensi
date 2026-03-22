import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useApi } from '../useApi'

describe('useApi hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const mockApiFunction = vi.fn()

    const { result } = renderHook(() => useApi(mockApiFunction))

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.execute).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('should execute API function and set data on success', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockApiFunction = vi.fn().mockResolvedValue(mockData)

    const { result } = renderHook(() => useApi(mockApiFunction))

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()

    let returnedData
    await act(async () => {
      returnedData = await result.current.execute('arg1', 'arg2')
    })

    expect(mockApiFunction).toHaveBeenCalledWith('arg1', 'arg2')
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(returnedData).toEqual(mockData)
  })

  it('should set loading state during API call', async () => {
    let resolveApiCall
    const mockApiFunction = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveApiCall = resolve
        })
    )

    const { result } = renderHook(() => useApi(mockApiFunction))

    let loadingDuringCall = false
    act(() => {
      result.current.execute().then(() => {
        // After execution completes
      })
    })

    // Check loading state during execution
    await waitFor(() => {
      if (result.current.loading) {
        loadingDuringCall = true
      }
    })

    expect(loadingDuringCall).toBe(true)

    // Resolve the API call
    act(() => {
      resolveApiCall({ data: 'test' })
    })

    // Check loading is false after completion
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should handle API errors and set error state', async () => {
    const mockError = {
      response: {
        data: {
          message: 'API Error',
        },
      },
    }
    const mockApiFunction = vi.fn().mockRejectedValue(mockError)

    const { result } = renderHook(() => useApi(mockApiFunction))

    let thrownError
    await act(async () => {
      try {
        await result.current.execute()
      } catch (err) {
        thrownError = err
      }
    })

    expect(result.current.error).toBe('API Error')
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(thrownError).toEqual(mockError)
  })

  it('should use error message from error object', async () => {
    const mockError = new Error('Network error')
    const mockApiFunction = vi.fn().mockRejectedValue(mockError)

    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      try {
        await result.current.execute()
      } catch (err) {
        // Catch the error
      }
    })

    expect(result.current.error).toBe('Network error')
  })

  it('should use default error message when not available', async () => {
    const mockApiFunction = vi.fn().mockRejectedValue({})

    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      try {
        await result.current.execute()
      } catch (err) {
        // Catch the error
      }
    })

    expect(result.current.error).toBe('오류가 발생했습니다.')
  })

  it('should reset state to initial values', async () => {
    const mockData = { id: 1 }
    const mockApiFunction = vi.fn().mockResolvedValue(mockData)

    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual(mockData)

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should clear previous error on successful execution', async () => {
    const mockApiFunction = vi.fn()

    const { result } = renderHook(() => useApi(mockApiFunction))

    // First call fails
    mockApiFunction.mockRejectedValueOnce({
      response: {
        data: {
          message: 'First error',
        },
      },
    })

    await act(async () => {
      try {
        await result.current.execute()
      } catch (err) {
        // Catch the error
      }
    })

    expect(result.current.error).toBe('First error')

    // Second call succeeds
    mockApiFunction.mockResolvedValueOnce({ success: true })

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({ success: true })
  })
})
