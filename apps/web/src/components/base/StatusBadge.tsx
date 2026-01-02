type Tone = 'low' | 'warning' | 'critical' | 'success' | 'neutral'

const styles: Record<Tone, string> = {
  low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  neutral: 'bg-white/10 text-slate-300 border-white/20',
}

export default function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: Tone
}) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        border
        px-3 py-1
        text-xs font-medium
        ${styles[tone]}
      `}
    >
      {label}
    </span>
  )
}
