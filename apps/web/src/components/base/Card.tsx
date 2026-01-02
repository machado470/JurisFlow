import { ReactNode } from 'react'

export default function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`
        relative
        rounded-2xl
        bg-white/[0.06]
        backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        p-6
        transition
        hover:bg-white/[0.08]
        ${className}
      `}
    >
      {children}
    </div>
  )
}
