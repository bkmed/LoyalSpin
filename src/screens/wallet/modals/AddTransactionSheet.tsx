import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  addTransaction,
  Category,
  selectAccounts,
  selectWalletSettings,
  TransactionType,
} from '../../../store/slices/walletSlice';
import { useToast } from '../../../context/ToastContext';
import { trackTransactionAdded } from '../../../services/analyticsService';

const CATEGORIES: { category: Category; emoji: string; label: string }[] = [
  { category: 'food', emoji: '🍽️', label: 'Food' },
  { category: 'transport', emoji: '🚌', label: 'Transport' },
  { category: 'drinks', emoji: '☕', label: 'Drinks' },
  { category: 'shopping', emoji: '🛍️', label: 'Shopping' },
  { category: 'health', emoji: '❤️', label: 'Health' },
  { category: 'entertainment', emoji: '🎬', label: 'Leisure' },
  { category: 'home', emoji: '🏠', label: 'Home' },
  { category: 'education', emoji: '📚', label: 'Education' },
  { category: 'travel', emoji: '✈️', label: 'Travel' },
  { category: 'salary', emoji: '💰', label: 'Salary' },
  { category: 'freelance', emoji: '💼', label: 'Freelance' },
  { category: 'gift', emoji: '🎁', label: 'Gift' },
  { category: 'investment', emoji: '📈', label: 'Invest' },
  { category: 'other', emoji: '⋯', label: 'Other' },
];

export const AddTransactionSheet = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const settings = useSelector(selectWalletSettings);
  const accounts = useSelector(selectAccounts);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const selectedCategory =
    CATEGORIES.find(item => item.category === category) || CATEGORIES[0];

  const append = (value: string) => {
    if (value === 'back') setAmount(prev => prev.slice(0, -1));
    else if (!(value === '.' && amount.includes('.')))
      setAmount(prev => `${prev}${value}`);
  };

  const save = () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      showToast('Enter an amount', 'warning');
      return;
    }
    dispatch(
      addTransaction({
        type,
        amount: parsed,
        label: label || selectedCategory.label,
        category,
        emoji: selectedCategory.emoji,
        accountId: settings.defaultAccountId || accounts[0]?.id || 'acc_cash',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        tags: [],
        isRecurring: false,
        isPaid: true,
        status: 'cleared',
      }),
    );
    trackTransactionAdded(type, parsed, category);
    showToast('✓ Added', 'success');
    navigation.goBack();
  };

  return (
    <View className="flex-1 justify-end bg-black/30">
      <View className="rounded-t-3xl bg-surface-container-lowest px-5 pb-10 pt-5">
        <View className="mb-5 h-1 w-9 self-center rounded-full bg-outline-variant" />
        <Text className="mb-4 font-headline text-lg font-extrabold text-on-surface">
          Add Transaction
        </Text>

        <View className="mb-4 flex-row gap-1 rounded-2xl bg-surface-container-low p-1">
          {(['expense', 'income', 'transfer'] as TransactionType[]).map(
            item => (
              <TouchableOpacity
                key={item}
                className={`flex-1 rounded-xl py-3 ${
                  type === item ? 'bg-white shadow-editorial' : ''
                }`}
                onPress={() => setType(item)}
              >
                <Text
                  className={`text-center font-label text-xs font-bold capitalize ${
                    type === item ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <View className="mb-4 items-center border-b border-outline-variant py-5">
          <Text className="font-body text-2xl font-semibold text-on-surface-variant">
            {settings.currency}
          </Text>
          <Text className="font-headline text-[52px] font-extrabold text-on-surface">
            {amount || '0.00'}
          </Text>
        </View>

        <View className="mb-4 flex-row flex-wrap gap-2">
          {CATEGORIES.map(item => (
            <TouchableOpacity
              key={item.category}
              className={`w-[23%] items-center rounded-2xl py-3 ${
                category === item.category
                  ? 'border-2 border-primary bg-primary/10'
                  : 'bg-surface-container-low'
              }`}
              onPress={() => setCategory(item.category)}
            >
              <Text className="text-xl">{item.emoji}</Text>
              <Text className="mt-1 font-label text-[9px] font-bold uppercase text-on-surface-variant">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Monoprix"
          placeholderTextColor="#717882"
          className="mb-4 rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface"
        />

        <View className="flex-row flex-wrap gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'].map(
            key => (
              <TouchableOpacity
                key={key}
                className="w-[31%] items-center rounded-2xl bg-surface-container-low py-4"
                onPress={() => append(key)}
              >
                {key === 'back' ? (
                  <MaterialIcons name="backspace" size={20} color="#404751" />
                ) : (
                  <Text className="font-headline text-xl font-bold text-on-surface">
                    {key}
                  </Text>
                )}
              </TouchableOpacity>
            ),
          )}
        </View>

        <TouchableOpacity
          className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-primary py-4"
          onPress={save}
        >
          <MaterialIcons name="check" size={20} color="#ffffff" />
          <Text className="font-headline text-base font-extrabold text-white">
            Save Transaction
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
