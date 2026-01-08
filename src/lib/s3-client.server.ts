import { S3Client } from '@aws-sdk/client-s3'
import type { Credentials } from './crypto.server'

export function getS3Client(credentials: Credentials) {
  return new S3Client({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
    endpoint: credentials.endpoint || undefined,
    forcePathStyle: !!credentials.endpoint,
  })
}
