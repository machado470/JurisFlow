import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireOnboarding() {
  const { user, systemState, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando…
      </div>
    )
  }

  // auth já resolve ausência de usuário
  if (!user) {
    return <Navigate to="/login" replace />
  }

  /**
   * 🔒 Regra CRÍTICA:
   * Só força onboarding se o backend afirmar explicitamente
   */
  if (systemState?.requiresOnboarding === true) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
