import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
