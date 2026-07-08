import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUser, logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { UserAccount } from '../database/schema';
import { subscriptionService } from '../services/subscriptionService';
import { sessionService } from '../services/sessionService';

export type { UserAccount as User };

interface AuthContextType {
  user: UserAccount | null;
  isLoading: boolean;
  signIn: (user: UserAccount) => Promise<void>;
  signUp: (user: UserAccount) => Promise<void>;
  signOut: (navigation?: any) => Promise<void>;
  updateProfile: (updatedData: Partial<UserAccount>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [sessionCheckInterval, setSessionCheckInterval] = useState<any>(null);

  useEffect(() => {
    // Sync session service with Redux state on mount
    if (user) {
      if (!sessionService.isAuthenticated()) {
        sessionService.initSession(user);
      }
    }
  }, [user]);

  // Session Monitoring
  useEffect(() => {
    if (user) {
      // Start checking session validity
      const interval = setInterval(() => {
        if (!sessionService.isSessionValid()) {
          console.log('Auto-logout triggered due to inactivity');
          signOut();
        }
      }, 60 * 1000); // Check every minute
      setSessionCheckInterval(interval);
    } else {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        setSessionCheckInterval(null);
      }
    }
    return () => {
      if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    };
  }, [user]);

  const signIn = async (loggedInUser: UserAccount) => {
    dispatch(setUser(loggedInUser));
    await subscriptionService.initializeSubscription(loggedInUser.id);
    await sessionService.initSession(loggedInUser);
  };

  const signUp = async (registeredUser: UserAccount) => {
    dispatch(setUser(registeredUser));
    await subscriptionService.initializeSubscription(registeredUser.id);
    await sessionService.initSession(registeredUser);
  };

  const signOut = async (navigation?: any) => {
    try {
      await authService.logout();
      sessionService.clearSession();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      dispatch(logout());
      if (navigation) {
        navigation.replace('Login');
      }
      // Note: If called from auto-logout (no navigation param),
      // the AppNavigator should ideally react to user being null and switch stacks,
      // or we rely on the Redux state change to trigger re-render of navigation.
    }
  };

  const updateProfile = async (updatedData: Partial<UserAccount>) => {
    try {
      const updatedUser = await authService.updateUser(updatedData);
      dispatch(setUser(updatedUser));
      sessionService.refreshSession(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
