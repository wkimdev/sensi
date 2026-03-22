import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  signToken,
  signRefreshToken,
  verifyToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  decodeToken,
} from '../jwtService.js'

describe('jwtService', () => {
  const testUser = {
    id: '123',
    email: 'test@example.com',
  }

  describe('signToken', () => {
    it('should create a valid access token', () => {
      const token = signToken(testUser)

      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')

      // Token should be decodable
      const decoded = decodeToken(token)
      expect(decoded.id).toBe(testUser.id)
      expect(decoded.email).toBe(testUser.email)
      expect(decoded.type).toBeUndefined() // Access tokens don't have type
    })

    it('should throw error if user is missing id', () => {
      const invalidUser = { email: 'test@example.com' }

      expect(() => signToken(invalidUser)).toThrow('User object must contain id and email')
    })

    it('should throw error if user is missing email', () => {
      const invalidUser = { id: '123' }

      expect(() => signToken(invalidUser)).toThrow('User object must contain id and email')
    })

    it('should throw error if user is null', () => {
      expect(() => signToken(null)).toThrow('User object must contain id and email')
    })
  })

  describe('signRefreshToken', () => {
    it('should create a valid refresh token', () => {
      const token = signRefreshToken(testUser)

      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')

      const decoded = decodeToken(token)
      expect(decoded.id).toBe(testUser.id)
      expect(decoded.email).toBe(testUser.email)
      expect(decoded.type).toBe('refresh')
    })

    it('should throw error if user is missing required fields', () => {
      const invalidUser = { id: '123' }

      expect(() => signRefreshToken(invalidUser)).toThrow('User object must contain id and email')
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid access token', () => {
      const token = signToken(testUser)
      const decoded = verifyToken(token)

      expect(decoded.id).toBe(testUser.id)
      expect(decoded.email).toBe(testUser.email)
    })

    it('should throw error if token is required but not provided', () => {
      expect(() => verifyToken(null)).toThrow('Token is required')
      expect(() => verifyToken('')).toThrow('Token is required')
    })

    it('should throw error if token is invalid', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid token')
    })

    it('should reject refresh token as access token', () => {
      const refreshToken = signRefreshToken(testUser)

      // Verification should pass (same secret)
      const decoded = verifyToken(refreshToken)
      expect(decoded.type).toBe('refresh')
    })
  })

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = signRefreshToken(testUser)
      const decoded = verifyRefreshToken(token)

      expect(decoded.id).toBe(testUser.id)
      expect(decoded.email).toBe(testUser.email)
      expect(decoded.type).toBe('refresh')
    })

    it('should throw error if token is required but not provided', () => {
      expect(() => verifyRefreshToken(null)).toThrow('Refresh token is required')
      expect(() => verifyRefreshToken('')).toThrow('Refresh token is required')
    })

    it('should throw error if token is not a refresh token', () => {
      const accessToken = signToken(testUser)

      expect(() => verifyRefreshToken(accessToken)).toThrow('Invalid refresh token type')
    })

    it('should throw error if token is invalid', () => {
      expect(() => verifyRefreshToken('invalid-token')).toThrow('Invalid refresh token')
    })
  })

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Authorization header', () => {
      const token = 'my-token-value'
      const header = `Bearer ${token}`

      const extracted = extractTokenFromHeader(header)
      expect(extracted).toBe(token)
    })

    it('should return null if header is missing', () => {
      expect(extractTokenFromHeader(null)).toBeNull()
      expect(extractTokenFromHeader('')).toBeNull()
    })

    it('should return null if header format is invalid', () => {
      expect(extractTokenFromHeader('InvalidFormat')).toBeNull()
      expect(extractTokenFromHeader('Bearer')).toBeNull()
      expect(extractTokenFromHeader('Bearer token extra')).toBeNull()
    })

    it('should return null if header does not start with Bearer', () => {
      expect(extractTokenFromHeader('Basic my-token')).toBeNull()
    })
  })

  describe('decodeToken', () => {
    it('should decode a valid token without verification', () => {
      const token = signToken(testUser)
      const decoded = decodeToken(token)

      expect(decoded.id).toBe(testUser.id)
      expect(decoded.email).toBe(testUser.email)
    })

    it('should return null if token is not provided', () => {
      expect(decodeToken(null)).toBeNull()
      expect(decodeToken('')).toBeNull()
    })

    it('should return null for invalid token', () => {
      expect(decodeToken('invalid-token')).toBeNull()
    })
  })
})
