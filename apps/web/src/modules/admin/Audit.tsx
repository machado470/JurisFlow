import { useEffect, useState } from 'react'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import EventTimeline from '../../components/base/EventTimeline'
import api from '../../services/api'

type Event = {
  id: string
  createdAt: string
  action: string
  context?: string
  person?: {
    name: string
  }
}

export default function Audit() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await api.get('/audit')
      setEvents(res.data.data)
      setLoading(false)
    }

    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Auditoria"
        description="Eventos reais gerados pelo sistema."
      />

      <Card>
        {loading ? (
          <div className="text-sm opacity-60">
            Carregando eventos…
          </div>
        ) : events.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhum evento registrado.
          </div>
        ) : (
          <EventTimeline
            events={events.map(e => ({
              id: e.id,
              date: e.createdAt,
              type: e.action,
              severity: 'INFO',
              description: e.context ?? 'Evento registrado',
              person: e.person?.name,
            }))}
          />
        )}
      </Card>
    </div>
  )
}
