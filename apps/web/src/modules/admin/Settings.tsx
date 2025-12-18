import Card from '../../components/ui/Card'
import { useTheme } from '../../theme/ThemeContext'
import type { ThemeName } from '../../theme/ThemeContext'
import clsx from 'clsx'

const themes: { id: ThemeName; label: string }[] = [
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
  { id: 'blue', label: 'Azul' },
]

export default function Settings() {
  const { theme, setTheme, tokens } = useTheme()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Configurações
      </h1>

      <Card title="Tema do sistema">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themes.map(t => {
            const active = theme === t.id

            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={clsx(
                  'rounded-lg border px-4 py-3 text-left transition-all',
                  active
                    ? 'font-medium'
                    : 'opacity-80 hover:opacity-100'
                )}
                style={{
                  backgroundColor: active
                    ? tokens.accent + '22'
                    : tokens.card,
                  borderColor: active
                    ? tokens.accent
                    : tokens.border + '88',
                  color: active
                    ? tokens.accent
                    : tokens.text,
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
