import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeName = 'light' | 'dark' | 'blue'

export type ThemeTokens = {
  appBg: string
  sidebarBg: string
  surface: string
  card: string
  border: string

  text: string
  textMuted: string

  accent: string

  success: string
  warning: string
  danger: string
}

const themes: Record<ThemeName, ThemeTokens> = {
  light: {
    appBg: '#f6f1e9',
    sidebarBg: '#f3ede3',
    surface: '#ffffff',
    card: '#fbf9f6',
    border: '#e6dfd3',

    text: '#1f2937',
    textMuted: '#6b7280',

    accent: '#d97706',

    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },

  dark: {
    appBg: '#0b0f14',
    sidebarBg: '#0e141b',
    surface: '#111827',
    card: '#0f172a',
    border: '#1f2937',

    text: '#e5e7eb',
    textMuted: '#9ca3af',

    accent: '#f59e0b',

    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
  },

  blue: {
    appBg: '#08172a',
    sidebarBg: '#0b1f3a',
    surface: '#0f2a44',
    card: '#102f4e',
    border: '#1e3a5f',

    text: '#e5e7eb',
    textMuted: '#94a3b8',

    accent: '#38bdf8',

    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#fb7185',
  },
}

type ThemeContextType = {
  theme: ThemeName
  tokens: ThemeTokens
  setTheme: (t: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const STORAGE_KEY = 'jurisflow:theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('light')

  // carregar tema salvo
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null
    if (stored && themes[stored]) {
      setThemeState(stored)
    }
  }, [])

  function setTheme(t: ThemeName) {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
  }

  const tokens = themes[theme]

  return (
    <ThemeContext.Provider value={{ theme, tokens, setTheme }}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: tokens.appBg,
          color: tokens.text,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return ctx
}
