import { Navigate, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { UserRole } from './AuthContext'
import { useAuth } from './AuthContext'

export default function RequireAuth({
  role,
  children,
}: {
  role?: UserRole
  children?: ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
