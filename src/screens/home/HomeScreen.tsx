import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { TransactionRow } from '../../components/TransactionRow';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  addTransaction,
  selectOverdueBills,
  selectTotalBalance,
  selectTransactions,
  selectUpcomingBills,
  selectWalletSettings,
} from '../../store/slices/walletSlice';
import { trackWalletScreen } from '../../services/analyticsService';

const today = () => new Date().toISOString().split('T')[0];
const timeNow = () => new Date().toTimeString().slice(0, 5);

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();
  const balance = useSelector(selectTotalBalance);
  const settings = useSelector(selectWalletSettings);
  const transactions = useSelector(selectTransactions);
  const overdue = useSelector(selectOverdueBills);
  const upcoming = useSelector((state: any) => selectUpcomingBills(state, 7));

  const overdueTotal = overdue.reduce((sum, bill) => sum + bill.amount, 0);

  useEffect(() => {
    trackWalletScreen('Home');
  }, []);

  return (
    <View className="flex-1 bg-background">
      <TopAppBar />
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        {Platform.OS === 'web' ? (
          <>
            <View
              style={{ pointerEvents: 'none' }}
              className="absolute right-[-70px] top-24 h-[220px] w-[220px] rounded-full bg-primary/5 blur-3xl"
            />
            <View
              style={{ pointerEvents: 'none' }}
              className="absolute bottom-10 left-[-90px] h-[260px] w-[260px] rounded-full bg-secondary/5 blur-3xl"
            />
          </>
        ) : null}

        <View className="px-5 pt-4">
          <Text className="font-headline text-[32px] font-extrabold tracking-normal text-on-surface">
            {greeting()}, {user?.name?.split(' ')[0] || 'Friend'}
          </Text>
          <Text className="mt-1 font-body text-[13px] font-medium text-on-surface-variant">
            Your portfolio is stable today.
          </Text>
        </View>

        <View className="mx-5 mt-4 overflow-hidden rounded-[28px] bg-primary p-7 shadow-editorial">
          <View className="absolute right-[-40px] top-[-40px] h-[180px] w-[180px] rounded-full bg-white/10" />
          <View className="flex-row items-start justify-between">
            <Text className="font-label text-[11px] font-bold uppercase tracking-[3px] text-white/75">
              Total Liquidity
            </Text>
            <MaterialIcons
              name="account-balance-wallet"
              size={32}
              color="rgba(255,255,255,0.35)"
            />
          </View>
          <Text className="mt-5 font-headline text-[42px] font-extrabold text-white">
            {settings.hideBalances
              ? '••••••'
              : `${balance.toFixed(2)} ${settings.currency}`}
          </Text>
          <View className="mt-6 self-start rounded-full bg-white/15 px-4 py-2">
            <Text className="font-label text-[11px] font-extrabold uppercase tracking-[1.2px] text-white">
              ↗ +4.2% this month
            </Text>
          </View>
        </View>

        {overdue.length > 0 ? (
          <View className="mx-5 mt-4 flex-row items-center justify-between rounded-2xl bg-error-container/60 px-5 py-4">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <MaterialIcons name="priority-high" size={24} color="#ffffff" />
              </View>
              <View>
                <Text className="font-body text-[15px] font-bold text-on-error-container">
                  {overdue.length} Overdue Bills
                </Text>
                <Text className="font-body text-xs font-medium text-secondary/70">
                  {overdueTotal.toFixed(2)} {settings.currency} pending
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="rounded-lg bg-secondary px-4 py-2"
              onPress={() => navigation.navigate('Accounts')}
            >
              <Text className="font-label text-[10px] font-extrabold uppercase tracking-[1px] text-white">
                Pay Now
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="mx-5 mt-6">
          <Text className="font-headline text-lg font-extrabold text-on-surface">
            Quick Log
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerClassName="gap-3"
          >
            {[
              ...settings.shortcuts,
              { id: 'custom', emoji: '➕', customLabel: 'Custom' },
            ].map(shortcut => (
              <TouchableOpacity
                key={shortcut.id}
                className="w-[68px] items-center gap-2"
                onPress={() => {
                  if (
                    shortcut.id === 'custom' ||
                    !('defaultAmount' in shortcut)
                  ) {
                    navigation.navigate('AddTransactionSheet');
                    return;
                  }
                  dispatch(
                    addTransaction({
                      type: 'expense',
                      amount: shortcut.defaultAmount,
                      label:
                        shortcut.customLabel ||
                        shortcut.i18nKey?.split('.').pop() ||
                        'Quick log',
                      category: shortcut.category,
                      emoji: shortcut.emoji,
                      accountId: shortcut.accountId,
                      date: today(),
                      time: timeNow(),
                      tags: [],
                      isRecurring: false,
                      isPaid: true,
                      status: 'cleared',
                    }),
                  );
                  showToast(
                    `✓ ${shortcut.defaultAmount} ${settings.currency}`,
                    'success',
                  );
                }}
                onLongPress={() =>
                  shortcut.id !== 'custom' &&
                  navigation.navigate('EditShortcutModal', {
                    shortcutId: shortcut.id,
                  })
                }
              >
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low">
                  <Text className="text-2xl">{shortcut.emoji}</Text>
                </View>
                <Text
                  className="text-center font-label text-[9px] font-bold uppercase tracking-[1px] text-on-surface-variant"
                  numberOfLines={1}
                >
                  {'customLabel' in shortcut && shortcut.customLabel
                    ? shortcut.customLabel
                    : shortcut.id === 'custom'
                    ? 'Custom'
                    : 'i18nKey' in shortcut
                    ? shortcut.i18nKey?.split('.').pop()
                    : 'Shortcut'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mx-5 mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="font-headline text-lg font-extrabold text-on-surface">
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text className="font-label text-[11px] font-extrabold uppercase text-primary">
                View All →
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-4 gap-3">
            {transactions.slice(0, 5).map(tx => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
            {transactions.length === 0 ? (
              <View className="items-center rounded-2xl bg-surface-container-low p-8">
                <Text className="font-body text-sm font-semibold text-on-surface-variant">
                  No transactions yet
                </Text>
                <Text className="mt-1 font-body text-xs text-on-surface-variant">
                  {upcoming.length} upcoming bill(s) this week
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-24 right-5 h-14 w-14 items-center justify-center rounded-[20px] bg-primary shadow-editorial"
        onPress={() => navigation.navigate('AddTransactionSheet')}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};
