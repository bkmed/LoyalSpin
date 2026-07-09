import { initializeApp, getApps, getApp } from 'firebase/app';
import { Platform } from 'react-native';

// REPLACE WITH YOUR FIREBASE CONFIG
// You can find these in your Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyDsj-Kb7vRAZD-TcjxuT6mM1tlWIuNNGhE",
  authDomain: "loyalspin-8988d.firebaseapp.com",
  projectId: "loyalspin-8988d",
  storageBucket: "loyalspin-8988d.firebasestorage.app",
  messagingSenderId: "1020479456298",
  appId: "1:1020479456298:web:b592bf8a05c8d918376f53",
  measurementId: "G-VYDMF71TSM"
};

let app: any;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  console.log('Firebase JS App initialized');
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export { app };
