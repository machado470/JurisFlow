import { ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'

type CardVariant = 'kpi' | 'panel' | 'list' | 'neutral' | 'focus'

type Props = {
  children: ReactNode
  className?: string
  variant?: CardVariant
}

export default function Card({
  children,
  className,
  variant = 'neutral',
}: Props) {
  const { styles } = useTheme()

  function variantStyle() {
    switch (variant) {
      case 'focus':
        return `
          ${styles.surface}
          shadow-[0_20px_50px_rgba(0,0,0,0.35)]
          ring-2 ring-red-500/40
          scale-[1.02]
        `

      case 'kpi':
        return `
          ${styles.surface}
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
          ring-1 ring-white/10
        `

      case 'panel':
        return `
          ${styles.surface}
          shadow-[0_6px_20px_rgba(0,0,0,0.2)]
        `

      case 'list':
        return `
          ${styles.surface}
          shadow-[0_2px_10px_rgba(0,0,0,0.15)]
        `

      default:
        return `
          ${styles.surface}
          shadow-[0_4px_16px_rgba(0,0,0,0.18)]
        `
    }
  }

  return (
    <div
      className={`
        rounded-2xl
        border
        p-6
        transition-all
        ${styles.border}
        ${variantStyle()}
        ${className ?? ''}
      `}
    >
      {children}
    </div>
  )
}
