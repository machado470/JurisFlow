import { ReactNode } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { useDensity } from '../../layouts/DensityContext'
import clsx from 'clsx'

type CardProps = {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export default function Card({
  title,
  actions,
  children,
  className,
}: CardProps) {
  const { tokens } = useTheme()
  const { density } = useDensity()

  const paddingByDensity = {
    compact: 'p-3',
    comfortable: 'p-5',
    expanded: 'p-7',
  }

  return (
    <section
      className={clsx(
        'rounded-xl border transition-all',
        paddingByDensity[density],
        className
      )}
      style={{
        backgroundColor: tokens.card,
        borderColor: tokens.border + '88',
        color: tokens.text,
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-base font-semibold">
              {title}
            </h2>
          )}

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </header>
      )}

      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}
