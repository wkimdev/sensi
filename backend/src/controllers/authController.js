import { PrismaClient } from '@prisma/client'
import { verifyIdToken } from '../services/oauthService.js'
import { signToken, signRefreshToken, verifyRefreshToken } from '../services/jwtService.js'

const prisma = new PrismaClient()

/**
 * Handle Google OAuth callback
 * Verifies ID token, creates or updates user, and returns JWT tokens
 * POST /auth/google
 * Body: { idToken: "..." }
 * Response: { accessToken, refreshToken, user: { id, email, name } }
 */
export async function googleCallback(req, res) {
  try {
    const { idToken } = req.body

    // Validate request
    if (!idToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'idToken is required',
      })
    }

    // Verify Google ID token
    const googleUser = await verifyIdToken(idToken)

    // Find or create user in database
    const user = await prisma.user.upsert({
      where: { googleId: googleUser.googleId },
      update: {
        // Update existing user (e.g., name might change)
        email: googleUser.email,
        name: googleUser.name,
      },
      create: {
        // Create new user
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.googleId,
      },
    })

    // Generate JWT tokens
    const accessToken = signToken({ id: user.id, email: user.email })
    const refreshToken = signRefreshToken({ id: user.id, email: user.email })

    // Return tokens and user info
    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    // Handle OAuth verification errors
    if (error.message.includes('Invalid Google ID token') || error.message.includes('expired')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      })
    }

    // Log error for debugging
    console.error('OAuth callback error:', error)

    // Generic server error
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process Google OAuth login',
    })
  }
}

/**
 * Refresh access token using refresh token
 * POST /auth/refresh
 * Body: { refreshToken: "..." }
 * Response: { accessToken, refreshToken, user }
 */
export async function refreshCallback(req, res) {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'refreshToken is required',
      })
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    // Fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      })
    }

    // Generate new tokens
    const newAccessToken = signToken({ id: user.id, email: user.email })
    const newRefreshToken = signRefreshToken({ id: user.id, email: user.email })

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    })
  } catch (error) {
    // Handle refresh token validation errors
    if (error.message.includes('expired') || error.message.includes('Invalid')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      })
    }

    console.error('Refresh callback error:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh token',
    })
  }
}

/**
 * Logout handler (optional)
 * POST /auth/logout
 */
export async function logoutCallback(req, res) {
  try {
    // For stateless JWT auth, logout is primarily client-side
    // Server just returns success to client which clears localStorage
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to logout',
    })
  }
}

/**
 * Get current user info
 * GET /auth/me
 * Requires valid Authorization header
 */
export async function getCurrentUserCallback(req, res) {
  try {
    // req.user should be set by auth middleware
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No user context found',
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('Get current user error:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user info',
    })
  }
}
