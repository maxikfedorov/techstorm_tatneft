// frontend/src/hooks/useHistory.js
import { useEffect, useState } from 'react'
import { fetchHistory } from '../services/history'
export const useHistory = () => {
  const [history, setHistory] = useState([])
  useEffect(() => {
    fetchHistory().then(r => setHistory(r.data.history))
  }, [])
  return history
}
