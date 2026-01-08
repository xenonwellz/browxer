import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Plus, RefreshCw } from 'lucide-react'
import { getSession } from '@/routes/-login.server'
import { listObjects } from '@/routes/browser/-$bucket.server'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { ObjectTable } from '@/components/object-table'
import { MetadataPanel } from '@/components/metadata-panel'
import { UploadDropzone } from '@/components/upload-dropzone'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const bucketSearchSchema = z.object({
  prefix: z.string().optional().catch(''),
})

export const Route = createFileRoute('/browser/$bucket')({
  validateSearch: (search) => bucketSearchSchema.parse(search),
  beforeLoad: async () => {
    const session = await getSession()
    if (!session.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: BucketPage,
})

function BucketPage() {
  const { bucket } = Route.useParams()
  const { prefix = '' } = Route.useSearch()
  const [selectedObject, setSelectedObject] = React.useState<any | null>(null)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['objects', bucket, prefix],
    queryFn: () => listObjects({ data: { bucket, prefix } }),
  })

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight mb-1 truncate">
            {bucket}
          </h1>
          <BreadcrumbNav bucket={bucket} prefix={prefix} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', isFetching && 'animate-spin')}
            />
            Refresh
          </Button>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              }
            />

            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Upload files to the current folder:{' '}
                  <code className="bg-muted px-1 rounded">
                    {prefix || 'root'}
                  </code>
                </DialogDescription>
              </DialogHeader>
              <UploadDropzone
                bucket={bucket}
                prefix={prefix}
                onComplete={() => {
                  setIsUploadOpen(false)
                  refetch()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ObjectTable
        bucket={bucket}
        prefix={prefix}
        folders={(data?.folders ?? []).filter((f): f is string => !!f)}
        objects={data?.objects || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onSelectObject={setSelectedObject}
      />

      <MetadataPanel
        bucket={bucket}
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
      />
    </div>
  )
}
