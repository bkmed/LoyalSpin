import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { Platform } from 'react-native';
import { app } from '../config/firebase';

const auth = getAuth(app);

// Enable Firestore offline persistence on web so cached data is
// served when the client is temporarily offline (avoids startup errors).
let db: ReturnType<typeof getFirestore>;
try {
  if (Platform.OS === 'web') {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } else {
    db = getFirestore(app);
  }
} catch {
  // initializeFirestore throws if already initialised (e.g. HMR)
  db = getFirestore(app);
}

export { app, auth, db };
