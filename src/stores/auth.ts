import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'aluno'
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    currentUser: (state) => state.user
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // TODO: Implementar chamada à API
        const response = { user: { id: 1, email, name: 'Admin', role: 'admin' }, token: 'fake-token' }
        this.user = response.user
        this.token = response.token
        localStorage.setItem('token', response.token)
        return true
      } catch (error) {
        console.error('Erro no login:', error)
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        // TODO: Implementar validação do token com a API
        this.token = token
        return true
      }
      return false
    }
  }
}) 