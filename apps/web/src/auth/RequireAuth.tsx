import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth({
  children,
  role,
}: {
  children: JSX.Element
  role?: 'ADMIN' | 'COLLABORATOR'
}) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  return children
}
