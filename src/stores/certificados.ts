import { defineStore } from 'pinia'
import axios from 'axios'

interface Certificado {
  id: number
  alunoId: number
  medalhaId: number
  dataEmissao: string
  codigoValidacao: string
  status: 'pendente' | 'emitido' | 'revogado'
}

interface CertificadosState {
  certificados: Certificado[]
  loading: boolean
  error: string | null
}

export const useCertificadosStore = defineStore('certificados', {
  state: (): CertificadosState => ({
    certificados: [],
    loading: false,
    error: null
  }),

  getters: {
    getCertificadoById: (state) => (id: number) => {
      return state.certificados.find(certificado => certificado.id === id)
    },
    getCertificadosByAlunoId: (state) => (alunoId: number) => {
      return state.certificados.filter(certificado => certificado.alunoId === alunoId)
    },
    getCertificadosByMedalhaId: (state) => (medalhaId: number) => {
      return state.certificados.filter(certificado => certificado.medalhaId === medalhaId)
    }
  },

  actions: {
    async fetchCertificados() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.get('/api/certificados')
        this.certificados = response.data
      } catch (error) {
        this.error = 'Erro ao carregar certificados'
        console.error('Erro ao carregar certificados:', error)
      } finally {
        this.loading = false
      }
    },

    async emitirCertificado(alunoId: number, medalhaId: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.post('/api/certificados', { alunoId, medalhaId })
        this.certificados.push(response.data)
        return response.data
      } catch (error) {
        this.error = 'Erro ao emitir certificado'
        console.error('Erro ao emitir certificado:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async revogarCertificado(id: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.put(`/api/certificados/${id}/revogar`)
        const index = this.certificados.findIndex(c => c.id === id)
        if (index !== -1) {
          this.certificados[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao revogar certificado'
        console.error('Erro ao revogar certificado:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async validarCertificado(codigoValidacao: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.get(`/api/certificados/validar/${codigoValidacao}`)
        return response.data
      } catch (error) {
        this.error = 'Erro ao validar certificado'
        console.error('Erro ao validar certificado:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async downloadCertificado(id: number) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implementar chamada à API
        const response = await axios.get(`/api/certificados/${id}/download`, {
          responseType: 'blob'
        })
        return response.data
      } catch (error) {
        this.error = 'Erro ao baixar certificado'
        console.error('Erro ao baixar certificado:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 