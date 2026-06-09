# Trial & Subscription Management System - Implementation Guide

## Overview

This system enables free trial management and subscription tracking for LoyalSpin across Android, iOS, and Web with a single codebase.

## Architecture

### Components

1. **Subscription Model** (`src/models/subscription.ts`)
   - Defines `Subscription` interface with trial tracking fields
   - Trial fields: `trialLimit`, `trialUsed`, `status`

2. **Subscription Service** (`src/services/subscriptionService.ts`)
   - Handles all subscription state operations
   - Uses MMKV storage for persistence
   - Key methods:
     - `initializeSubscription()` - Create trial on first login
     - `incrementTrialUsage()` - Track dashboard access
     - `getSubscription()` - Retrieve current subscription
     - `isTrialExpired()` - Check expiration status
     - `activateSubscription()` - Upgrade to paid plan

3. **Redux Store** (`src/store/slices/subscriptionSlice.ts`)
   - State management for subscription data
   - Actions: `initializeTrial`, `incrementTrialUsed`, `setSubscription`
   - Automatic expiration handling on increment

4. **SubscriptionGuard Context** (`src/context/SubscriptionGuardContext.tsx`)
   - Centralized context for subscription state
   - Provides hooks and state to all components
   - Auto-syncs with Redux and storage service
   - Export: `useSubscriptionGuard()`

5. **Trial Banner Component** (`src/components/TrialBanner.tsx`)
   - Visual indicator of active trial
   - Shows remaining uses
   - "Choose Plan" button
   - Auto-hides when trial is not active

6. **SubscriptionExpiredScreen** (`src/features/subscription/screens/SubscriptionExpiredScreen.tsx`)
   - Full-screen UI for expired trials
   - Displays all three plans with features
   - Call-to-action buttons for plan selection
   - Support contact option

7. **Trial Tracking Hooks** (`src/hooks/useTrialTracking.ts`)
   - `useDashboardTrialTracking()` - Auto-increment on dashboard access
   - `useTrialExpirationCheck()` - Check if redirect needed

## Data Flow

```
User Login
  ↓
Auth Service checks for existing subscription
  ↓
If none exists → Create trial (15 uses, status="trial")
  ↓
Trial subscription stored in MMKV + Redux
  ↓
On Dashboard access → Increment trialUsed
  ↓
If trialUsed >= trialLimit → status="expired", auto-logout
  ↓
Redirect to SubscriptionExpiredScreen
  ↓
User selects plan → Activate subscription (status="active")
```

## Integration Steps

### 1. Wrap App with SubscriptionGuardProvider

In your main App.tsx or root component:

```tsx
import { SubscriptionGuardProvider } from './src/context/SubscriptionGuardContext';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SubscriptionGuardProvider>
          {/* Your app content */}
        </SubscriptionGuardProvider>
      </PersistGate>
    </Provider>
  );
}
```

### 2. Add Trial Banner to Dashboard

In your Dashboard component (AdminDashboard, UserDashboard, etc.):

```tsx
import { TrialBanner } from '../components/TrialBanner';

export const AdminDashboard = () => {
  const handleChoosePlan = () => {
    // Navigate to subscription screen
    navigation.navigate('Subscription.PlanSelection');
  };

  return (
    <View>
      <TrialBanner onChoosePlan={handleChoosePlan} />
      {/* Rest of dashboard content */}
    </View>
  );
};
```

### 3. Track Dashboard Access

In your main dashboard/home screen:

```tsx
import { useDashboardTrialTracking, useTrialExpirationCheck } from '../hooks/useTrialTracking';

export const DashboardScreen = () => {
  const { isTrialExpired } = useDashboardTrialTracking();
  const { shouldShowExpiredScreen } = useTrialExpirationCheck();

  // Redirect if trial expired
  useEffect(() => {
    if (shouldShowExpiredScreen) {
      navigation.navigate('Subscription.Expired');
    }
  }, [shouldShowExpiredScreen]);

  if (isTrialExpired) {
    return null; // Will redirect above
  }

  return (
    // Your dashboard UI
  );
};
```

### 4. Handle Plan Selection

```tsx
import { useSubscriptionGuard } from '../context/SubscriptionGuardContext';

export const ChoosePlanScreen = () => {
  const { activateSubscription } = useSubscriptionGuard();

  const handleSelectPlan = async (planId: string) => {
    try {
      await activateSubscription(planId);
      // Navigate to payment or success
      navigation.navigate('Subscription.Payment', { planId });
    } catch (error) {
      console.error('Failed to activate subscription:', error);
    }
  };

  return (
    <TouchableOpacity onPress={() => handleSelectPlan('business')}>
      <Text>Choose Business Plan</Text>
    </TouchableOpacity>
  );
};
```

## Usage Examples

### Check Trial Status

