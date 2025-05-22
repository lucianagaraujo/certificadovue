import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Medalha, AlunoMedalha } from '@/types';

// Funções para usuários
export const getUsers = async (role?: string): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  let q = query(usersRef);
  
  if (role) {
    q = query(usersRef, where('role', '==', role));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as User));
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const usersRef = collection(db, 'users');
  const docRef = await addDoc(usersRef, {
    ...userData,
    created_at: new Date()
  });
  
  return {
    id: docRef.id,
    ...userData
  };
};

// Funções para medalhas
export const getMedalhas = async (): Promise<Medalha[]> => {
  const medalhasRef = collection(db, 'medalhas');
  const q = query(medalhasRef, orderBy('nome'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medalha));
};

export const createMedalha = async (medalhaData: Omit<Medalha, 'id'>): Promise<Medalha> => {
  const medalhasRef = collection(db, 'medalhas');
  const docRef = await addDoc(medalhasRef, {
    ...medalhaData,
    created_at: new Date()
  });
  
  return {
    id: docRef.id,
    ...medalhaData
  };
};

export const deleteMedalha = async (id: string): Promise<void> => {
  const medalhaRef = doc(db, 'medalhas', id);
  await deleteDoc(medalhaRef);
};

// Funções para alunos_medalhas
export const vincularMedalhaAluno = async (alunoId: string, medalhaId: string): Promise<AlunoMedalha> => {
  const alunosMedalhasRef = collection(db, 'alunos_medalhas');
  const docRef = await addDoc(alunosMedalhasRef, {
    aluno_id: alunoId,
    medalha_id: medalhaId,
    data_vincular: new Date()
  });
  
  return {
    id: docRef.id,
    aluno_id: alunoId,
    medalha_id: medalhaId,
    data_vincular: new Date()
  };
};

export const getMedalhasAluno = async (alunoId: string): Promise<Medalha[]> => {
  const alunosMedalhasRef = collection(db, 'alunos_medalhas');
  const q = query(alunosMedalhasRef, where('aluno_id', '==', alunoId));
  const querySnapshot = await getDocs(q);
  
  const medalhas: Medalha[] = [];
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    const medalhaRef = doc(db, 'medalhas', data.medalha_id);
    const medalhaDoc = await getDoc(medalhaRef);
    
    if (medalhaDoc.exists()) {
      medalhas.push({
        id: medalhaDoc.id,
        ...medalhaDoc.data()
      } as Medalha);
    }
  }
  
  return medalhas;
};

// Função para importar vários alunos em lote
export const importarAlunos = async (alunos: Omit<User, 'id'>[]): Promise<void> => {
  const usersRef = collection(db, 'users');
  for (const aluno of alunos) {
    await addDoc(usersRef, {
      ...aluno,
      created_at: new Date()
    });
  }
};

// Função para buscar conquistas do aluno, trazendo os dados completos da medalha
export const getConquistasAluno = async (alunoId: string) => {
  const conquistasRef = collection(db, 'alunos_medalhas');
  const q = query(conquistasRef, where('aluno_id', '==', alunoId));
  const querySnapshot = await getDocs(q);
  const conquistas = [];
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const medalhaRef = doc(db, 'medalhas', data.medalha_id);
    const medalhaDoc = await getDoc(medalhaRef);
    if (medalhaDoc.exists()) {
      conquistas.push({
        id: docSnap.id,
        ...medalhaDoc.data(),
        data_conquista: data.data_vincular
      });
    }
  }
  return conquistas;
}; 