import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import api from '../services/api'

type User = {
  id: string
  role: 'ADMIN' | 'COLLABORATOR'
  personId?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', {
      email,
      password,
    })

    const { token, user } = res.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    setToken(token)
    setUser(user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
