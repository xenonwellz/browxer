import * as React from 'react'
import {
  Calendar,
  Copy,
  FileText,
  HardDrive,
  Hash,
  Loader2,
  Type,
} from 'lucide-react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn, formatBytes } from '@/lib/utils'
import { getDownloadUrl, getObjectMetadata } from '@/routes/browser/-$bucket.server'

interface MetadataPanelProps {
  bucket: string
  object: any | null
  onClose: () => void
}

export function MetadataPanel({ bucket, object, onClose }: MetadataPanelProps) {
  const { data: metadata, isLoading } = useQuery({
    queryKey: ['metadata', bucket, object?.key],
    queryFn: () => getObjectMetadata({ data: { bucket, key: object.key } }),
    enabled: !!object,
  })

  const { data: imageUrl } = useQuery({
    queryKey: ['image-preview', bucket, object?.key],
    queryFn: async () => {
      const result = await getDownloadUrl({ data: { bucket, key: object.key } })
      return result.url
    },
    enabled: !!object && !!metadata?.contentType?.startsWith('image/'),
  })

  const isImage = metadata?.contentType?.startsWith('image/')

  const handleCopyPath = () => {
    if (!object?.key) return
    navigator.clipboard.writeText(object.key)
    toast.success('Path copied to clipboard')
  }

  return (
    <Sheet open={!!object} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-hidden flex flex-col p-0" showCloseButton={false}>
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Object Metadata
          </SheetTitle>
          <SheetDescription className="truncate text-xs font-mono">
            {object?.key?.split('/').pop()}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : metadata ? (
            <div className="divide-y divide-border/50">
              {isImage && imageUrl && (
                <section className="p-6 pb-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Preview
                  </h3>
                  <div 
                    className="relative rounded-lg overflow-hidden border flex items-center justify-center bg-muted/30"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #e5e5e5 25%, transparent 25%, transparent 75%, #e5e5e5 75%, #e5e5e5), repeating-linear-gradient(45deg, #e5e5e5 25%, #e5e5e5 75%, transparent 75%, transparent)`,
                      backgroundPosition: '0 0, 10px 10px',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    <img 
                      src={imageUrl} 
                      alt={object?.key?.split('/').pop() || 'Preview'}
                      className="w-full h-auto aspect-square object-contain"
                    />
                  </div>
                </section>
              )}

              <section className="p-6 pb-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                   <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Full Path
                  </h3>
                  <Button variant="ghost" size="icon-sm" onClick={handleCopyPath} className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="bg-muted px-3 py-2 rounded-lg break-all font-mono text-xs border">
                  {object?.key}
                </div>
              </section>

              <section className="p-6 py-4 space-y-3">
                 <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  System Properties
                </h3>
                <div className="grid gap-2">
                  <MetadataItem
                    label="Size"
                    value={formatBytes(metadata.size || 0)}
                    icon={<HardDrive className="h-4 w-4" />}
                  />
                  <MetadataItem
                    label="Content-Type"
                    value={metadata.contentType || 'application/octet-stream'}
                    icon={<Type className="h-4 w-4" />}
                  />
                  <MetadataItem
                    label="Last Modified"
                    value={
                      metadata.lastModified
                        ? format(new Date(metadata.lastModified), 'PPP p')
                        : 'Not available'
                    }
                    icon={<Calendar className="h-4 w-4" />}
                  />
                  <MetadataItem
                    label="ETag"
                    value={metadata.etag || 'No ETag'}
                    icon={<Hash className="h-4 w-4" />}
                    className="font-mono text-[11px]"
                  />
                </div>
              </section>

              {metadata.metadata && Object.keys(metadata.metadata).length > 0 && (
                <section className="p-6 space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    User Metadata
                  </h3>
                  <div className="grid gap-3">
                    {Object.entries(metadata.metadata).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          {key}
                        </span>
                        <span className="text-sm border-b border-border/20 pb-2 break-all">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="p-6 pt-4 pb-10">
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
             <div className="p-10 text-center space-y-2">
                <div className="text-destructive font-medium">Failed to load metadata</div>
                <p className="text-xs text-muted-foreground">The object might be unavailable or you lack permissions.</p>
                <Button variant="outline" size="sm" onClick={() => onClose()} className="mt-4">Close</Button>
             </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MetadataItem({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div 
      className="flex items-center justify-between gap-4 cursor-pointer hover:bg-foreground/3 -mx-2 px-2 py-1.5 rounded-md transition-colors group relative"
      onClick={handleCopy}
      title="Click to copy"
    >
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-muted-foreground/60">{icon}</div>
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span className={cn("text-sm text-foreground text-right truncate", className)}>
          {value}
        </span>
        <Copy className="h-3 w-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 absolute right-2 bg-primary rounded p-0.5" />
      </div>
    </div>
  )
}
