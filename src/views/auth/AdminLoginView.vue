<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 text-center">Login do Administrador</h2>
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
import { supabase } from '../../services/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (authError) throw authError
    if (data.session && data.user) {
      // Buscar o papel do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('id', data.user.id)
        .single()
      if (userError) throw userError
      if (!userData || userData.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Acesso restrito ao administrador.')
      }
      router.push('/home')
    }
  } catch (e: any) {
    error.value = e.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script> 