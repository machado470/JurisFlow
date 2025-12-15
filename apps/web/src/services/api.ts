import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

// 🔐 Interceptor de request → injeta token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 🚨 Interceptor de response → tratamento global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token inválido ou expirado')
      // futuro: redirect para /login
    }

    return Promise.reject(error)
  }
)

export default api
