import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

interface AdminStatsProps {
  projectId?: string | null;
}

export default function AdminStats({ projectId }: AdminStatsProps) {
  const coupons = useSelector((state: RootState) => state.coupons?.items || []);
  const spinHistory = useSelector((state: RootState) => state.spinHistory?.items || []);
  const filteredCoupons = projectId ? coupons.filter(c => c.projectId === projectId) : coupons;
  const filteredSpinHistory = projectId ? spinHistory.filter(s => s.projectId === projectId) : spinHistory;

  const totalScans = filteredSpinHistory.length;
  const rewardsDistributed = filteredSpinHistory.filter(h => h.outcome === 'win').length;

  const createdCoupons = filteredCoupons.reduce((sum, c) => sum + (c.totalQuantity || 1), 0);
  const usedCoupons = filteredCoupons.reduce((sum, c) => sum + (c.usedQuantity || 0), 0);

  return (
    <View className="max-w-5xl">
      <Text className="text-3xl font-black text-slate-900 dark:text-white mb-8">
        Tableau de bord
      </Text>
      
      <View className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Text className="text-slate-500 dark:text-slate-400 font-bold mb-2">Total Scans (QR)</Text>
          <Text className="text-4xl font-black text-[#1E3A5F] dark:text-white">{totalScans}</Text>
        </View>
        
        <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Text className="text-slate-500 dark:text-slate-400 font-bold mb-2">Récompenses Distribuées</Text>
          <Text className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{rewardsDistributed}</Text>
        </View>
        
        <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Text className="text-slate-500 dark:text-slate-400 font-bold mb-2">Coupons Utilisés / Créés</Text>
          <Text className="text-4xl font-black text-amber-500 dark:text-amber-400">
            {usedCoupons} <Text className="text-2xl text-slate-400">/ {createdCoupons}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
