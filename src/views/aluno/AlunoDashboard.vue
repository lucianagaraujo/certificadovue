<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="items-center">
              <h2 class="text-xl font-semibold">{{ aluno.nome }}</h2>
              <p class="text-gray-600">{{ aluno.email }}</p>
            </div>
          </div>
          <div class="text-right">
              
            </div>
          <div class="flex items-center">
            <button
              @click="logout"
              class="ml-4 bg-gradient-to-br from-[#0159ce] to-[#00134c] text-white px-4 py-2 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Perfil do Aluno -->
        <div class="card mb-6">
          <Certificado :nome="aluno.nome" :email="aluno.email" />
        </div>

        <!-- Medalhas Conquistadas -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Minhas Medalhas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="medalha in medalhas"
              :key="medalha.id"
              class="bg-gradient-to-br from-[#ffffff] to-[#c4cfd7] rounded-3xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-2xl transition"
              @click="abrirModalMedalha(medalha)"
            >
              <img :src="medalha.imagem_url" class="w-32 h-32 object-contain mb-2" />
              <h3 class="text-lg font-bold text-center">{{ medalha.nome }}</h3>
            </div>
          </div>
        </div>
        <!-- Modal de Detalhes da Medalha -->
        <div v-if="modalAberto && medalhaSelecionada" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div class="absolute inset-0" @click="fecharModalMedalha"></div>
          <div class="bg-white rounded-lg shadow-lg p-4 sm:p-8 max-w-lg w-full relative animate-fade-in my-20 sm:my-24 z-10 overflow-y-auto max-h-[90vh]">
            <button @click="fecharModalMedalha" class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl z-20">&times;</button>
            <div class="flex flex-col items-center">
              <img :src="medalhaSelecionada.imagem_url" class="w-40 h-40 object-contain mb-4" />
              <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ medalhaSelecionada.nome }}</h3>
              <p class="mb-2 text-center">{{ medalhaSelecionada.descricao }}</p>
              <div class="mt-4 w-full">
                <span class="block font-semibold mb-1">Critérios:</span>
                <ul class="list-disc list-inside mb-4">
                  <li v-for="criterio in medalhaSelecionada.criterios.split(';')" :key="criterio" class="mb-1">{{ criterio }}</li>
                </ul>
              </div>
              <div class="mt-4 w-full">
                <span class="block font-semibold">Data da conquista:</span>
                <span class="ml-2">{{ formatarData(medalhaSelecionada.data_conquista) }}</span>
              </div>
              <div class="mt-2 w-full">
                <span class="block font-semibold">Código:</span>
                <span class="ml-2">{{ medalhaSelecionada.id }}</span>
              </div>
              <div class="my-4 flex flex-col items-center">
                <qrcode-vue :value="`${urlBase}/validar/${medalhaSelecionada.id}`" :size="100" />
                <p class="text-xs text-gray-500 mt-1">Escaneie para validar a medalha</p>
              </div>
              <div class="acoes flex gap-2 mt-4">
                <button
                  @click="baixarCertificado(medalhaSelecionada)"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                >
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12' /></svg>
                  Baixar Certificado
                </button>
                <div class="relative group">
                  <button
                    @click="abrirOpcoesCompartilhar(medalhaSelecionada)"
                    class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 8a3 3 0 00-6 0v1a3 3 0 006 0V8zm-6 4v1a3 3 0 006 0v-1m-6 4v1a3 3 0 006 0v-1' /></svg>
                    Compartilhar
                  </button>
                  <div v-if="medalhaCompartilhar && medalhaCompartilhar.id === medalhaSelecionada.id" class="absolute bottom-full mb-2 right-0 bg-white border rounded shadow p-2 flex flex-col min-w-[180px] z-20">
                    <button @click="compartilharWhatsapp(medalhaSelecionada)" class="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded">
                      <img src='https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg' class='h-5 w-5' /> WhatsApp
                    </button>
                    <button @click="compartilharFacebook(medalhaSelecionada)" class="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded">
                      <img src='https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg' class='h-5 w-5' /> Facebook
                    </button>
                    <button @click="compartilharLinkedin(medalhaSelecionada)" class="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded">
                      <img src='https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg' class='h-5 w-5' /> LinkedIn
                    </button>
                    <button @click="copiarLink(medalhaSelecionada)" class="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded">
                      <svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13.828 10.172a4 4 0 010 5.656m-1.414-1.414a2 2 0 010-2.828m-2.828 2.828a4 4 0 010-5.656m1.414 1.414a2 2 0 010 2.828' /></svg> Copiar Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getConquistasAluno } from '@/services/database'
