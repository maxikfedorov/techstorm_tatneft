// frontend/src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

function RegisterForm() {
  const { handleRegister } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const onSubmit = e => {
    e.preventDefault()
    handleRegister(form)
  }

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <Button type="submit">Register</Button>
    </form>
  )
}

export default RegisterForm
