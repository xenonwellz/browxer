import { createServerFn } from '@tanstack/react-start'
import { ListBucketsCommand } from '@aws-sdk/client-s3'
import { getS3Client } from '@/lib/s3-client.server'
import { authMiddleware } from '@/server/middleware'

export const listBuckets = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const s3 = getS3Client(context.credentials)
    try {
      const response = await s3.send(new ListBucketsCommand({}))
      return response.Buckets || []
    } catch (error: any) {
      console.error('ListBuckets failed:', error)
      throw new Error(error.message || 'Failed to list buckets')
    }
  })
