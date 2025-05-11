import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIH96gXRUf4IDaKNmduz-GyURkCWgq2UM",
  authDomain: "dsdsdsf-b8dac.firebaseapp.com",
  projectId: "dsdsdsf-b8dac",
  storageBucket: "dsdsdsf-b8dac.firebasestorage.app",
  messagingSenderId: "539429035601",
  appId: "1:539429035601:web:2e1662d79cfc2eb6a0a270"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
