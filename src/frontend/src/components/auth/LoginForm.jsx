// frontend/src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

function LoginForm() {
  const { handleLogin } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })

  const onSubmit = e => {
    e.preventDefault()
    handleLogin(form)
  }

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <Button type="submit">Login</Button>
    </form>
  )
}

export default LoginForm
