import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireAuth({
  role,
}: {
  role?: 'ADMIN' | 'COLLABORATOR'
}) {
  const { user, loading } = useAuth()

  if (loading) return <div>Carregando…</div>

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
