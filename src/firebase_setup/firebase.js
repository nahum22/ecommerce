// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Correct import for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCGclymkZWOaAwLf6_WoFwGe3lW-CbHyw",
  authDomain: "ecommerce-9b39f.firebaseapp.com",
  projectId: "ecommerce-9b39f",
  storageBucket: "ecommerce-9b39f.appspot.com",
  messagingSenderId: "498730616349",
  appId: "1:498730616349:web:6b16fac086b9656026a8f4",
  measurementId: "G-LXLK7S3V6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Use getFirestore to initialize Firestore
const analytics = getAnalytics(app);

export { db }; // Export the Firestore instance
