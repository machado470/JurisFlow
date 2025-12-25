import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/useTheme'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { styles } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          flex items-center gap-2 rounded-md px-3 py-2
          text-sm font-medium
          hover:bg-black/5 dark:hover:bg-white/10
          ${styles.text}
        `}
      >
        <span>{user?.name ?? 'Usuário'}</span>
        <span className="text-xs opacity-60">
          {user?.role}
        </span>
      </button>

      {open && (
        <div
          className={`
            absolute right-0 mt-2 w-40 rounded-lg border p-2
            ${styles.surface}
            ${styles.border}
            shadow-lg
          `}
        >
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-red-500/10 text-red-500"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
