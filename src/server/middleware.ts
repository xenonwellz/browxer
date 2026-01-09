import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { Credentials } from '@/lib/crypto.server'
import { decryptSession } from '@/lib/crypto.server'

const COOKIE_NAME = 's3_session'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const sessionToken = getCookie(COOKIE_NAME)

    if (!sessionToken) {
      throw new Error('Unauthorized: No session')
    }

    const secret = process.env.COOKIE_SECRET
    if (!secret) {
      throw new Error('COOKIE_SECRET is not configured on the server')
    }

    try {
      const credentials = decryptSession(sessionToken, secret)
      return await next({
        context: {
          credentials,
        },
      })
    } catch (error) {
      console.error('Session decryption failed:', error)
      throw new Error('Unauthorized: Invalid session')
    }
  },
)

// Type augmentation for middleware context
declare module '@tanstack/react-start' {
  interface MiddlewareContext {
    credentials: Credentials
  }
}
