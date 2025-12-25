import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api'

export default function ActivateAccount() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Token inválido')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirm) {
      setError('As senhas não coincidem')
      return
    }

    try {
      setLoading(true)
      await api.post('/auth/activate', {
        token,
        password,
      })

      navigate('/login')
    } catch (err) {
      setError('Convite inválido ou expirado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg w-96 space-y-4"
      >
        <h1 className="text-xl font-bold text-white">
          Ativar conta
        </h1>

        {error && (
          <div className="bg-red-900/40 text-red-300 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white"
          required
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Ativando...' : 'Ativar conta'}
        </button>
      </form>
    </div>
  )
}
