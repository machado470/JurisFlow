import { useEffect, useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import { getExecutiveReport } from '../../services/reports'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type PersonAtRisk = {
  personId: string
  name: string
  email?: string
  risk: RiskLevel
  progress: number
}

function riskTone(risk: RiskLevel) {
  if (risk === 'CRITICAL') return 'critical'
  if (risk === 'HIGH') return 'warning'
  return 'success'
}

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState<PersonAtRisk[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await getExecutiveReport('default')
        setPeople(res.data.peopleAtRisk ?? [])
      } catch (err) {
        console.error('[Reports]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios Executivos"
        description="Visão consolidada de risco humano e conformidade."
      />

      <Card>
        <h3 className="font-medium mb-4">
          Pessoas que exigem atenção
        </h3>

        {loading ? (
          <div className="text-sm opacity-60">
            Carregando dados…
          </div>
        ) : people.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma pessoa em risco no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {people.map(p => (
              <div
                key={p.personId}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {p.name}
                  </div>
                  {p.email && (
                    <div className="text-xs opacity-70">
                      {p.email}
                    </div>
                  )}
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
