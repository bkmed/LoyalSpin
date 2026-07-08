import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export default function AdminHistory() {
  const spinHistory = useSelector((state: RootState) => state.spinHistory?.items || []);

  const handleExport = () => {
    alert('Export CSV de l\'historique généré.');
  };

  return (
    <View className="max-w-5xl">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-black text-slate-900 dark:text-white">
          Historique & Clients
        </Text>
        <TouchableOpacity onPress={handleExport} className="bg-emerald-600 px-4 py-2 rounded-lg">
          <Text className="text-white font-bold">Exporter CSV</Text>
        </TouchableOpacity>
      </View>
      
      <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-full">
            {/* Header */}
            <View className="flex-row border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
              <Text className="w-32 font-bold text-slate-500 dark:text-slate-400">Date</Text>
              <Text className="w-40 font-bold text-slate-500 dark:text-slate-400">Utilisateur (ID)</Text>
              <Text className="w-40 font-bold text-slate-500 dark:text-slate-400">Résultat</Text>
              <Text className="w-48 font-bold text-slate-500 dark:text-slate-400">Détail du lot</Text>
            </View>
            
            {/* Rows */}
            {spinHistory.map((spin, idx) => (
              <View key={spin.id} className={`flex-row p-4 ${idx !== spinHistory.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                <Text className="w-32 text-slate-700 dark:text-slate-300">
                  {new Date(spin.createdAt).toLocaleDateString()}
                </Text>
                <Text className="w-40 text-slate-700 dark:text-slate-300">
                  {spin.userId || 'Anonyme'}
                </Text>
                <Text className={`w-40 font-bold ${spin.outcome === 'win' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {spin.outcome === 'win' ? 'Gagné' : 'Perdu'}
                </Text>
                <Text className="w-48 text-slate-700 dark:text-slate-300">
                  {spin.segmentLabel}
                </Text>
              </View>
            ))}
            
            {spinHistory.length === 0 && (
              <View className="p-8 items-center justify-center w-full">
                <Text className="text-slate-500">Aucun historique de scan trouvé.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
