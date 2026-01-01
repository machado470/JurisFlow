import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PUBLIC_ROUTES = ['/', '/login', '/logout']

export default function EntryGate() {
  const { token, user, systemState, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm opacity-60">
        Validando sessão…
      </div>
    )
  }

  // 🌐 Rotas públicas reais (landing, login, logout)
  if (PUBLIC_ROUTES.includes(location.pathname)) {
    return null
  }

  // 🔓 Sem sessão → login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (!systemState) return null

  // 👑 ADMIN
  if (systemState.isAdmin) {
    if (
      systemState.requiresOnboarding &&
      location.pathname !== '/admin/onboarding'
    ) {
      return <Navigate to="/admin/onboarding" replace />
    }

    if (
      !systemState.requiresOnboarding &&
      location.pathname === '/admin/onboarding'
    ) {
      return <Navigate to="/admin" replace />
    }

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
