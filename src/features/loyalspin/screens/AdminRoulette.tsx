import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface AdminRouletteProps {
  t: any;
}

const AdminRoulette: React.FC<AdminRouletteProps> = ({ t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const segments = [
    { label: 'Free Latte', value: '10' },
    { label: '10% OFF', value: '25' },
    { label: 'Pastry', value: '15' },
    { label: 'Points x2', value: '20' },
    { label: 'No Luck', value: '20' },
    { label: 'Espresso', value: '10' },
  ];

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-8">
        {tCommon('adminRoulette.title', 'Roulette Configuration')}
      </Text>
      <View className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <View className="bg-slate-950/90 dark:bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <Text className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
            {tCommon('adminRoulette.subtitle', 'Design the visual experience and reward probabilities for your customers.')}
          </Text>

          <View className="space-y-6">
            <View>
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {tCommon('adminRoulette.wheelName', 'Wheel Name')}
              </Text>
              <TextInput
                value="Morning Rush Rewards"
                onChangeText={() => {}}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                placeholder={tCommon('adminRoulette.wheelNamePlaceholder', 'Morning Rush Rewards')}
              />
            </View>

            <View className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-bold text-slate-100">
                  {tCommon('adminRoulette.segments', 'Segments (2–8)')}
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-200">
                    -
                  </TouchableOpacity>
                  <Text className="text-xs text-slate-300">6</Text>
                  <TouchableOpacity className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-200">
                    +
                  </TouchableOpacity>
                </View>
              </View>
              <View className="space-y-3">
                {segments.map((segment, index) => (
                  <View key={index} className="flex-row items-center gap-3 rounded-2xl bg-slate-900 px-3 py-3 border border-slate-800">
                    <View className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200">
                      {segment.label.charAt(0)}
                    </View>
                    <Text className="flex-1 text-sm text-slate-200">{segment.label}</Text>
                    <View className="flex-row items-center gap-1 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-700 text-slate-300">
                      <Text className="text-xs">{segment.value}</Text>
                      <Text className="text-xs text-slate-400">%</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Text className="mt-4 text-right text-xs text-emerald-400">
                100% ✔
              </Text>
            </View>

            <View className="grid grid-cols-2 gap-4">
              <View className="rounded-3xl bg-slate-900 border border-slate-800 p-5">
                <Text className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">
                  {tCommon('adminRoulette.spinsPerDay', 'Spins per day')}
                </Text>
                <TextInput
                  value="1"
                  onChangeText={() => {}}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                />
              </View>
              <View className="rounded-3xl bg-slate-900 border border-slate-800 p-5">
                <Text className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">
                  {tCommon('adminRoulette.minPurchase', 'Min. Purchase')}
                </Text>
                <TextInput
                  value="$5.00"
                  onChangeText={() => {}}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <Text className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
            {tCommon('adminRoulette.livePreview', 'Live Preview')}
          </Text>
          <View className="rounded-3xl bg-slate-800 p-6 flex items-center justify-center">
            <View className="h-[300px] w-[300px] rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 shadow-inner flex items-center justify-center">
              <View className="absolute inset-0 rounded-full border border-slate-600" />
              <Text className="text-white text-xl font-black">SPIN</Text>
            </View>
          </View>
          <View className="mt-8 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-slate-900">
            <Text className="text-xs uppercase tracking-[0.3em] text-slate-700 mb-2">
              {tCommon('adminRoulette.coupon', 'Coupon')}
            </Text>
            <Text className="text-xl font-black">Free Latte</Text>
            <Text className="text-sm text-slate-800 mt-2">
              {tCommon('adminRoulette.unlock', 'Unlock with Morning Spin')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminRoulette;
