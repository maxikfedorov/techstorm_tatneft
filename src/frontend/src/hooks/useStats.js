// frontend/src/hooks/useStats.js
import { useEffect, useState } from 'react'
import { fetchStats } from '../services/stats'
export const useStats = () => {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    fetchStats().then(r => setStats(r.data))
  }, [])
  return stats
}
