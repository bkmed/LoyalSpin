import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export default function ClientDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const spinHistory = useSelector((state: RootState) => state.spinHistory?.items || []);

  const wins = spinHistory.filter(h => h.outcome === 'win');

  return (
    <View className="flex-1 bg-slate-50 dark:bg-[#0B0F19] p-4 md:p-8">
      <View className="max-w-4xl mx-auto w-full">
        <View className="mb-8">
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            Bonjour, {user?.name || 'Client'} !
          </Text>
          <Text className="text-slate-500 text-lg mt-2">
            Bienvenue sur votre espace de fidélité.
          </Text>
        </View>

        <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TouchableOpacity className="bg-emerald-600 p-8 rounded-3xl shadow-lg items-center justify-center">
            <Text className="text-white font-black text-2xl mb-2">Scanner un QR Code</Text>
            <Text className="text-emerald-100 text-center">Scannez en magasin pour tourner la roue et gagner des cadeaux !</Text>
          </TouchableOpacity>

          <View className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <Text className="text-slate-500 dark:text-slate-400 font-bold mb-2">Cadeaux gagnés</Text>
            <Text className="text-5xl font-black text-[#1E3A5F] dark:text-white">{wins.length}</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Vos Récompenses (Historique)</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {wins.length > 0 ? (
            wins.map((win, idx) => (
              <View key={win.id} className={`p-4 flex-row justify-between items-center ${idx !== wins.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                <View>
                  <Text className="font-bold text-lg dark:text-white">{win.segmentLabel}</Text>
                  <Text className="text-sm text-slate-500">{new Date(win.createdAt).toLocaleDateString()}</Text>
                </View>
                <View className="bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">À réclamer</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="p-8 items-center justify-center">
              <Text className="text-slate-500 text-center">Vous n'avez pas encore gagné de cadeaux.{'\n'}Scannez un QR code pour commencer !</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
