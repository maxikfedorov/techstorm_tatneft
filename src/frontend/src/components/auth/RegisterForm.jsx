// frontend/src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../common/NotificationProvider'
import Button from '../common/Button'

function RegisterForm() {
  const { handleRegister } = useAuth()
  const notify = useNotification()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    console.log('Register attempt:', form)
    
    if (!form.username || !form.email || !form.password) {
      notify('Fill all fields', 'error')
      return
    }
    if (form.password.length < 6) {
      notify('Password must be at least 6 characters', 'error')
      return
    }
    
    setLoading(true)
    try {
      console.log('Calling handleRegister...')
      await handleRegister(form)
      notify('Registration successful! Please login.', 'success')
    } catch (err) {
      console.error('Registration error:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Registration failed'
      
      if (errorMsg.includes('already exists') || errorMsg.includes('username')) {
        notify('Username already exists', 'error')
      } else if (errorMsg.includes('email')) {
        notify('Email already registered', 'error')
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        notify('Cannot connect to server. Check if backend is running.', 'error')
      } else {
        notify(errorMsg, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input 
            placeholder="Username" 
            value={form.username} 
            onChange={e => setForm({ ...form, username: e.target.value })} 
            required
          />
        </div>
        <div>
          <input 
            type="email"
            placeholder="Email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            required
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>
      </form>
      <p>Already have account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default RegisterForm
