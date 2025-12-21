import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@autoescola.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // 🔐 LOGIN MOCK CONTROLADO
    login({
      user: {
        id: 'admin-1',
        email,
        role: 'ADMIN',
      },
      token: 'mock-token-admin',
    })

    navigate('/admin')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Lado institucional */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <span className="inline-block mb-6 px-3 py-1 rounded-full bg-white/10 text-sm">
          Plataforma Jurídica
        </span>

        <h1 className="text-5xl font-bold mb-4">
          JurisFlow
        </h1>

        <p className="text-lg opacity-90 mb-6">
          Controle de risco jurídico com dados reais,
          trilhas estruturadas e ações corretivas auditáveis.
        </p>

        <ul className="space-y-2 text-sm opacity-90">
          <li>• Identifique riscos antes que virem problemas</li>
          <li>• Padronize o treinamento da equipe</li>
          <li>• Tome decisões com base em dados</li>
        </ul>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center bg-[#f7f5ef]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold">
            Acessar plataforma
          </h2>

          <input
            type="email"
            className="w-full p-3 rounded border"
            value={email}
            disabled
          />

          <input
            type="password"
            className="w-full p-3 rounded border"
            value={password}
            disabled
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Entrar como administrador
          </button>
        </form>
      </div>
    </div>
  )
}
