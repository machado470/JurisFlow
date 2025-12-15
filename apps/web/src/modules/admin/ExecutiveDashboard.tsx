export default function ExecutiveDashboard() {
  const stats = [
    { label: 'Colaboradores monitorados', value: 18 },
    { label: 'Em risco alto', value: 4, danger: true },
    { label: 'Trilhas obrigatórias', value: 7 },
    { label: 'Pendências críticas', value: 3, danger: true },
  ]

  const peopleAtRisk = [
    { name: 'Carlos Almeida', risk: 'Alto', color: 'text-red-500' },
    { name: 'Fernanda Souza', risk: 'Médio', color: 'text-yellow-400' },
    { name: 'João Pereira', risk: 'Alto', color: 'text-red-500' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Visão Executiva</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`p-4 rounded border ${
              s.danger ? 'border-red-500' : 'border-zinc-700'
            }`}
          >
            <div className="text-sm text-zinc-400">{s.label}</div>
            <div
              className={`text-2xl font-bold ${
                s.danger ? 'text-red-500' : ''
              }`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Pessoas em risco */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Pessoas com maior risco operacional
        </h2>

        <div className="space-y-2">
          {peopleAtRisk.map((p) => (
            <div
              key={p.name}
              className="flex justify-between items-center p-3 rounded border border-zinc-800"
            >
              <span>{p.name}</span>
              <span className={`font-bold ${p.color}`}>
                {p.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
