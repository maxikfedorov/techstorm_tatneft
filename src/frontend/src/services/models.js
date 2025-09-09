// frontend/src/services/models.js
import api from './api'
export const fetchModels = () => api.get('/generate/models')
