<template>
  <div class="min-h-screen bg-gradient-to-br from-[#e3ebf7] to-[#FFFFFF]">
    <!-- Header com Logo e Título -->
    <header class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center">
          <img src="@/assets/logoippla.png" alt="Logo IPPLA" class="h-32 mb-4 drop-shadow-lg" />
          <h1 class="text-4xl font-bold text-[#002f99] text-center">
            Sistema de Certificados Digitais
          </h1>
          <p class="mt-4 text-lg text-gray-600 text-center max-w-2xl">
            Gerencie e compartilhe suas conquistas acadêmicas de forma segura e moderna
          </p>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Área do Aluno -->
          <div class="bg-white rounded-2xl shadow-xl p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="flex flex-col items-center text-center">
              <div class="bg-blue-100 p-4 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#002f99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-[#002f99] mb-4">Área do Aluno</h2>
              <p class="text-gray-600 mb-6">
                Acesse seus certificados e medalhas digitais, compartilhe suas conquistas e acompanhe seu progresso acadêmico.
              </p>
              <router-link
                to="/login"
                class="w-full bg-gradient-to-r from-[#002f99] to-[#00193f] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-[#0038b8] hover:to-[#002266] transition duration-300 transform hover:-translate-y-1"
              >
                Acessar Área do Aluno
              </router-link>
            </div>
          </div>

          <!-- Área do Administrador -->
          <div class="bg-white rounded-2xl shadow-xl p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="flex flex-col items-center text-center">
              <div class="bg-blue-100 p-4 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#002f99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-[#002f99] mb-4">Área do Administrador</h2>
              <p class="text-gray-600 mb-6">
                Gerencie certificados, medalhas e alunos. Mantenha o controle total sobre o sistema de certificação digital.
              </p>
              <router-link
                to="/admin/login"
                class="w-full bg-gradient-to-r from-[#002f99] to-[#00193f] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-[#0038b8] hover:to-[#002266] transition duration-300 transform hover:-translate-y-1"
              >
                Acessar Área do Administrador
              </router-link>
            </div>
          </div>
        </div>

        <!-- Seção de Recursos -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="text-[#002f99] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Certificados Verificáveis</h3>
            <p class="text-gray-600">Todos os certificados são verificáveis digitalmente através de QR Code.</p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="text-[#002f99] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Segurança Garantida</h3>
            <p class="text-gray-600">Sistema protegido com autenticação e criptografia de ponta a ponta.</p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="text-[#002f99] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Gestão Simplificada</h3>
            <p class="text-gray-600">Interface intuitiva para gerenciar certificados e medalhas.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#002f99] text-white mt-16">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-sm">© 2024 IPPLA - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Componente da página inicial
</script>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

.btn-primary {
  @apply bg-gradient-to-r from-[#002f99] to-[#00193f] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-[#0038b8] hover:to-[#002266] transition duration-300;
}
</style> 