import { useTheme } from '../theme/useTheme'
import { useAuth } from '../auth/AuthContext'

export default function UserMenu() {
  const { styles } = useTheme()
  const { user } = useAuth()

  return (
    <div
      className={`
        rounded-md p-3 text-sm
        ${styles.surface}
        ${styles.border}
      `}
    >
      <div className="font-medium">
        {user?.email ?? 'Usuário'}
      </div>
      <div className="text-xs opacity-60">
        {user?.role ?? '—'}
      </div>
    </div>
  )
}
