// frontend/src/utils/RequireAuth.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function RequireAuth() {
  const token = useAuthStore(state => state.token)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default RequireAuth
