import { createContext, useContext, useState } from 'react'
import { themes, ThemeName } from './themes'

type ThemeContextType = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('dark')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={themes[theme].bg}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme fora do provider')
  return ctx
}
