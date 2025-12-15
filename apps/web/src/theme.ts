export type ThemeName = 'institutional' | 'audit' | 'education'

export type Theme = {
  primary: string
  background: string
  text: string
  border: string
}

export const themes: Record<ThemeName, Theme> = {
  institutional: {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827',
    border: '#e5e7eb',
  },

  audit: {
    primary: '#111827',
    background: '#ffffff',
    text: '#111827',
    border: '#d1d5db',
  },

  education: {
    primary: '#16a34a',
    background: '#ffffff',
    text: '#064e3b',
    border: '#d1fae5',
  },
}
