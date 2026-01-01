import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * REQUEST
 * Injeta token em todas as requisições
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * RESPONSE
 * Só derruba sessão se o token já existia
 * Evita matar login em estado transitório
 */
api.interceptors.response.use(
  response => response,
  error => {
    const hadToken = !!localStorage.getItem('token')

    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api
