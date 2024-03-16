// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEsUd7wGZv3ZNQZz6sftsgIWrmzRJPvDw",
  authDomain: "lineup-queue-management.firebaseapp.com",
  projectId: "lineup-queue-management",
  storageBucket: "lineup-queue-management.appspot.com",
  messagingSenderId: "306608268560",
  appId: "1:306608268560:web:f315935c2ecb23de4af195",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

export { db };

export default app;
