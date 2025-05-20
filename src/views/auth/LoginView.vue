<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 flex flex-col items-center">
      <div class="flex flex-col items-center w-full">
        <img src="@/assets/logoippla.png" alt="Logo" class="h-20 mb-4 drop-shadow mx-auto" />
        <h1 class="text-2xl font-bold text-blue-700 mb-2 text-center">Bem-vindo!</h1>
        <p class="text-gray-600 mb-6 text-center">Acesse sua conta para visualizar e compartilhar suas conquistas.</p>
        <h2 class="text-xl font-semibold mb-4 text-center text-gray-800">Login do Aluno</h2>
      </div>
      <form class="w-full flex flex-col gap-3" @submit.prevent="handleLogin">
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
        />
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          required
          placeholder="Senha"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold shadow transition disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
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