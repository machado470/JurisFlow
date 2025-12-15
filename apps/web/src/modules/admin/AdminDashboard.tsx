import { Outlet, Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4 space-y-4">
        <div className="text-xl font-bold">
          JurisFlow
        </div>

        <nav className="space-y-2">
          <Link to="/admin/executive" className="block">
            Dashboard
          </Link>
          <Link to="/admin/risk" className="block">
            Relatório Executivo
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
