import { createServerFn } from '@tanstack/react-start'
import {
  CreateBucketCommand,
  DeleteBucketPolicyCommand,
  GetBucketPolicyCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3'
import type { BucketLocationConstraint } from '@aws-sdk/client-s3'
import { getS3Client } from '@/lib/s3-client.server'
import { authMiddleware } from '@/server/middleware'

export const createBucket = createServerFn({ method: 'POST' })
  .inputValidator((data: { bucketName: string; region?: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { bucketName, region } = data
    const s3 = getS3Client(context.credentials)

    try {
      const command = new CreateBucketCommand({
        Bucket: bucketName,
        ...(region &&
          region !== 'us-east-1' && {
            CreateBucketConfiguration: {
              LocationConstraint: region as BucketLocationConstraint,
            },
          }),
      })

      await s3.send(command)
      return { success: true, bucketName }
    } catch (error: any) {
      console.error('CreateBucket failed:', error)
      throw new Error(error.message || 'Failed to create bucket')
    }
  })

export const getBucketPolicy = createServerFn({ method: 'GET' })
  .inputValidator((data: { bucket: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { bucket } = data
    const s3 = getS3Client(context.credentials)

    try {
      const response = await s3.send(
        new GetBucketPolicyCommand({ Bucket: bucket }),
      )
      return {
        policy: response.Policy || null,
        hasPolicy: !!response.Policy,
      }
    } catch (error: any) {
      // NoSuchBucketPolicy is expected when no policy is set
      if (error.name === 'NoSuchBucketPolicy') {
        return { policy: null, hasPolicy: false }
      }
      console.error('GetBucketPolicy failed:', error)
      throw new Error(error.message || 'Failed to get bucket policy')
    }
  })

export const setBucketPolicy = createServerFn({ method: 'POST' })
  .inputValidator((data: { bucket: string; policy: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { bucket, policy } = data
    const s3 = getS3Client(context.credentials)

    try {
      // Validate that policy is valid JSON
      JSON.parse(policy)

      await s3.send(
        new PutBucketPolicyCommand({
          Bucket: bucket,
          Policy: policy,
        }),
      )
      return { success: true }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON policy')
      }
      console.error('SetBucketPolicy failed:', error)
      throw new Error(error.message || 'Failed to set bucket policy')
    }
  })

export const deleteBucketPolicy = createServerFn({ method: 'POST' })
  .inputValidator((data: { bucket: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { bucket } = data
    const s3 = getS3Client(context.credentials)

    try {
      await s3.send(new DeleteBucketPolicyCommand({ Bucket: bucket }))
      return { success: true }
    } catch (error: any) {
      // Ignore if no policy exists
      if (error.name === 'NoSuchBucketPolicy') {
        return { success: true }
      }
      console.error('DeleteBucketPolicy failed:', error)
      throw new Error(error.message || 'Failed to delete bucket policy')
    }
  })

// Helper to generate common policy templates
export const generatePublicReadPolicy = (bucketName: string) => {
  return JSON.stringify(
    {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    },
    null,
    2,
  )
}
