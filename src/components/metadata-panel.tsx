import * as React from 'react'
import {
  Calendar,
  FileText,
  HardDrive,
  Hash,
  Loader2,
  Type,
} from 'lucide-react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Card, CardContent } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
import { getObjectMetadata } from '@/routes/browser/-$bucket.server'

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

  return (
    <Sheet open={!!object} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Object Metadata
          </SheetTitle>
          <SheetDescription className="break-all">
            {object?.key}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : metadata ? (
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                System Properties
              </h3>
              <div className="grid gap-3">
                <MetadataItem
                  icon={<HardDrive className="h-4 w-4" />}
                  label="Size"
                  value={formatBytes(metadata.size || 0)}
                />
                <MetadataItem
                  icon={<Type className="h-4 w-4" />}
                  label="Content-Type"
                  value={metadata.contentType || 'unknown'}
                />
                <MetadataItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Last Modified"
                  value={
                    metadata.lastModified
                      ? format(new Date(metadata.lastModified), 'PPP p')
                      : 'n/a'
                  }
                />
                <MetadataItem
                  icon={<Hash className="h-4 w-4" />}
                  label="ETag"
                  value={metadata.etag || 'n/a'}
                />
                <MetadataItem
                  icon={<HardDrive className="h-4 w-4" />}
                  label="Storage Class"
                  value={metadata.storageClass || 'Standard'}
                />
              </div>
            </section>

            {metadata.metadata && Object.keys(metadata.metadata).length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  User Metadata
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y text-sm">
                      {Object.entries(metadata.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3">
                          <span className="font-medium text-muted-foreground">
                            {key}
                          </span>
                          <span className="text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <section className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Object Path
              </h3>
              <Card>
                <CardContent className="p-3 text-sm break-all font-mono bg-muted/50">
                  {object?.key}
                </CardContent>
              </Card>
            </section>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Failed to load metadata
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function MetadataItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="grid gap-0.5">
        <span className="font-medium text-muted-foreground leading-none">
          {label}
        </span>
        <span className="text-foreground">{value}</span>
      </div>
    </div>
  )
}
