import type { FirebaseOptions } from 'firebase/app';

// Copy this file to src/config/firebase.local.ts and fill in your own Firebase values.
// Do not commit src/config/firebase.local.ts to the repository.

const firebaseConfig: FirebaseOptions = {
  apiKey: '<YOUR_FIREBASE_API_KEY>',
  authDomain: '<YOUR_PROJECT>.firebaseapp.com',
  projectId: '<YOUR_PROJECT_ID>',
  storageBucket: '<YOUR_PROJECT>.appspot.com',
  messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
  appId: '<YOUR_APP_ID>',
  measurementId: '<YOUR_MEASUREMENT_ID>',
};

export default firebaseConfig;
