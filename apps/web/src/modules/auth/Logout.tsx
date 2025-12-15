import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

export default function Logout() {
  const { clear } = useUser()
  const navigate = useNavigate()

  function exit() {
    clear()
    navigate('/login')
  }

  return (
    <button
      onClick={exit}
      style={{
        marginLeft: 'auto',
        padding: '6px 12px',
        background: '#dc2626',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Sair
    </button>
  )
}
