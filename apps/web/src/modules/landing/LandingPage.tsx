import { useNavigate } from 'react-router-dom'
import Card from '../../components/base/Card'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          JurisFlow
        </h1>

        <p className="mt-4 text-slate-400 text-sm">
          Plataforma de conformidade, treinamento e gestão de risco
          para escritórios jurídicos.
        </p>

        <div className="mt-10">
          <button
            onClick={() => navigate('/login')}
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-blue-600
              px-6
              py-3
              text-sm
              font-medium
              text-white
              hover:bg-blue-500
              transition
            "
          >
            Acessar sistema
          </button>
        </div>
      </Card>
    </div>
  )
}
