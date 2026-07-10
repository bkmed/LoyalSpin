import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export default function ClientDashboard({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const spinHistory = useSelector((state: RootState) => state.spinHistory?.items || []);

  const nextLanguage =
    i18n.language === 'fr' ? 'en' : i18n.language === 'en' ? 'ar' : 'fr';

  const languageLabel =
    i18n.language === 'ar'
      ? t('languages.languageLabelAR', 'العربية')
      : i18n.language === 'en'
      ? t('languages.languageLabelEN', 'English')
      : t('languages.languageLabelFR', 'Français');

  const languageNextLabel =
    nextLanguage === 'ar'
      ? t('languages.languageLabelAR', 'العربية')
      : nextLanguage === 'en'
      ? t('languages.languageLabelEN', 'English')
      : t('languages.languageLabelFR', 'Français');

  const wins = spinHistory.filter(h => h.outcome === 'win');

  return (
    <View className="flex-1 bg-slate-50 dark:bg-[#0B0F19] p-4 md:p-8">
      <View className="max-w-4xl mx-auto w-full">
        <View className="mb-8 flex-row justify-between items-start gap-4">
          <View>
            <Text className="text-3xl font-black text-slate-900 dark:text-white">
              {t('client.dashboardGreeting', {
                name: user?.name || t('client.defaultClient', 'Client'),
                defaultValue: `Hello, ${user?.name || t('client.defaultClient', 'Client')}!`,
              })}
            </Text>
            <Text className="text-slate-500 text-lg mt-2">
              {t('client.welcomeText', 'Welcome to your loyalty space.')}
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2 items-center">
            <TouchableOpacity
              onPress={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
                {themeMode === 'dark'
                  ? t('common.themeLight', 'Mode clair')
                  : t('common.themeDark', 'Mode sombre')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => i18n.changeLanguage(nextLanguage)}
              className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
                {t('common.languageSwitcher', 'Lang')}: {languageLabel} → {languageNextLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
                {t('common.editProfile', 'Modifier le profil')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TouchableOpacity onPress={() => navigation.navigate('QRScanner')} className="bg-emerald-600 p-8 rounded-3xl shadow-lg items-center justify-center">
            <Text className="text-white font-black text-2xl mb-2">{t('client.scanQrTitle', 'Scan a QR Code')}</Text>
            <Text className="text-emerald-100 text-center">{t('client.scanQrDescription', 'Scan in store to spin the wheel and win prizes!')}</Text>
          </TouchableOpacity>

          <View className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <Text className="text-slate-500 dark:text-slate-400 font-bold mb-2">{t('client.rewardsWon', 'Rewards won')}</Text>
            <Text className="text-5xl font-black text-[#1E3A5F] dark:text-white">{wins.length}</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('client.rewardsHistoryTitle', 'Your Rewards (History)')}</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {wins.length > 0 ? (
            wins.map((win, idx) => (
              <View key={win.id} className={`p-4 flex-row justify-between items-center ${idx !== wins.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                <View>
                  <Text className="font-bold text-lg dark:text-white">{win.segmentLabel}</Text>
                  <Text className="text-sm text-slate-500">{new Date(win.createdAt).toLocaleDateString()}</Text>
                </View>
                <View className="bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">{t('client.toClaim', 'To claim')}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="p-8 items-center justify-center">
              <Text className="text-slate-500 text-center">{t('client.noPrizesYet', "You haven't won any prizes yet.\nScan a QR code to get started!")}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
