import { ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'

type Props = {
  children: ReactNode
}

export default function Card({ children }: Props) {
  const { styles } = useTheme()

  return (
    <div
      className={`
        rounded-xl
        border
        p-6
        ${styles.surface}
        ${styles.border}
      `}
    >
      {children}
    </div>
  )
}
