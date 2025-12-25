import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'
import PageHeader from '../../components/base/PageHeader'
import StatusBadge from '../../components/base/StatusBadge'
import { usePersons } from '../../hooks/usePersons'

export default function People() {
  const { data, loading, error } = usePersons()
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pessoas"
        description="Colaboradores e administradores vinculados à organização."
      />

      <Card>
        {loading ? (
          <div className="text-sm opacity-60">
            Carregando pessoas…
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="text-sm opacity-60">
            Nenhuma pessoa cadastrada.
          </div>
        ) : (
          <div className="space-y-2">
            {data.map(p => (
              <button
                key={p.id}
                onClick={() =>
                  navigate(`/admin/people/${p.id}`)
                }
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition text-left"
              >
                <div>
                  <div className="font-medium">
                    {p.name}
                  </div>
                  <div className="text-xs opacity-70">
                    {p.email}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge
                    label={p.role}
                    tone={
                      p.role === 'ADMIN'
                        ? 'critical'
                        : 'success'
                    }
                  />

                  {!p.active && (
                    <StatusBadge
                      label="Inativo"
                      tone="warning"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
