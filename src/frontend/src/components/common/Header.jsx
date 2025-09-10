// frontend/src/components/common/Header.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import ProjectInfo from './ProjectInfo'

function Header() {
  const { logout } = useAuth()
  const user = useAuthStore(state => state.user)
  const [showInfo, setShowInfo] = useState(false)
  
  const clearStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  return (
    <>
      <header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Diagram Builder
          </Link>
          <button 
            onClick={() => setShowInfo(true)}
            style={{ marginLeft: '15px', background: '#17a2b8', fontSize: '12px' }}
            title="Информация о проекте"
          >
            Info
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user && <span style={{ marginRight: '15px' }}>Welcome, {user.username}</span>}
          <button onClick={logout} style={{ marginRight: '10px' }}>Logout</button>
          <button 
            onClick={clearStorage} 
            style={{ background: '#dc3545', fontSize: '12px' }}
            title="Clear all local data"
          >
            Clear Storage
          </button>
        </div>
      </header>
      <ProjectInfo isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  )
}

export default Header
