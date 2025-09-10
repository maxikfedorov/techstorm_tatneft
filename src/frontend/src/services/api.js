// frontend/src/services/api.js
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  console.error('Request Error:', error)
  return Promise.reject(error)
})

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url, response.data)
    return response
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    })
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authorization failed, clearing auth state')
      const { clearAuth } = useAuthStore.getState()
      clearAuth()
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
