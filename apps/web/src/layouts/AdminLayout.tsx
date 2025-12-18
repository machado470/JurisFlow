import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import { useTheme } from '../theme/ThemeContext'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { tokens } = useTheme()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main
        className="flex-1 overflow-auto p-6"
        style={{ backgroundColor: tokens.surface }}
      >
        {children}
      </main>
    </div>
  )
}

