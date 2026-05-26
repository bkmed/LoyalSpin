import React, { useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Svg, { Circle } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { TopAppBar } from '../../components/TopAppBar';
import {
  selectTotalByCategory,
  selectTotalIncomeMonth,
  selectTotalSpentMonth,
  selectWalletSettings,
} from '../../store/slices/walletSlice';
import { trackWalletScreen } from '../../services/analyticsService';

const month = new Date().toISOString().slice(0, 7);

export const ReportsScreen = () => {
  const settings = useSelector(selectWalletSettings);
  const spent = useSelector(selectTotalSpentMonth(month));
  const income = useSelector(selectTotalIncomeMonth(month));
  const byCategory = useSelector((state: any) =>
    selectTotalByCategory(state, month),
  );
  const width = Math.min(Dimensions.get('window').width - 40, 760);
  const categories = Object.entries(byCategory).slice(0, 4);
  const total = categories.reduce((sum, [, value]) => sum + value, 0) || 1;

  useEffect(() => {
    trackWalletScreen('Reports');
  }, []);

  return (
    <View className="flex-1 bg-background">
      <TopAppBar />
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        <View className="mx-5 pt-4">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="font-headline text-[28px] font-extrabold text-on-surface">
                Financial Health
              </Text>
              <Text className="mt-1 font-body text-xs text-on-surface-variant">
                Performance & spending metrics
              </Text>
            </View>
            <View className="rounded-xl bg-surface-container-low px-3 py-2">
              <Text className="font-label text-[11px] font-extrabold uppercase tracking-[1px] text-on-surface">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-5 mt-4 rounded-2xl bg-surface-container-lowest p-6 shadow-editorial">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-headline text-base font-bold text-on-surface">
              Cash Flow
            </Text>
            <Text className="font-label text-[10px] font-bold uppercase text-on-surface-variant">
              ● Income ● Expenses
            </Text>
          </View>
          <BarChart
            data={{
              labels: ['W1', 'W2', 'W3', 'W4'],
              datasets: [
                {
                  data: [
                    income * 0.2,
                    spent * 0.3,
                    income * 0.25,
                    spent * 0.35,
                  ],
                },
              ],
            }}
            width={width}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: opacity => `rgba(0,89,148,${opacity})`,
              labelColor: () => '#404751',
              barPercentage: 0.5,
            }}
            style={{ marginLeft: -22 }}
          />
          <View className="mt-4 flex-row justify-between">
            {[
              ['Income', income, 'text-primary'],
              ['Spent', spent, 'text-secondary'],
              ['Net', income - spent, 'text-on-surface'],
            ].map(([label, value, color]) => (
              <View key={label as string}>
                <Text className="font-label text-[10px] font-bold uppercase text-on-surface-variant">
                  {label}
                </Text>
                <Text
                  className={`font-headline text-lg font-extrabold ${color}`}
                >
                  {Number(value).toFixed(2)} {settings.currency}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-5 mt-4 rounded-2xl bg-surface-container-lowest p-6 shadow-editorial">
          <Text className="font-headline text-base font-bold text-on-surface">
            Spending Allocation
          </Text>
          <View className="mt-5 flex-row items-center gap-6">
            <Svg width={110} height={110} viewBox="0 0 110 110">
              <Circle
                cx={55}
                cy={55}
                r={42}
                stroke="#e0e2e9"
                strokeWidth={16}
                fill="none"
              />
              <Circle
                cx={55}
                cy={55}
                r={42}
                stroke="#005994"
                strokeWidth={16}
                fill="none"
                strokeDasharray={`${Math.max(20, (spent / total) * 160)} 264`}
                strokeLinecap="round"
                rotation="-90"
                origin="55,55"
              />
            </Svg>
            <View className="flex-1 gap-3">
              {categories.length === 0 ? (
                <Text className="font-body text-sm text-on-surface-variant">
                  No data yet
                </Text>
              ) : (
                categories.map(([category, value]) => (
                  <View
                    key={category}
                    className="flex-row items-center justify-between"
                  >
                    <Text className="font-body text-[13px] font-medium text-on-surface">
                      ● {category}
                    </Text>
                    <Text className="font-body text-[13px] font-bold text-on-surface-variant">
                      {Math.round((value / total) * 100)}%
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>

        <View className="mx-5 mt-4 rounded-2xl bg-surface-container-low p-6">
          <View className="flex-row items-center justify-between">
            <Text className="font-headline text-base font-bold text-on-surface">
              Spending Velocity
            </Text>
            <TouchableOpacity className="rounded-lg bg-primary px-3 py-1.5">
              <Text className="font-label text-[10px] font-extrabold text-on-primary">
                CSV
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-5 h-[120px] justify-end rounded-2xl bg-primary/5 p-4">
            <View
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.min(100, spent)}%` }}
            />
          </View>
          <Text className="mt-3 font-label text-[10px] font-bold uppercase text-on-surface-variant/60">
            Apr 01 · Apr 08 · Apr 15 · Apr 22 · Apr 30
          </Text>
        </View>

        <View className="mx-5 mt-4">
          <Text className="font-headline text-base font-extrabold text-on-surface">
            Active Budgets
          </Text>
          {settings.categoryBudgets.map(budget => {
            const spentForCategory = byCategory[budget.category] || 0;
            const percent = Math.round(
              (spentForCategory / budget.monthlyLimit) * 100,
            );
            const tone =
              percent > 85
                ? 'secondary'
                : percent > 60
                ? 'tertiary'
                : 'primary';
            const toneText =
              tone === 'secondary'
                ? 'text-secondary'
                : tone === 'tertiary'
                ? 'text-tertiary'
                : 'text-primary';
            const toneBg =
              tone === 'secondary'
                ? 'bg-secondary'
                : tone === 'tertiary'
                ? 'bg-tertiary'
                : 'bg-primary';
            return (
              <View
                key={budget.category}
                className="mt-3 rounded-2xl bg-surface-container-lowest p-5 shadow-editorial"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-body text-sm font-bold capitalize text-on-surface">
                    {budget.category}
                  </Text>
                  <Text
                    className={`rounded-full px-3 py-1 font-label text-[10px] font-bold uppercase ${toneText}`}
                  >
                    {percent > 85 ? 'Alert' : percent > 60 ? 'Watch' : 'Good'}
                  </Text>
                </View>
                <View className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container">
                  <View
                    className={`h-full rounded-full ${toneBg}`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </View>
                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="font-headline text-xl font-extrabold text-on-surface">
                    {spentForCategory.toFixed(2)} {settings.currency}
                  </Text>
                  <Text className="font-body text-[11px] text-on-surface-variant">
                    {percent}% used
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
