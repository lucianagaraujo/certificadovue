<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Painel Administrativo</h1>
            </div>
          </div>
          <div class="flex items-center">
            <button
              @click="logout"
              class="ml-4 btn-primary"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Upload de Alunos -->
          <div class="card bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Upload de Alunos</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Arquivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  @change="handleFileUpload"
                  class="mt-1 block w-full"
                />
              </div>
              <button
                @click="uploadAlunos"
                class="btn-primary"
                :disabled="!selectedFile"
              >
                Enviar Arquivo
              </button>
            </div>
          </div>
          <!-- Cadastro Manual de Aluno -->
          <div class="card bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Cadastro de Aluno</h2>
            <form @submit.prevent="cadastrarAluno" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome do Aluno</label>
                <input v-model="novoAluno.nome" type="text" required class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">E-mail do Aluno</label>
                <input v-model="novoAluno.email" type="email" required class="input-field" />
              </div>
              <button type="submit" class="btn-primary">Cadastrar Aluno</button>
            </form>
          </div>

          <!-- Gerenciar Medalhas -->
          <div class="card bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Gerenciar Medalhas</h2>
            <router-link
              to="/admin/medalhas"
              class="btn-primary inline-block"
            >
              Gerenciar Medalhas
            </router-link>
          </div>

          <!-- Lista de Alunos -->
          <div class="card bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Lista de Alunos</h2>
            <router-link
              to="/admin/alunos"
              class="btn-primary inline-block"
            >
              Ver Alunos
            </router-link>
          </div>

          <!-- Vincular Medalha a Aluno -->
          <div class="card bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Vincular Medalha a Aluno</h2>
            <router-link
              to="/admin/vincular-medalha"
              class="btn-primary inline-block"
            >
              Vincular Medalha
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Papa from 'papaparse'
import { importarAlunos } from '@/services/database'

const router = useRouter()
const authStore = useAuthStore()
const selectedFile = ref<File | null>(null)
const novoAluno = ref({ nome: '', email: '' })

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const uploadAlunos = async () => {
  if (!selectedFile.value) return

  Papa.parse(selectedFile.value, {
    header: false,
    skipEmptyLines: true,
    complete: async (results: any) => {
      const linhas = results.data.slice(1)
      const alunos = linhas
        .filter((a: any) => a[0] && a[1])
        .map((a: any) => ({
          email: String(a[0]).trim(),
          nome: String(a[1]).trim(),
          role: 'aluno'
        }))

      if (alunos.length === 0) {
        alert('Nenhum aluno válido encontrado no arquivo.')
        return
      }

      try {
        await importarAlunos(alunos)
        alert('Alunos importados com sucesso!')
      } catch (error: any) {
        alert('Erro ao importar alunos: ' + (error.message || error))
      }
    }
  })
}

const cadastrarAluno = async () => {
  if (!novoAluno.value.nome || !novoAluno.value.email) return
  try {
    await importarAlunos([{ nome: novoAluno.value.nome, email: novoAluno.value.email, role: 'aluno' }])
    alert('Aluno cadastrado com sucesso!')
    novoAluno.value = { nome: '', email: '' }
  } catch (error: any) {
    alert('Erro ao cadastrar aluno: ' + (error.message || error))
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script> 

@ts-ignore
// eslint-disable-next-line
// Declaração de tipos para papaparse 

console.log('Medalhas encontradas:', medalhasAluno); 