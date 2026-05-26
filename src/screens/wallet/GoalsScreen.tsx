import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import {
  Goal,
  selectActiveGoals,
  selectCompletedGoals,
  selectGoalProgress,
} from '../../store/slices/goalsSlice';
import { trackWalletScreen } from '../../services/analyticsService';

const ProgressBar = ({
  percent,
  tone = 'primary',
}: {
  percent: number;
  tone?: 'primary' | 'secondary';
}) => (
  <View className="mt-3 h-4 overflow-hidden rounded-full bg-surface-container-low">
    <View
      className={`h-full rounded-full ${
        tone === 'secondary' ? 'bg-secondary' : 'bg-primary'
      }`}
      style={{ width: `${Math.min(100, percent)}%` }}
    />
  </View>
);

const SmallGoal = ({ goal }: { goal: Goal }) => {
  const progress = useSelector(selectGoalProgress(goal.id));
  return (
    <View className="min-w-[45%] flex-1 rounded-3xl bg-surface-container-low p-5">
      <Text
        className="font-headline text-[15px] font-bold text-on-surface"
        numberOfLines={1}
      >
        {goal.emoji} {goal.name}
      </Text>
      <Text className="mt-1 font-body text-[11px] text-on-surface-variant">
        {progress.remaining.toFixed(0)} DT remaining
      </Text>
      <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress.percent}%` }}
        />
      </View>
      <View className="mt-2 flex-row justify-between">
        <Text className="font-body text-[11px] font-bold text-on-surface-variant">
          {progress.percent}%
        </Text>
        <Text className="font-body text-[11px] font-bold text-primary">
          {goal.currentAmount.toFixed(0)} DT
        </Text>
      </View>
    </View>
  );
};

export const GoalsScreen = () => {
  const navigation = useNavigation<any>();
  const active = useSelector(selectActiveGoals);
  const completed = useSelector(selectCompletedGoals);
  const featured = active[0];
  const weakest = [...active].sort(
    (a, b) =>
      a.currentAmount / a.targetAmount - b.currentAmount / b.targetAmount,
  )[0];
  const featuredProgress = useSelector(selectGoalProgress(featured?.id || ''));
  const weakestProgress = useSelector(selectGoalProgress(weakest?.id || ''));

  useEffect(() => {
    trackWalletScreen('Goals');
  }, []);

  return (
    <View className="flex-1 bg-background">
      <TopAppBar />
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        <View className="px-5 pt-4">
          <View className="flex-row flex-wrap items-end justify-between gap-4">
            <View>
              <Text className="font-label text-[11px] font-bold uppercase tracking-[2px] text-primary">
                Portfolio Overview
              </Text>
              <Text className="mt-1 font-headline text-[30px] font-extrabold leading-9 text-on-surface">
                Your Future,{'\n'}
                <Text className="text-primary">Curated.</Text>
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-2 rounded-xl bg-primary px-5 py-3"
              onPress={() => navigation.navigate('AddGoalModal')}
            >
              <MaterialIcons name="add" size={18} color="#ffffff" />
              <Text className="font-body text-sm font-bold text-white">
                Add Funds
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {featured ? (
          <View className="mx-5 mt-6 overflow-hidden rounded-3xl bg-surface-container-lowest p-8 shadow-editorial">
            <Text className="absolute right-[-10px] top-[-10px] text-[120px] opacity-5">
              {featured.emoji}
            </Text>
            <Text className="self-start rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] font-extrabold uppercase text-primary">
              Featured Goal
            </Text>
            <Text className="mt-3 font-headline text-2xl font-extrabold text-on-surface">
              {featured.name}
            </Text>
            <View className="mt-4 flex-row justify-between">
              <Text className="font-body text-[13px] font-bold text-primary">
                {featuredProgress.percent}% Reached
              </Text>
              <Text className="font-body text-[11px] text-on-surface-variant">
                Goal: {featured.targetAmount.toFixed(0)} DT
              </Text>
            </View>
            <ProgressBar percent={featuredProgress.percent} />
            <View className="mt-4 flex-row justify-between">
              <Text className="font-headline text-lg font-extrabold text-on-surface">
                {featured.currentAmount.toFixed(0)} DT
              </Text>
              <Text className="font-body text-[11px] text-on-surface-variant">
                {featured.deadline
                  ? `Est. ${featured.deadline}`
                  : 'No deadline'}
              </Text>
            </View>
          </View>
        ) : null}

        {weakest ? (
          <View className="mx-5 mt-4 rounded-2xl border-t-4 border-secondary bg-surface-container-lowest p-6 shadow-editorial">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="priority-high" size={20} color="#bc000d" />
              <Text className="rounded-full bg-secondary/10 px-3 py-1 font-label text-[10px] font-extrabold uppercase text-secondary">
                Low Progress
              </Text>
            </View>
            <Text className="mt-3 font-headline text-xl font-extrabold text-on-surface">
              {weakest.name}
            </Text>
            <Text className="mt-1 font-body text-xs text-on-surface-variant">
              A small top-up keeps this goal moving.
            </Text>
            <View className="mt-4 flex-row items-end justify-between">
              <Text className="font-headline text-[28px] font-black text-on-surface">
                {weakest.currentAmount.toFixed(0)}
                <Text className="text-xs text-on-surface-variant">
                  {' '}
                  / {weakest.targetAmount} DT
                </Text>
              </Text>
              <Text className="font-body text-[13px] font-bold text-secondary">
                {weakestProgress.percent}%
              </Text>
            </View>
            <ProgressBar percent={weakestProgress.percent} tone="secondary" />
          </View>
        ) : null}

        <View className="mx-5 mt-4 flex-row flex-wrap gap-4">
          {active.slice(1).map(goal => (
            <SmallGoal key={goal.id} goal={goal} />
          ))}
        </View>

        <View className="mx-5 mt-7">
          <View className="flex-row items-center justify-between">
            <Text className="font-headline text-xl font-extrabold text-on-surface">
              Victories
            </Text>
            <Text className="font-label text-[10px] font-extrabold uppercase text-primary">
              View Archive
            </Text>
          </View>
          <View className="mt-3 flex-row flex-wrap gap-4">
            {completed.slice(0, 4).map(goal => (
              <View
                key={goal.id}
                className="min-w-[45%] flex-1 rounded-2xl bg-surface-container-lowest p-5 shadow-editorial"
              >
                <View className="absolute right-4 top-4 rounded-full bg-primary/10 p-2">
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#005994"
                  />
                </View>
                <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-primary/5">
                  <Text className="text-2xl">{goal.emoji}</Text>
                </View>
                <Text className="font-body text-[13px] font-bold text-on-surface">
                  {goal.name}
                </Text>
                <Text className="mt-1 font-body text-[11px] text-on-surface-variant">
                  {goal.targetAmount.toFixed(0)} DT · 2026
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
