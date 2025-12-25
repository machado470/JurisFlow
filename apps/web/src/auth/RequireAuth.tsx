import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireAuth({
  children,
  role,
}: {
  children: JSX.Element
  role?: 'ADMIN' | 'COLLABORATOR'
}) {
  const { token, user } = useAuth()
  const location = useLocation()

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  return children
}
