import { createContext, useEffect, useState } from 'react'
import { themes } from './themes'
import type { ThemeName } from './themes'

type ThemeContextType = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  styles: (typeof themes)['blue']
}

export const ThemeContext =
  createContext<ThemeContextType | null>(null)

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<ThemeName>('blue')

  useEffect(() => {
    document.documentElement.classList.remove(
      'blue',
      'offwhite'
    )
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        styles: themes[theme],
      }}
    >
      <div className={`${themes[theme].bg} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
