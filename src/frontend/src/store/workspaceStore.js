// frontend/src/store/workspaceStore.js
import { create } from 'zustand'

export const useWorkspaceStore = create(set => ({
  diagram: null,
  setDiagram: diagram => set({ diagram }),
  clearDiagram: () => set({ diagram: null })
}))
