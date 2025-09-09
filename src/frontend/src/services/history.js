// frontend/src/services/history.js
import api from './api'
export const fetchHistory = () => api.get('/generate/history')
