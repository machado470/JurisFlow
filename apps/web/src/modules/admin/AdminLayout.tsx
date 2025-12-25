import { Outlet } from 'react-router-dom'
import { useTheme } from '../../theme/useTheme'

import AdminSidebar from '../../layouts/AdminSidebar'
import Topbar from '../../layouts/Topbar'
import AdminContent from '../../layouts/AdminContent'

export default function AdminLayout() {
  const { styles } = useTheme()

  return (
    <div className={`min-h-screen ${styles.bg}`}>
      <AdminSidebar />

      {/* Área principal */}
      <div className="ml-64 flex min-h-screen flex-col">
        {/* Topbar controla seu próprio espaçamento */}
        <Topbar />

        {/* Conteúdo controla largura e padding */}
        <AdminContent>
          <Outlet />
        </AdminContent>
      </div>
    </div>
  )
}

