import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import PageHeader from '../components/base/PageHeader'
import Card from '../components/base/Card'

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '')

  function handleSave() {
    updateUser({ name, avatarUrl })
    alert('Perfil atualizado')
  }

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader
        title="Meu perfil"
        description="Gerencie seus dados pessoais e aparência."
      />

      <Card className="space-y-4">
        <div>
          <label className="text-sm opacity-70">
            Nome
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm opacity-70">
            Avatar (URL da imagem)
          </label>
          <input
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Salvar alterações
        </button>
      </Card>
    </div>
  )
}
