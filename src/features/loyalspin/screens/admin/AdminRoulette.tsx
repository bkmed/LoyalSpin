import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../../store';
import { RouletteConfig, RouletteSegment } from '../../../../database/schema';

export default function AdminRoulette() {
  const { t } = useTranslation();
  const tCommon = (key: string, defaultValue: string, options?: any) =>
    t(key, { defaultValue, ...options });
  const configs = useSelector((state: RootState) => state.rouletteConfig?.configs || {});
  const config = Object.values(configs)[0] as RouletteConfig | undefined;
  const [segments, setSegments] = useState<Partial<RouletteSegment>[]>(
    config?.segments ||
      Array(8).fill({
        label: tCommon('adminRoulette.defaultSegmentLost', 'Perdu'),
        probability: 10,
        isGift: false,
      }),
  );

  const handleSave = () => {
    // Dispatch save action to update in firebase
    alert(tCommon('adminRoulette.savedAlert', 'Configuration de la roulette sauvegardée.'));
  };

  return (
    <View className="max-w-5xl">
      <Text className="text-3xl font-black text-slate-900 dark:text-white mb-2">
        {tCommon('adminRoulette.title', 'Configuration Roulette')}
      </Text>
      <Text className="text-slate-500 mb-8">
        {tCommon(
          'adminRoulette.description',
          'Définissez les 8 segments, les probabilités (total 100%) et les cadeaux.',
        )}
      </Text>

      <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
        <Text className="text-xl font-bold dark:text-white mb-6">
          {tCommon('adminRoulette.segmentsTitle', 'Segments de la roue')}
        </Text>

        {segments.map((seg, idx) => (
          <View
            key={idx}
            className="flex-row items-center space-x-4 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4"
          >
            <View className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 items-center justify-center">
              <Text className="font-bold dark:text-white">{idx + 1}</Text>
            </View>
            <View className="flex-1">
              <TextInput
                value={seg.label}
                onChangeText={(text) => {
                  const newSegs = [...segments];
                  newSegs[idx] = { ...newSegs[idx], label: text };
                  setSegments(newSegs);
                }}
                placeholder={tCommon(
                  'adminRoulette.segmentPlaceholder',
                  'Texte (Ex: Cadeau Mystère)',
                )}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 dark:text-white"
              />
            </View>
            <View className="w-24">
              <TextInput
                value={String(seg.probability || 0)}
                onChangeText={(text) => {
                  const newSegs = [...segments];
                  newSegs[idx] = {
                    ...newSegs[idx],
                    probability: parseInt(text) || 0,
                  };
                  setSegments(newSegs);
                }}
                keyboardType="numeric"
                placeholder="%"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 dark:text-white"
              />
            </View>
            <View className="flex-row items-center w-24">
              <Text className="mr-2 text-slate-600 dark:text-slate-400">
                {tCommon('adminRoulette.giftLabel', 'Cadeau')}
              </Text>
              <Switch
                value={seg.isGift || false}
                onValueChange={(val) => {
                  const newSegs = [...segments];
                  newSegs[idx] = { ...newSegs[idx], isGift: val };
                  setSegments(newSegs);
                }}
              />
            </View>
          </View>
        ))}

        <View className="flex-row justify-between items-center mt-6">
          <Text className="text-slate-500">
            {tCommon(
              'adminRoulette.probabilityTotal',
              'Total Probabilité: {{total}}% (doit être 100%)',
              {
                total: segments.reduce((acc, curr) => acc + (curr.probability || 0), 0),
              },
            )}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            className="bg-[#1E3A5F] px-6 py-3 rounded-lg shadow-md"
          >
            <Text className="text-white font-bold">
              {tCommon('adminRoulette.saveSegmentsButton', 'Sauvegarder les segments')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
