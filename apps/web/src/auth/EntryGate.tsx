import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PUBLIC_ROUTES = ['/', '/login']

export default function EntryGate() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm opacity-60">
        Validando sessão…
      </div>
    )
  }

  // 🌐 Rotas públicas
  if (PUBLIC_ROUTES.includes(location.pathname)) {
    return null
  }

  // 🔓 Sem sessão → login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 👑 ADMIN
  if (user.role === 'ADMIN') {
    if (!location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace />
    }
    return null
  }

  // 👤 COLABORADOR
  if (!location.pathname.startsWith('/collaborator')) {
    return <Navigate to="/collaborator" replace />
  }

  return null
}
