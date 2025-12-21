export type ThemeName = 'blue' | 'offwhite'

export const themes: Record<
  ThemeName,
  {
    bg: string
    surface: string
    border: string
    text: string
    muted: string
  }
> = {
  blue: {
    bg: 'bg-gradient-to-br from-[#0c1f2f] via-[#081624] to-[#050c14]',
    surface:
      'bg-[#0f2438]/70 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
    border: 'border-white/10',
    text: 'text-slate-100',
    muted: 'text-slate-400',
  },

  offwhite: {
    bg: 'bg-gradient-to-br from-[#f6f3ec] via-[#efeadd] to-[#e6dfd2]',
    surface:
      'bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
    border: 'border-black/10',
    text: 'text-slate-900',
    muted: 'text-slate-500',
  },
}
