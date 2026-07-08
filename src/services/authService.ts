import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import type { UserAccount, Role } from '../database/schema';

export const ROLES: Role[] = ['admin', 'user', 'anonyme', 'super-admin'];
export type UserRole = Role;

export const authService = {
  async login(email: string, password: string): Promise<UserAccount> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return this.getUserData(userCredential.user.uid);
  },

  async register(name: string, email: string, password: string, role: Role = 'user', projectId?: string): Promise<UserAccount> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);

    const newUser: UserAccount = {
      id: user.uid,
      name,
      email,
      role,
      projectId,
      status: 'active',
      authProvider: 'email',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), newUser);
    return newUser;
  },

  async loginWithGoogle(): Promise<UserAccount> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return this.handleSocialLogin(result.user, 'google');
  },

  async loginWithFacebook(): Promise<UserAccount> {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return this.handleSocialLogin(result.user, 'facebook');
  },

  async loginWithApple(): Promise<UserAccount> {
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    return this.handleSocialLogin(result.user, 'apple');
  },

  async handleSocialLogin(user: FirebaseUser, provider: 'google' | 'facebook' | 'apple' | 'tiktok'): Promise<UserAccount> {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserAccount;
    } else {
      const newUser: UserAccount = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        role: 'user',
        status: 'active',
        authProvider: provider,
        emailVerified: user.emailVerified,
        avatarUri: user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), newUser);
      return newUser;
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async getCurrentUser(): Promise<UserAccount | null> {
    const user = auth.currentUser;
    if (user) {
      return this.getUserData(user.uid);
    }
    return null;
  },

  async getUserData(uid: string): Promise<UserAccount> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserAccount;
    }
    throw new Error('User not found in database');
  },

  async updateUser(data: Partial<UserAccount>): Promise<UserAccount> {
    if (!data.id) throw new Error('User ID required for update');
    const docRef = doc(db, 'users', data.id);
    await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    return this.getUserData(data.id);
  }
};
