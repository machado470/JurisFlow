import { useTheme } from '../theme/useTheme'
import { ThemeName } from '../theme/themes'

const options: { label: string; value: ThemeName }[] = [
  { label: 'Dark', value: 'dark' },
  { label: 'Blue', value: 'blue' },
  { label: 'Off', value: 'offwhite' },
]

export function ThemeSwitcher() {
  const { theme, setTheme, styles } = useTheme()

  return (
    <div className={`inline-flex border ${styles.border} rounded`}>
      {options.map(opt => {
        const active = theme === opt.value

        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`px-3 py-1 text-sm transition ${
              active
                ? `${styles.surface} font-semibold`
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
