/**
 * INTEGRATION EXAMPLE - AdminDashboard with Trial System
 * 
 * This file shows how to integrate the trial and subscription system
 * into the existing AdminDashboard component.
 * 
 * Copy relevant parts into your actual AdminDashboard.tsx file.
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../store';

// Trial System Imports
import { TrialBanner } from '../../../components/TrialBanner';
import { useDashboardTrialTracking, useTrialExpirationCheck } from '../../../hooks/useTrialTracking';
import { useSubscriptionGuard } from '../../../context/SubscriptionGuardContext';

interface AdminDashboardProps {
  businessName: string;
  products: any[];
  t: any;
  setActiveTab?: (tab: string) => void;
  navigation?: any; // Add this for navigation
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businessName,
  products,
  t,
  setActiveTab,
  navigation,
}) => {
  const tCommon = (
    key: string,
    defaultValue: string,
    options?: Record<string, any>,
  ) => t(key, { defaultValue, ...options });

  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) =>
    (state as any).categories?.items || [],
  );
  const users = useSelector((state: RootState) =>
    (state as any).users?.items || [],
  );
  const webSession = useSelector((state: RootState) => (state as any).webSession) || {};
  const sessionUser = webSession.sessionUser;
  const currentRole = webSession.currentRole as any;

  // Trial System Integration
  const { isTrialActive, isTrialExpired } = useDashboardTrialTracking();
  const { shouldShowExpiredScreen } = useTrialExpirationCheck();
  const { remainingTrialUses } = useSubscriptionGuard();

  // Redirect to expired screen if trial has expired
  useEffect(() => {
    if (shouldShowExpiredScreen && navigation) {
      navigation.navigate('Subscription.Expired');
    }
  }, [shouldShowExpiredScreen, navigation]);

  // Handle plan selection from trial banner
  const handleChoosePlan = () => {
    if (navigation) {
      navigation.navigate('Subscription.PlanSelection');
    }
  };

  // Handle contact support
  const handleContactSupport = () => {
    // Implement your support contact logic here
    console.log('Contacting support...');
  };

  // If trial expired, don't show dashboard (will redirect above)
  if (isTrialExpired) {
    return null;
  }

  const myClients = React.useMemo(() => {
    if (currentRole === 'super-admin') return users;
    if (!sessionUser) return [];
    return users.filter(
      u => u.managerId === sessionUser.id || u.id === sessionUser.id,
    );
  }, [users, sessionUser, currentRole]);

  // Rest of dashboard UI remains the same...
  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-[#0B0F19]"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 py-6 space-y-6">
        {/* Trial Banner - Add this at the top */}
        {isTrialActive && (
          <TrialBanner onChoosePlan={handleChoosePlan} />
        )}

        {/* Welcome Section */}
        <View className="space-y-2">
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            {tCommon('admin.dashboardTitle', 'Tableau de bord admin')}
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            {tCommon('admin.dashboardDescription', 'Consultez les indicateurs...', {
              businessName,
            })}
          </Text>
        </View>

        {/* Trial Status Card (Optional - for additional visibility) */}
        {isTrialActive && (
          <View className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-orange-500">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-semibold text-slate-900 dark:text-white">
                  📊 {tCommon('subscription.trialBanner.title', 'Essai gratuit actif')}
                </Text>
                <Text className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {remainingTrialUses} {tCommon('subscription.trialBanner.message', 'utilisations restantes')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleChoosePlan}
                className="bg-orange-500 rounded-lg px-4 py-2"
              >
                <Text className="text-white font-bold text-sm">
                  {tCommon('subscription.choosePlan', 'CHOISIR')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Key Metrics Grid */}
        <View className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Active Listings */}
          <TouchableOpacity
            onPress={() => setActiveTab?.('Services')}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <Text className="text-2xl font-black text-orange-500">
              {products.length}
            </Text>
            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wide">
              {tCommon('admin.activeListingsTitle', 'Annonces actives')}
            </Text>
            <Text className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
              {tCommon('admin.activeListingsDesc', 'Pièces détachées')}
            </Text>
          </TouchableOpacity>

          {/* Categories */}
          <TouchableOpacity
            onPress={() => setActiveTab?.('Categories')}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <Text className="text-2xl font-black text-blue-500">
              {categories.length}
            </Text>
            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wide">
              {tCommon('admin.categoriesTitle', 'Catégories')}
            </Text>
            <Text className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
              {tCommon('admin.categoriesDesc', 'Familles de produits')}
            </Text>
          </TouchableOpacity>

          {/* Registered Users */}
          <TouchableOpacity
            onPress={() => setActiveTab?.('Users')}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <Text className="text-2xl font-black text-green-500">
              {myClients.length}
            </Text>
            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wide">
              {tCommon('admin.registeredUsersTitle', 'Utilisateurs enregistrés')}
            </Text>
            <Text className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
              {tCommon('admin.registeredUsersDesc', 'Comptes créés')}
            </Text>
          </TouchableOpacity>

          {/* Leads */}
          <TouchableOpacity
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <Text className="text-2xl font-black text-purple-500">0</Text>
            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wide">
              {tCommon('admin.leadsTitle', 'Demandes d\'intervention')}
            </Text>
            <Text className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
              {tCommon('admin.leadsDesc', 'Besoins urgents')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">
            {tCommon('admin.recentActivityTitle', 'Historique récent')}
          </Text>
          {/* Activity items would go here */}
        </View>

        {/* Rest of existing dashboard content... */}
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
