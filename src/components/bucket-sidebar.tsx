import * as React from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Database, MoreVertical, RefreshCw, Search, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { listBuckets } from '@/routes/browser/-browser.server'
import { cn } from '@/lib/utils'
import { CreateBucketDialog } from '@/components/create-bucket-dialog'
import { BucketPolicyDialog } from '@/components/bucket-policy-dialog'

export function BucketSidebar({ className }: { className?: string }) {
  const { bucket: activeBucket } = useParams({ strict: false })
  const [search, setSearch] = React.useState('')
  const [policyDialogBucket, setPolicyDialogBucket] = React.useState<string | null>(null)

  const {
    data: buckets,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['buckets'],
    queryFn: () => listBuckets(),
  })

  const filteredBuckets = React.useMemo(() => {
    if (!buckets) return []
    return buckets.filter((b: any) => b.Name.toLowerCase().includes(search.toLowerCase()))
  }, [buckets, search])

  return (
    <>
      <div className={cn('flex flex-col h-full border-r bg-muted/20', className)}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Buckets
          </h2>
          <div className="flex items-center gap-1">
            <CreateBucketDialog />
            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buckets..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : error ? (
              <div className="p-4 text-sm text-destructive text-center">Failed to load buckets</div>
            ) : filteredBuckets.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">No buckets found</div>
            ) : (
              filteredBuckets.map((bucket: any) => (
                <div
                  key={bucket.Name}
                  className={cn(
                    'group flex items-center gap-1 rounded-md transition-colors',
                    activeBucket === bucket.Name
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Link
                    to="/browser/$bucket"
                    params={{ bucket: bucket.Name }}
                    className="flex flex-1 items-center gap-2 px-3 py-2 text-sm font-medium"
                  >
                    <Database className="h-4 w-4 shrink-0" />
                    <span className="truncate">{bucket.Name}</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className={cn(
                            'mr-1 opacity-0 group-hover:opacity-100 transition-opacity',
                            activeBucket === bucket.Name &&
                              'text-primary-foreground hover:bg-primary-foreground/20',
                          )}
                        />
                      }
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Bucket options</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setPolicyDialogBucket(bucket.Name)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Policy
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Bucket Policy Dialog */}
      {policyDialogBucket && (
        <BucketPolicyDialog
          bucket={policyDialogBucket}
          open={!!policyDialogBucket}
          onOpenChange={(open) => {
            if (!open) setPolicyDialogBucket(null)
          }}
        />
      )}
    </>
  )
}
