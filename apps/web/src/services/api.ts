import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

// 🔐 Interceptor de request
api.interceptors.request.use(
  (config) => {
    /**
     * ❗️IMPORTANTE
     * Não enviar token em rotas públicas
     */
    const publicRoutes = ['/auth/login']

    if (
      config.url &&
      publicRoutes.some(route => config.url?.includes(route))
    ) {
      return config
    }

    const token = localStorage.getItem('token')

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 🚨 Interceptor de response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token inválido ou expirado')
      // aqui futuramente: redirect para /login
    }

    return Promise.reject(error)
  }
)

export default api
