import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import Icon from '../components/icons/Icon'
import { useTheme } from '../theme/ThemeProvider'

type Props = {
  to: string
  label: string
  icon: LucideIcon
}

export default function SidebarItem({ to, label, icon }: Props) {
  const { styles } = useTheme()

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        px-3 py-2
        rounded-lg
        text-sm
        transition-colors
        ${
          isActive
            ? `${styles.surface} font-medium`
            : 'opacity-70 hover:opacity-100 hover:bg-white/5'
        }
      `
      }
    >
      <Icon icon={icon} />
      <span>{label}</span>
    </NavLink>
  )
}
