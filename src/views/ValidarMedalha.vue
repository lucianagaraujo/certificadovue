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
import { getFirestore, doc, getDoc } from 'firebase/firestore'

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
  const db = getFirestore();
  // Buscar o vínculo em alunos_medalhas
  const vinculoRef = doc(db, 'alunos_medalhas', String(id));
  const vinculoSnap = await getDoc(vinculoRef);
  if (!vinculoSnap.exists()) {
    erro.value = 'Medalha não encontrada ou código inválido.';
    carregando.value = false;
    return;
  }
  const vinculo = vinculoSnap.data();
  // Buscar o aluno
  const alunoRef = doc(db, 'users', vinculo.aluno_id);
  const alunoSnap = await getDoc(alunoRef);
  // Buscar a medalha
  const medalhaRef = doc(db, 'medalhas', vinculo.medalha_id);
  const medalhaSnap = await getDoc(medalhaRef);
  if (!alunoSnap.exists() || !medalhaSnap.exists()) {
    erro.value = 'Dados do aluno ou medalha não encontrados.';
    carregando.value = false;
    return;
  }
  const aluno = alunoSnap.data();
  const medalha = medalhaSnap.data();
  medalhaAluno.value = {
    id: vinculoSnap.id,
    data_conquista: vinculo.data_conquista || vinculo.data_vincular,
    aluno_nome: aluno.nome,
    aluno_email: aluno.email,
    nome: medalha.nome,
    descricao: medalha.descricao,
    criterios: medalha.criterios,
    imagem: medalha.imagem_url
  };
  carregando.value = false;
})
</script> 