import { getFirestore, collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import QrcodeVue from 'qrcode.vue'
import JSZip from 'jszip'
import QRCode from 'qrcode'
import { saveAs } from 'file-saver'
import Certificado from '@/components/Certificado.vue'
import type { Medalha } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const aluno = ref({
  nome: '',
  email: ''
})

const medalhas = ref<Medalha[]>([])
const medalhaCompartilhar = ref<Medalha | null>(null)
const modalAberto = ref(false)
const medalhaSelecionada = ref<Medalha | null>(null)

const urlBase = typeof window !== 'undefined' ? window.location.origin : ''

const userInitials = computed(() => {
  return aluno.value.nome
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

const db = getFirestore()
let unsubscribeMedalhas: (() => void) | null = null

const fetchAlunoEMedalhas = async () => {
  if (!authStore.user) return
  aluno.value = {
    nome: authStore.user.nome,
    email: authStore.user.email
  }
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', authStore.user.email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log('Usuário não encontrado na coleção users');
    medalhas.value = [];
    return;
  }
  const userDoc = querySnapshot.docs[0];
  const userId = userDoc.id;
  medalhas.value = await getConquistasAluno(userId);
  console.log('Medalhas retornadas:', medalhas.value)
}

const baixarCertificado = async (medalha: Medalha) => {
  try {
    const zip = new JSZip();
    // Gerar QR Code
    const qrUrl = await QRCode.toDataURL(`${urlBase}/validar/${medalha.id}`, { width: 300 });
    const qrBlob = await (await fetch(qrUrl)).blob();
    zip.file(`qrcode-${medalha.nome}.png`, qrBlob);
    
    // Tentar baixar a imagem da medalha
    let medalhaBaixada = false;
    try {
      const response = await fetch(medalha.imagem_url, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      if (response.ok) {
        const medalhaBlob = await response.blob();
        zip.file(`medalha-${medalha.nome}.png`, medalhaBlob);
        medalhaBaixada = true;
      } else {
        console.error('Erro ao baixar imagem:', response.status, response.statusText);
      }
    } catch (e) {
      console.error('Erro ao baixar imagem:', e);
    }
    
    // Adicionar arquivo de informações
    const info = `Medalha: ${medalha.nome}\nDescrição: ${medalha.descricao}\nData da conquista: ${formatarData(medalha.data_conquista)}\nCódigo: ${medalha.id}`;
    zip.file('informacoes.txt', info);
    
    // Gerar e baixar o ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `certificado-${medalha.nome}.zip`);
    
    if (!medalhaBaixada) {
      alert('A imagem da medalha não pôde ser baixada devido a restrições do servidor. O arquivo contém apenas o QR code e as informações.');
    }
  } catch (error) {
    console.error('Erro ao baixar certificado:', error);
    alert('Erro ao baixar o certificado. Tente novamente.');
  }
}

const abrirOpcoesCompartilhar = (medalha: Medalha) => {
  medalhaCompartilhar.value = medalhaCompartilhar.value && medalhaCompartilhar.value.id === medalha.id ? null : medalha
}

const compartilharWhatsapp = (medalha: Medalha) => {
  const url = `${urlBase}/validar/${medalha.id}`
  const texto = encodeURIComponent(`Compartilho minha nova conquista: ${medalha.nome}! Veja e valide: ${url}`)
  window.open(`https://wa.me/?text=${texto}`, '_blank')
}

const compartilharFacebook = (medalha: Medalha) => {
  const url = `${urlBase}/validar/${medalha.id}`
  const texto = encodeURIComponent(`Compartilho minha nova conquista: ${medalha.nome}! Veja e valide: ${url}\n${url}`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${texto}`, '_blank')
}

const compartilharLinkedin = (medalha: Medalha) => {
  const url = `${urlBase}/validar/${medalha.id}`
  const texto = encodeURIComponent(`Compartilho minha nova conquista: ${medalha.nome}! Veja e valide: ${url}\n${url}`)
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${texto}`,'_blank')
}

const copiarLink = (medalha: Medalha) => {
  const url = `${urlBase}/validar/${medalha.id}`
  navigator.clipboard.writeText(url)
  alert('Link copiado!')
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

const formatarData = (data: any) => {
  if (!data) return ''
  if (typeof data === 'object' && data.seconds) {
    return new Date(data.seconds * 1000).toLocaleDateString('pt-BR')
  }
  return new Date(data).toLocaleDateString('pt-BR')
}

const abrirModalMedalha = (medalha: Medalha) => {
  medalhaSelecionada.value = medalha
  modalAberto.value = true
}

const fecharModalMedalha = () => {
  modalAberto.value = false
  medalhaCompartilhar.value = null
}

onMounted(() => {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  
  if (authStore.user.role !== 'aluno') {
    router.push('/admin')
    return
  }
  
  fetchAlunoEMedalhas()
  // Configurar listener em tempo real para as medalhas do aluno
  if (authStore.user?.id) {
    const medalhasRef = collection(db, 'alunos_medalhas')
    const q = query(medalhasRef, where('aluno_id', '==', authStore.user.id))
    
    unsubscribeMedalhas = onSnapshot(q, async (snapshot) => {
      const medalhasPromises = snapshot.docs.map(async (docSnapshot) => {
        const vinculo = docSnapshot.data()
        const medalhaRef = doc(db, 'medalhas', vinculo.medalha_id)
        const medalhaSnap = await getDoc(medalhaRef)
        
        if (!medalhaSnap.exists()) return null
        
        const medalhaData = medalhaSnap.data() as DocumentData
        return {
          id: docSnapshot.id,
          nome: medalhaData.nome as string,
          descricao: medalhaData.descricao as string,
          criterios: medalhaData.criterios as string,
          imagem_url: medalhaData.imagem_url as string,
          data_conquista: vinculo.data_conquista
        } as Medalha
      })
      
      const medalhasResult = await Promise.all(medalhasPromises)
      medalhas.value = medalhasResult.filter((m): m is Medalha => m !== null)
    })
  }
})

onUnmounted(() => {
  // Limpar listener quando o componente for desmontado
  if (unsubscribeMedalhas) {
    unsubscribeMedalhas()
  }
})
</script> 