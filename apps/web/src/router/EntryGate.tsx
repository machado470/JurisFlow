import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function EntryGate({
  children,
}: {
  children: ReactNode
}) {
  const { user, systemState, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (systemState?.requiresOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
