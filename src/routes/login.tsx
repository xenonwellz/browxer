import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form'
import { LoginPattern } from '@/components/ui/login-pattern'
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
    <div className="flex min-h-screen w-full bg-background">
      <div className="relative hidden w-0 flex-1 lg:block">
        <LoginPattern />
      </div>
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[600px] shrink-0">
        <div className="absolute top-4 right-4 z-10">
          <ThemeSelector />
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
