import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'atom'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.rol !== requiredRole && requiredRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRole === 'admin' && user.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
