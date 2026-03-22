import '@testing-library/jest-dom'
import { expect, afterEach, vi, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// 각 테스트 전 localStorage 초기화
beforeEach(() => {
  localStorage.clear()
})

// 각 테스트 후 DOM 정리
afterEach(() => {
  cleanup()
})
