// frontend/src/utils/RequireAuth.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import api from '../services/api'

function RequireAuth() {
  const { token, clearAuth } = useAuthStore()
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (!token) {
      setIsValidating(false)
      return
    }

    const validateToken = async () => {
      try {
        await api.get('/diagrams/')
        setIsValid(true)
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Token validation failed, clearing auth')
          clearAuth()
          setIsValid(false)
        } else {
          setIsValid(true)
        }
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token, clearAuth])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (isValidating) {
    return <div>Validating session...</div>
  }

  if (!isValid) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RequireAuth
