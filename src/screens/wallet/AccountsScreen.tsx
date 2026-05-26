import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { TransactionRow } from '../../components/TransactionRow';
import {
  addTransaction,
  markRecurringPaid,
  selectAccounts,
  selectRecurringRules,
  selectTransactions,
  selectWalletSettings,
} from '../../store/slices/walletSlice';
import { useToast } from '../../context/ToastContext';
import { trackWalletScreen } from '../../services/analyticsService';

export const AccountsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
  const recurring = useSelector(selectRecurringRules);
  const settings = useSelector(selectWalletSettings);
  const pendingBills = recurring.filter(
    rule => !rule.isPaid && rule.type === 'expense',
  );

  useEffect(() => {
    trackWalletScreen('Accounts');
  }, []);

  return (
    <View className="flex-1 bg-background">
      <TopAppBar />
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        <View className="px-5 pt-4">
          <Text className="font-headline text-[32px] font-extrabold text-on-surface">
            Accounts
          </Text>
          <Text className="mt-1 font-body text-[13px] text-on-surface-variant">
            Manage your assets and liabilities
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerClassName="gap-4 px-5"
        >
          {accounts
            .filter(account => !account.isArchived)
            .map(account => (
              <View
                key={account.id}
                className={`min-w-[280px] rounded-2xl p-6 ${
                  account.type === 'credit_card'
                    ? 'border-2 border-secondary/20 bg-surface-container-lowest'
                    : 'bg-primary'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-3xl">{account.emoji}</Text>
                  <Text
                    className={`font-label text-[9px] font-extrabold uppercase tracking-[1.5px] ${
                      account.type === 'credit_card'
                        ? 'text-secondary'
                        : 'text-white/70'
                    }`}
                  >
                    {account.type.replace('_', ' ')}
                  </Text>
                </View>
                <Text
                  className={`mt-8 font-body text-xs ${
                    account.type === 'credit_card'
                      ? 'text-on-surface-variant'
                      : 'text-white/75'
                  }`}
                >
                  Current Balance
                </Text>
                <Text
                  className={`mt-1 font-headline text-[28px] font-extrabold ${
                    account.type === 'credit_card'
                      ? 'text-secondary'
                      : 'text-white'
                  }`}
                >
                  {settings.hideBalances
                    ? '••••••'
                    : `${account.balance.toFixed(2)} ${account.currency}`}
                </Text>
                {account.type === 'credit_card' ? (
                  <Text className="mt-3 self-start rounded-full bg-secondary px-3 py-1 font-label text-[9px] font-extrabold uppercase text-white">
                    Due Soon
                  </Text>
                ) : null}
              </View>
            ))}
          <TouchableOpacity
            className="min-w-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant p-6"
            onPress={() => navigation.navigate('AddAccountModal')}
          >
            <MaterialIcons name="add" size={28} color="#005994" />
            <Text className="mt-2 font-body text-sm font-bold text-primary">
              Add Account
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View className="mx-5 mt-6 gap-4">
          <View className="rounded-2xl bg-surface-container-low p-2">
            <View className="mb-2 flex-row items-center justify-between px-2 pt-2">
              <Text className="font-headline text-base font-extrabold text-on-surface">
                Recent Transactions
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text className="font-label text-[10px] font-extrabold uppercase text-primary">
                  View All →
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-2">
              {transactions.slice(0, 3).map(tx => (
                <TransactionRow key={tx.id} transaction={tx} compact />
              ))}
            </View>
          </View>

          <View className="rounded-2xl bg-surface-container-low p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-headline text-base font-extrabold text-on-surface">
                Recurring Bills
              </Text>
              <Text className="rounded-full bg-secondary/10 px-3 py-1 font-label text-[10px] font-extrabold uppercase text-secondary">
                {pendingBills.length} Pending
              </Text>
            </View>
            <View className="gap-3">
              {pendingBills.map(rule => (
                <View
                  key={rule.id}
                  className="rounded-2xl bg-surface-container-lowest p-5"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
                      <Text className="text-xl">{rule.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-body text-sm font-bold text-on-surface">
                        {rule.label}
                      </Text>
                      <Text className="font-body text-[11px] text-on-surface-variant">
                        Due {rule.nextDueDate}
                      </Text>
                    </View>
                    <Text className="font-headline text-base font-bold text-secondary">
                      {rule.amount} {settings.currency}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="mt-4 w-full rounded-xl bg-secondary py-3"
                    onPress={() => {
                      dispatch(markRecurringPaid(rule.id));
                      dispatch(
                        addTransaction({
                          type: 'expense',
                          amount: rule.amount,
                          label: rule.label,
                          category: rule.category,
                          emoji: rule.emoji,
                          accountId: rule.accountId,
                          date: new Date().toISOString().split('T')[0],
                          time: new Date().toTimeString().slice(0, 5),
                          tags: ['bill'],
                          isRecurring: true,
                          recurringId: rule.id,
                          isPaid: true,
                          status: 'cleared',
                        }),
                      );
                      showToast('Marked as paid', 'success');
                    }}
                  >
                    <Text className="text-center font-label text-[11px] font-extrabold uppercase tracking-[1px] text-white">
                      Pay Now
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
