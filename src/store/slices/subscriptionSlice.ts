import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Plan,
  Subscription,
  SubscriptionStatus,
} from '../../../src/models/subscription';

interface SubscriptionState {
  availablePlans: Plan[];
  currentSubscription?: Subscription | null;
}

const initialState: SubscriptionState = {
  availablePlans: [
    {
      id: 'starter',
      name: 'Starter',
      duration: 'monthly',
      price: 9.99,
      currency: 'EUR',
      features: [
        '1 establishment',
        '500 clients',
        'Roulette',
        'Coupons',
        'Notifications',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      duration: 'monthly',
      price: 29.99,
      currency: 'EUR',
      features: [
        '3 establishments',
        'Unlimited clients',
        'Advanced analytics',
        'Branding',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      duration: 'annual',
      price: 299.0,
      currency: 'EUR',
      features: [
        'Unlimited establishments',
        'Priority support',
        'Multi-admin',
        'API',
      ],
    },
  ],
  currentSubscription: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setAvailablePlans(state, action: PayloadAction<Plan[]>) {
      state.availablePlans = action.payload;
    },
    startTrial(
      state,
      action: PayloadAction<{
        planId: string;
        startDate: string;
        endDate: string;
      }>,
    ) {
      const { planId, startDate, endDate } = action.payload;
      state.currentSubscription = {
        id: `sub_trial_${Date.now()}`,
        planId,
        status: 'trial' as SubscriptionStatus,
        startDate,
        endDate,
      };
    },
    activateSubscription(
      state,
      action: PayloadAction<{ subscription: Subscription }>,
    ) {
      state.currentSubscription = action.payload.subscription;
    },
    setSubscriptionStatus(
      state,
      action: PayloadAction<{ status: SubscriptionStatus }>,
    ) {
      if (state.currentSubscription)
        state.currentSubscription.status = action.payload.status;
    },
    cancelSubscription(state) {
      if (state.currentSubscription)
        state.currentSubscription.status = 'cancelled';
    },
    clearSubscription(state) {
      state.currentSubscription = null;
    },
  },
});

export const {
  setAvailablePlans,
  startTrial,
  activateSubscription,
  setSubscriptionStatus,
  cancelSubscription,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
