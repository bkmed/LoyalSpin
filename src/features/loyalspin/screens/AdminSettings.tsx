import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface AdminSettingsProps {
  t: any;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-8">
        {tCommon('adminSettings.title', 'Thème & Branding')}
      </Text>

      <View className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <View className="bg-slate-950/90 dark:bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <Text className="text-sm text-slate-400 mb-6">
            {tCommon('adminSettings.subtitle', 'Personnalisez l\'apparence de votre programme de fidélité pour refléter l\'identité de votre marque.')}
          </Text>

          <View className="space-y-6">
            <View className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {tCommon('adminSettings.brandingLogo', "Logo de l'établissement")}
              </Text>
              <View className="h-36 rounded-3xl border border-dashed border-slate-700 bg-slate-950 flex items-center justify-center text-slate-500">
                <Text className="text-sm">PNG ou SVG recommandé. Taille max: 2MB.</Text>
              </View>
              <TouchableOpacity className="mt-4 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-white">
                {tCommon('adminSettings.chooseFile', 'Choisir un fichier')}
              </TouchableOpacity>
            </View>

            <View className="grid gap-4 sm:grid-cols-2">
              <View className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {tCommon('adminSettings.primaryColor', 'Couleur Primaire')}
                </Text>
                <TextInput
                  value="#A0CAFF"
                  onChangeText={() => {}}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                />
              </View>
              <View className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {tCommon('adminSettings.secondaryColor', 'Couleur Secondaire')}
                </Text>
                <TextInput
                  value="#FFB961"
                  onChangeText={() => {}}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                />
              </View>
            </View>

            <View className="grid gap-4 sm:grid-cols-2">
              <View className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {tCommon('adminSettings.typography', 'Typographie')}
                </Text>
                <Text className="text-sm text-slate-100">Plus Jakarta Sans</Text>
              </View>
              <View className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {tCommon('adminSettings.defaultMode', 'Mode par défaut')}
                </Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
                    {tCommon('adminSettings.darkMode', 'Sombre')}
                  </TouchableOpacity>
                  <TouchableOpacity className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-400">
                    {tCommon('adminSettings.lightMode', 'Clair')}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {tCommon('adminSettings.socialLinks', 'Réseaux sociaux')}
              </Text>
              <TextInput
                value="URL Google Maps"
                onChangeText={() => {}}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white mb-3"
              />
              <TextInput
                value="Lien Instagram"
                onChangeText={() => {}}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </View>
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <Text className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-6">
            {tCommon('adminSettings.livePreview', 'Aperçu en direct')}
          </Text>
          <View className="rounded-[40px] bg-[#0B1122] p-6 text-slate-100">
            <Text className="text-lg font-black tracking-tight mb-4">LoyalSpin</Text>
            <View className="rounded-3xl bg-slate-900 p-6 mb-5">
              <Text className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">{tCommon('adminSettings.memberStatus', 'MEMBRE GOLD')}</Text>
              <Text className="text-2xl font-black mb-2">#LS-29384</Text>
              <Text className="text-sm text-slate-400">1,420 pts</Text>
            </View>
            <View className="grid grid-cols-5 gap-3 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} className="h-14 rounded-2xl bg-slate-900" />
              ))}
            </View>
            <Text className="text-sm text-slate-400 mb-4">
              {tCommon('adminSettings.cardLabel', 'Votre carte café')}
            </Text>
            <View className="rounded-3xl bg-slate-900 p-4">
              <Text className="text-sm text-slate-100">{tCommon('adminSettings.limitedOffer', 'Offre limitée')}</Text>
              <Text className="text-base font-bold">Spin & Win -50% sur les Lattés</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminSettings;
