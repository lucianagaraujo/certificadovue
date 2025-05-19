<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Minhas Medalhas</h1>
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
        <!-- Perfil do Aluno -->
        <div class="card mb-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-2xl text-primary-600">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ aluno.nome }}</h2>
              <p class="text-gray-600">{{ aluno.email }}</p>
            </div>
          </div>
        </div>

        <!-- Medalhas Conquistadas -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Minhas Medalhas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="medalha in medalhas"
              :key="medalha.id"
              class="card-medalha"
            >
              <img :src="medalha.imagem" class="medalha-img" />
              <div class="medalha-info">
                <h3>{{ medalha.nome }}</h3>
                <p>{{ medalha.descricao }}</p>
                <p><b>Critérios:</b> {{ medalha.criterios }}</p>
                <p><b>Data da conquista:</b> {{ formatarData(medalha.data_conquista) }}</p>
                <p><b>Código:</b> {{ medalha.id }}</p>
                <div class="my-2">
                  <qrcode-vue :value="`${urlBase}/validar/${medalha.id}`" :size="100" />
                  <p class="text-xs text-gray-500 mt-1">Escaneie para validar a medalha</p>
                </div>
                <div class="acoes">
                  <button @click="baixarCertificado(medalha)">Baixar Certificado</button>
                  <button @click="compartilharMedalha(medalha)">Compartilhar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'
import QrcodeVue from 'qrcode.vue'

interface Medalha {
  id: number
  nome: string
  descricao: string
  criterios: string
  imagem: string
  data_conquista: string
  codigo_validacao?: string
}

const router = useRouter()
const authStore = useAuthStore()

const aluno = ref({
  nome: 'Nome do Aluno',
  email: 'aluno@email.com'
})

const medalhas = ref<Medalha[]>([])

const urlBase = typeof window !== 'undefined' ? window.location.origin : ''

const userInitials = computed(() => {
  return aluno.value.nome
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

const baixarCertificado = (medalha: Medalha) => {
  // TODO: Implementar download do certificado
  console.log('Baixando certificado:', medalha.nome)
}

const compartilharMedalha = (medalha: Medalha) => {
  // TODO: Implementar compartilhamento
  console.log('Compartilhando medalha:', medalha.nome)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const formatarData = (data: string) => {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

onMounted(async () => {
  if (authStore.user) {
    aluno.value.nome = authStore.user.name || 'Aluno'
    aluno.value.email = authStore.user.email
    // Buscar medalhas vinculadas ao aluno
    const { data, error } = await supabase
      .from('alunos_medalhas')
      .select('id, data_conquista, medalhas(id, nome, descricao, criterios, imagem_url)')
      .eq('aluno_id', authStore.user.id)
    console.log('Medalhas retornadas:', data, error)
    if (!error && data) {
      medalhas.value = data.map((item: any) => ({
        id: item.id, // id da conquista
        nome: item.medalhas.nome,
        descricao: item.medalhas.descricao,
        criterios: item.medalhas.criterios,
        imagem: item.medalhas.imagem_url,
        data_conquista: item.data_conquista
      }))
    }
  }
})
</script> 