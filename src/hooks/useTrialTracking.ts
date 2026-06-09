import { useEffect } from 'react';
import { useSubscriptionGuard } from '../context/SubscriptionGuardContext';

/**
 * Hook to track and increment trial usage when dashboard is accessed
 * Should be called whenever the dashboard/main screen is accessed
 */
export const useDashboardTrialTracking = () => {
  const {
    isTrialActive,
    isTrialExpired,
    incrementTrialUsage,
    checkSubscriptionStatus,
  } = useSubscriptionGuard();

  // Increment trial on mount (dashboard access)
  useEffect(() => {
    const trackDashboardAccess = async () => {
      if (isTrialActive && !isTrialExpired) {
        await incrementTrialUsage();
      }
    };

    trackDashboardAccess();
  }, [isTrialActive, isTrialExpired, incrementTrialUsage]);

  // Periodic check for subscription status (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      checkSubscriptionStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSubscriptionStatus]);

  return {
    isTrialActive,
    isTrialExpired,
  };
};

/**
 * Hook to check if user should be redirected to trial expired screen
 */
export const useTrialExpirationCheck = () => {
  const { isTrialExpired, subscription } = useSubscriptionGuard();

  return {
    shouldShowExpiredScreen:
      isTrialExpired && subscription?.status === 'expired',
    subscription,
  };
};
