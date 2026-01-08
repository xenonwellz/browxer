import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { loginUser } from '@/routes/-login.server'

const REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
]

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
      endpoint: '',
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await loginUser({ data })
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login to S3 Browser</CardTitle>
        <CardDescription>
          Enter your AWS credentials to access your S3 buckets.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessKeyId">AWS Access Key ID</Label>
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
            <Label htmlFor="secretAccessKey">AWS Secret Access Key</Label>
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label} ({region.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endpoint">Custom Endpoint (Optional)</Label>
            <Input
              id="endpoint"
              placeholder="https://s3.example.com"
              {...register('endpoint')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
