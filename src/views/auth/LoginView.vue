<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3ebf7] to-[#FFFFFF]">
    <div class="bg-white p-14 rounded-3xl shadow-xl max-w-md w-full border border-gray-200 flex flex-col items-center">
      <div class="flex flex-col items-center w-full">
        <img src="@/assets/logoippla.png" alt="Logo" class="h-32 mb-4 drop-shadow mx-auto" />
        <h1 class="text-2xl font-bold text-[#002f99] mb-2 text-center">Bem-vindo(a)!</h1>
        <p class="text-gray-600 mb-6 text-center">Acesse sua conta para visualizar e compartilhar suas conquistas.</p>
        <h2 class="text-xl font-semibold mb-4 text-center text-[#002f99]">Login</h2>
      </div>
      <form class="w-full flex flex-col gap-3" @submit.prevent="handleLogin">
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          class="w-full p-3 border border-gray-300 rounded-2xl rounded- focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
        />
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          required
          placeholder="Senha"
          class="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
        />
        <button
          type="submit"
          class="w-full bg-gradient-to-br from-[#002f99] to-[#00193f] hover:from-[#4282e3] hover:to-[#013585] text-white p-3  rounded-2xl font-semibold shadow transition disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        <button
          type="button"
          class="w-full text-blue-700 underline mt-2"
          @click="handleForgotPassword"
        >
          Esqueci minha senha
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/services/firebase'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const { user, error } = await signIn(email.value, password.value)
    if (error || !user) {
      alert('Aluno não encontrado ou senha incorreta!')
      return
    }
    if (user.role !== 'aluno') {
      alert('Acesso restrito a alunos!')
      return
    }
    authStore.user = {
      id: user.id,
      email: user.email || '',
      name: user.nome || '',
      role: user.role || 'aluno'
    }
    router.push('/aluno')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!email.value) {
    alert('Por favor, preencha o e-mail para redefinir a senha.')
    return
  }
  try {
    await sendPasswordResetEmail(auth, email.value)
    alert('Um e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada.')
  } catch (error: any) {
    alert('Erro ao enviar e-mail de redefinição: ' + (error.message || error))
  }
}
</script> 