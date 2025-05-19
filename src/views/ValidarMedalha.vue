<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
    <div class="bg-white rounded-lg shadow p-8 max-w-lg w-full">
      <template v-if="carregando">
        <p>Carregando informações...</p>
      </template>
      <template v-else-if="erro">
        <p class="text-red-600 font-bold">{{ erro }}</p>
      </template>
      <template v-else>
        <h2 class="text-2xl font-bold mb-4">Validação de Medalha</h2>
        <div class="mb-4">
          <b>Aluno:</b> {{ medalhaAluno?.aluno_nome }}<br>
          <b>E-mail:</b> {{ medalhaAluno?.aluno_email }}
        </div>
        <div class="mb-4">
          <img :src="medalhaAluno?.imagem" :alt="medalhaAluno?.nome" class="h-32 w-32 object-cover rounded-lg mb-2" />
          <h3 class="text-xl font-semibold">{{ medalhaAluno?.nome }}</h3>
          <p>{{ medalhaAluno?.descricao }}</p>
          <ul v-if="criteriosArray.length" class="list-disc ml-5 mt-2">
            <li v-for="(criterio, idx) in criteriosArray" :key="idx">{{ criterio }}</li>
          </ul>
          <p class="mt-2"><b>Data da conquista:</b> {{ formatarData(medalhaAluno?.data_conquista) }}</p>
          <p><b>Código de validação:</b> {{ medalhaAluno?.id }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'

const route = useRoute()
const carregando = ref(true)
const erro = ref('')
const medalhaAluno = ref<any>(null)

const criteriosArray = computed(() => {
  if (!medalhaAluno.value?.criterios) return []
  return medalhaAluno.value.criterios.split(';').map((c: string) => c.trim()).filter(Boolean)
})

const formatarData = (data: string) => {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    erro.value = 'Código de validação não informado.'
    carregando.value = false
    return
  }
  const { data, error } = await supabase
    .from('alunos_medalhas')
    .select('id, data_conquista, aluno:users(nome, email), medalhas(id, nome, descricao, criterios, imagem_url)')
    .eq('id', id)
    .single()
  if (error || !data) {
    erro.value = 'Medalha não encontrada ou código inválido.'
  } else {
    medalhaAluno.value = {
      id: data.id,
      data_conquista: data.data_conquista,
      aluno_nome: data.aluno?.nome,
      aluno_email: data.aluno?.email,
      nome: data.medalhas?.nome,
      descricao: data.medalhas?.descricao,
      criterios: data.medalhas?.criterios,
      imagem: data.medalhas?.imagem_url
    }
  }
  carregando.value = false
})
</script> 