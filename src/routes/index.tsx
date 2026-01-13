import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/routes/-login.server'

import { LandingPage } from '@/components/landing-page'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session.isAuthenticated) {
      throw redirect({ to: '/browser' })
    }
  },
  component: LandingPage,
})
