// frontend/src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/auth'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()

  const handleLogin = async credentials => {
    const { data } = await login(credentials)
    setAuth({ username: credentials.username }, data.access_token)
    navigate('/dashboard')
  }

  const handleRegister = async values => {
    await register(values)
    await handleLogin({ username: values.username, password: values.password })
  }

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return { logout, handleLogin, handleRegister }
}
