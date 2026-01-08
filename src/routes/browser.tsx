import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/routes/-login.server'
import { BrowserLayout } from '@/components/browser-layout'

export const Route = createFileRoute('/browser')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: BrowserLayout,
})
