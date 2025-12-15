import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { useOrganization } from '../../hooks/useOrganization'

export default function Login() {
  const navigate = useNavigate()
  const { set: setUser } = useUser()
  const { set: setOrg } = useOrganization()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [orgName, setOrgName] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!name || !email || !orgName) {
      alert('Preencha todos os campos')
      return
    }

    const orgId = crypto.randomUUID()

    setOrg({
      id: orgId,
      name: orgName,
      slug: orgName.toLowerCase().replace(/\s+/g, '-'),
    })

    setUser({
      id: crypto.randomUUID(),
      name,
      email,
      role: email.includes('admin') ? 'ADMIN' : 'STUDENT',
      department: 'Jurídico',
    })

    navigate('/dashboard')
  }

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: 400,
        margin: '80px auto',
        padding: 24,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      }}
    >
      <h1 style={{ marginBottom: 16 }}>JurisFlow</h1>

      <input
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <input
        placeholder="Empresa / Escritório"
        value={orgName}
        onChange={e => setOrgName(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '8px 12px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
        }}
      >
        Entrar
      </button>
    </form>
  )
}
