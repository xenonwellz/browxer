import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import type { Credentials } from '@/lib/crypto.server'
import { encryptSession } from '@/lib/crypto.server'

const COOKIE_NAME = 's3_session'
const SESSION_DURATION = 60 * 60 * 12 // 12 hours

export const loginUser = createServerFn({ method: 'POST' })
  .inputValidator((data: Credentials) => data)
  .handler(async ({ data }) => {
    const { accessKeyId, secretAccessKey, region, endpoint } = data

    try {
      const s3 = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
        endpoint: endpoint || undefined,
        forcePathStyle: !!endpoint,
      })

      // Validate credentials
      await s3.send(new ListBucketsCommand({}))

      const secret = process.env.COOKIE_SECRET
      if (!secret) {
        throw new Error('COOKIE_SECRET is not configured on the server')
      }

      const sessionToken = encryptSession(data, secret)

      setCookie(COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION,
        path: '/',
      })

      return { success: true }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.message || 'Invalid AWS credentials or configuration', { cause: error })
    }
  })

export const logoutUser = createServerFn({ method: 'POST' }).handler(() => {
  deleteCookie(COOKIE_NAME)
  return { success: true }
})

export const getSession = createServerFn({ method: 'GET' }).handler(() => {
  const session = getCookie(COOKIE_NAME)
  return { isAuthenticated: !!session }
})
