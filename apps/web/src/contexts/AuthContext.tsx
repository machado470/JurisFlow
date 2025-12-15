import { createContext, useContext } from 'react'

type UserRole = 'ADMIN' | 'STUDENT' | null

type AuthContextType = {
  token: string | null
  role: UserRole
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')

  let role: UserRole = null

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      role = payload.role ?? null
    } catch {
      role = null
    }
  }

  return (
    <AuthContext.Provider value={{ token, role }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
