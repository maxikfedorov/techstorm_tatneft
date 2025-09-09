// frontend/src/services/llm.js
import api from './api'

export const generateDiagram = data => api.post('/generate/', data)
