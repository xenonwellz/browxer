import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {} from // Card components removed

'@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { loginUser } from '@/routes/-login.server'
import { REGIONS } from '@/lib/constants'

export function LoginForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSecret, setShowSecret] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      customRegion: '',
      endpoint: '',
    },
  })

  const selectedRegion = watch('region')
  const isCustomRegion = selectedRegion === 'custom'

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const payload = {
        ...data,
        region: data.region === 'custom' ? data.customRegion : data.region,
      }
      await loginUser({ data: payload })
      toast.success('Login successful')
      navigate({ to: '/browser' })
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to login. Please check your credentials.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="mb-2 text-left">
        <span className="font-logo text-3xl font-bold tracking-tighter select-none">
          BROW<span className="text-primary">S3</span>R
        </span>
      </div>
      <div className="space-y-2 text-left">
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your storage.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="space-y-2">
          <Label htmlFor="accessKeyId">Access Key</Label>
          <Input
            id="accessKeyId"
            placeholder="AKIA..."
            {...register('accessKeyId', {
              required: 'Access Key ID is required',
            })}
          />
          {errors.accessKeyId && (
            <p className="text-sm text-destructive">
              {errors.accessKeyId.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="secretAccessKey">Secret Key</Label>
          <div className="relative">
            <Input
              id="secretAccessKey"
              type={showSecret ? 'text' : 'password'}
              placeholder="Your secret key"
              {...register('secretAccessKey', {
                required: 'Secret Access Key is required',
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.secretAccessKey && (
            <p className="text-sm text-destructive">
              {errors.secretAccessKey.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            onValueChange={(value) => value && setValue('region', value)}
            defaultValue={watch('region')}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isCustomRegion && (
            <div className="mt-2">
              <Input
                placeholder="Enter custom region (e.g. us-gov-west-1)"
                {...register('customRegion', {
                  required: 'Custom region is required',
                })}
              />
              {errors.customRegion && (
                <p className="text-sm text-destructive mt-1">
                  {errors.customRegion.message as string}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endpoint">Custom Endpoint (Optional)</Label>
          <Input
            id="endpoint"
            placeholder="https://s3.example.com"
            {...register('endpoint')}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Connect
        </Button>
      </form>
    </div>
  )
}
