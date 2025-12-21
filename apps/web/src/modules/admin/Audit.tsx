import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import EventTimeline from '../../components/base/EventTimeline'
import type { Event } from '../../models/Event'

const mockEvents: Event[] = [
  {
    id: 'e1',
    date: new Date().toISOString(),
    type: 'RISK_DETECTED',
    severity: 'CRITICAL',
    description:
      'Risco crítico detectado para João Silva (LGPD abaixo de 60%).',
  },
  {
    id: 'e2',
    date: new Date(
      Date.now() - 1000 * 60 * 60 * 2
    ).toISOString(),
    type: 'CORRECTIVE_ACTION',
    severity: 'WARNING',
    description:
      'Ação corretiva atribuída para reforço de treinamento LGPD.',
  },
  {
    id: 'e3',
    date: new Date(
      Date.now() - 1000 * 60 * 60 * 24
    ).toISOString(),
    type: 'TRACK_ASSIGNED',
    severity: 'INFO',
    description:
      'Trilha Compliance atribuída para Maria Santos.',
  },
]

export default function Audit() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Auditoria"
        description="Registro de eventos críticos, ações corretivas e mudanças relevantes no sistema."
      />

      <Card>
        <EventTimeline events={mockEvents} />
      </Card>
    </div>
  )
}
