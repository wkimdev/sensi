import { beforeEach, afterEach, vi } from 'vitest'

// Mock environment variables for tests
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret'
process.env.DATABASE_URL = 'file:./test.db'
process.env.PORT = '3001'
process.env.FRONTEND_URL = 'http://localhost:5173'

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})

// Cleanup after each test
afterEach(() => {
  vi.resetAllMocks()
})
