import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import { useTheme } from '../theme/ThemeProvider'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const { styles } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative">
      {/* Gatilho */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          w-full
          flex items-center gap-3
          px-3 py-2
          rounded-lg
          text-sm
          ${styles.surface}
          ${styles.border}
          border
          hover:bg-white/5
        `}
      >
        <UserAvatar
          name={user?.name ?? user?.role}
          imageUrl={user?.avatarUrl}
        />

        <div className="text-left leading-tight">
          <div className="font-medium">
            {user?.name ?? 'Usuário'}
          </div>
          <div className="text-xs opacity-60">
            {user?.role}
          </div>
        </div>
      </button>

      {/* Dropdown (abre PARA BAIXO) */}
      {open && (
        <div
          className={`
            absolute
            top-full
            mt-2
            left-0
            w-full
            rounded-xl
            ${styles.surface}
            ${styles.border}
            border
            shadow-[0_12px_24px_rgba(0,0,0,0.25)]
            z-50
          `}
        >
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false)
                navigate('/profile')
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-white/5"
            >
              Perfil
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm opacity-60 hover:bg-white/5"
            >
              Preferências
            </button>
          </div>

          <div className="border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
