<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Gerenciar Alunos</h1>
            </div>
          </div>
          <div class="flex items-center">
            <router-link
              to="/admin"
              class="btn-primary"
            >
              Voltar
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Lista de Alunos -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Lista de Alunos</h2>
            <div class="flex space-x-2 items-center">
              <select v-model="tipoBusca" class="input-field">
                <option value="nome">Nome</option>
                <option value="email">E-mail</option>
                <option value="ambos">Nome ou E-mail</option>
              </select>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar aluno..."
                class="input-field max-w-xs"
              />
              <button @click="buscarAlunos" class="btn-primary">Buscar</button>
              <button @click="exibirTodos" class="btn-secondary">{{ mostrandoTodos ? 'Esconder Todos' : 'Exibir Todos' }}</button>
              <button
                @click="exportarAlunos"
                class="btn-primary"
              >
                Exportar CSV
              </button>
            </div>
          </div>

          <div v-if="carregando" class="text-center py-4 text-gray-500">Carregando alunos...</div>
          <div v-else-if="filteredAlunos.length === 0" class="text-center text-gray-500 py-4">Nenhum aluno encontrado.</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medalhas
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="aluno in filteredAlunos" :key="aluno.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ aluno.nome }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">
                      {{ aluno.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">
                      {{ aluno.medalhas.length }} medalhas
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="editarAluno(aluno)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      @click="excluirAluno(aluno.id)"
                      class="text-red-600 hover:text-red-900 mr-3"
                    >
                      Excluir
                    </button>
                    <button
                      @click="abrirModalConquistas(aluno)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Ver Conquistas
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal de Conquistas -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button @click="showModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl">&times;</button>
            <h3 class="text-xl font-bold mb-4">Conquistas de {{ alunoSelecionado?.nome }}</h3>
            <div v-if="loadingConquistas" class="text-center py-4 text-gray-500">Carregando conquistas...</div>
            <div v-else-if="conquistas.length === 0" class="text-center text-gray-500 py-4">Nenhuma medalha encontrada para este aluno.</div>
            <ul v-else class="space-y-4">
              <li v-for="medalha in conquistas" :key="medalha.id" class="border rounded p-3">
                <div class="flex items-center space-x-3">
                  <img :src="medalha.imagem_url" class="h-12 w-12 object-cover rounded" v-if="medalha.imagem_url" />
                  <div>
                    <div class="font-semibold">{{ medalha.nome }}</div>
                    <div class="text-sm text-gray-600">{{ medalha.descricao }}</div>
                    <div class="text-xs text-gray-500 mt-1"><b>Data:</b> {{ formatarData(medalha.data_conquista || '') }}</div>
                    <ul v-if="medalha.criterios" class="list-disc ml-5 mt-1 text-xs text-gray-500">
                      <li v-for="(c, idx) in medalha.criterios.split(';')" :key="idx">{{ c }}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getUsers, getMedalhasAluno, getConquistasAluno } from '@/services/database'

interface Medalha {
  id: string
  nome: string
  descricao?: string
  criterios?: string
  imagem_url?: string
  data_conquista?: string
}

interface Aluno {
  id: string
  nome: string
  email: string
  medalhas: Medalha[]
}

const alunos = ref<Aluno[]>([])
const searchQuery = ref('')
const tipoBusca = ref('nome')
const carregando = ref(false)
const mostrandoTodos = ref(false)

const filteredAlunos = computed(() => alunos.value)

const buscarAlunos = async () => {
  carregando.value = true
  let lista = await getUsers('aluno')
  if (searchQuery.value.trim()) {
    const termo = searchQuery.value.trim().toLowerCase()
    if (tipoBusca.value === 'nome') {
      lista = lista.filter(a => a.nome.toLowerCase().includes(termo))
    } else if (tipoBusca.value === 'email') {
      lista = lista.filter(a => a.email.toLowerCase().includes(termo))
    } else {
      lista = lista.filter(a => a.nome.toLowerCase().includes(termo) || a.email.toLowerCase().includes(termo))
    }
  }
  alunos.value = await Promise.all(lista.map(async (a: any) => ({
    ...a,
    medalhas: await getMedalhasAluno(a.id)
  })))
  carregando.value = false
}

const exibirTodos = async () => {
  if (!mostrandoTodos.value) {
    searchQuery.value = ''
    carregando.value = true
    const lista = await getUsers('aluno')
    alunos.value = await Promise.all(lista.map(async (a: any) => ({
      ...a,
      medalhas: await getMedalhasAluno(a.id)
    })))
    carregando.value = false
    mostrandoTodos.value = true
  } else {
    alunos.value = []
    mostrandoTodos.value = false
  }
}

const editarAluno = (aluno: Aluno) => {
  // TODO: Implementar edição do aluno
  console.log('Editando aluno:', aluno)
}

const excluirAluno = async (id: string) => {
  if (!confirm('Tem certeza que deseja excluir este aluno?')) return
  
  // TODO: Implementar exclusão do aluno
  console.log('Excluindo aluno:', id)
}

const exportarAlunos = () => {
  // TODO: Implementar exportação para CSV
  console.log('Exportando alunos para CSV')
}

// Modal de conquistas
const showModal = ref(false)
const alunoSelecionado = ref<Aluno | null>(null)
const conquistas = ref<Medalha[]>([])
const loadingConquistas = ref(false)

const abrirModalConquistas = async (aluno: Aluno) => {
  alunoSelecionado.value = aluno
  showModal.value = true
  loadingConquistas.value = true
  // Buscar conquistas do aluno no Firestore (dados completos da medalha)
  const conquistasAluno = await getConquistasAluno(aluno.id)
  conquistas.value = conquistasAluno
  loadingConquistas.value = false
}

const formatarData = (data: string) => {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}
</script> 