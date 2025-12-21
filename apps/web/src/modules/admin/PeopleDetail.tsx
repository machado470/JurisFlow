import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import CorrectiveActionList from '../../components/base/CorrectiveActionList'
import type { CorrectiveAction } from '../../models/CorrectiveAction'
import {
  calculateRiskFromTracks,
  type RiskLevel,
} from '../../services/risk'

type Track = {
  id: string
  name: string
  progress: number
}

export default function PeopleDetail() {
  const { id } = useParams()

  const person = {
    id,
    name: 'João Silva',
    role: 'Advogado',
    tracks: [
      { id: 't1', name: 'LGPD', progress: 45 },
      { id: 't2', name: 'Compliance', progress: 80 },
    ],
  }

  const [actions, setActions] = useState<CorrectiveAction[]>([])

  const risk = calculateRiskFromTracks(person.tracks)

  function riskTone(risk: RiskLevel) {
    if (risk === 'CRÍTICO') return 'critical'
    if (risk === 'ATENÇÃO') return 'warning'
    return 'success'
  }

  function createAction() {
    setActions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        personId: person.id!,
        title: 'Reforçar trilha de LGPD',
        description:
          'Treinamento abaixo do nível esperado.',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={person.name}
        description={`Cargo: ${person.role}`}
        right={
          <Link
            to="/admin/people"
            className="text-sm opacity-70 hover:opacity-100"
          >
            ← Voltar
          </Link>
        }
      />

      <Card>
        <h3 className="font-medium mb-2">
          Status de Risco
        </h3>
        <StatusBadge
          label={risk}
          tone={riskTone(risk)}
        />
      </Card>

      <Card>
        <h3 className="font-medium mb-4">
          Ações Corretivas
        </h3>

        <CorrectiveActionList actions={actions} />

        <button
          onClick={createAction}
          className="mt-4 text-sm text-blue-400 hover:underline"
        >
          + Criar ação corretiva
        </button>
      </Card>
    </div>
  )
}
