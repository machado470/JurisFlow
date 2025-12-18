export type ThemeName = 'light' | 'dark' | 'blue'

export type ThemeTokens = {
  bg: string
  bgSecondary: string
  card: string
  border: string
  text: string
  textMuted: string
  accent: string
  success: string
  warning: string
  danger: string
}

export const themeTokens: Record<ThemeName, ThemeTokens> = {
  light: {
    bg: '#f7f6f2',
    bgSecondary: '#ffffff',
    card: '#ffffff',
    border: '#e5e4df',
    text: '#1c1c1c',
    textMuted: '#6b6b6b',
    accent: '#2563eb',
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#dc2626',
  },

  dark: {
    bg: '#0b0b0c',
    bgSecondary: '#111113',
    card: '#141416',
    border: '#27272a',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    accent: '#3b82f6',
    success: '#22c55e',
    warning: '#fbbf24',
    danger: '#ef4444',
  },

  blue: {
    bg: '#071a33',
    bgSecondary: '#0b2447',
    card: '#0f2a4f',
    border: '#1e3a5f',
    text: '#f8fafc',
    textMuted: '#cbd5e1',
    accent: '#38bdf8',
    success: '#22c55e',
    warning: '#facc15',
    danger: '#f87171',
  },
}
