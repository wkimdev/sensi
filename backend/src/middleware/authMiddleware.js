import { verifyToken, extractTokenFromHeader } from '../services/jwtService.js'

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and sets req.user
 * Usage: app.use(authMiddleware) or app.get('/protected', authMiddleware, handler)
 */
export function authMiddleware(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header with Bearer token is required',
      })
    }

    // Verify token
    const payload = verifyToken(token)

    // Set user info on request object
    req.user = {
      id: payload.id,
      email: payload.email,
    }

    // Continue to next middleware/handler
    next()
  } catch (error) {
    // Handle token validation errors
    let statusCode = 401
    let message = 'Invalid token'

    if (error.message.includes('expired')) {
      message = 'Token has expired'
    } else if (error.message.includes('Invalid token')) {
      message = 'Invalid token format'
    } else if (error.message.includes('required')) {
      message = error.message
    }

    return res.status(statusCode).json({
      error: 'Unauthorized',
      message,
    })
  }
}

/**
 * Optional authentication middleware
 * Attempts to verify token but doesn't fail if missing
 * Sets req.user if token is valid, otherwise leaves it undefined
 * Usage: For endpoints that support both authenticated and unauthenticated access
 */
export function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    const token = extractTokenFromHeader(authHeader)

    if (token) {
      const payload = verifyToken(token)
      req.user = {
        id: payload.id,
        email: payload.email,
      }
    }
    // Continue regardless of token validity
    next()
  } catch (error) {
    // Silently fail - user is optional
    // If token was provided but invalid, we still continue
    // (alternative: log the error for debugging)
    next()
  }
}

/**
 * Check if user is authenticated
 * Use after authMiddleware to verify req.user exists
 */
export function isAuthenticated(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User authentication required',
    })
  }
  next()
}
