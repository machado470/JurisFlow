import { ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'

type Props = {
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({
  title,
  description,
  action,
}: Props) {
  const { styles } = useTheme()

  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        px-8
        py-14
        text-center
        ${styles.surface}
        ${styles.border}
      `}
    >
      <div
        className={`
          mb-3
          text-lg
          font-semibold
          ${styles.text}
        `}
      >
        {title}
      </div>

      {description && (
        <div
          className={`
            mb-6
            max-w-md
            text-sm
            opacity-70
          `}
        >
          {description}
        </div>
      )}

      {action && <div>{action}</div>}
    </div>
  )
}
