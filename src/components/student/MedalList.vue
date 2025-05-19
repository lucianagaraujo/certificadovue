<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-2xl font-bold mb-6">Minhas Medalhas</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="medal in medals" :key="medal.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="aspect-w-16 aspect-h-9">
          <img 
            :src="medal.imageUrl" 
            :alt="medal.name"
            class="w-full h-48 object-cover"
          />
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ medal.name }}</h3>
          <p class="mt-2 text-sm text-gray-600">{{ medal.description }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {{ medal.category }}
            </span>
            <span class="text-sm font-medium text-gray-900">
              {{ medal.points }} pontos
            </span>
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-500">
              Concedida em: {{ formatDate(medal.awarded_at) }}
            </p>
            <p v-if="medal.expirationDate" class="text-sm text-gray-500">
              Expira em: {{ formatDate(medal.expirationDate) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/auth';

interface Medal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  points: number;
  category: string;
  awarded_at: string;
  expirationDate?: string;
}

const authStore = useAuthStore();
const medals = ref<Medal[]>([]);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const fetchMedals = async () => {
  try {
    const { data: studentMedals, error: studentMedalsError } = await supabase
      .from('student_medals')
      .select('*, medals(*)')
      .eq('student_id', authStore.user?.id);

    if (studentMedalsError) throw studentMedalsError;

    medals.value = studentMedals.map((studentMedal: any) => ({
      id: studentMedal.medals.id,
      name: studentMedal.medals.name,
      description: studentMedal.medals.description,
      imageUrl: studentMedal.medals.imageUrl,
      points: studentMedal.medals.points,
      category: studentMedal.medals.category,
      awarded_at: studentMedal.awarded_at,
      expirationDate: studentMedal.medals.expirationDate
    }));
  } catch (error) {
    console.error('Erro ao buscar medalhas:', error);
  }
};

onMounted(() => {
  fetchMedals();
});
</script> 