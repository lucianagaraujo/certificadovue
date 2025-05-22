<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow max-w-md w-full">
      <div class="flex flex-col items-center">
        <img src="@/assets/logoippla.png" alt="Logo" class="h-20 mb-4 drop-shadow mx-auto" />
        <h2 class="text-2xl font-bold mb-4 text-center">Login do Administrador</h2>
      </div>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" class="w-full mb-2 p-2 border rounded" required />
        <input v-model="password" type="password" placeholder="Senha" class="w-full mb-4 p-2 border rounded" required />
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
        <div v-if="error" class="text-red-500 text-center mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn, signOut } from '@/services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    const { user, error: authError } = await signIn(email.value, password.value)
    if (authError || !user) throw new Error('Usuário ou senha inválidos')
    if (user.role !== 'admin') {
      await signOut()
      throw new Error('Acesso restrito ao administrador.')
    }
    router.push('/home')
  } catch (e: any) {
    error.value = e.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script> 