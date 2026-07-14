import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0315164606",
  appId: "1:508765983564:web:6688854c0c7c8b455035e9",
  apiKey: "AIzaSyBrHrVfjR6JruAksidMcm2J4Jc5msJ5yno",
  authDomain: "gen-lang-client-0315164606.firebaseapp.com",
  storageBucket: "gen-lang-client-0315164606.firebasestorage.app",
  messagingSenderId: "508765983564",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
