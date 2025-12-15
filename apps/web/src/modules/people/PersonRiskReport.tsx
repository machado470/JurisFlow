import { useAssignments } from './hooks/useAssignments'
import { useTracks } from '../tracks/useTracks'
import { useProgress } from '../progress/useProgress'
import { usePersonRisk } from './hooks/usePersonRisk'

export default function PersonRiskReport({ personId }: { personId: string }) {
  const { listByPerson } = useAssignments()
  const { get: getProgress } = useProgress()
  const { getById } = useTracks()
  const { riskLevel } = usePersonRisk()

  const assignments = listByPerson(personId)

  return (
    <div className="p-4 space-y-3 border">
      <h2 className="font-bold">
        Risco: {riskLevel(personId)}
      </h2>

      {assignments.map(a => {
        const track = getById(a.trackId)
        const progress = getProgress(a.trackId)

        return (
          <div key={a.id} className="border-b pb-2">
            <div className="font-semibold">{track?.title}</div>
            <div>Obrigatória: {a.mandatory ? 'Sim' : 'Não'}</div>
            <div>Progresso: {progress}%</div>
            {a.mandatory && progress < 100 && (
              <div className="text-red-600">
                Incompleta
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
