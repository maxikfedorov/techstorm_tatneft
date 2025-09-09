// frontend/src/components/common/Header.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Header() {
  const { logout } = useAuth()
  return (
    <header>
      <Link to="/dashboard">Diagram Builder</Link>
      <button onClick={logout}>Logout</button>
    </header>
  )
}

export default Header
