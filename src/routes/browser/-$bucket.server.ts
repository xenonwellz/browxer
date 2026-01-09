import { createServerFn } from '@tanstack/react-start'
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import { getS3Client } from '@/lib/s3-client.server'
import { authMiddleware } from '@/server/middleware'

export const listObjects = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: {
      bucket: string
      prefix?: string
      continuationToken?: string
      maxKeys?: number
    }) => data,
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }: { data: any; context: any }) => {
    const { bucket, prefix, continuationToken, maxKeys = 100 } = data
    const s3 = getS3Client(context.credentials)

    try {
      const response = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix || '',
          Delimiter: '/',
          ContinuationToken: continuationToken,
          MaxKeys: maxKeys,
        }),
      )

      return {
        folders: (response.CommonPrefixes || []).map((p) => p.Prefix),
        objects: (response.Contents || [])
          .map((obj) => ({
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
            etag: obj.ETag,
            storageClass: obj.StorageClass,
          }))
          .filter((obj) => obj.key !== prefix), // Filter out the current folder marker if it exists
        nextContinuationToken: response.NextContinuationToken,
        isTruncated: response.IsTruncated,
      }
    } catch (error: any) {
      console.error('ListObjects failed:', error)
      throw new Error(error.message || 'Failed to list objects')
    }
  })

export const getObjectMetadata = createServerFn({ method: 'GET' })
  .inputValidator((data: { bucket: string; key: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }: { data: any; context: any }) => {
    const { bucket, key } = data
    const s3 = getS3Client(context.credentials)

    try {
      // We can use head object for metadata but standard ListObjects already has some.
      // If we need detailed metadata, we call HeadObject
      const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
      const response = await s3.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key }),
      )
      return {
        contentType: response.ContentType,
        lastModified: response.LastModified,
        size: response.ContentLength,
        etag: response.ETag,
        storageClass: response.StorageClass,
        metadata: response.Metadata,
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get object metadata')
    }
  })

export const deleteObject = createServerFn({ method: 'POST' })
  .inputValidator((data: { bucket: string; key: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }: { data: any; context: any }) => {
    const { bucket, key } = data
    const s3 = getS3Client(context.credentials)

    try {
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
      return { success: true }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete object')
    }
  })

export const renameObject = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { bucket: string; oldKey: string; newKey: string }) => data,
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }: { data: any; context: any }) => {
    const { bucket, oldKey, newKey } = data
    const s3 = getS3Client(context.credentials)

    try {
      // S3 Rename is Copy + Delete
      await s3.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${oldKey}`,
          Key: newKey,
        }),
      )
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: oldKey }))
      return { success: true }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to rename object')
    }
  })

export const getDownloadUrl = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: { bucket: string; key: string }) => data)
  .handler(async ({ data, context }) => {
    const { bucket, key } = data
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    const { GetObjectCommand } = await import('@aws-sdk/client-s3')

    const s3 = getS3Client(context.credentials)
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
    })

    try {
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
      return { url }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate download URL')
    }
  })

export const getUploadPresignedUrl = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    (data: { bucket: string; key: string; contentType?: string }) => data,
  )
  .handler(async ({ data, context }) => {
    const { bucket, key, contentType } = data
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    const { PutObjectCommand } = await import('@aws-sdk/client-s3')

    const s3 = getS3Client(context.credentials)
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })

    try {
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
      return { url }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate upload URL')
    }
  })
