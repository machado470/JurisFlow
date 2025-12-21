type StatusBadgeProps = {
  label: string
  tone: 'critical' | 'warning' | 'success' | 'info'
}

function toneClasses(tone: StatusBadgeProps['tone']) {
  switch (tone) {
    case 'critical':
      return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'warning':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    case 'success':
      return 'bg-green-500/10 text-green-600 border-green-500/20'
    default:
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }
}

export default function StatusBadge({
  label,
  tone,
}: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-sm
        font-medium
        backdrop-blur
        ${toneClasses(tone)}
      `}
    >
      {label}
    </span>
  )
}
