// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogpulse-c6b4b.firebaseapp.com",
  projectId: "blogpulse-c6b4b",
  storageBucket: "blogpulse-c6b4b.appspot.com",
  messagingSenderId: "293813127314",
  appId: "1:293813127314:web:221852c8e2a8761fa0fe4b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
