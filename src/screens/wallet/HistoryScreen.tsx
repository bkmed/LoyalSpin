import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { TransactionRow } from '../../components/TransactionRow';
import {
  selectTransactions,
  selectTransactionsByDay,
  selectWalletSettings,
  Transaction,
} from '../../store/slices/walletSlice';
import { trackWalletScreen } from '../../services/analyticsService';

const labelForDay = (date: string) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (date === today) return 'Today';
  if (date === yesterday) return 'Yesterday';
  return 'Activity';
};

export const HistoryScreen = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const grouped = useSelector(selectTransactionsByDay);
  const allTransactions = useSelector(selectTransactions);
  const settings = useSelector(selectWalletSettings);

  useEffect(() => {
    trackWalletScreen('History');
  }, []);

  const sections = useMemo<Array<[string, Transaction[]]>>(() => {
    const source = query.trim()
      ? allTransactions.filter(tx =>
          [tx.label, tx.category, tx.note, ...tx.tags]
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
      : Object.keys(grouped).reduce<Transaction[]>(
          (acc, key) => acc.concat(grouped[key]),
          [],
        );

    return Object.entries(
      source.reduce((acc, tx) => {
        acc[tx.date] = acc[tx.date] ? [...acc[tx.date], tx] : [tx];
        return acc;
      }, {} as Record<string, Transaction[]>),
    ).sort(([a], [b]) => (a < b ? 1 : -1)) as Array<[string, Transaction[]]>;
  }, [allTransactions, grouped, query]);

  return (
    <View className="flex-1 bg-background">
      <TopAppBar />
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        <View className="mx-5 mt-4">
          <View className="relative">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor="#717882"
              className="rounded-2xl bg-surface-container-low py-4 pl-12 pr-4 font-body text-on-surface"
            />
            <View className="absolute left-4 top-4">
              <MaterialIcons name="search" size={20} color="#717882" />
            </View>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerClassName="gap-2 px-5"
        >
          {['📅 This Month', '💳 Category', '🔽 Type'].map((chip, index) => (
            <View
              key={chip}
              className={`rounded-full px-5 py-2.5 ${
                index === 0
                  ? 'bg-primary-container'
                  : 'bg-surface-container-high'
              }`}
            >
              <Text
                className={`font-label text-xs font-bold ${
                  index === 0 ? 'text-on-primary-container' : 'text-on-surface'
                }`}
              >
                {chip}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="mx-5 mt-5 gap-6">
          {sections.map(([date, items]) => {
            const spent = items
              .filter(tx => tx.type === 'expense')
              .reduce((sum, tx) => sum + tx.amount, 0);
            const income = items
              .filter(tx => tx.type === 'income')
              .reduce((sum, tx) => sum + tx.amount, 0);
            return (
              <View key={date}>
                <View className="mb-3 flex-row items-end justify-between">
                  <View>
                    <Text className="font-label text-[10px] font-extrabold uppercase tracking-[2px] text-on-surface-variant">
                      {labelForDay(date)}
                    </Text>
                    <Text className="font-headline text-[26px] font-extrabold text-on-surface">
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-label text-[9px] font-bold uppercase text-on-surface-variant">
                      {income > spent ? 'Total Income' : 'Total Spent'}
                    </Text>
                    <Text
                      className={`font-headline text-[22px] font-black ${
                        income > spent ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      {(income > spent ? income : spent).toFixed(2)}{' '}
                      {settings.currency}
                    </Text>
                  </View>
                </View>
                <View className="gap-3">
                  {items.map(tx => (
                    <TransactionRow key={tx.id} transaction={tx} />
                  ))}
                </View>
              </View>
            );
          })}
          {sections.length === 0 ? (
            <View className="items-center p-10">
              <MaterialIcons name="receipt-long" size={48} color="#717882" />
              <Text className="mt-3 font-body text-sm font-semibold text-on-surface-variant">
                No transactions yet
              </Text>
            </View>
          ) : null}
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
