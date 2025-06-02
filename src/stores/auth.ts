import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)

  async function login(email: string, password: string) {
    try {
      // TODO: Implementar chamada à API
      const response = { 
        user: { 
          id: '1', 
          email, 
          nome: 'Admin', 
          role: 'admin' as 'admin' | 'aluno' 
        }, 
        token: 'fake-token' 
      }
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (storedToken && userStr) {
      try {
        const userData = JSON.parse(userStr)
        token.value = storedToken
        user.value = userData
        return true
      } catch (error) {
        console.error('Erro ao restaurar estado do usuário:', error)
        logout()
        return false
      }
    }
    return false
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    currentUser,
    login,
    logout,
    checkAuth
  }
}) 