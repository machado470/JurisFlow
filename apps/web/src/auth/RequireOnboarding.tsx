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

  // sem user → auth cuida
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // precisa onboarding → força rota
  if (systemState?.requiresOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
