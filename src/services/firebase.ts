import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Suas configurações do Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyBt8F0RrYzzjeh1j292NpBZxQ9KizredDY",
  authDomain: "portal-a8f73.firebaseapp.com",
  projectId: "portal-a8f73",
  storageBucket: "portal-a8f73.firebasestorage.app",
  messagingSenderId: "612707612493",
  appId: "1:612707612493:web:cd9bfee84701c9cb506904",
  measurementId: "G-P1LXC4GL1K"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 