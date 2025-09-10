// frontend/src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/auth'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()

  const handleLogin = async credentials => {
    try {
      const { data } = await login(credentials)
      setAuth({ username: credentials.username }, data.access_token)
      navigate('/dashboard')
      return data
    } catch (error) {
      throw error
    }
  }

  const handleRegister = async values => {
    try {
      await register(values)
      navigate('/login')
      return true
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return { logout, handleLogin, handleRegister }
}
