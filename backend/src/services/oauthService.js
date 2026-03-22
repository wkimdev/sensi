import { OAuth2Client } from 'google-auth-library'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

// Initialize Google Auth client
const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
})

/**
 * Verify Google ID token and extract user information
 * @param {string} idToken - Google ID token from client
 * @returns {Object} Verified user info { email, name, sub (googleId) }
 * @throws {Error} If token is invalid or verification fails
 */
export async function verifyIdToken(idToken) {
  if (!idToken) {
    throw new Error('ID token is required')
  }

  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is not set')
  }

  try {
    // Verify the token with Google servers
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    // Extract payload from verified token
    const payload = ticket.getPayload()

    // Validate required fields
    if (!payload.email || !payload.sub) {
      throw new Error('Invalid token payload: missing email or sub')
    }

    return {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0], // Fallback to email prefix
      googleId: payload.sub, // Google's unique user ID
      picture: payload.picture || null, // Optional: user's profile picture
    }
  } catch (error) {
    // Re-throw with more context
    if (error.message.includes('Invalid token')) {
      throw new Error('Invalid Google ID token')
    } else if (error.message.includes('Token used too late')) {
      throw new Error('Google ID token has expired')
    } else if (error.message.includes('Token used too early')) {
      throw new Error('Google ID token timestamp is too early')
    }
    throw new Error(`Google OAuth verification failed: ${error.message}`)
  }
}

/**
 * Verify ID token from authorization code (alternative flow)
 * For use with authorization code flow if needed in future
 * @param {string} code - Authorization code from Google
 * @param {string} redirectUri - Redirect URI used in authorization request
 * @returns {Object} Token response with access_token, id_token, etc.
 */
export async function verifyAuthorizationCode(code, redirectUri) {
  if (!code || !redirectUri) {
    throw new Error('Authorization code and redirect URI are required')
  }

  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    })

    return tokens
  } catch (error) {
    throw new Error(`Failed to verify authorization code: ${error.message}`)
  }
}

/**
 * Get Google auth URL for authorization code flow
 * For use if implementing authorization code flow
 * @param {string} redirectUri - Where Google will redirect after auth
 * @returns {string} Google OAuth authorization URL
 */
export function getAuthUrl(redirectUri) {
  if (!redirectUri) {
    throw new Error('Redirect URI is required')
  }

  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    redirect_uri: redirectUri,
  })
}
