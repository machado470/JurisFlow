import { useTheme } from '../theme/ThemeProvider'
import {
  LayoutDashboard,
  Users,
  Layers,
  FileText,
} from 'lucide-react'
import SidebarItem from './SidebarItem'
import UserMenu from '../components/UserMenu'

export default function AdminSidebar() {
  const { styles } = useTheme()

  return (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        w-64
        ${styles.surfaceStrong}
        ${styles.border}
        border-r
        px-4
        py-6
        flex
        flex-col
        gap-8
        z-40
      `}
    >
      {/* Marca */}
      <div className="px-2">
        <div className="text-lg font-semibold tracking-tight">
          JurisFlow
        </div>
        <div className="text-xs opacity-50">
          Gestão de risco jurídico
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-1">
        <SidebarItem to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <SidebarItem to="/admin/people" label="Pessoas" icon={Users} />
        <SidebarItem to="/admin/tracks" label="Trilhas" icon={Layers} />
        <SidebarItem to="/admin/reports" label="Relatórios" icon={FileText} />
      </nav>

      {/* Usuário (integrado, não rodapé morto) */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <UserMenu />
      </div>
    </aside>
  )
}
