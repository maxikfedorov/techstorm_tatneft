// frontend/src/components/common/NotificationProvider.jsx
import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    console.warn('useNotification must be used within NotificationProvider')
    return (msg, type) => console.log(`[${type}] ${msg}`)
  }
  return context
}

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const notify = (text, type = 'info') => {
    console.log(`Notification: [${type}] ${text}`)
    const id = Date.now()
    setNotifications(prev => [...prev, { id, text, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }

  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        {notifications.map(n => (
          <div 
            key={n.id}
            style={{ 
              background: n.type === 'error' ? '#ff4444' : '#44ff44',
              color: 'white',
              padding: '10px 15px',
              marginBottom: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
              maxWidth: '300px'
            }}
            onClick={() => removeNotification(n.id)}
          >
            {n.text}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
