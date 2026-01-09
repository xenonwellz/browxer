import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form'
import { getSession } from '@/routes/-login.server'
import { ThemeSelector } from '@/components/theme-selector'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session.isAuthenticated) {
      throw redirect({ to: '/browser' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>
      <LoginForm />
    </div>
  )
}
