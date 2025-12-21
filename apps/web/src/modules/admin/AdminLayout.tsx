import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/useTheme'

function navItemClass(isActive: boolean) {
  return `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'
  }`
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { setTheme } = useTheme()
  const location = useLocation()

  // 🔁 Tema por contexto (análise x operação)
  useEffect(() => {
    const analysisRoutes = ['/admin', '/admin/reports']

    if (analysisRoutes.includes(location.pathname)) {
      setTheme('offwhite')
    } else {
      setTheme('blue')
    }
  }, [location.pathname, setTheme])

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0b0f14] border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">JurisFlow</h1>
        </div>

        {/* Menu — SOMENTE rotas reais */}
        <nav className="flex-1 px-3 space-y-1 text-sm text-slate-300">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => navItemClass(isActive)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/tracks"
            className={({ isActive }) => navItemClass(isActive)}
          >
            Trilhas
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) => navItemClass(isActive)}
          >
            Relatórios
          </NavLink>
        </nav>

        {/* Usuário */}
        <div className="border-t border-white/10 p-4 text-sm text-slate-300">
          <div className="font-medium text-white">
            {user?.name || 'Usuário'}
          </div>
          <div className="text-xs opacity-70">{user?.email}</div>

          <button
            onClick={logout}
            className="mt-3 text-xs text-red-400 hover:text-red-300"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-10">
        <div className="h-full rounded-2xl bg-white/95 text-slate-900 p-10 shadow-xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
