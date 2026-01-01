import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { themes, type ThemeName } from './themes'

type ThemeContextType = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  toggleTheme: () => void
  styles: (typeof themes)[ThemeName]
}

export const ThemeContext =
  createContext<ThemeContextType | null>(null)

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [theme, setTheme] = useState<ThemeName>('blue')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeName | null
    if (saved && themes[saved]) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev =>
      prev === 'blue' ? 'offwhite' : 'blue',
    )
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        styles: themes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
