export type ThemeName = 'dark' | 'blue' | 'offwhite'

export const themes = {
  dark: {
    name: 'dark',
    bg: 'bg-black',
    surface: 'bg-black/40',
    border: 'border-white/20',
    text: 'text-white',
    muted: 'text-white/60',

    danger: 'text-red-600',
    warning: 'text-amber-500',
    success: 'text-green-500',

    chart: {
      primary: '#fbbf24',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },

  blue: {
    name: 'blue',
    bg: 'bg-slate-900',
    surface: 'bg-slate-800/60',
    border: 'border-slate-600',
    text: 'text-white',
    muted: 'text-slate-300',

    danger: 'text-red-500',
    warning: 'text-orange-400',
    success: 'text-emerald-400',

    chart: {
      primary: '#60a5fa',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
    },
  },

  offwhite: {
    name: 'offwhite',
    bg: 'bg-[#f7f4ee]',
    surface: 'bg-white',
    border: 'border-black/10',
    text: 'text-black',
    muted: 'text-black/60',

    danger: 'text-red-700',
    warning: 'text-amber-600',
    success: 'text-green-700',

    chart: {
      primary: '#2563eb',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
    },
  },
}
