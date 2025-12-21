import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import UserAvatar from '../../components/UserAvatar'
import StatusBadge from '../../components/base/StatusBadge'
import { Link } from 'react-router-dom'
import {
  calculateRiskFromTracks,
  type RiskLevel,
} from '../../services/risk'

type Track = {
  id: string
  name: string
  progress: number
}

type Person = {
  id: string
  name: string
  role: string
  tracks: Track[]
}

const people: Person[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Advogado',
    tracks: [{ id: 't1', name: 'LGPD', progress: 45 }],
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'Assistente Jurídica',
    tracks: [{ id: 't2', name: 'Compliance', progress: 75 }],
  },
  {
    id: '3',
    name: 'Carlos Lima',
    role: 'Sócio',
    tracks: [{ id: 't3', name: 'Governança', progress: 100 }],
  },
]

function riskTone(risk: RiskLevel) {
  if (risk === 'CRÍTICO') return 'critical'
  if (risk === 'ATENÇÃO') return 'warning'
  return 'success'
}

export default function ExecutiveDashboard() {
  const peopleWithRisk = people.map(person => ({
    ...person,
    risk: calculateRiskFromTracks(person.tracks),
  }))

  const peopleNeedingAttention = peopleWithRisk.filter(
    p => p.risk !== 'OK'
  )

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

        {peopleNeedingAttention.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhum colaborador em risco no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {peopleNeedingAttention.map(person => (
              <div
                key={person.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar name={person.name} />

                  <div className="leading-tight">
                    <div className="font-medium">
                      {person.name}
                    </div>
                    <div className="text-sm opacity-70">
                      {person.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge
                    label={person.risk}
                    tone={riskTone(person.risk)}
                  />

                  <Link
                    to={`/admin/people/${person.id}`}
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
