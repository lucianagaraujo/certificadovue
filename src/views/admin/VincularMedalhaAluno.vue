<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Vincular Medalha a Aluno</h2>
    <form @submit.prevent="vincularMedalha" class="space-y-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Alunos</label>
        <div class="flex space-x-2">
          <input v-model="busca" type="text" placeholder="Nome ou e-mail" class="input-field flex-1" />
          <button type="button" class="btn-primary" @click="buscarAlunos">Buscar</button>
        </div>
      </div>
      <div v-if="carregando" class="text-center py-4 text-gray-500">Carregando alunos...</div>
      <div v-else-if="alunos.length > 0">
        <table class="min-w-full divide-y divide-gray-200 border rounded-lg mt-4">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">
                <input type="checkbox" v-model="selecionarTodos" @change="toggleSelecionarTodos" />
              </th>
              <th class="px-4 py-2 text-left">Nome</th>
              <th class="px-4 py-2 text-left">E-mail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aluno in alunos" :key="aluno.id" class="bg-white border-b">
              <td class="px-4 py-2">
                <input type="checkbox" :value="aluno.id" v-model="alunosSelecionados" />
              </td>
              <td class="px-4 py-2">{{ aluno.nome }}</td>
              <td class="px-4 py-2">{{ aluno.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-4">Nenhum aluno encontrado.</div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Medalha</label>
        <select v-model="medalhaSelecionada" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="" disabled>Selecione uma medalha</option>
          <option v-for="medalha in medalhas" :key="medalha.id" :value="medalha.id">
            {{ medalha.nome }}
          </option>
        </select>
      </div>
      <button type="submit" class="btn-primary">Vincular Medalha</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/services/supabase'

const alunos = ref<any[]>([])
const medalhas = ref<any[]>([])
const alunosSelecionados = ref<any[]>([])
const medalhaSelecionada = ref('')
const selecionarTodos = ref(false)
const busca = ref('')
const carregando = ref(false)

const buscarAlunos = async () => {
  carregando.value = true
  let query = supabase.from('users').select('id, nome, email').eq('role', 'aluno')
  if (busca.value.trim()) {
    query = query.ilike('nome', `%${busca.value.trim()}%`).or(`email.ilike.%${busca.value.trim()}%`)
  }
  const { data } = await query.order('nome')
  alunos.value = data || []
  alunosSelecionados.value = []
  selecionarTodos.value = false
  carregando.value = false
}

const fetchMedalhas = async () => {
  const { data } = await supabase.from('medalhas').select('id, nome').order('nome')
  if (data) medalhas.value = data
}

const toggleSelecionarTodos = () => {
  if (selecionarTodos.value) {
    alunosSelecionados.value = alunos.value.map(a => a.id)
  } else {
    alunosSelecionados.value = []
  }
}

watch(alunosSelecionados, (val) => {
  selecionarTodos.value = val.length === alunos.value.length && alunos.value.length > 0
})

const vincularMedalha = async () => {
  if (!alunosSelecionados.value.length || !medalhaSelecionada.value) return
  const inserts = alunosSelecionados.value.map((alunoId: string) => ({
    aluno_id: alunoId,
    medalha_id: medalhaSelecionada.value,
    data_conquista: new Date().toISOString()
  }))
  const { error } = await supabase.from('alunos_medalhas').insert(inserts)
  if (error) {
    alert('Erro ao vincular medalha: ' + error.message)
  } else {
    alert('Medalha vinculada com sucesso!')
    alunosSelecionados.value = []
    selecionarTodos.value = false
    medalhaSelecionada.value = ''
    buscarAlunos()
  }
}

onMounted(() => {
  fetchMedalhas()
})
</script> 