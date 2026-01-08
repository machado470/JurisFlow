import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

export default function CollaboratorShell({
  children,
}: {
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <p className="text-sm font-semibold">
            JurisFlow
          </p>
          <p className="text-xs opacity-60">
            Painel do colaborador
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs opacity-60">
            {user?.email}
          </span>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="text-xs px-3 py-1 rounded bg-white/5 hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
