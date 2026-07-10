import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';

const placeholderFirebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDsj-Kb7vRAZD-TcjxuT6mM1tlWIuNNGhE',
  authDomain: 'loyalspin-8988d.firebaseapp.com',
  projectId: 'loyalspin-8988d',
  storageBucket: 'loyalspin-8988d.firebasestorage.app',
  messagingSenderId: '1020479456298',
  appId: '1:1020479456298:web:b592bf8a05c8d918376f53',
  measurementId: 'G-VYDMF71TSM',
};

const requiredConfigFields: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const isFirebaseConfig = (value: unknown): value is FirebaseOptions => {
  return (
    typeof value === 'object' &&
    value !== null &&
    requiredConfigFields.every((field) => typeof (value as any)[field] === 'string' && (value as any)[field].length > 0)
  );
};

const loadLocalFirebaseConfig = (): FirebaseOptions | undefined => {
  try {
    // Local override file is optional and should not be checked into source control.
    // The require call is wrapped in eval so bundlers do not resolve it statically.
    // eslint-disable-next-line no-eval
    const localRequire = eval('require') as any;
    const localConfig = localRequire('./firebase.local');
    const config = localConfig?.default || localConfig;
    if (isFirebaseConfig(config)) {
      return config;
    }
    console.warn(
      'src/config/firebase.local.ts exists but does not export a valid Firebase configuration object.',
    );
  } catch {
    // local override not present or not usable
  }
  return undefined;
};

const loadEnvFirebaseConfig = (): FirebaseOptions | undefined => {
  const envConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  } as Partial<FirebaseOptions>;

  if (isFirebaseConfig(envConfig)) {
    return envConfig as FirebaseOptions;
  }
  return undefined;
};

const firebaseConfig =
  loadEnvFirebaseConfig() || loadLocalFirebaseConfig() || placeholderFirebaseConfig;

const invalidFields = requiredConfigFields.filter(
  (field) => !firebaseConfig[field] || typeof firebaseConfig[field] !== 'string',
);

if (firebaseConfig === placeholderFirebaseConfig) {
  console.warn(
    'Firebase is using the built-in placeholder configuration. Copy src/config/firebase.local.example.ts to src/config/firebase.local.ts or set FIREBASE_* environment variables with your Firebase project values.',
  );
}

if (invalidFields.length > 0) {
  console.error(
    `Firebase configuration is missing required fields: ${invalidFields.join(', ')}. ` +
      'Set FIREBASE_* environment variables or create src/config/firebase.local.ts with your Firebase web app settings.',
  );
}

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

