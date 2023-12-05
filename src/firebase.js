// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYKmfQhE1yITMYGlk8CEuqAwGyaZZFTWs",
  authDomain: "master-scheduler-cbe64.firebaseapp.com",
  projectId: "master-scheduler-cbe64",
  storageBucket: "master-scheduler-cbe64.appspot.com",
  messagingSenderId: "622291728396",
  appId: "1:622291728396:web:8fb7b0a961b9e01e671629",
  measurementId: "G-SEGL7BQCX6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore
export { db };
