import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface UserDashboardMobileProps {
  t: any;
  setActiveTab?: (tab: string) => void;
}

const UserDashboardMobile: React.FC<UserDashboardMobileProps> = ({
  t,
  setActiveTab,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const { theme } = useTheme();

  const stats = [
    {
      label: tCommon('web.userDashboard.points', 'Loyalty points'),
      value: '4 320',
      tone: 'text-amber-600',
    },
    {
      label: tCommon('web.userDashboard.level', 'Level'),
      value: tCommon('web.userDashboard.levelSilver', 'Silver'),
      tone: 'text-slate-700',
    },
    {
      label: tCommon('web.userDashboard.nextReward', 'Next reward'),
      value: 'Discount 15%',
      tone: 'text-emerald-600',
    },
  ];

  const quickActions = [
    {
      label: tCommon('web.userDashboard.coupons', 'My coupons'),
      desc: tCommon(
        'web.userDashboard.couponsDesc',
        'Access your active discount vouchers.',
      ),
      tab: 'UserCoupons',
    },
    {
      label: tCommon('web.userDashboard.spin', 'Spin'),
      desc: tCommon(
        'web.userDashboard.spinDesc',
        'Play the LoyalSpin wheel to earn rewards.',
      ),
      tab: 'LoyalSpin',
    },
    {
      label: tCommon('web.userDashboard.history', 'History'),
      desc: tCommon(
        'web.userDashboard.historyDesc',
        'View your recent orders and payments.',
      ),
      tab: 'UserPurchaseHistory',
    },
    {
      label: tCommon('web.userDashboard.notifications', 'Notifications'),
      desc: tCommon(
        'web.userDashboard.notificationsDesc',
        'See recent alerts and announcements.',
      ),
      tab: 'UserNotifications',
    },
    {
      label: tCommon('web.userDashboard.socialGate', 'Social Gate'),
      desc: tCommon(
        'web.userDashboard.socialGateDesc',
        'Share and earn points by connecting your social networks.',
      ),
      tab: 'UserSocialGate',
    },
    {
      label: tCommon('web.userDashboard.profile', 'Profile'),
      desc: tCommon(
        'web.userDashboard.profileDesc',
        'Edit your information and preferences.',
      ),
      tab: 'Profile',
    },
  ];

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8">
        <View className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <View className="max-w-2xl">
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {tCommon(
                'web.userDashboard.title',
                'Welcome to your dashboard',
              )}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
              {tCommon(
                'web.userDashboard.subtitle',
                'Track your points, view your orders, and access coupons quickly.',
              )}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveTab?.('UserNotifications')}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 999,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: theme.colors.card, fontWeight: '800' }}>
              {tCommon(
                'web.userDashboard.showAlerts',
                'Voir les notifications',
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {stats.map(item => (
          <View
            key={item.label}
            className="rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
          >
            <Text className="text-xs font-black uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              {item.label}
            </Text>
            <Text className={`mt-4 text-3xl font-black ${item.tone}`}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      

      <View className="mt-10 grid gap-6 lg:grid-cols-2">
        <View className="rounded-3xl bg-gradient-to-br from-[#1E3A5F] to-[#F97316] p-8 text-white shadow-lg overflow-hidden">
          <Text className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">
            {tCommon('web.userDashboard.loyaltyBadge', 'VIP loyalty')}
          </Text>
          <Text className="mt-6 text-4xl font-black tracking-tight">
            {tCommon('web.userDashboard.youEarned', 'You have earned')}
          </Text>
          <Text className="mt-3 text-lg font-semibold text-amber-100">
            {tCommon(
              'web.userDashboard.vipText',
              'Access priority service and exclusive offers.',
            )}
          </Text>
        </View>

        <View className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <Text className="text-sm font-black uppercase tracking-[0.24em] text-slate-900 dark:text-slate-100">
            {tCommon('web.userDashboard.quickActions', 'Quick actions')}
          </Text>
          <View className="mt-5 grid gap-4">
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.tab}
                onPress={() => setActiveTab?.(action.tab)}
                className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 text-left hover:border-[#F97316] hover:bg-[#F97316]/10 transition"
              >
                <Text className="text-base font-black text-slate-900 dark:text-white">
                  {action.label}
                </Text>
                <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {action.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserDashboardMobile;
