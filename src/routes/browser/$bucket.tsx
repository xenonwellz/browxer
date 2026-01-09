import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Plus, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { getSession } from '@/routes/-login.server'
import { listObjects } from '@/routes/browser/-$bucket.server'
import { listBuckets } from '@/routes/browser/-browser.server'
import { generatePublicReadPolicy, getBucketPolicy } from '@/routes/browser/-bucket-management.server'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { ObjectTable } from '@/components/object-table'
import { MetadataPanel } from '@/components/metadata-panel'
import { UploadDropzone } from '@/components/upload-dropzone'
import { BucketPolicyDialog } from '@/components/bucket-policy-dialog'
import { ImagePreviewDialog } from '@/components/image-preview-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const [previewObject, setPreviewObject] = React.useState<any | null>(null)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = React.useState(false)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['objects', bucket, prefix],
    queryFn: () => listObjects({ data: { bucket, prefix } }),
  })

  const { data: buckets } = useQuery({
    queryKey: ['buckets'],
    queryFn: () => listBuckets(),
  })

  const { data: policyData } = useQuery({
    queryKey: ['bucket-policy', bucket],
    queryFn: () => getBucketPolicy({ data: { bucket } }),
  })

  const currentBucket = buckets?.find((b: any) => b.Name === bucket)

  const getPolicyStatus = () => {
    if (!policyData?.hasPolicy || !policyData.policy) return 'Private'
    try {
      const normalizedIncoming = policyData.policy.replace(/\s/g, '')
      const normalizedPublic = generatePublicReadPolicy(bucket).replace(/\s/g, '')
      
      return normalizedIncoming === normalizedPublic ? 'Public' : 'Custom'
    } catch {
      return 'Custom'
    }
  }

  const policyStatus = getPolicyStatus()

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight truncate">
            {bucket}
          </h1>
          <BreadcrumbNav bucket={bucket} prefix={prefix} />
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Policy:</span>
              <Badge 
                variant={policyStatus === 'Public' ? 'default' : policyStatus === 'Private' ? 'secondary' : 'outline'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsPolicyDialogOpen(true)}
              >
                {policyStatus}
              </Badge>
            </div>
            {currentBucket?.CreationDate && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Created:</span>
                <Badge variant="outline" className="font-normal">
                  {format(new Date(currentBucket.CreationDate), 'MMM d, yyyy')}
                </Badge>
              </div>
            )}
          </div>
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

      <div className="h-px bg-border shadow-[0_1px_0_0_rgba(0,0,0,0.05)]" />

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
        onPreview={setPreviewObject}
      />

      <ImagePreviewDialog 
        bucket={bucket}
        object={previewObject}
        open={!!previewObject}
        onOpenChange={(open) => !open && setPreviewObject(null)}
      />

      <BucketPolicyDialog
        bucket={bucket}
        open={isPolicyDialogOpen}
        onOpenChange={setIsPolicyDialogOpen}
      />
    </div>
  )
}
