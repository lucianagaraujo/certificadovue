import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebase';

// Função para fazer upload de imagem
export const uploadImage = async (
  file: File, 
  path: string
): Promise<string> => {
  try {
    // Cria uma referência única para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    // Faz o upload do arquivo
    await uploadBytes(storageRef, file);

    // Retorna a URL de download
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
};

// Função para deletar uma imagem
export const deleteImage = async (url: string): Promise<void> => {
  try {
    // Extrai o caminho do arquivo da URL
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error('Falha ao deletar imagem');
  }
};

// Função para atualizar uma imagem (deleta a antiga e faz upload da nova)
export const updateImage = async (
  oldUrl: string | undefined,
  newFile: File,
  path: string
): Promise<string> => {
  try {
    // Se existir uma imagem antiga, deleta ela
    if (oldUrl) {
      await deleteImage(oldUrl);
    }

    // Faz upload da nova imagem
    const newUrl = await uploadImage(newFile, path);
    return newUrl;
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    throw new Error('Falha ao atualizar imagem');
  }
}; 