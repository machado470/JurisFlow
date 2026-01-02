import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `
      flex items-center gap-3 px-4 py-2 rounded-lg text-sm
      transition-colors
      ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }
    `

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 p-4">
        <div className="text-lg font-semibold mb-8">
          AutoEscola<span className="text-indigo-400">Sim</span>
        </div>

        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/people" className={linkClass}>
            Pessoas
          </NavLink>

          <NavLink to="/admin/tracks" className={linkClass}>
            Trilhas
          </NavLink>

          <NavLink to="/admin/reports" className={linkClass}>
            Relatórios
          </NavLink>

          <NavLink to="/admin/audit" className={linkClass}>
            Auditoria
          </NavLink>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Painel Administrativo
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Sair
          </button>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
