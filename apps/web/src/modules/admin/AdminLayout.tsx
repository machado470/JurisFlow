import { Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AdminSidebar from '../../layouts/AdminSidebar'
import Topbar from '../../layouts/Topbar'
import AdminContent from '../../layouts/AdminContent'

export default function AdminLayout() {
  const { systemState } = useAuth()
  const onboarding = systemState?.requiresOnboarding

  return (
    <div className="min-h-screen">
      {!onboarding && <AdminSidebar />}

      <div className={onboarding ? '' : 'ml-64'}>
        {!onboarding && <Topbar />}
        <AdminContent>
          <Outlet />
        </AdminContent>
      </div>
    </div>
  )
}
