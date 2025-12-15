import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow h-full p-4 space-y-4">
      <h2 className="text-xl font-bold">
        JurisFlow
      </h2>

      <nav className="flex flex-col gap-2 text-sm">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/admin" className="hover:underline">
          Admin
        </Link>
      </nav>
    </aside>
  )
}
