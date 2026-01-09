'use client'

import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Code, Globe, Loader2, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  deleteBucketPolicy,
  generatePublicReadPolicy,
  getBucketPolicy,
  setBucketPolicy,
} from '@/routes/browser/-bucket-management.server'

type PolicyMode = 'private' | 'public' | 'custom'

interface BucketPolicyDialogProps {
  bucket: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BucketPolicyDialog({
  bucket,
  open,
  onOpenChange,
}: BucketPolicyDialogProps) {
  const [mode, setMode] = React.useState<PolicyMode>('private')
  const [customPolicy, setCustomPolicy] = React.useState('')
  const [jsonError, setJsonError] = React.useState<string | null>(null)

  const queryClient = useQueryClient()

  const { data: policyData, isLoading: isLoadingPolicy } = useQuery({
    queryKey: ['bucket-policy', bucket],
    queryFn: () => getBucketPolicy({ data: { bucket } }),
    enabled: open,
  })

  // Update state when policy data loads
  React.useEffect(() => {
    if (policyData) {
      if (!policyData.hasPolicy) {
        setMode('private')
        setCustomPolicy('')
      } else {
        const policy = policyData.policy || ''
        setCustomPolicy(policy)
        
        // Check if it matches the public read policy strictly (ignoring whitespace)
        try {
          const normalizedIncoming = policy.replace(/\s/g, '')
          const normalizedPublic = generatePublicReadPolicy(bucket).replace(/\s/g, '')
          
          setMode(normalizedIncoming === normalizedPublic ? 'public' : 'custom')
        } catch {
          setMode('custom')
        }
      }
    }
  }, [policyData, bucket])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (mode === 'private') {
        return deleteBucketPolicy({ data: { bucket } })
      } else if (mode === 'public') {
        const policy = generatePublicReadPolicy(bucket)
        return setBucketPolicy({ data: { bucket, policy } })
      } else {
        // Validate JSON before sending
        try {
          JSON.parse(customPolicy)
        } catch {
          throw new Error('Invalid JSON format')
        }
        return setBucketPolicy({ data: { bucket, policy: customPolicy } })
      }
    },
    onSuccess: () => {
      const messages: Record<PolicyMode, string> = {
        private: 'Bucket policy removed (private)',
        public: 'Public read access enabled',
        custom: 'Custom policy applied',
      }
      toast.success(messages[mode])
      queryClient.invalidateQueries({ queryKey: ['bucket-policy', bucket] })
      onOpenChange(false)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const handleModeChange = (newMode: PolicyMode) => {
    setMode(newMode)
    setJsonError(null)
    if (newMode === 'public') {
      setCustomPolicy(generatePublicReadPolicy(bucket))
    } else if (newMode === 'private') {
      setCustomPolicy('')
    }
  }

  const validateJson = (value: string) => {
    if (!value.trim()) {
      setJsonError(null)
      return
    }
    try {
      JSON.parse(value)
      setJsonError(null)
    } catch {
      setJsonError('Invalid JSON format')
    }
  }

  const handleCustomPolicyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value
    setCustomPolicy(value)
    validateJson(value)
  }

  const modeOptions = [
    {
      value: 'private' as const,
      label: 'Private',
      description: 'No public access',
      icon: Shield,
    },
    {
      value: 'public' as const,
      label: 'Public Read',
      description: 'Anyone can read objects',
      icon: Globe,
    },
    {
      value: 'custom' as const,
      label: 'Custom',
      description: 'Custom JSON policy',
      icon: Code,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bucket Policy</DialogTitle>
          <DialogDescription>
            Manage access policy for <strong>{bucket}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoadingPolicy ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Policy mode selection */}
            <div className="grid gap-2">
              <Label>Access Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {modeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleModeChange(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors hover:bg-foreground/3',
                      mode === option.value &&
                        'border-primary bg-primary/5 ring-1 ring-primary',
                    )}
                  >
                    <option.icon
                      className={cn(
                        'h-5 w-5',
                        mode === option.value
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Policy textarea (Common for Custom and Public) */}
            {(mode === 'custom' || mode === 'public') && (
              <div className="grid gap-2">
                <Label htmlFor="custom-policy">
                  {mode === 'public' ? 'Policy Preview' : 'Policy JSON'}
                </Label>
                <Textarea
                  id="custom-policy"
                  value={mode === 'public' ? generatePublicReadPolicy(bucket) : customPolicy}
                  onChange={handleCustomPolicyChange}
                  readOnly={mode === 'public'}
                  placeholder='{"Version": "2012-10-17", "Statement": [...]}'
                  className={cn(
                    "font-mono min-h-[200px] text-xs!",
                    mode === 'public' && "bg-muted/50 text-muted-foreground"
                  )}
                />
                {jsonError && mode === 'custom' && (
                  <p className="text-sm text-destructive">{jsonError}</p>
                )}
              </div>
            )}

            {mode === 'private' && policyData?.hasPolicy && (
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">
                The existing bucket policy will be removed. Only the bucket
                owner will have access.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={
              saveMutation.isPending ||
              isLoadingPolicy ||
              (mode === 'custom' && !!jsonError)
            }
            className="gap-2"
          >
            {saveMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
