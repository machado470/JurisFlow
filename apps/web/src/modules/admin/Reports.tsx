import { useEffect, useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import {
  getExecutiveReport,
  type PersonAtRisk,
} from '../../services/reports'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

function riskTone(risk: RiskLevel) {
  if (risk === 'CRITICAL') return 'critical'
  if (risk === 'HIGH') return 'warning'
  if (risk === 'MEDIUM') return 'warning'
  return 'success'
}

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState<PersonAtRisk[]>([])

  useEffect(() => {
    async function load() {
      try {
        const report = await getExecutiveReport()
        setPeople(report.peopleAtRisk ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-12">
      <PageHeader
        title="Relatórios Executivos"
        description="Visão consolidada de risco humano e conformidade."
      />

      <Card>
        <h3 className="font-medium mb-6">
          Pessoas que exigem atenção
        </h3>

        {loading ? (
          <div className="text-sm text-slate-400">
            Carregando dados…
          </div>
        ) : people.length === 0 ? (
          <div className="text-sm text-slate-400">
            Nenhuma pessoa em risco no momento.
          </div>
        ) : (
          <div className="space-y-2">
            {people.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white/5 transition"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                </div>

                <StatusBadge
                  label={p.risk}
                  tone={riskTone(p.risk)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
