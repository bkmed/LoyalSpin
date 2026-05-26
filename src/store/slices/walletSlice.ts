import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export type TransactionType = 'expense' | 'income' | 'transfer';
export type TransactionStatus = 'cleared' | 'pending' | 'failed';
export type Category =
  | 'food'
  | 'transport'
  | 'drinks'
  | 'shopping'
  | 'health'
  | 'entertainment'
  | 'home'
  | 'education'
  | 'travel'
  | 'salary'
  | 'freelance'
  | 'gift'
  | 'investment'
  | 'other';
export type AccountType = 'cash' | 'bank' | 'credit_card' | 'savings';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  label: string;
  category: Category;
  emoji: string;
  accountId: string;
  toAccountId?: string;
  date: string;
  time: string;
  note?: string;
  receiptUri?: string;
  tags: string[];
  isRecurring: boolean;
  recurringId?: string;
  isPaid: boolean;
  status: TransactionStatus;
  createdAt: number;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  emoji: string;
  color: string;
  balance: number;
  creditLimit?: number;
  dueDate?: number;
  currency: string;
  isArchived: boolean;
  createdAt: number;
}

export interface RecurringRule {
  id: string;
  label: string;
  amount: number;
  category: Category;
  emoji: string;
  accountId: string;
  frequency: RecurringFrequency;
  nextDueDate: string;
  reminderDaysBefore: number;
  isPaid: boolean;
  type: 'expense' | 'income';
}

export interface CategoryBudget {
  category: Category;
  monthlyLimit: number;
  alertAt: number;
}

export interface Shortcut {
  id: string;
  i18nKey?: string;
  customLabel?: string;
  emoji: string;
  defaultAmount: number;
  category: Category;
  accountId: string;
}

export interface WalletSettings {
  currency: string;
  dailyBudget: number;
  monthlyBudget: number;
  categoryBudgets: CategoryBudget[];
  shortcuts: Shortcut[];
  hideBalances: boolean;
  defaultAccountId: string;
  notificationsEnabled: boolean;
}

const now = Date.now();

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc_cash',
    name: 'Especes',
    type: 'cash',
    emoji: '💵',
    color: '#005994',
    balance: 200,
    currency: 'DT',
    isArchived: false,
    createdAt: now,
  },
  {
    id: 'acc_bank',
    name: 'Banque',
    type: 'bank',
    emoji: '🏦',
    color: '#00497b',
    balance: 1500,
    currency: 'DT',
    isArchived: false,
    createdAt: now,
  },
  {
    id: 'acc_card',
    name: 'Carte',
    type: 'credit_card',
    emoji: '💳',
    color: '#bc000d',
    balance: 0,
    currency: 'DT',
    isArchived: false,
    creditLimit: 2000,
    dueDate: 15,
    createdAt: now,
  },
];

const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    id: 's1',
    i18nKey: 'shortcuts.coffee',
    emoji: '☕',
    defaultAmount: 2.5,
    category: 'drinks',
    accountId: 'acc_cash',
  },
  {
    id: 's2',
    i18nKey: 'shortcuts.transport',
    emoji: '🚌',
    defaultAmount: 1,
    category: 'transport',
    accountId: 'acc_cash',
  },
  {
    id: 's3',
    i18nKey: 'shortcuts.dining',
    emoji: '🍽️',
    defaultAmount: 8,
    category: 'food',
    accountId: 'acc_cash',
  },
  {
    id: 's4',
    i18nKey: 'shortcuts.retail',
    emoji: '🛍️',
    defaultAmount: 5,
    category: 'shopping',
    accountId: 'acc_cash',
  },
  {
    id: 's5',
    i18nKey: 'shortcuts.utility',
    emoji: '⚡',
    defaultAmount: 3,
    category: 'home',
    accountId: 'acc_bank',
  },
  {
    id: 's6',
    i18nKey: 'shortcuts.fuel',
    emoji: '⛽',
    defaultAmount: 12,
    category: 'transport',
    accountId: 'acc_bank',
  },
];

