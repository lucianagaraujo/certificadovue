<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-2xl font-bold mb-6">Minhas Medalhas</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="medal in medals" :key="medal.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="aspect-w-16 aspect-h-9">
          <img 
            :src="medal.imagem_url" 
            :alt="medal.nome"
            class="w-full h-48 object-cover"
          />
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ medal.nome }}</h3>
          <p class="mt-2 text-sm text-gray-600">{{ medal.descricao }}</p>
          <div class="mt-4">
            <p class="text-sm text-gray-500">
              Concedida em: {{ formatDate(medal.data_conquista) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { db } from '@/services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Medalha } from '@/types';

const authStore = useAuthStore();
const medals = ref<Medalha[]>([]);

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const fetchMedals = async () => {
  try {
    if (!authStore.user?.id) return;

    const medalhasRef = collection(db, 'medalhas');
    const q = query(medalhasRef, where('aluno_id', '==', authStore.user.id));
    const querySnapshot = await getDocs(q);

    medals.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Medalha[];
  } catch (error) {
    console.error('Erro ao buscar medalhas:', error);
  }
};

onMounted(() => {
  fetchMedals();
});
</script> 