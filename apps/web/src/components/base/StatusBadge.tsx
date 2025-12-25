import { useTheme } from '../../theme/useTheme'

type Tone = 'success' | 'warning' | 'critical'

type Props = {
  label: string
  tone: Tone
}

export default function StatusBadge({ label, tone }: Props) {
  const { styles } = useTheme()

  function toneStyle() {
    switch (tone) {
      case 'critical':
        return `
          bg-red-500/15
          text-red-400
          border-red-500/30
        `
      case 'warning':
        return `
          bg-yellow-500/15
          text-yellow-400
          border-yellow-500/30
        `
      default:
        return `
          bg-emerald-500/15
          text-emerald-400
          border-emerald-500/30
        `
    }
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-[11px]
        font-semibold
        uppercase
        tracking-wide
        ${toneStyle()}
      `}
    >
      {label}
    </span>
  )
}
