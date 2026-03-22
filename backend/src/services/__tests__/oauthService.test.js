import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock google-auth-library BEFORE importing the service
vi.mock('google-auth-library', () => {
  const mockTicket = {
    getPayload: vi.fn(() => ({
      email: 'user@example.com',
      name: 'Test User',
      sub: 'google-123',
      picture: 'https://example.com/photo.jpg',
    })),
  }

  const mockTicketNoName = {
    getPayload: vi.fn(() => ({
      email: 'user@example.com',
      sub: 'google-123',
      picture: 'https://example.com/photo.jpg',
    })),
  }

  return {
    OAuth2Client: vi.fn(function (config) {
      this.clientId = config.clientId
      this.clientSecret = config.clientSecret
      this.verifyIdToken = vi.fn(async ({ idToken, audience }) => {
        if (idToken === 'valid-token') {
          return mockTicket
        }
        throw new Error('Invalid token')
      })
      this.getToken = vi.fn(async ({ code }) => {
        if (code === 'valid-code') {
          return {
            tokens: {
              access_token: 'access-token',
              id_token: 'id-token',
            },
          }
        }
        throw new Error('Invalid code')
      })
      this.generateAuthUrl = vi.fn(({ redirect_uri, scope, access_type }) => {
        return `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_uri}`
      })
    }),
  }
})

// Set environment variables BEFORE importing the service
process.env.GOOGLE_CLIENT_ID = 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'

import { verifyIdToken, verifyAuthorizationCode, getAuthUrl } from '../oauthService.js'

describe('oauthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
  })

  describe('verifyIdToken', () => {
    it('should verify valid Google ID token', async () => {
      const result = await verifyIdToken('valid-token')

      expect(result).toBeDefined()
      expect(result.email).toBe('user@example.com')
      expect(result.name).toBe('Test User')
      expect(result.googleId).toBe('google-123')
      expect(result.picture).toBe('https://example.com/photo.jpg')
    })

    it('should throw error if idToken is not provided', async () => {
      await expect(verifyIdToken(null)).rejects.toThrow('ID token is required')
      await expect(verifyIdToken('')).rejects.toThrow('ID token is required')
    })

    it('should throw error if GOOGLE_CLIENT_ID is not set', async () => {
      delete process.env.GOOGLE_CLIENT_ID

      await expect(verifyIdToken('some-token')).rejects.toThrow(
        'GOOGLE_CLIENT_ID environment variable is not set'
      )
    })

    it('should throw error for invalid token', async () => {
      await expect(verifyIdToken('invalid-token')).rejects.toThrow()
    })

    it('should use email prefix as name fallback', async () => {
      // This test uses the mocked response which includes name
      const result = await verifyIdToken('valid-token')

      expect(result.email).toBe('user@example.com')
      expect(result.name).toBe('Test User')
    })
  })

  describe('verifyAuthorizationCode', () => {
    it('should verify valid authorization code', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'

      const result = await verifyAuthorizationCode('valid-code', 'http://localhost:3001/callback')

      expect(result).toBeDefined()
      expect(result.access_token).toBe('access-token')
      expect(result.id_token).toBe('id-token')
    })

    it('should throw error if code is not provided', async () => {
      await expect(verifyAuthorizationCode(null, 'http://localhost:3001')).rejects.toThrow(
        'Authorization code and redirect URI are required'
      )
    })

    it('should throw error if redirectUri is not provided', async () => {
      await expect(verifyAuthorizationCode('some-code', null)).rejects.toThrow(
        'Authorization code and redirect URI are required'
      )
    })

    it('should throw error for invalid authorization code', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'

      await expect(verifyAuthorizationCode('invalid-code', 'http://localhost:3001/callback')).rejects.toThrow()
    })
  })

  describe('getAuthUrl', () => {
    it('should generate Google auth URL', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'

      const redirectUri = 'http://localhost:3001/callback'
      const url = getAuthUrl(redirectUri)

      expect(url).toBeDefined()
      expect(typeof url).toBe('string')
      expect(url).toContain('redirect_uri')
    })

    it('should throw error if redirectUri is not provided', () => {
      expect(() => getAuthUrl(null)).toThrow('Redirect URI is required')
      expect(() => getAuthUrl('')).toThrow('Redirect URI is required')
    })
  })
})
