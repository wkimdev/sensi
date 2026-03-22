import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Set up mocks BEFORE importing the controller
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(() => ({
      user: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
      },
    })),
  }
})

vi.mock('../../services/jwtService.js', () => ({
  signToken: vi.fn((payload) => `access-token-for-${payload.id}`),
  signRefreshToken: vi.fn((payload) => `refresh-token-for-${payload.id}`),
  verifyToken: vi.fn((token) => {
    if (token.startsWith('access-token-for-')) {
      return { id: token.replace('access-token-for-', ''), email: 'user@example.com' }
    }
    throw new Error('Invalid token')
  }),
  verifyRefreshToken: vi.fn((token) => {
    if (token.startsWith('refresh-token-for-')) {
      return { id: token.replace('refresh-token-for-', '') }
    }
    throw new Error('Invalid refresh token')
  }),
  extractTokenFromHeader: vi.fn((header) => {
    if (header?.startsWith('Bearer ')) {
      return header.slice(7)
    }
    return null
  }),
}))

vi.mock('../../services/oauthService.js', () => ({
  verifyIdToken: vi.fn((token) => {
    if (token === 'valid-id-token') {
      return {
        googleId: 'google-123',
        email: 'user@example.com',
        name: 'Test User',
      }
    }
    throw new Error('Invalid Google ID token')
  }),
}))

// NOW import after mocks are set up
import { googleCallback, refreshCallback, logoutCallback, getCurrentUserCallback } from '../authController.js'
import * as jwtService from '../../services/jwtService.js'
import * as oauthService from '../../services/oauthService.js'
import { PrismaClient } from '@prisma/client'

// Get mocked Prisma methods
const prismaModule = await import('@prisma/client')
const PrismaClientMocked = vi.mocked(prismaModule.PrismaClient)

describe('authController', () => {
  let mockReq, mockRes, mockNext
  let mockUpsert, mockFindUnique

  beforeEach(() => {
    // Create a new mocked Prisma instance
    const mockPrisma = {
      user: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
      },
    }

    // Update the Prisma mock to return our instance
    PrismaClientMocked.mockImplementation(() => mockPrisma)

    // Store references for this test
    mockUpsert = mockPrisma.user.upsert
    mockFindUnique = mockPrisma.user.findUnique

    // Mock request and response objects
    mockReq = {
      body: {},
      headers: {},
      user: null,
    }

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }

    mockNext = vi.fn()

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('googleCallback', () => {
    it('should return 400 if idToken is missing', async () => {
      mockReq.body = {}

      await googleCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'idToken is required',
      })
    })

    it('should create a new user on first login', async () => {
      mockReq.body = { idToken: 'valid-id-token' }

      const mockUser = {
        id: '123',
        email: 'user@example.com',
        name: 'Test User',
        googleId: 'google-123',
      }

      mockUpsert.mockResolvedValue(mockUser)

      await googleCallback(mockReq, mockRes)

      expect(mockUpsert).toHaveBeenCalledWith({
        where: { googleId: 'google-123' },
        update: {
          email: 'user@example.com',
          name: 'Test User',
        },
        create: {
          email: 'user@example.com',
          name: 'Test User',
          googleId: 'google-123',
        },
      })

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        accessToken: 'access-token-for-123',
        refreshToken: 'refresh-token-for-123',
        user: {
          id: '123',
          email: 'user@example.com',
          name: 'Test User',
        },
      })
    })

    it('should return 401 for invalid Google ID token', async () => {
      mockReq.body = { idToken: 'invalid-id-token' }

      await googleCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Invalid Google ID token',
      })
    })
  })

  describe('refreshCallback', () => {
    it('should return 400 if refreshToken is missing', async () => {
      mockReq.body = {}

      await refreshCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'refreshToken is required',
      })
    })

    it('should generate new tokens for valid refresh token', async () => {
      mockReq.body = { refreshToken: 'refresh-token-for-123' }

      const mockUser = {
        id: '123',
        email: 'user@example.com',
        name: 'Test User',
      }

      mockFindUnique.mockResolvedValue(mockUser)

      await refreshCallback(mockReq, mockRes)

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        select: {
          id: true,
          email: true,
          name: true,
        },
      })

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        accessToken: 'access-token-for-123',
        refreshToken: 'refresh-token-for-123',
        user: mockUser,
      })
    })

    it('should return 404 if user not found', async () => {
      mockReq.body = { refreshToken: 'refresh-token-for-nonexistent' }

      mockFindUnique.mockResolvedValue(null)

      await refreshCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Not Found',
        message: 'User not found',
      })
    })

    it('should return 401 for invalid refresh token', async () => {
      mockReq.body = { refreshToken: 'invalid-token' }

      await refreshCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(401)
    })
  })

  describe('logoutCallback', () => {
    it('should return success for logout', async () => {
      await logoutCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      })
    })
  })

  describe('getCurrentUserCallback', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = null

      await getCurrentUserCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'No user context found',
      })
    })

    it('should return user info for authenticated user', async () => {
      mockReq.user = { id: '123', email: 'user@example.com' }

      const mockUser = {
        id: '123',
        email: 'user@example.com',
        name: 'Test User',
      }

      mockFindUnique.mockResolvedValue(mockUser)

      await getCurrentUserCallback(mockReq, mockRes)

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        select: {
          id: true,
          email: true,
          name: true,
        },
      })

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockUser)
    })

    it('should return 404 if user not found in database', async () => {
      mockReq.user = { id: '123', email: 'user@example.com' }

      mockFindUnique.mockResolvedValue(null)

      await getCurrentUserCallback(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Not Found',
        message: 'User not found',
      })
    })
  })
})
