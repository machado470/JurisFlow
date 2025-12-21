import { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  right?: ReactNode
}

export default function PageHeader({
  title,
  description,
  right,
}: Props) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm opacity-60 mt-1">
            {description}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </header>
  )
}
