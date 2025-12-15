import { Link } from 'react-router-dom'
import { useExecutiveDashboard } from '../../hooks/useExecutiveDashboard'

export default function ExecutiveDashboard() {
  const { stats, peopleAtRisk, loading, mode } = useExecutiveDashboard()

  if (loading) {
    return <div className="opacity-70">Carregando…</div>
  }

  const criticalCount = stats.find(s => s.label === 'Risco crítico')?.value ?? 0

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Visão Executiva</h1>
        {mode === 'demo' && (
          <div className="text-sm opacity-60">
            Modo demonstração — dados ilustrativos
          </div>
        )}
      </header>

      {criticalCount > 0 && (
        <div className="border border-red-300 rounded-lg p-4 bg-red-50">
          <div className="font-semibold text-red-700">
            Atenção imediata necessária
          </div>
          <div className="text-sm text-red-700">
            {criticalCount} colaboradores em risco crítico exigem ação corretiva.
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="border rounded-lg p-5">
            <div className="text-sm opacity-70">{s.label}</div>
            <div className={`mt-1 text-3xl font-bold ${s.danger ? 'text-red-600' : ''}`}>
              {s.value}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pessoas em risco</h2>

        {peopleAtRisk.length === 0 && (
          <div className="opacity-70">Nenhuma pessoa em risco no momento.</div>
        )}

        <div className="space-y-2">
          {peopleAtRisk.map(p => (
            <Link
              key={p.personId}
              to={`/admin/people/${p.personId}`}
              className="block"
            >
              <div className="border rounded-lg p-3 flex justify-between items-center hover:bg-zinc-50 transition">
                <span>{p.name}</span>
                <strong className={p.risk === 'CRÍTICO' ? 'text-red-600' : 'text-amber-600'}>
                  {p.risk}
                </strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
