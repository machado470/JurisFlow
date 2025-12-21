import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

type Props = {
  children: JSX.Element
  role?: 'ADMIN' | 'COLLABORATOR'
}

export function RequireAuth({ children, role }: Props) {
  const { user, token, ready } = useAuth()

  // ⏳ Estado visível (nunca mais tela branca)
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando sessão…
      </div>
    )
  }

  // 🔐 Não autenticado
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // 🚫 Role inválida
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  return children
}
