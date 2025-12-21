import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'

export default function Sidebar() {
  const { styles } = useTheme()

  return (
    <aside
      className={`w-64 p-4 border-r ${styles.surface} ${styles.border} ${styles.text}`}
    >
      <h2 className="text-xl font-bold mb-6">
        JurisFlow
      </h2>

      <nav className="flex flex-col gap-3 text-sm">
        <Link to="/admin" className="hover:underline">
          Dashboard
        </Link>

        <Link to="/admin/report" className="hover:underline">
          Relatório Executivo
        </Link>
      </nav>
    </aside>
  )
}
