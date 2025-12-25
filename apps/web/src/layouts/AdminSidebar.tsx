import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { getExecutiveReport } from '../services/reports'
import StatusBadge from '../components/base/StatusBadge'

type RiskSummary = {
  CRITICAL: number
  HIGH: number
  MEDIUM: number
}

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/people', label: 'Pessoas' },
  { to: '/admin/tracks', label: 'Trilhas' },
  { to: '/admin/reports', label: 'Relatórios' },
]

export default function AdminSidebar() {
  const { styles } = useTheme()
  const [risk, setRisk] = useState<RiskSummary | null>(null)

  useEffect(() => {
    getExecutiveReport('default')
      .then(res => setRisk(res.data.summary))
      .catch(() => {})
  }, [])

  function badgeFor(label: string) {
    if (!risk) return null

    if (label === 'Relatórios' && risk.CRITICAL > 0) {
      return (
        <StatusBadge
          label={`${risk.CRITICAL}`}
          tone="critical"
        />
      )
    }

    if (
      label === 'Pessoas' &&
      (risk.HIGH > 0 || risk.MEDIUM > 0)
    ) {
      return (
        <StatusBadge
          label={`${risk.HIGH + risk.MEDIUM}`}
          tone="warning"
        />
      )
    }

    return null
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 z-20
        flex h-screen w-64 flex-col
        border-r
        ${styles.surface}
        ${styles.border}
      `}
    >
      {/* LOGO */}
      <div className="px-6 py-6">
        <div className={`text-lg font-semibold ${styles.text}`}>
          JurisFlow
        </div>
        <div className="text-xs opacity-60">
          Gestão de risco jurídico
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {links.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  `
                    flex items-center justify-between
                    rounded-lg px-4 py-2 text-sm
                    transition
                    ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400'
                        : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10'
                    }
                  `
                }
              >
                <span>{link.label}</span>
                {badgeFor(link.label)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* RODAPÉ */}
      <div className="px-6 py-4 text-xs opacity-40">
        © JurisFlow
      </div>
    </aside>
  )
}
