import express from 'express'
import { googleCallback, refreshCallback, logoutCallback, getCurrentUserCallback } from '../controllers/authController.js'

const router = express.Router()

/**
 * POST /auth/google
 * Handle Google OAuth login
 * Body: { idToken: "..." }
 * Response: { accessToken, refreshToken, user }
 */
router.post('/google', googleCallback)

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 * Body: { refreshToken: "..." }
 * Response: { accessToken, refreshToken }
 */
router.post('/refresh', refreshCallback)

/**
 * POST /auth/logout
 * Logout handler (primarily client-side for JWT)
 * Response: { success, message }
 */
router.post('/logout', logoutCallback)

/**
 * GET /auth/me
 * Get current user info
 * Requires: Authorization: Bearer <token>
 * Response: { id, email, name }
 */
router.get('/me', getCurrentUserCallback)

export default router
