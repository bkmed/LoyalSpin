import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import { StickerConfig } from '../../../../database/schema';

export default function AdminSticker() {
  const configs = useSelector((state: RootState) => state.stickerConfig?.configs || {});
  const config = Object.values(configs)[0] as StickerConfig | undefined;
  const [shape, setShape] = useState<'round' | 'square' | 'rectangle'>(config?.shape || 'round');
  const [primaryColor, setPrimaryColor] = useState(config?.primaryColor || '#1E3A5F');

  const handleSave = () => {
    alert('Configuration Sticker sauvegardée.');
  };

  return (
    <View className="max-w-5xl">
      <Text className="text-3xl font-black text-slate-900 dark:text-white mb-2">
        Design des Stickers
      </Text>
      <Text className="text-slate-500 mb-8">Personnalisez le QR code qui sera scanné par vos clients.</Text>
      
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Text className="text-xl font-bold dark:text-white mb-4">Configuration</Text>
          
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-4">Forme</Text>
          <View className="flex-row space-x-2">
            {['round', 'square', 'rectangle'].map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setShape(s as any)}
                className={`px-4 py-2 rounded-lg border ${shape === s ? 'bg-blue-100 border-blue-500' : 'bg-slate-50 border-slate-200'} dark:bg-slate-900`}
              >
                <Text className="capitalize dark:text-white">{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-6">Couleur Principale (Hex)</Text>
          <TextInput
            value={primaryColor}
            onChangeText={setPrimaryColor}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
          />

          <TouchableOpacity onPress={handleSave} className="bg-[#1E3A5F] mt-8 py-4 rounded-xl shadow-md">
            <Text className="text-white font-bold text-center">Sauvegarder le design</Text>
          </TouchableOpacity>
        </View>
        
        <View className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 items-center justify-center">
          <Text className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-4">Aperçu en direct</Text>
          <View 
            className="border-2 border-dashed border-slate-300 items-center justify-center bg-white"
            style={{
              width: shape === 'rectangle' ? 240 : 180,
              height: 180,
              borderRadius: shape === 'round' ? 90 : 16,
              borderColor: primaryColor,
              borderWidth: 4,
              borderStyle: 'solid'
            }}
          >
            <Text className="text-xl font-bold text-slate-400">QR Code</Text>
            <Text className="text-xs text-slate-400 mt-2 text-center px-4">Scannez pour tourner la roue !</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
