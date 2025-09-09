// frontend/src/components/common/NotificationProvider.jsx
import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export function useNotification() {
  return useContext(NotificationContext)
}

export default function NotificationProvider({ children }) {
  const [msg, setMsg] = useState(null)
  const notify = (text, type = 'info') => setMsg({ text, type })
  return (
    <NotificationContext.Provider value={notify}>
      {children}
      {msg && (
        <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
          {msg.text}
        </div>
      )}
    </NotificationContext.Provider>
  )
}
