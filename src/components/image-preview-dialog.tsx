import * as React from 'react'
import { Download } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn, formatBytes } from '@/lib/utils'

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  object: any
  bucket: string
  downloadUrl?: string
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  object,
  bucket,
  downloadUrl: initialDownloadUrl,
}: ImagePreviewDialogProps) {
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(
    initialDownloadUrl || null,
  )
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open && object && !downloadUrl) {
      setIsLoading(true)
      import('@/routes/browser/-$bucket.server')
        .then(({ getDownloadUrl }) => {
          return getDownloadUrl({ data: { bucket, key: object.key } })
        })
        .then(({ url }) => {
          setDownloadUrl(url)
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
    // Reset when closed
    if (!open) {
      setDownloadUrl(null)
    }
  }, [open, object, bucket])

  if (!object) return null

  const fileName = object.key.split('/').pop()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="truncate pr-8">{fileName}</DialogTitle>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={fileName}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'mr-8',
              )}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          )}
        </DialogHeader>

        <div className="flex-1 relative bg-muted/10 w-full h-full overflow-hidden flex items-center justify-center p-8">
          {/* Tiny lines background for transparency check */}
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
              backgroundSize: '10px 10px',
            }}
          />

          {/* Second layer for better visibility on dark mode */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-grid-slate-200 dark:bg-grid-slate-800 mask-[linear-gradient(to_bottom,white,transparent)]" />

          {isLoading ? (
            <div className="animate-pulse w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
              Loading preview...
            </div>
          ) : (
            downloadUrl && (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={downloadUrl}
                  alt={fileName}
                  className="max-w-full max-h-full object-contain shadow-sm"
                />
              </div>
            )
          )}
        </div>

        <div className="p-2 bg-muted/20 text-xs text-muted-foreground text-center border-t shrink-0">
          {formatBytes(object.size)} • {object.key}
        </div>
      </DialogContent>
    </Dialog>
  )
}
