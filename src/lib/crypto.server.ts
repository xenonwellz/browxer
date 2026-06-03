import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto'

export interface Credentials {
  accessKeyId: string
  secretAccessKey: string
  region: string
  endpoint?: string
}

export function encryptSession(credentials: Credentials, secret: string): string {
  // Ensure secret is 32 bytes for aes-256-gcm
  const key = createHmac('sha256', secret).digest()
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  const payload = {
    iv: iv.toString('hex'),
    data: encrypted,
    tag: authTag.toString('hex'),
  }

  const payloadStr = JSON.stringify(payload)
  const hmac = createHmac('sha256', secret)
  hmac.update(payloadStr)
  const signature = hmac.digest('hex')

  return Buffer.from(payloadStr + ':' + signature).toString('base64')
}

export function decryptSession(encryptedBase64: string, secret: string): Credentials {
  const decoded = Buffer.from(encryptedBase64, 'base64').toString()
  const lastColonIndex = decoded.lastIndexOf(':')

  if (lastColonIndex === -1) {
    throw new Error('Invalid session format')
  }

  const payloadStr = decoded.substring(0, lastColonIndex)
  const signature = decoded.substring(lastColonIndex + 1)

  const hmac = createHmac('sha256', secret)
  hmac.update(payloadStr)

  if (hmac.digest('hex') !== signature) {
    throw new Error('Session tampered')
  }

  const payload = JSON.parse(payloadStr)
  const key = createHmac('sha256', secret).digest()

  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'hex'))
  decipher.setAuthTag(Buffer.from(payload.tag, 'hex'))

  let decrypted = decipher.update(payload.data, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return JSON.parse(decrypted)
}
