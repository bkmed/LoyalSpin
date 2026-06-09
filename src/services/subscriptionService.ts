import { storageService } from './storage';
import { Subscription, Plan, SubscriptionStatus } from '../models/subscription';

const SUBSCRIPTION_KEY = 'subscription_data';

export const subscriptionService = {
  /**
   * Create or get existing subscription for user
   */
  initializeSubscription: async (userId: string, establishmentId?: string): Promise<Subscription> => {
    const existing = await subscriptionService.getSubscription();
    
    if (existing) {
      return existing;
    }

    // Create new trial subscription
    const trial: Subscription = {
      id: `sub_trial_${Date.now()}`,
      userId,
      establishmentId,
      planId: 'trial',
      status: 'trial',
      trialLimit: 15,
      trialUsed: 0,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.setString(SUBSCRIPTION_KEY, JSON.stringify(trial));
    return trial;
  },

  /**
   * Get current subscription from storage
   */
  getSubscription: async (): Promise<Subscription | null> => {
    const json = storageService.getString(SUBSCRIPTION_KEY);
    if (!json) return null;
    
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  },

  /**
   * Increment trial usage counter on dashboard access
   */
  incrementTrialUsage: async (): Promise<Subscription | null> => {
    const subscription = await subscriptionService.getSubscription();
    if (!subscription || subscription.status !== 'trial') {
      return subscription;
    }

    const current = subscription.trialUsed || 0;
    const limit = subscription.trialLimit || 15;

    if (current < limit) {
      subscription.trialUsed = current + 1;
      subscription.updatedAt = new Date().toISOString();

      // Check if trial is now expired
      if (subscription.trialUsed >= limit) {
        subscription.status = 'expired';
        subscription.endDate = new Date().toISOString();
      }

      storageService.setString(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    }

    return subscription;
  },

  /**
   * Update subscription status
   */
  updateSubscriptionStatus: async (status: SubscriptionStatus): Promise<Subscription | null> => {
    const subscription = await subscriptionService.getSubscription();
    if (!subscription) return null;

    subscription.status = status;
    subscription.updatedAt = new Date().toISOString();

    if (status === 'active' || status === 'pending') {
      subscription.startDate = subscription.startDate || new Date().toISOString();
      subscription.endDate = undefined; // Remove trial end date
    }

    if (status === 'expired' || status === 'suspended' || status === 'cancelled') {
      subscription.endDate = new Date().toISOString();
    }

    storageService.setString(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    return subscription;
  },

  /**
   * Check if subscription is in trial and not expired
   */
  isTrialActive: async (): Promise<boolean> => {
    const subscription = await subscriptionService.getSubscription();
    if (!subscription) return false;
    return subscription.status === 'trial';
  },

  /**
   * Check if subscription trial is expired
   */
  isTrialExpired: async (): Promise<boolean> => {
    const subscription = await subscriptionService.getSubscription();
    if (!subscription) return false;
    return subscription.status === 'expired';
  },

  /**
   * Get remaining trial uses
   */
  getRemainingTrialUses: async (): Promise<number> => {
    const subscription = await subscriptionService.getSubscription();
    if (!subscription || subscription.status !== 'trial') {
      return 0;
    }

    const used = subscription.trialUsed || 0;
    const limit = subscription.trialLimit || 15;
    return Math.max(0, limit - used);
  },

  /**
   * Activate subscription (move from trial to paid plan)
   */
  activateSubscription: async (planId: string): Promise<Subscription> => {
    const subscription = await subscriptionService.getSubscription();

    const active: Subscription = {
      id: subscription?.id || `sub_active_${Date.now()}`,
      userId: subscription?.userId,
      establishmentId: subscription?.establishmentId,
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      createdAt: subscription?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.setString(SUBSCRIPTION_KEY, JSON.stringify(active));
    return active;
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (): Promise<Subscription | null> => {
    const subscription = await subscriptionService.getSubscription();
    if (!subscription) return null;

    subscription.status = 'cancelled';
    subscription.endDate = new Date().toISOString();
    subscription.updatedAt = new Date().toISOString();

    storageService.setString(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    return subscription;
  },

  /**
   * Clear subscription data (e.g., on logout)
   */
  clearSubscription: async (): Promise<void> => {
    storageService.delete(SUBSCRIPTION_KEY);
  },
};
