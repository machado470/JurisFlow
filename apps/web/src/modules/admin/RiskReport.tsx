import { useExecutiveDashboard } from '../../hooks/useExecutiveDashboard'
import { exportPrintable } from '../../utils/exportPdf'

export default function RiskReport() {
  const { stats, peopleAtRisk, loading, mode } = useExecutiveDashboard()

  if (loading) {
    return <div className="opacity-70">Gerando relatório…</div>
  }

  return (
    <div className="space-y-8 print-container">
      <header className="flex justify-between items-center no-print">
        <h1 className="text-3xl font-semibold">Relatório Executivo</h1>
        <button
          onClick={() => exportPrintable('Relatório Executivo — JurisFlow')}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Exportar PDF
        </button>
      </header>

      {mode === 'demo' && (
        <div className="text-sm opacity-60">
          Modo demonstração — dados ilustrativos
        </div>
      )}

      {/* Resumo */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="border rounded p-4">
            <div className="text-sm opacity-70">{s.label}</div>
            <div className={`text-2xl font-bold ${s.danger ? 'text-red-600' : ''}`}>
              {s.value}
            </div>
          </div>
        ))}
      </section>

      {/* Pessoas em risco */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Pessoas em risco</h2>
        {peopleAtRisk.length === 0 && (
          <div className="opacity-70">Nenhuma pessoa em risco no momento.</div>
        )}
        <div className="space-y-2">
          {peopleAtRisk.map(p => (
            <div key={p.personId} className="border rounded p-3 flex justify-between">
              <span>{p.name}</span>
              <strong>{p.risk}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* Auditoria (demo) */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Auditoria recente</h2>
        <div className="border rounded p-3">
          Ação corretiva concluída — risco recalculado automaticamente.
        </div>
      </section>
    </div>
  )
}
