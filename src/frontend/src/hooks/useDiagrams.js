// frontend/src/hooks/useDiagrams.js
import { useEffect, useState } from 'react'
import { fetchDiagrams } from '../services/diagrams'

export const useDiagrams = () => {
  const [diagrams, setDiagrams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiagrams().then(res => {
      setDiagrams(res.data)
      setLoading(false)
    })
  }, [])

  return { diagrams, loading }
}
