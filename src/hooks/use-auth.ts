import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { logoutUser } from '@/routes/-login.server'

export function useAuth() {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await logoutUser()
      toast.success('Logged out successfully')
      navigate({ to: '/login' })
    } catch {
      toast.error('Failed to logout')
    }
  }

  return { logout }
}
