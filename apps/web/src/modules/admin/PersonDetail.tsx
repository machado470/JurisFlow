import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState } from 'react'

import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import ProgressBar from '../../components/base/ProgressBar'
import StatusBadge from '../../components/base/StatusBadge'
import ConfirmDialog from '../../components/base/ConfirmDialog'

import api from '../../services/api'
import { usePersonDetail } from '../../hooks/usePersonDetail'
import { useCorrectiveActions } from '../../hooks/useCorrectiveActions'

export default function PersonDetail() {
  const { personId } = useParams<{ personId: string }>()
  const navigate = useNavigate()

  const { person, assignments, loading, error, reload } =
    usePersonDetail(personId!)

  const {
    actions,
    loading: loadingActions,
  } = useCorrectiveActions(personId)

  const [actionLoading, setActionLoading] =
    useState(false)
  const [confirm, setConfirm] = useState<
    null | {
      type: 'deactivate' | 'activate' | 'offboard'
      title: string
      description: string
    }
  >(null)

  if (loading || loadingActions) {
    return (
      <div className="text-sm opacity-60">
        Carregando pessoa…
      </div>
    )
  }

  if (error || !person) {
    return (
      <div className="text-sm text-red-500">
        Erro ao carregar pessoa.
      </div>
    )
  }

  const openActions = actions.filter(
    a => a.status === 'OPEN',
  ).length

  const awaitingActions = actions.filter(
    a => a.status === 'AWAITING_REASSESSMENT',
  ).length

  const hasCorrectiveRegime =
    openActions > 0 || awaitingActions > 0

  function humanStatus() {
    if (person.offboardedAt) return 'Desligado'
    if (!person.active) return 'Em férias / afastado'
    return 'Ativo'
  }

  function humanTone() {
    if (person.offboardedAt) return 'neutral'
    if (!person.active) return 'warning'
    return 'success'
  }

  async function handleAction(type: 'deactivate' | 'activate' | 'offboard') {
    if (!personId) return
    setActionLoading(true)

    try {
      if (type === 'deactivate') {
        await api.post(`/people/${personId}/deactivate`)
      }

      if (type === 'activate') {
        await api.post(`/people/${personId}/activate`)
      }

      if (type === 'offboard') {
        await api.post(`/people/${personId}/offboard`)
        navigate('/admin/pessoas')
        return
      }

      await reload()
    } finally {
      setActionLoading(false)
      setConfirm(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={person.name}
        description="Estado institucional e operacional da pessoa"
        actions={
          hasCorrectiveRegime && (
            <Link
              to={`/admin/people/${personId}/corrective-actions`}
              className="
                text-sm px-4 py-2 rounded-lg
                bg-rose-500/10 text-rose-400
                hover:bg-rose-500/20 transition
              "
            >
              Ações corretivas ({openActions})
            </Link>
          )
        }
      />

      {/* ESTADO INSTITUCIONAL */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">
              Função institucional
            </div>
            <div className="font-medium">
              {person.role}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasCorrectiveRegime && (
              <StatusBadge
                label={
                  openActions > 0
                    ? 'Regime corretivo ativo'
                    : 'Reavaliação obrigatória'
                }
                tone={
                  openActions > 0 ? 'critical' : 'warning'
                }
              />
            )}

            <StatusBadge
              label={humanStatus()}
              tone={humanTone()}
            />
          </div>
        </div>
      </Card>

      {/* AÇÕES HUMANAS */}
      <Card>
        <div className="flex gap-3">
          {person.active && !person.offboardedAt && (
            <button
              disabled={actionLoading}
              onClick={() =>
                setConfirm({
                  type: 'deactivate',
                  title: 'Colocar em férias',
                  description:
                    'A pessoa ficará temporariamente inativa.',
                })
              }
              className="text-sm px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400"
            >
              Férias / Afastar
            </button>
          )}

          {!person.active && !person.offboardedAt && (
            <button
              disabled={actionLoading}
              onClick={() =>
                setConfirm({
                  type: 'activate',
                  title: 'Reativar pessoa',
                  description:
                    'A pessoa retornará ao estado ativo.',
                })
              }
              className="text-sm px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400"
            >
              Reativar
            </button>
          )}

          {!person.offboardedAt && (
            <button
              disabled={actionLoading}
              onClick={() =>
                setConfirm({
                  type: 'offboard',
                  title: 'Desligar definitivamente',
                  description:
                    'Essa ação é irreversível.',
                })
              }
              className="text-sm px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400"
            >
              Desligar
            </button>
          )}
        </div>
      </Card>

      {/* CONFIRMAÇÃO */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onCancel={() => setConfirm(null)}
          onConfirm={() => handleAction(confirm.type)}
          loading={actionLoading}
        />
      )}

      {/* TRILHAS */}
      <Card>
        <h3 className="text-sm font-semibold mb-4">
          Trilhas atribuídas
        </h3>

        {assignments.length === 0 ? (
          <div className="text-sm text-slate-400">
            Nenhuma trilha atribuída.
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <div
                key={a.id}
                className="
                  p-4 rounded-lg
                  border border-white/10
                  space-y-2
                "
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {a.track.title}
                  </div>

                  <StatusBadge
                    label={`${a.progress}%`}
                    tone={
                      a.progress === 0
                        ? 'neutral'
                        : a.progress < 70
                        ? 'warning'
                        : 'success'
                    }
                  />
                </div>

                <ProgressBar value={a.progress} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
