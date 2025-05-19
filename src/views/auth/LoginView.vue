<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Entre no Sistema
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="input-field"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="input-field"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full btn-primary"
              :disabled="loading"
            >
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // Buscar usuário pelo e-mail e role 'aluno'
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.value)
      .eq('role', 'aluno')
      .single()
    if (error || !data) {
      alert('Aluno não encontrado!')
      return
    }
    // Salvar usuário no authStore
    authStore.user = {
      id: data.id,
      email: data.email,
      name: data.nome,
      role: data.role
    }
    router.push('/aluno')
  } finally {
    loading.value = false
  }
}
</script> 