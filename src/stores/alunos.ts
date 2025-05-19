import { defineStore } from 'pinia'
import axios from 'axios'

interface Medalha {
  id: number
  nome: string
}

interface Aluno {
  id: number
  nome: string
  email: string
  medalhas: Medalha[]
}

interface AlunosState {
  alunos: Aluno[]
  loading: boolean
  error: string | null
}

export const useAlunosStore = defineStore('alunos', {
  state: (): AlunosState => ({
    alunos: [],
    loading: false,
    error: null
  }),

  getters: {
    getAlunoById: (state) => (id: number) => {
      return state.alunos.find(aluno => aluno.id === id)
    },
    getAlunoByEmail: (state) => (email: string) => {
      return state.alunos.find(aluno => aluno.email === email)
    }
  },

  actions: {
    async fetchAlunos() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.get('/api/alunos')
        this.alunos = response.data
      } catch (error) {
        this.error = 'Erro ao carregar alunos'
        console.error('Erro ao carregar alunos:', error)
      } finally {
        this.loading = false
      }
    },

    async criarAluno(aluno: Omit<Aluno, 'id' | 'medalhas'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.post('/api/alunos', aluno)
        this.alunos.push(response.data)
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar aluno'
        console.error('Erro ao criar aluno:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async atualizarAluno(id: number, aluno: Partial<Aluno>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.put(`/api/alunos/${id}`, aluno)
        const index = this.alunos.findIndex(a => a.id === id)
        if (index !== -1) {
          this.alunos[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao atualizar aluno'
        console.error('Erro ao atualizar aluno:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async excluirAluno(id: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        await axios.delete(`/api/alunos/${id}`)
        this.alunos = this.alunos.filter(a => a.id !== id)
      } catch (error) {
        this.error = 'Erro ao excluir aluno'
        console.error('Erro ao excluir aluno:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async vincularMedalha(alunoId: number, medalhaId: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.post(`/api/alunos/${alunoId}/medalhas`, { medalhaId })
        const index = this.alunos.findIndex(a => a.id === alunoId)
        if (index !== -1) {
          this.alunos[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao vincular medalha'
        console.error('Erro ao vincular medalha:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async desvincularMedalha(alunoId: number, medalhaId: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.delete(`/api/alunos/${alunoId}/medalhas/${medalhaId}`)
        const index = this.alunos.findIndex(a => a.id === alunoId)
        if (index !== -1) {
          this.alunos[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao desvincular medalha'
        console.error('Erro ao desvincular medalha:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 