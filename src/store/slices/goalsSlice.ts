import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
  linkedAccountId?: string;
  isCompleted: boolean;
  createdAt: number;
}

interface GoalsState {
  goals: Goal[];
}

const now = Date.now();

const initialState: GoalsState = {
  goals: [
    {
      id: 'g1',
      name: 'Summer Retreat',
      emoji: '🏖️',
      targetAmount: 12500,
      currentAmount: 8750,
      deadline: '2026-06-30',
      color: '#005994',
      isCompleted: false,
      createdAt: now,
    },
    {
      id: 'g2',
      name: 'New Workstation',
      emoji: '💻',
      targetAmount: 3200,
      currentAmount: 450,
      deadline: '2026-12-01',
      color: '#bc000d',
      isCompleted: false,
      createdAt: now,
    },
    {
      id: 'g3',
      name: 'Emergency Fund',
      emoji: '🛡️',
      targetAmount: 10000,
      currentAmount: 4500,
      color: '#005994',
      isCompleted: false,
      createdAt: now,
    },
    {
      id: 'g4',
      name: 'Anniversary',
      emoji: '💍',
      targetAmount: 1000,
      currentAmount: 820,
      deadline: '2026-07-15',
      color: '#6f5028',
      isCompleted: false,
      createdAt: now,
    },
    {
      id: 'g5',
      name: 'MacBook Pro M3',
      emoji: '💻',
      targetAmount: 2499,
      currentAmount: 2499,
      color: '#005994',
      isCompleted: true,
      createdAt: now,
    },
    {
      id: 'g6',
      name: 'Diamond Ring',
      emoji: '💎',
      targetAmount: 5000,
      currentAmount: 5000,
      color: '#6f5028',
      isCompleted: true,
      createdAt: now,
    },
  ],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Omit<Goal, 'id' | 'createdAt'>>) => {
      state.goals.push({
        ...action.payload,
        id: `g_${Date.now()}`,
        createdAt: Date.now(),
      });
    },
    updateGoal: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Goal> }>,
    ) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (goal) Object.assign(goal, action.payload.updates);
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
    },
    addToGoal: (
      state,
      action: PayloadAction<{ id: string; amount: number }>,
    ) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (!goal) return;
      goal.currentAmount = Math.min(
        goal.currentAmount + action.payload.amount,
        goal.targetAmount,
      );
      if (goal.currentAmount >= goal.targetAmount) goal.isCompleted = true;
    },
  },
});

export const { addGoal, updateGoal, deleteGoal, addToGoal } =
  goalsSlice.actions;
export default goalsSlice.reducer;

export const selectGoals = (s: RootState) => s.goals.goals;
export const selectActiveGoals = (s: RootState) =>
  s.goals.goals.filter(g => !g.isCompleted);
export const selectCompletedGoals = (s: RootState) =>
  s.goals.goals.filter(g => g.isCompleted);
export const selectGoalProgress = (id: string) => (s: RootState) => {
  const goal = s.goals.goals.find(g => g.id === id);
  if (!goal)
    return {
      percent: 0,
      remaining: 0,
      daysLeft: undefined as number | undefined,
    };
  const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  let daysLeft: number | undefined;
  if (goal.deadline) {
    const diff = new Date(goal.deadline).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / 86400000));
  }
  return { percent, remaining, daysLeft };
};
