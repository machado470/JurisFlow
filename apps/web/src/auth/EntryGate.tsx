import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function EntryGate() {
  const { user, token } = useAuth()

  // Não autenticado → landing institucional
  if (!token || !user) {
    return <Navigate to="/landing" replace />
  }

  // Autenticado → decide por role
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/collaborator" replace />
}
