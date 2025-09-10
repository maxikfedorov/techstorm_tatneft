// frontend/src/services/diagrams.js
import api from './api'

export const fetchDiagrams = () => api.get('/diagrams/')
export const fetchDiagram = id => api.get(`/diagrams/${id}`)
export const createDiagram = data => api.post('/diagrams/', data)
export const updateDiagram = (id, data) => api.put(`/diagrams/${id}`, data)
