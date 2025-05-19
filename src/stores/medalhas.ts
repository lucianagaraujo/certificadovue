import { defineStore } from 'pinia'
import axios from 'axios'

interface Medalha {
  id: number
  nome: string
  descricao: string
  criterios: string
  imagem: string
}

interface MedalhasState {
  medalhas: Medalha[]
  loading: boolean
  error: string | null
}

export const useMedalhasStore = defineStore('medalhas', {
  state: (): MedalhasState => ({
    medalhas: [],
    loading: false,
    error: null
  }),

  getters: {
    getMedalhaById: (state) => (id: number) => {
      return state.medalhas.find(medalha => medalha.id === id)
    }
  },

  actions: {
    async fetchMedalhas() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.get('/api/medalhas')
        this.medalhas = response.data
      } catch (error) {
        this.error = 'Erro ao carregar medalhas'
        console.error('Erro ao carregar medalhas:', error)
      } finally {
        this.loading = false
      }
    },

    async criarMedalha(medalha: Omit<Medalha, 'id'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.post('/api/medalhas', medalha)
        this.medalhas.push(response.data)
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar medalha'
        console.error('Erro ao criar medalha:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async atualizarMedalha(id: number, medalha: Partial<Medalha>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.put(`/api/medalhas/${id}`, medalha)
        const index = this.medalhas.findIndex(m => m.id === id)
        if (index !== -1) {
          this.medalhas[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao atualizar medalha'
        console.error('Erro ao atualizar medalha:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async excluirMedalha(id: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        await axios.delete(`/api/medalhas/${id}`)
        this.medalhas = this.medalhas.filter(m => m.id !== id)
      } catch (error) {
        this.error = 'Erro ao excluir medalha'
        console.error('Erro ao excluir medalha:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 