import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscriptionService } from '../services/subscriptionService';
import { 
  incrementTrialUsed, 
  setSubscription 
} from '../store/slices/subscriptionSlice';
import { Subscription, SubscriptionStatus } from '../models/subscription';
import { RootState } from '../store';

interface SubscriptionGuardContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  remainingTrialUses: number;
  checkSubscriptionStatus: () => Promise<void>;
  initializeTrial: (userId: string, establishmentId?: string) => Promise<void>;
  incrementTrialUsage: () => Promise<void>;
  updateSubscriptionStatus: (status: SubscriptionStatus) => Promise<void>;
  activateSubscription: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionGuardContext = createContext<SubscriptionGuardContextType | undefined>(undefined);

export const SubscriptionGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const subscription = useSelector((state: RootState) => state.subscription.currentSubscription);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [remainingTrialUses, setRemainingTrialUses] = useState(15);

  // Check subscription status on mount and when subscription changes
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      let sub = await subscriptionService.getSubscription();

      if (!sub && authUser?.id) {
        sub = await subscriptionService.initializeSubscription(authUser.id);
      }

      if (sub) {
        dispatch(setSubscription(sub));
        setIsTrialActive(sub.status === 'trial');
        setIsTrialExpired(sub.status === 'expired');
        
        const remaining = await subscriptionService.getRemainingTrialUses();
        setRemainingTrialUses(remaining);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id, dispatch]);

  // Initialize trial for new user
  const initializeTrial = useCallback(async (userId: string, establishmentId?: string) => {
    try {
      setIsLoading(true);
      const sub = await subscriptionService.initializeSubscription(userId, establishmentId);
      dispatch(setSubscription(sub));
      setIsTrialActive(true);
      setIsTrialExpired(false);
      setRemainingTrialUses(sub.trialLimit || 15);
    } catch (error) {
      console.error('Error initializing trial:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Increment trial usage
  const incrementTrialUsage = useCallback(async () => {
    try {
      const sub = await subscriptionService.incrementTrialUsage();
      
      if (sub) {
        dispatch(incrementTrialUsed());
        setIsTrialActive(sub.status === 'trial');
        setIsTrialExpired(sub.status === 'expired');
        
        const remaining = await subscriptionService.getRemainingTrialUses();
        setRemainingTrialUses(remaining);
      }
    } catch (error) {
      console.error('Error incrementing trial usage:', error);
    }
  }, [dispatch]);

  // Update subscription status
  const updateSubscriptionStatus = useCallback(async (status: SubscriptionStatus) => {
    try {
      setIsLoading(true);
      const sub = await subscriptionService.updateSubscriptionStatus(status);
      
      if (sub) {
        dispatch(setSubscription(sub));
        setIsTrialActive(sub.status === 'trial');
        setIsTrialExpired(sub.status === 'expired');
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Activate subscription
  const activateSubscription = useCallback(async (planId: string) => {
    try {
      setIsLoading(true);
      const sub = await subscriptionService.activateSubscription(planId);
      dispatch(setSubscription(sub));
      setIsTrialActive(false);
      setIsTrialExpired(false);
    } catch (error) {
      console.error('Error activating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      const sub = await subscriptionService.cancelSubscription();
      
      if (sub) {
        dispatch(setSubscription(sub));
        setIsTrialActive(false);
        setIsTrialExpired(false);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Check status on mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const value: SubscriptionGuardContextType = {
    subscription,
    isLoading,
    isTrialActive,
    isTrialExpired,
    remainingTrialUses,
    checkSubscriptionStatus,
    initializeTrial,
    incrementTrialUsage,
    updateSubscriptionStatus,
    activateSubscription,
    cancelSubscription,
  };

  return (
    <SubscriptionGuardContext.Provider value={value}>
      {children}
    </SubscriptionGuardContext.Provider>
  );
};

export const useSubscriptionGuard = (): SubscriptionGuardContextType => {
  const context = useContext(SubscriptionGuardContext);
  if (context === undefined) {
    throw new Error('useSubscriptionGuard must be used within SubscriptionGuardProvider');
  }
  return context;
};
