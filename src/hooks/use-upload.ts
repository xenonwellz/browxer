import * as React from 'react'
import { toast } from 'sonner'
import { getUploadPresignedUrl } from '@/routes/browser/-$bucket.server'

export function useUpload(bucket: string, prefix: string) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})

  const uploadFiles = async (files: Array<File>) => {
    setIsUploading(true)
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const key = prefix + file.name
        try {
          const { url } = await getUploadPresignedUrl({
            data: { bucket, key, contentType: file.type },
          })

          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('PUT', url)
            xhr.setRequestHeader('Content-Type', file.type)

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100)
                setProgresses((prev) => ({ ...prev, [file.name]: percent }))
              }
            }

            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve({ name: file.name, success: true })
              } else {
                reject(new Error(`Upload failed for ${file.name}`))
              }
            }

            xhr.onerror = () => reject(new Error(`Network error during upload of ${file.name}`))
            xhr.send(file)
          })
        } catch (error: any) {
          throw new Error(`Failed to get upload URL for ${file.name}: ${error.message}`, {
            cause: error,
          })
        }
      }),
    )

    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      toast.error(`Failed to upload ${failures.length} files`)
    } else {
      toast.success('All files uploaded successfully')
    }

    setIsUploading(false)
    setProgresses({})
  }

  return { uploadFiles, progresses, isUploading }
}
