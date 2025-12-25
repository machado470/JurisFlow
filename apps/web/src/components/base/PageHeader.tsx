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
    <header className="flex items-start justify-between gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </header>
  )
}
