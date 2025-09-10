// frontend/src/services/llm.js
import api from './api'

export const generateDiagram = data => {
  return api.post('/generate/', data, { timeout: 60000 })
}
