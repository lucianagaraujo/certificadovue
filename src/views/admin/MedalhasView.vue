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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

interface Medalha {
  id: string
  nome: string
  descricao: string
  criterios: string
  imagem_url: string
}

const novaMedalha = ref({
  nome: '',
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
    const { data, error } = await supabase
      .from('medalhas')
      .insert([{ ...novaMedalha.value }])
      .select()
    if (error) {
      alert('Erro ao criar medalha: ' + error.message)
    } else {
      alert('Medalha criada com sucesso!')
      fetchMedalhas()
      novaMedalha.value = { nome: '', descricao: '', criterios: '', imagem_url: '' }
      criterios.value = []
    }
  } finally {
    loading.value = false
  }
}

const fetchMedalhas = async () => {
  const { data, error } = await supabase.from('medalhas').select('*').order('nome')
  if (!error && data) {
    medalhas.value = data
  }
}

onMounted(() => {
  fetchMedalhas()
})

const editarMedalha = (medalha: Medalha) => {
  // TODO: Implementar edição da medalha
  console.log('Editando medalha:', medalha)
}

const excluirMedalha = async (id: string) => {
  if (!confirm('Tem certeza que deseja excluir esta medalha?')) return
  const { error } = await supabase.from('medalhas').delete().eq('id', id)
  if (!error) fetchMedalhas()
}
</script> 