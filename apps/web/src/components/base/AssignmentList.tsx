import { useState } from 'react'
import { submitAssessment } from '../../services/assessments'

type Assignment = {
  id: string
  progress: number
  track: {
    id: string
    title: string
  }
  personId: string
}

export default function AssignmentList({
  assignments,
  personId,
  onSubmitted,
}: {
  assignments: Assignment[]
  personId: string
  onSubmitted?: () => void
}) {
  const [open, setOpen] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)

  async function submit(assignment: Assignment) {
    setLoading(true)

    await submitAssessment({
      assignmentId: assignment.id,
      personId,
      trackId: assignment.track.id,
      score,
    })

    setOpen(null)
    setScore(0)
    setLoading(false)
    onSubmitted?.()
  }

  return (
    <div className="space-y-4">
      {assignments.map(a => (
        <div
          key={a.id}
          className="bg-slate-900 rounded p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {a.track.title}
              </div>
              <div className="text-xs text-slate-400">
                Progresso: {a.progress}%
              </div>
            </div>

            <button
              className="text-sm bg-blue-600 px-3 py-1 rounded"
              onClick={() => setOpen(a.id)}
            >
              Avaliar
            </button>
          </div>

          {open === a.id && (
            <div className="pt-3 space-y-2">
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={e =>
                  setScore(Number(e.target.value))
                }
                className="w-full bg-slate-800 rounded px-3 py-2"
                placeholder="Score (0–100)"
              />

              <button
                disabled={loading}
                onClick={() => submit(a)}
                className="w-full bg-green-600 py-2 rounded font-medium"
              >
                {loading
                  ? 'Salvando…'
                  : 'Enviar avaliação'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
