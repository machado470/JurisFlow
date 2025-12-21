import { Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function CollaboratorLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div>
          <h1 className="text-lg font-semibold">JurisFlow</h1>
          <p className="text-xs text-slate-500">
            Área do colaborador
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="text-xs text-red-500 hover:underline"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
