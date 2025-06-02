import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as firebaseCreateUser,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { getUsers } from './database';
import type { User } from '@/types';

interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Buscar dados adicionais do usuário no Firestore
    const users = await getUsers();
    const userData = users.find(u => u.email === email);
    
    if (!userData) {
      throw new Error('Usuário não encontrado no banco de dados');
    }
    
    return {
      user: userData,
      error: null
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      user: null,
      error: error as Error
    };
  }
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string): Promise<{ user: FirebaseUser | null; error: Error | null }> => {
  try {
    const userCredential = await firebaseCreateUser(auth, email, password);
    return {
      user: userCredential.user,
      error: null
    };
  } catch (error) {
    return {
      user: null,
      error: error as Error
    };
  }
}; 