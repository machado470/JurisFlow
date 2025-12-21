import { Outlet } from 'react-router-dom'
import { ThemeProvider, useTheme } from '../theme/ThemeProvider'
import AdminSidebar from './AdminSidebar'
import ThemeSwitcher from '../components/ThemeSwitcher'

function AdminShell() {
  const { styles } = useTheme()

  return (
    <div className={`min-h-screen ${styles.bg}`}>
      <AdminSidebar />

      <div className="pl-64 min-h-screen flex flex-col">
        <header className={`${styles.surface} border-b px-8 h-16 flex items-center justify-between`}>
          <span className="font-semibold">JurisFlow</span>
          <ThemeSwitcher />
        </header>

        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <ThemeProvider>
      <AdminShell />
    </ThemeProvider>
  )
}
