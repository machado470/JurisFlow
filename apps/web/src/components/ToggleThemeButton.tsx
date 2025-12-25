import { useTheme } from '../theme/useTheme'

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded text-sm opacity-70 hover:opacity-100"
    >
      {theme === 'blue' ? '☀️ Claro' : '🌙 Escuro'}
    </button>
  )
}
