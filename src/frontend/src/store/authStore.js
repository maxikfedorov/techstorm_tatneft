// frontend/src/store/authStore.js
import { create } from 'zustand'

export const useAuthStore = create(set => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null })
}))