const DEFAULT_RECURRING: RecurringRule[] = [
  {
    id: 'r1',
    label: 'STEG Electricite',
    amount: 65,
    category: 'home',
    emoji: '⚡',
    accountId: 'acc_bank',
    frequency: 'monthly',
    nextDueDate: '2026-05-27',
    reminderDaysBefore: 3,
    isPaid: false,
    type: 'expense',
  },
  {
    id: 'r2',
    label: 'Ooredoo Fiber',
    amount: 45,
    category: 'home',
    emoji: '📡',
    accountId: 'acc_bank',
    frequency: 'monthly',
    nextDueDate: '2026-05-15',
    reminderDaysBefore: 1,
    isPaid: false,
    type: 'expense',
  },
  {
    id: 'r3',
    label: 'Salaire',
    amount: 2450,
    category: 'salary',
    emoji: '💰',
    accountId: 'acc_bank',
    frequency: 'monthly',
    nextDueDate: '2026-06-01',
    reminderDaysBefore: 0,
    isPaid: false,
    type: 'income',
  },
];

interface WalletState {
  transactions: Transaction[];
  accounts: Account[];
  recurringRules: RecurringRule[];
  settings: WalletSettings;
}

const initialState: WalletState = {
  transactions: [],
  accounts: DEFAULT_ACCOUNTS,
  recurringRules: DEFAULT_RECURRING,
  settings: {
    currency: 'DT',
    dailyBudget: 20,
    monthlyBudget: 500,
    categoryBudgets: [
      { category: 'food', monthlyLimit: 150, alertAt: 80 },
      { category: 'transport', monthlyLimit: 50, alertAt: 80 },
      { category: 'entertainment', monthlyLimit: 80, alertAt: 80 },
    ],
    shortcuts: DEFAULT_SHORTCUTS,
    hideBalances: false,
    defaultAccountId: 'acc_cash',
    notificationsEnabled: true,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addTransaction: (
      state,
      action: PayloadAction<Omit<Transaction, 'id' | 'createdAt'>>,
    ) => {
      const tx = {
        ...action.payload,
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        createdAt: Date.now(),
      };
      state.transactions.unshift(tx);

      const account = state.accounts.find(a => a.id === tx.accountId);
      if (account) {
        if (tx.type === 'income') account.balance += tx.amount;
        if (tx.type === 'expense') account.balance -= tx.amount;
        if (tx.type === 'transfer' && tx.toAccountId) {
          account.balance -= tx.amount;
          const target = state.accounts.find(a => a.id === tx.toAccountId);
          if (target) target.balance += tx.amount;
        }
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        t => t.id !== action.payload,
      );
    },
    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Transaction> }>,
    ) => {
      const tx = state.transactions.find(t => t.id === action.payload.id);
      if (tx) Object.assign(tx, action.payload.updates);
    },
    togglePaid: (state, action: PayloadAction<string>) => {
      const tx = state.transactions.find(t => t.id === action.payload);
      if (tx) tx.isPaid = !tx.isPaid;
    },
    addAccount: (
      state,
      action: PayloadAction<Omit<Account, 'id' | 'createdAt'>>,
    ) => {
      state.accounts.push({
        ...action.payload,
        id: `acc_${Date.now()}`,
        createdAt: Date.now(),
      });
    },
    updateAccount: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Account> }>,
    ) => {
      const acc = state.accounts.find(a => a.id === action.payload.id);
      if (acc) Object.assign(acc, action.payload.updates);
    },
    archiveAccount: (state, action: PayloadAction<string>) => {
      const acc = state.accounts.find(a => a.id === action.payload);
      if (acc) acc.isArchived = true;
    },
    addRecurringRule: (
      state,
      action: PayloadAction<Omit<RecurringRule, 'id'>>,
    ) => {
      state.recurringRules.push({ ...action.payload, id: `rec_${Date.now()}` });
    },
    markRecurringPaid: (state, action: PayloadAction<string>) => {
      const rule = state.recurringRules.find(r => r.id === action.payload);
      if (!rule) return;
      rule.isPaid = true;
      const next = new Date(rule.nextDueDate);
      if (rule.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
      else if (rule.frequency === 'weekly') next.setDate(next.getDate() + 7);
      else if (rule.frequency === 'yearly')
        next.setFullYear(next.getFullYear() + 1);
      else next.setDate(next.getDate() + 1);
      rule.nextDueDate = next.toISOString().split('T')[0];
    },
    deleteRecurringRule: (state, action: PayloadAction<string>) => {
      state.recurringRules = state.recurringRules.filter(
        r => r.id !== action.payload,
      );
    },
    updateSettings: (state, action: PayloadAction<Partial<WalletSettings>>) => {
      Object.assign(state.settings, action.payload);
    },
    updateShortcut: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Shortcut> }>,
    ) => {
      const sc = state.settings.shortcuts.find(s => s.id === action.payload.id);
      if (sc) Object.assign(sc, action.payload.updates);
    },
    resetToday: state => {
      const today = new Date().toISOString().split('T')[0];
      state.transactions = state.transactions.filter(t => t.date !== today);
    },
    resetAll: state => {
      state.transactions = [];
      state.accounts = DEFAULT_ACCOUNTS;
      state.recurringRules = DEFAULT_RECURRING;
      state.settings = initialState.settings;
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  togglePaid,
  addAccount,
  updateAccount,
  archiveAccount,
  addRecurringRule,
  markRecurringPaid,
  deleteRecurringRule,
  updateSettings,
  updateShortcut,
  resetToday,
  resetAll,
} = walletSlice.actions;

