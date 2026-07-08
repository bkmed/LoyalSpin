import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Coupon } from '../../../../database/schema';

export default function AdminCoupons() {
  const coupons = useSelector((state: RootState) => state.coupons?.items || []);
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <View className="max-w-5xl">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-black text-slate-900 dark:text-white">
          Gestion des Coupons
        </Text>
        {!isCreating && (
          <TouchableOpacity onPress={() => setIsCreating(true)} className="bg-[#1E3A5F] px-4 py-2 rounded-lg">
            <Text className="text-white font-bold">+ Nouveau Coupon</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isCreating ? (
        <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Text className="text-xl font-bold mb-4 dark:text-white">Créer un Coupon</Text>
          
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 mt-4">Code</Text>
          <TextInput placeholder="Ex: ETE2026" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:text-white" />
          
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 mt-4">Titre</Text>
          <TextInput placeholder="Ex: -20% sur tout le menu" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:text-white" />

          <View className="flex-row justify-end space-x-4 mt-8">
            <TouchableOpacity onPress={() => setIsCreating(false)} className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-700">
              <Text className="text-slate-800 dark:text-white font-bold">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsCreating(false)} className="px-6 py-2 rounded-lg bg-[#1E3A5F]">
              <Text className="text-white font-bold">Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {coupons.map((coupon, idx) => (
            <View key={coupon.id} className={`p-4 flex-row justify-between items-center ${idx !== coupons.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
              <View>
                <Text className="font-bold text-lg dark:text-white">{coupon.title}</Text>
                <Text className="text-sm text-slate-500">Code: {coupon.code} | Utilisés: {coupon.usedQuantity}/{coupon.totalQuantity || '∞'}</Text>
              </View>
              <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                <Text className="text-green-700 dark:text-green-300 text-xs font-bold">{coupon.isActive ? 'Actif' : 'Inactif'}</Text>
              </View>
            </View>
          ))}
          {coupons.length === 0 && (
            <View className="p-8 items-center">
              <Text className="text-slate-500">Aucun coupon trouvé</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
