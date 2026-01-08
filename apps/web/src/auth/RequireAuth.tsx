import { Navigate, Outlet } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from './AuthContext'

export default function RequireAuth({
  role,
  children,
}: {
  role?: 'ADMIN' | 'COLLABORATOR'
  children?: ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  // 🔑 SUPORTE DUPLO:
  // - com children → renderiza children
  // - sem children → usa Outlet (rotas aninhadas)
  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