export default walletSlice.reducer;

export const selectTransactions = (s: RootState) => s.wallet.transactions;
export const selectAccounts = (s: RootState) => s.wallet.accounts;
export const selectRecurringRules = (s: RootState) => s.wallet.recurringRules;
export const selectWalletSettings = (s: RootState) => s.wallet.settings;

export const selectTotalBalance = (s: RootState) =>
  s.wallet.accounts
    .filter(a => !a.isArchived)
    .reduce((sum, a) => sum + a.balance, 0);

export const selectTotalSpentToday = (s: RootState) => {
  const today = new Date().toISOString().split('T')[0];
  return s.wallet.transactions
    .filter(t => t.date === today && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const selectTotalSpentMonth = (month: string) => (s: RootState) =>
  s.wallet.transactions
    .filter(t => t.date.startsWith(month) && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

export const selectTotalIncomeMonth = (month: string) => (s: RootState) =>
  s.wallet.transactions
    .filter(t => t.date.startsWith(month) && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

export const selectTransactionsByDay = createSelector(
  [selectTransactions],
  transactions =>
    transactions.reduce((acc, tx) => {
      acc[tx.date] = acc[tx.date] ? [...acc[tx.date], tx] : [tx];
      return acc;
    }, {} as Record<string, Transaction[]>),
);

export const selectTotalByCategory = createSelector(
  [selectTransactions, (_s: RootState, month: string) => month],
  (transactions, month) =>
    transactions
      .filter(t => t.date.startsWith(month) && t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<Category, number>),
);

export const selectOverdueBills = createSelector(
  [selectRecurringRules],
  rules => {
    const today = new Date().toISOString().split('T')[0];
    return rules.filter(
      r => r.nextDueDate < today && !r.isPaid && r.type === 'expense',
    );
  },
);

export const selectUpcomingBills = createSelector(
  [selectRecurringRules, (_s: RootState, days: number) => days],
  (rules, days) => {
    const today = new Date();
    const limit = new Date(today.getTime() + days * 86400000)
      .toISOString()
      .split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    return rules.filter(
      r =>
        r.nextDueDate >= todayStr &&
        r.nextDueDate <= limit &&
        !r.isPaid &&
        r.type === 'expense',
    );
  },
);

export const selectBudgetPercent =
  (category: Category, month: string) => (s: RootState) => {
    const budget = s.wallet.settings.categoryBudgets.find(
      b => b.category === category,
    );
    if (!budget || budget.monthlyLimit === 0) return 0;
    const spent = s.wallet.transactions
      .filter(
        t =>
          t.date.startsWith(month) &&
          t.type === 'expense' &&
          t.category === category,
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return Math.round((spent / budget.monthlyLimit) * 100);
  };
