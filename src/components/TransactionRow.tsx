import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  deleteTransaction,
  selectWalletSettings,
  Transaction,
} from '../store/slices/walletSlice';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit?: () => void;
  compact?: boolean;
}

const amountPrefix = (type: Transaction['type']) =>
  type === 'expense' ? '-' : type === 'income' ? '+' : '';

export const TransactionRow = ({
  transaction,
  onEdit,
  compact,
}: TransactionRowProps) => {
  const dispatch = useDispatch();
  const settings = useSelector(selectWalletSettings);
  const amountColor =
    transaction.type === 'expense'
      ? 'text-secondary'
      : transaction.type === 'income'
      ? 'text-primary'
      : 'text-on-surface-variant';

  const actions = (
    <View className="flex-row overflow-hidden rounded-2xl">
      <TouchableOpacity
        className="w-[70px] items-center justify-center bg-primary-container"
        onPress={onEdit}
      >
        <MaterialIcons name="edit" size={20} color="#ffffff" />
      </TouchableOpacity>
      <TouchableOpacity
        className="w-[70px] items-center justify-center bg-secondary"
        onPress={() => dispatch(deleteTransaction(transaction.id))}
      >
        <MaterialIcons name="delete" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  const content = (
    <View className="flex-row items-center gap-4 rounded-2xl bg-surface-container-lowest p-4">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Text className="text-2xl">{transaction.emoji}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text
            className="font-body text-[15px] font-bold text-on-surface"
            numberOfLines={1}
          >
            {transaction.label}
          </Text>
          {transaction.amount > 50 && transaction.type === 'expense' ? (
            <Text className="rounded-full bg-secondary/5 px-2 py-0.5 font-label text-[9px] font-extrabold text-secondary">
              HIGH
            </Text>
          ) : null}
        </View>
        <Text className="mt-1 font-body text-xs font-medium text-on-surface-variant">
          {transaction.category} · {transaction.time}
        </Text>
        {compact ? null : (
          <View className="mt-1 flex-row flex-wrap gap-1">
            {transaction.tags.map(tag => (
              <Text
                key={tag}
                className="rounded-full bg-primary-fixed px-2 py-0.5 font-label text-[9px] text-primary"
              >
                {tag}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="items-end">
        <Text className={`font-headline text-[15px] font-bold ${amountColor}`}>
          {settings.hideBalances
            ? '•••'
            : `${amountPrefix(transaction.type)}${transaction.amount.toFixed(
                2,
              )} ${settings.currency}`}
        </Text>
        <Text className="mt-1 rounded-full bg-surface-container-high px-2 py-0.5 font-label text-[9px] font-extrabold uppercase text-on-surface-variant">
          {transaction.status}
        </Text>
      </View>
      {Platform.OS === 'web' ? actions : null}
    </View>
  );

  if (Platform.OS === 'web') return content;
  return <Swipeable renderRightActions={() => actions}>{content}</Swipeable>;
};
