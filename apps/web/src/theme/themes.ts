export const themes = {
  dark: {
    bg: 'bg-black text-white min-h-screen',
  },
  light: {
    bg: 'bg-white text-black min-h-screen',
  },
} as const

export type ThemeName = keyof typeof themes
