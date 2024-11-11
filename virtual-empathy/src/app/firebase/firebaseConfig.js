// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4VuGdMzoH09Xq8cfY3ddAjlX86oG30-w",
  authDomain: "virtualempathy-337c8.firebaseapp.com",
  projectId: "virtualempathy-337c8",
  storageBucket: "virtualempathy-337c8.firebasestorage.app",
  messagingSenderId: "91124783114",
  appId: "1:91124783114:web:39bed7f648e652b497a7f3",
  measurementId: "G-G8W522KNQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);