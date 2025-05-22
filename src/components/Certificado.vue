<template>
  <div class="certificado-container">
    <div class="logo-container">
      <img src="@/assets/logoippla.png" alt="Logo IPPLA" class="logo" />
      <h1 class="logo-text">IPPLA</h1>
    </div>
    <div class="logo-container">
      <h2 class="logo-name">INSTITUTO DE PSICOLOGIA E PLANEJAMENTO FINANCEIRO</h2>
    </div>
    <div class="aluno-info">
      <h3>{{ nome.split(' ')[0] }}, veja logo abaixo suas conquistas:</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  nome: string
  email: string
}>()
</script>

<style scoped>
.certificado-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(120deg, #ffffff, #e2e9ed);
  border-radius: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #003d79;
  margin-top: -1.3rem;
}

.logo-name{
  font-size: 1.5rem;
  font-weight: 150;
  color: #003d79;
  margin-top: -2rem;
}

.aluno-info {
  text-align: center;
}

.aluno-info h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.aluno-info {
  color: #0a447d;
}
</style> 