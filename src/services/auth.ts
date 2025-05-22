import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { getUsers } from './database';
import type { User } from '@/types';

interface AuthResponse {
  user: (User & FirebaseUser) | null;
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
      user: {
        ...firebaseUser,
        ...userData
      },
      error: null
    };
  } catch (error) {
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