```tsx
const { useSubscriptionGuard } = require('./src/context/SubscriptionGuardContext');

function MyComponent() {
  const { isTrialActive, remainingTrialUses, subscription } = useSubscriptionGuard();

  return (
    <View>
      {isTrialActive && (
        <Text>Trial active: {remainingTrialUses} uses left</Text>
      )}
      {subscription?.status === 'active' && (
        <Text>Active subscription: {subscription.planId}</Text>
      )}
    </View>
  );
}
```

### Manual Subscription Operations

```tsx
const { updateSubscriptionStatus, cancelSubscription } = useSubscriptionGuard();

// Change subscription status
await updateSubscriptionStatus('suspended');

// Cancel subscription
await cancelSubscription();
```

### Service-Level Operations

```tsx
import { subscriptionService } from './src/services/subscriptionService';

// Get subscription
const sub = await subscriptionService.getSubscription();

// Check if expired
const isExpired = await subscriptionService.isTrialExpired();

// Get remaining uses
const remaining = await subscriptionService.getRemainingTrialUses();
```

## Trial Parameters

**Default Configuration:**
- `trialLimit`: 15 (dashboard accesses)
- `trialUsed`: 0 (incremented per dashboard visit)
- `status`: "trial" (automatically set on creation)
- Auto-expiration: When `trialUsed >= trialLimit`

To modify trial limit, edit `subscriptionService.ts`:
```ts
const trial: Subscription = {
  trialLimit: 30, // Change this value
  // ... rest of properties
};
```

## Subscription Statuses

- **trial** - Active free trial period
- **active** - Paid subscription is active
- **pending** - Subscription pending activation/payment
- **expired** - Trial or subscription has ended
- **cancelled** - User cancelled subscription
- **suspended** - Subscription temporarily suspended

## Translation Keys

All user-facing strings use i18n keys. Add these to your locale files:

```json
{
  "subscription": {
    "trialBanner": {
      "title": "Trial active",
      "message": "{{remaining}} uses remaining"
    },
    "trialExpired": {
      "title": "Trial ended",
      "subtitle": "Choose a plan..."
    },
    "choosePlan": "Choose plan",
    "subscribe": "Subscribe",
    "plans": {
      "starter": { "name": "Starter", ... },
      "business": { "name": "Business", ... },
      "enterprise": { "name": "Enterprise", ... }
    }
  }
}
```

## Storage & Persistence

- **Storage**: MMKV (native) / localStorage (web)
- **Storage Key**: `subscription_data`
- **Redux**: `subscription` slice (persisted via redux-persist)
- **Automatic Sync**: SubscriptionGuard keeps all three in sync

## Logout Behavior

On logout, subscription data is automatically cleared:
```ts
await authService.logout(); // Clears subscription
```

To restore on login, it's automatically re-initialized:
```ts
await authService.login(email, password); // Re-initializes subscription
```

## Testing Trial Flow

```ts
// 1. Login (auto-initializes trial)
await authService.login('admin@demo.com', 'admin123');

// 2. Access dashboard 15 times to expire trial
for (let i = 0; i < 15; i++) {
  await subscriptionService.incrementTrialUsage();
}

// 3. Check if expired
const isExpired = await subscriptionService.isTrialExpired();
// Returns: true

// 4. Activate subscription to restore access
await subscriptionService.activateSubscription('business');

// 5. Verify active subscription
const sub = await subscriptionService.getSubscription();
// Returns: { status: 'active', planId: 'business', ... }
```

## Troubleshooting

### Trial not initializing on login
- Check if SubscriptionGuardProvider is wrapped around app
- Verify authService imports subscriptionService
- Check MMKV storage is accessible

### Trial not incrementing
- Ensure useDashboardTrialTracking() is called in dashboard screen
- Check that incrementTrialUsage() is being called
- Verify useEffect dependencies

### Expired screen not showing
- Verify navigation is configured for 'Subscription.Expired' route
- Check useTrialExpirationCheck() logic in dashboard
- Ensure navigation.navigate() is called correctly

### Translations missing
- Add keys to all locale files (fr.json, en.json, ar.json, etc.)
- Use consistent key structure: `subscription.xxx.yyy`
- Verify i18n is initialized before component mount

## Security Considerations

- Trial counter is stored locally (client-side)
- For production: Validate trial status on backend
- Implement server-side trial expiration checks
- Add payment verification before allowing "active" status
- Log all subscription changes for audit trail

## Next Steps

1. ✅ Integrate SubscriptionGuardProvider in root component
2. ✅ Add TrialBanner to each dashboard screen
3. ✅ Implement trial tracking hooks in main screens
4. ✅ Connect plan selection UI to `activateSubscription()`
5. ✅ Setup payment integration for plan activation
6. ✅ Add backend validation for subscription status
7. ✅ Test across Android, iOS, and Web
