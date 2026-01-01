import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import LandingPage from '../modules/landing/LandingPage'

export default function EntryGate() {
  const { user, systemState, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname !== '/') return null

  useEffect(() => {
    if (loading || !user || !systemState) return

    if (user.role === 'ADMIN') {
      navigate(
        systemState.requiresOnboarding
          ? '/admin/onboarding'
          : '/admin',
        { replace: true },
      )
    } else {
      navigate('/collaborator', { replace: true })
    }
  }, [user, systemState, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando…
      </div>
    )
  }

  if (!user) return <LandingPage />

  return null
}
