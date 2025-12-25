import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import PageHeader from '../../components/base/PageHeader'
import Card from '../../components/base/Card'
import StatusBadge from '../../components/base/StatusBadge'
import AssignmentList from '../../components/base/AssignmentList'
import CorrectiveActionList from '../../components/base/CorrectiveActionList'
import {
  listCorrectiveActions,
  resolveCorrectiveAction,
} from '../../services/correctiveActions'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type Assignment = {
  id: string
  progress: number
  track: {
    id: string
    title: string
  }
}

type CorrectiveAction = {
  id: string
  reason: string
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE'
}

type Person = {
  id: string
  name: string
  active: boolean
  role: string
  riskLevel: RiskLevel
  assignments: Assignment[]
}

function riskTone(risk: RiskLevel) {
  if (risk === 'CRITICAL') return 'critical'
  if (risk === 'HIGH') return 'warning'
  if (risk === 'MEDIUM') return 'warning'
  return 'success'
}

export default function PersonDetail() {
  const { id } = useParams()
  const [person, setPerson] = useState<Person | null>(null)
  const [actions, setActions] = useState<CorrectiveAction[]>([])
  const [loading, setLoading] = useState(true)
  const [reason, setReason] = useState('')
  const [toggling, setToggling] = useState(false)

  async function load() {
    if (!id) return
    setLoading(true)

    const [personRes, actionsRes] = await Promise.all([
      api.get(`/persons/${id}`),
      listCorrectiveActions(id),
    ])

    setPerson(personRes.data)
    setActions(actionsRes)
    setLoading(false)
  }

  async function toggleActive() {
    if (!id) return
    setToggling(true)
    await api.patch(`/persons/${id}/toggle`)
    setToggling(false)
    load()
  }

  async function createAction() {
    if (!reason.trim() || !id || !person?.active) return

    await api.post('/corrective-actions', {
      personId: id,
      reason,
    })

    setReason('')
    load()
  }

  async function resolveAction(actionId: string) {
    if (!person?.active) return
    await resolveCorrectiveAction(actionId)
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading || !person) {
    return (
      <div className="text-slate-400">
        Carregando pessoa…
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title={person.name}
        description={
          person.active
            ? 'Pessoa ativa no sistema'
            : 'Pessoa inativa — atividades suspensas'
        }
        right={
          <div className="flex items-center gap-3">
            <StatusBadge
              label={person.riskLevel}
              tone={riskTone(person.riskLevel)}
            />

            <button
              disabled={toggling}
              onClick={toggleActive}
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                transition
                bg-white/10
                hover:bg-white/20
                disabled:opacity-50
              "
            >
              {toggling
                ? 'Processando…'
                : person.active
                ? 'Desativar'
                : 'Reativar'}
            </button>
          </div>
        }
      />

      {!person.active && (
        <Card>
          <div className="text-sm text-slate-400">
            Pessoa inativa. Avaliações, ações corretivas e
            pendências estão suspensas.
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Trilhas
        </h2>

        {person.active ? (
          <AssignmentList
            assignments={person.assignments}
            personId={person.id}
            onSubmitted={load}
          />
        ) : (
          <div className="text-sm text-slate-400">
            Trilhas desativadas enquanto a pessoa estiver
            inativa.
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Ações corretivas
        </h2>

        {person.active && (
          <div className="flex gap-2 mb-4">
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Descreva a ação corretiva…"
              className="
                flex-1
                rounded-lg
                bg-white/5
                px-3
                py-2
                text-sm
                outline-none
                ring-1
                ring-white/10
                focus:ring-blue-500/40
              "
            />
            <button
              onClick={createAction}
              className="
                rounded-lg
                bg-blue-600
                px-4
                text-sm
                font-medium
                hover:bg-blue-500
                transition
              "
            >
              Criar
            </button>
          </div>
        )}

        <CorrectiveActionList
          actions={actions}
          onResolve={
            person.active ? resolveAction : undefined
          }
        />
      </Card>
    </div>
  )
}
