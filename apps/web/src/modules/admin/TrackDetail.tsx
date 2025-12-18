import { useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import ProgressRow from '../../components/ui/ProgressRow'
import { tracks } from '../../mocks/tracks'

export default function TrackDetail() {
  const { id } = useParams()

  const track = tracks.find(t => t.id === id)

  if (!track) {
    return (
      <div className="text-sm opacity-70">
        Trilha não encontrada
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {track.name}
        </h1>

        <p className="mt-1 text-sm opacity-70">
          {track.description}
        </p>
      </div>

      <Card title="Conformidade Atual">
        <ProgressRow
          label="Nível de Conformidade"
          value={track.conformity}
          status={track.risk}
        />
      </Card>

      <Card title="Ações recomendadas">
        <ul className="list-disc pl-4 text-sm opacity-70 space-y-1">
          <li>Reforçar treinamento obrigatório</li>
          <li>Aplicar nova avaliação técnica</li>
          <li>Revisar materiais de apoio</li>
        </ul>
      </Card>

      <Card title="Histórico">
        <p className="text-sm opacity-60">
          Histórico detalhado será exibido aqui
        </p>
      </Card>
    </div>
  )
}
