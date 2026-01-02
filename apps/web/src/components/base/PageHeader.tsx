export default function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="mb-10">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-400">
          {description}
        </p>
      )}
    </header>
  )
}
