import { NavLink } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useAuthContext } from '../auth/AuthContext'
import clsx from 'clsx'

type Item = {
  label: string
  to: string
}

const items: Item[] = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Trilhas', to: '/admin/tracks' },
  { label: 'Pessoas', to: '/admin/people' },
  { label: 'Auditoria', to: '/admin/audit' },
  { label: 'Configurações', to: '/admin/settings' },
]

export default function AdminSidebar() {
  const { tokens } = useTheme()
  const { user } = useAuthContext()

  return (
    <aside
      className="flex h-full w-64 flex-col border-r"
      style={{
        backgroundColor: tokens.sidebarBg,
        borderColor: tokens.border + '88',
        color: tokens.text,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-6 border-b"
        style={{
          borderColor: tokens.border + '88',
        }}
      >
        <div className="text-lg font-semibold tracking-tight">
          JurisFlow
        </div>

        {user && (
          <div
            className="mt-1 text-sm"
            style={{ color: tokens.textMuted }}
          >
            {user.name}
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              clsx(
                'block rounded-lg px-3 py-2 text-sm transition-all',
                isActive
                  ? 'font-medium'
                  : 'opacity-80 hover:opacity-100'
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive
                ? tokens.accent + '22'
                : 'transparent',
              color: isActive
                ? tokens.accent
                : tokens.text,
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="border-t px-5 py-4 text-xs"
        style={{
          borderColor: tokens.border + '88',
          color: tokens.textMuted,
        }}
      >
        JurisFlow • v1
      </div>
    </aside>
  )
}
