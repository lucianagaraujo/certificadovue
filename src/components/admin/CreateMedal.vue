<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Criar Nova Medalha</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome da Medalha</label>
        <input
          v-model="medalData.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          v-model="medalData.description"
          required
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">URL da Imagem da Medalha</label>
        <input
          v-model="medalData.imagem_url"
          type="text"
          placeholder="https://exemplo.com/imagem.png"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <img v-if="medalData.imagem_url" :src="medalData.imagem_url" class="mt-2 h-32 w-32 object-cover rounded-lg" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Pontos</label>
        <input
          v-model.number="medalData.points"
          type="number"
          required
          min="0"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          v-model="medalData.category"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="academic">Acadêmica</option>
          <option value="sports">Esportiva</option>
          <option value="cultural">Cultural</option>
          <option value="social">Social</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Data de Expiração</label>
        <input
          v-model="medalData.expirationDate"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Criar Medalha
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';

const router = useRouter();

const medalData = ref({
  name: '',
  description: '',
  imagem_url: '',
  points: 0,
  category: 'academic',
  expirationDate: '',
  created_at: new Date().toISOString(),
  active: true
});

const handleSubmit = async () => {
  try {
    if (!medalData.value.imagem_url) {
      alert('Por favor, informe a URL da imagem da medalha');
      return;
    }

    const { data, error } = await supabase
      .from('medals')
      .insert([{
        ...medalData.value
      }])
      .select();

    if (error) throw error;

    alert('Medalha criada com sucesso!');
    router.push('/admin/medals');
  } catch (error) {
    console.error('Erro ao criar medalha:', error);
    alert('Erro ao criar medalha. Por favor, tente novamente.');
  }
};

const testConnection = async () => {
  const { data, error } = await supabase.from('users').insert([
    { email: 'aluno@email.com', nome: 'Nome do Aluno', role: 'aluno' }
  ]).select();
  console.log('TESTE SUPABASE:', { data, error });
};
testConnection();
</script> 