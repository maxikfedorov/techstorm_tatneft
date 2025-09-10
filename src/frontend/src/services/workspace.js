// frontend/src/services/workspace.js
import api from './api'

export const fetchWorkspace = diagramId => {
  const url = diagramId ? `/workspace/${diagramId}` : '/workspace/'
  return api.get(url)
}
