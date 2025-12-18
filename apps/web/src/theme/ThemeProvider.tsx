import { createContext, useContext, useEffect, useState } from 'react'
import { themes } from './themes'

export type ThemeName = 'dark' | 'light'

type ThemeContextType = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  styles: any
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: any }) {
  const [theme, setTheme] = useState<ThemeName>('dark')

  useEffect(() => {
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        styles: themes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
