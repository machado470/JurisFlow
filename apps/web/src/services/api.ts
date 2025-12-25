import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * REQUEST
 * Injeta token em todas as requisições
 */
api.interceptors.request.use(config => {
  const raw = localStorage.getItem('auth')

  if (raw) {
    const { token } = JSON.parse(raw)
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

/**
 * RESPONSE
 * Se token expirar → derruba sessão global
 */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth')

      // força o fluxo normal do EntryGate
      window.location.href = '/'
    }

    return Promise.reject(error)
  },
)

export default api
