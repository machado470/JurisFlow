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
        h-full
        rounded-2xl
        bg-white/[0.06]
        backdrop-blur-xl
        border border-white/10
        shadow-[0_25px_60px_rgba(0,0,0,0.35)]
        transition-all duration-300
        ${className}
      `}
    >
      {/* Linha superior de destaque */}
      <div className="
        pointer-events-none
        absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-white/30 to-transparent
      " />

      <div className="relative z-10 p-12">
        {children}
      </div>
    </div>
  )
}
