// frontend/src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../common/NotificationProvider'
import Button from '../common/Button'

function LoginForm() {
  const { handleLogin } = useAuth()
  const notify = useNotification()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.password) {
      notify('Fill all fields', 'error')
      return
    }
    
    setLoading(true)
    try {
      await handleLogin(form)
      notify('Login successful', 'success')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Login failed'
      if (err.response?.status === 401) {
        notify('Invalid username or password', 'error')
      } else if (errorMsg.includes('not found') || errorMsg.includes('incorrect')) {
        notify('Account not found or incorrect credentials', 'error')
      } else {
        notify(errorMsg, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input 
          placeholder="Username" 
          value={form.username} 
          onChange={e => setForm({ ...form, username: e.target.value })} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={e => setForm({ ...form, password: e.target.value })} 
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <p>Don't have account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default LoginForm
