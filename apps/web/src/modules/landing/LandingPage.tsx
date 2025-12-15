import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          JurisFlow
        </h1>

        <p className="text-gray-500">
          Plataforma de treinamento jurídico
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Entrar
        </Link>
      </div>
    </div>
  )
}
