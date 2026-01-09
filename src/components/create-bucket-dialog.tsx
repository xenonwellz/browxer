'use client'

import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createBucket } from '@/routes/browser/-bucket-management.server'

const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-west-2', label: 'EU (London)' },
  { value: 'eu-west-3', label: 'EU (Paris)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'eu-north-1', label: 'EU (Stockholm)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
  { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka)' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
  { value: 'ca-central-1', label: 'Canada (Central)' },
]

// S3 bucket naming rules validation
function validateBucketName(name: string): string | null {
  if (!name) return 'Bucket name is required'
  if (name.length < 3) return 'Bucket name must be at least 3 characters'
  if (name.length > 63) return 'Bucket name must be 63 characters or less'
  if (!/^[a-z0-9]/.test(name))
    return 'Bucket name must start with a lowercase letter or number'
  if (!/[a-z0-9]$/.test(name))
    return 'Bucket name must end with a lowercase letter or number'
  if (!/^[a-z0-9.-]+$/.test(name))
    return 'Bucket name can only contain lowercase letters, numbers, hyphens, and periods'
  if (/\.\./.test(name)) return 'Bucket name cannot contain consecutive periods'
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(name))
    return 'Bucket name cannot be formatted as an IP address'
  if (name.startsWith('xn--'))
    return 'Bucket name cannot start with "xn--" prefix'
  if (name.endsWith('-s3alias'))
    return 'Bucket name cannot end with "-s3alias" suffix'
  return null
}

export function CreateBucketDialog() {
  const [open, setOpen] = React.useState(false)
  const [bucketName, setBucketName] = React.useState('')
  const [region, setRegion] = React.useState('us-east-1')
  const [error, setError] = React.useState<string | null>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const validationError = validateBucketName(bucketName)
      if (validationError) {
        throw new Error(validationError)
      }
      return createBucket({ data: { bucketName, region } })
    },
    onSuccess: () => {
      toast.success(`Bucket "${bucketName}" created successfully`)
      queryClient.invalidateQueries({ queryKey: ['buckets'] })
      setOpen(false)
      setBucketName('')
      setRegion('us-east-1')
      setError(null)
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    mutation.mutate()
  }

  const handleBucketNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setBucketName(value)
    if (error) {
      const validationError = validateBucketName(value)
      setError(validationError)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" />}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Create Bucket</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Bucket</DialogTitle>
            <DialogDescription>
              Create a new S3 bucket. Bucket names must be globally unique.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bucket-name">Bucket Name</Label>
              <Input
                id="bucket-name"
                placeholder="my-unique-bucket-name"
                value={bucketName}
                onChange={handleBucketNameChange}
                disabled={mutation.isPending}
                autoComplete="off"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={region}
                onValueChange={(value) => {
                  if (value) setRegion(value)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AWS_REGIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending || !bucketName}
              className="gap-2"
            >
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Bucket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
