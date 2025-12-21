import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import StatusBadge from '../../components/base/StatusBadge'
import api from '../../services/api'

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
  if (risk === 'MEDIUM') return 'warning'
  return 'success'
}

export default function People() {
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState<PersonAtRisk[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/reports/executive')
        setPeople(res.data.data.peopleAtRisk ?? [])
      } catch (err) {
        console.error('[People]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pessoas"
        description="Lista de colaboradores com base no risco educacional e progresso nas trilhas."
      />

      <Card>
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
              <button
                key={p.personId}
                onClick={() =>
                  navigate(`/admin/people/${p.personId}`)
                }
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition text-left"
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

                <div className="flex items-center gap-4">
                  <div className="text-xs opacity-60">
                    {p.progress}%
                  </div>
                  <StatusBadge
                    label={p.risk}
                    tone={riskTone(p.risk)}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
