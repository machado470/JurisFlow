export type ThemeName = 'blue' | 'offwhite'

export const themes: Record<
  ThemeName,
  {
    bg: string
    surface: string
    border: string
    text: string
    muted: string
    accent: string
    chart: {
      primary: string
      success: string
      warning: string
      danger: string
    }
  }
> = {
  blue: {
    // Fundo principal — azul profundo executivo
    bg: `
      bg-gradient-to-br
      from-[#0B1E33]
      via-[#081A2D]
      to-[#050F1C]
    `,

    // Superfícies
    surface: `
      bg-[#0F2A44]/80
      backdrop-blur-xl
      shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
    `,

    border: 'border-white/10',

    text: 'text-slate-100',
    muted: 'text-slate-400',
    accent: 'text-blue-400',

    chart: {
      primary: '#38BDF8', // azul claro
      success: '#4ADE80', // verde
      warning: '#FACC15', // amarelo
      danger: '#F87171',  // vermelho
    },
  },

  offwhite: {
    bg: `
      bg-gradient-to-br
      from-[#f6f3ec]
      via-[#efeadd]
      to-[#e6dfd2]
    `,

    surface:
      'bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.06)]',

    border: 'border-black/10',

    text: 'text-slate-900',
    muted: 'text-slate-600',
    accent: 'text-blue-600',

    chart: {
      primary: '#2563EB', // azul forte
      success: '#16A34A', // verde escuro
      warning: '#D97706', // âmbar
      danger: '#DC2626',  // vermelho forte
    },
  },
}
