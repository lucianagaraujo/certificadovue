<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Gerenciar Medalhas</h1>
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
        <!-- Formulário de Nova Medalha -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold mb-4">Nova Medalha</h2>
          <form @submit.prevent="criarMedalha" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Nome da Medalha
              </label>
              <input
                v-model="novaMedalha.nome"
                type="text"
                required
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Curso
              </label>
              <input
                v-model="novaMedalha.curso"
                type="text"
                required
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                v-model="novaMedalha.descricao"
                rows="3"
                required
                class="input-field"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Critérios
              </label>
              <div class="flex space-x-2 mb-2">
                <input v-model="novoCriterio" type="text" class="input-field flex-1" placeholder="Digite um critério" @keyup.enter="adicionarCriterio" />
                <button type="button" class="btn-primary" @click="adicionarCriterio">Adicionar</button>
              </div>
              <ul>
                <li v-for="(criterio, idx) in criterios" :key="idx" class="flex items-center space-x-2">
                  <span>{{ criterio }}</span>
                  <button type="button" class="text-red-600" @click="removerCriterio(idx)">Remover</button>
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                URL da Imagem da Medalha
              </label>
              <input
                v-model="novaMedalha.imagem_url"
                type="text"
                placeholder="https://exemplo.com/imagem.png"
                class="input-field"
              />
              <img v-if="novaMedalha.imagem_url" :src="novaMedalha.imagem_url" class="mt-2 h-32 w-32 object-cover rounded-lg" />
            </div>

            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
            >
              {{ loading ? 'Criando...' : 'Criar Medalha' }}
            </button>
          </form>
        </div>

        <!-- Lista de Medalhas -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Medalhas Existentes</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="medalha in medalhas"
              :key="medalha.id"
              class="border rounded-lg p-4"
            >
              <img
                :src="medalha.imagem_url"
                :alt="medalha.nome"
                class="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h3 class="font-semibold">{{ medalha.nome }}</h3>
              <p class="text-sm text-gray-600">{{ medalha.descricao }}</p>
              <div class="mt-2">
                <button
                  @click="editarMedalha(medalha)"
                  class="text-primary-600 hover:text-primary-700"
                >
                  Editar
                </button>
                <button
                  @click="excluirMedalha(medalha.id)"
                  class="ml-2 text-red-600 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de Edição de Medalha -->
        <div v-if="modalEditarAberto && medalhaEditando" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div class="absolute inset-0" @click="fecharModalEditar"></div>
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative animate-fade-in my-12 z-10">
            <button @click="fecharModalEditar" class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl z-20">&times;</button>
            <h2 class="text-xl font-bold mb-4 text-center">Editar Medalha</h2>
            <form @submit.prevent="salvarEdicaoMedalha" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome da Medalha</label>
                <input v-model="medalhaEditando!.nome" type="text" required class="input-field w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea v-model="medalhaEditando!.descricao" rows="3" required class="input-field w-full"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Critérios (um por linha)</label>
                <textarea v-model="criteriosEdicao" rows="3" required class="input-field w-full"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">URL da Imagem da Medalha</label>
                <input v-model="medalhaEditando!.imagem_url" type="text" class="input-field w-full" />
                <img v-if="medalhaEditando!.imagem_url" :src="medalhaEditando!.imagem_url" class="mt-2 h-32 w-32 object-cover rounded-lg" />
              </div>
              <button type="submit" class="btn-primary w-full">Salvar Alterações</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMedalhas, createMedalha, deleteMedalha } from '@/services/database'

interface Medalha {
  id: string
  nome: string
  descricao: string
  criterios: string
  imagem_url: string
}

const novaMedalha = ref({
  nome: '',
  curso: '',
  descricao: '',
  criterios: '',
  imagem_url: ''
})

const criterios = ref<string[]>([])
const novoCriterio = ref('')

const adicionarCriterio = () => {
  if (novoCriterio.value.trim()) {
    criterios.value.push(novoCriterio.value.trim())
    novoCriterio.value = ''
  }
}

const removerCriterio = (index: number) => {
  criterios.value.splice(index, 1)
}

const medalhas = ref<Medalha[]>([])
const loading = ref(false)

const criarMedalha = async () => {
  loading.value = true
  try {
    if (!novaMedalha.value.imagem_url) {
      alert('Por favor, informe a URL da imagem da medalha')
      return
    }
    novaMedalha.value.criterios = criterios.value.join(';')
    await createMedalha({ ...novaMedalha.value })
    alert('Medalha criada com sucesso!')
    fetchMedalhas()
    novaMedalha.value = { nome: '', curso: '', descricao: '', criterios: '', imagem_url: '' }
    criterios.value = []
  } finally {
    loading.value = false
  }
}

const fetchMedalhas = async () => {
  medalhas.value = await getMedalhas()
}

onMounted(() => {
  fetchMedalhas()
})

const modalEditarAberto = ref(false)
const medalhaEditando = ref<Medalha | null>(null)
const criteriosEdicao = ref('')

const editarMedalha = (medalha: Medalha) => {
  medalhaEditando.value = { ...medalha }
  criteriosEdicao.value = medalha.criterios.split(';').join('\n')
  modalEditarAberto.value = true
}

const fecharModalEditar = () => {
  modalEditarAberto.value = false
  medalhaEditando.value = null
}

const salvarEdicaoMedalha = async () => {
  if (!medalhaEditando.value) return
  loading.value = true
  try {
    const criteriosStr = criteriosEdicao.value.split('\n').map(c => c.trim()).filter(Boolean).join(';')
    await createMedalha({
      nome: medalhaEditando.value.nome,
      descricao: medalhaEditando.value.descricao,
      criterios: criteriosStr,
      imagem_url: medalhaEditando.value.imagem_url
    })
    alert('Medalha atualizada com sucesso!')
    fetchMedalhas()
    fecharModalEditar()
  } finally {
    loading.value = false
  }
}

const excluirMedalha = async (id: string) => {
  await deleteMedalha(id)
  fetchMedalhas()
}
</script> 