<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Criar Nova Medalha</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome da Medalha</label>
        <input
          v-model="medalData.nome"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          v-model="medalData.descricao"
          required
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Critérios</label>
        <textarea
          v-model="medalData.criterios"
          required
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Digite os critérios separados por ponto e vírgula (;)"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">URL da Imagem da Medalha</label>
        <input
          type="file"
          @change="handleImageChange"
          accept="image/*"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <img v-if="imageFile || medalData.imagem_url" :src="imageFile ? getImageUrl(imageFile) : medalData.imagem_url" class="mt-2 h-32 w-32 object-cover rounded-lg" />
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
import { createMedalha } from '@/services/database';
import { uploadImage } from '@/services/storage';
import type { Medalha } from '@/types';

const router = useRouter();

const medalData = ref<Omit<Medalha, 'id'>>({
  nome: '',
  descricao: '',
  criterios: '',
  imagem_url: '',
  created_at: new Date()
});

const imageFile = ref<File | null>(null);

const getImageUrl = (file: File) => {
  return URL.createObjectURL(file);
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
  }
};

const handleSubmit = async () => {
  try {
    let imageUrl = medalData.value.imagem_url;
    if (imageFile.value) {
      imageUrl = await uploadImage(imageFile.value, 'medalhas');
    }
    if (!imageUrl) {
      alert('Por favor, envie uma imagem da medalha');
      return;
    }
    await createMedalha({
      ...medalData.value,
      imagem_url: imageUrl
    });
    alert('Medalha criada com sucesso!');
    router.push('/admin/medalhas');
  } catch (error) {
    console.error('Erro ao criar medalha:', error);
    alert('Erro ao criar medalha. Por favor, tente novamente.');
  }
};
</script> 