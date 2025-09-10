// frontend/src/hooks/useModels.js
import { useEffect, useState } from 'react'
import { fetchModels } from '../services/models'
export const useModels = () => {
  const [models, setModels] = useState([])
  useEffect(() => {
    fetchModels().then(r => setModels(r.data.available_models))
  }, [])
  return models
}
