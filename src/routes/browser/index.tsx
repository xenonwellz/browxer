import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/routes/-login.server'
import { listBuckets } from '@/routes/browser/-browser.server'

export const Route = createFileRoute('/browser/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    const buckets = await listBuckets()
    if (buckets.length > 0) {
      throw redirect({
        to: '/browser/$bucket',
        params: { bucket: buckets[0].Name! },
      })
    }
    return { buckets }
  },
  component: BrowserIndexPage,
})

function BrowserIndexPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-muted-foreground">No buckets found</h2>
        <p className="text-muted-foreground">
          Log in with credentials that have access to S3 buckets.
        </p>
      </div>
    </div>
  )
}
