<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Sistema de Certificados Digitais
        </h1>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Área do Aluno -->
            <div class="card">
              <h2 class="text-xl font-semibold mb-4">Área do Aluno</h2>
              <p class="text-gray-600 mb-4">
                Acesse seus certificados e medalhas digitais.
              </p>
              <router-link
                to="/aluno"
                class="btn-primary inline-block"
              >
                Acessar Área do Aluno
              </router-link>
            </div>

            <!-- Área do Administrador -->
            <div class="card">
              <h2 class="text-xl font-semibold mb-4">Área do Administrador</h2>
              <p class="text-gray-600 mb-4">
                Gerencie certificados, medalhas e alunos.
              </p>
              <router-link
                to="/admin"
                class="btn-primary inline-block"
              >
                Acessar Área do Administrador
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Componente da página inicial
</script>
