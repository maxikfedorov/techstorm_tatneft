// frontend/src/services/stats.js
import api from './api'
export const fetchStats = () => api.get('/diagrams/stats/summary')
