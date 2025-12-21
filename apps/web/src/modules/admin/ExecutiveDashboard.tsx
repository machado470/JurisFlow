import { useEffect, useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import UserAvatar from '../../components/UserAvatar'
import StatusBadge from '../../components/base/StatusBadge'
import { Link } from 'react-router-dom'
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

export default function ExecutiveDashboard() {
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState<PersonAtRisk[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await getExecutiveReport('default')
        setPeople(res.data.peopleAtRisk ?? [])
      } catch (err) {
        console.error('[ExecutiveDashboard]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão Executiva"
        description="Situação atual de risco e conformidade do escritório."
      />

      <Card>
        <h2 className="font-semibold mb-4">
          Pessoas que exigem atenção
        </h2>

        {loading ? (
          <div className="text-sm opacity-60">
            Carregando dados reais…
          </div>
        ) : people.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma pessoa em risco no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {people.map(person => (
              <div
                key={person.personId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar name={person.name} />

                  <div className="leading-tight">
                    <div className="font-medium">
                      {person.name}
                    </div>
                    {person.email && (
                      <div className="text-sm opacity-70">
                        {person.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge
                    label={person.risk}
                    tone={riskTone(person.risk)}
                  />

                  <Link
                    to={`/admin/people/${person.personId}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
