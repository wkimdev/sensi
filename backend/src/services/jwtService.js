import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

/**
 * Sign an access token
 * @param {Object} user - User object with { id, email }
 * @returns {string} Signed JWT access token
 */
export function signToken(user) {
  if (!user || !user.id || !user.email) {
    throw new Error('User object must contain id and email')
  }

  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )
}

/**
 * Sign a refresh token
 * @param {Object} user - User object with { id, email }
 * @returns {string} Signed JWT refresh token
 */
export function signRefreshToken(user) {
  if (!user || !user.id || !user.email) {
    throw new Error('User object must contain id and email')
  }

  return jwt.sign(
    { id: user.id, email: user.email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  )
}

/**
 * Verify an access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload { id, email, iat, exp }
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  if (!token) {
    throw new Error('Token is required')
  }

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired')
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    }
    throw error
  }
}

/**
 * Verify a refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded payload { id, email, type, iat, exp }
 * @throws {Error} If token is invalid, expired, or not a refresh token
 */
export function verifyRefreshToken(token) {
  if (!token) {
    throw new Error('Refresh token is required')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token type')
    }

    return decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired')
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token')
    }
    throw error
  }
}

/**
 * Decode a token without verification (for debugging)
 * Use with caution - only for non-security-critical purposes
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function decodeToken(token) {
  if (!token) {
    return null
  }

  try {
    return jwt.decode(token)
  } catch {
    return null
  }
}

/**
 * Extract token from Authorization header
 * Expected format: "Bearer <token>"
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if header is invalid
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}
