import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { useAuth } from '../../context/AuthContext';
import {
  resetAll,
  selectTransactions,
  selectWalletSettings,
  updateSettings,
} from '../../store/slices/walletSlice';
import { trackWalletScreen } from '../../services/analyticsService';

const Toggle = ({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`h-[26px] w-11 rounded-full p-[3px] ${
      value ? 'items-end bg-primary' : 'items-start bg-outline-variant'
    }`}
  >
    <View className="h-5 w-5 rounded-full bg-white shadow-editorial" />
  </TouchableOpacity>
);

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const settings = useSelector(selectWalletSettings);
  const transactions = useSelector(selectTransactions);

  useEffect(() => {
    trackWalletScreen('Profile');
  }, []);

  const exportCsv = async () => {
    const csv = [
      'date,label,category,amount,account,tags,note',
      ...transactions.map(tx =>
        [
          tx.date,
          tx.label,
          tx.category,
          tx.amount,
          tx.accountId,
          tx.tags.join('|'),
          tx.note || '',
        ]
          .map(value => `"${String(value).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');
    await Share.share({ message: csv });
  };

  return (
    <View className="flex-1 bg-background">
      <TopAppBar />
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        <View className="mx-5 mt-4 flex-row items-center gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-editorial">
          <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-primary">
            <Text className="font-headline text-[22px] font-extrabold text-white">
              {(user?.name || 'SU')
                .split(' ')
                .map(part => part[0])
                .join('')
                .slice(0, 2)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-headline text-lg font-extrabold text-on-surface">
              {user?.name || 'Plombier User'}
            </Text>
            <Text className="mt-1 font-body text-xs text-on-surface-variant">
              {user?.email}
            </Text>
            <Text className="mt-2 self-start rounded-full bg-primary/10 px-3 py-1.5 font-label text-[10px] font-extrabold uppercase text-primary">
              {t('profile.verifiedWallet', 'Verified Wallet')}
            </Text>
          </View>
        </View>

        <Text className="px-5 pb-2 pt-5 font-label text-[11px] font-extrabold uppercase tracking-[2px] text-on-surface-variant">
          {t('profile.display', 'Display')}
        </Text>
        <View className="mx-5 rounded-2xl bg-surface-container-lowest shadow-editorial">
          {[
            [
              t('profile.language', 'Language'),
              i18n.language.toUpperCase(),
              'language',
            ],
            [t('profile.currency', 'Currency'), settings.currency, 'payments'],
          ].map(([label, value, icon]) => (
            <TouchableOpacity
              key={label}
              className="flex-row items-center justify-between px-5 py-4"
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons
                  name={icon as string}
                  size={20}
                  color="#005994"
                />
                <Text className="font-body text-sm font-bold text-on-surface">
                  {label}
                </Text>
              </View>
              <Text className="font-body text-sm text-on-surface-variant">
                {value}
              </Text>
            </TouchableOpacity>
          ))}
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="font-body text-sm font-bold text-on-surface">
              {t('profile.hideBalances', 'Hide Balances')}
            </Text>
            <Toggle
              value={settings.hideBalances}
              onPress={() =>
                dispatch(
                  updateSettings({ hideBalances: !settings.hideBalances }),
                )
              }
            />
          </View>
        </View>

        <Text className="px-5 pb-2 pt-5 font-label text-[11px] font-extrabold uppercase tracking-[2px] text-on-surface-variant">
          {t('profile.budgetAlerts', 'Budget & Alerts')}
        </Text>
        <View className="mx-5 rounded-2xl bg-surface-container-lowest shadow-editorial">
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="font-body text-sm font-bold text-on-surface">
              {t('profile.monthlyBudget', 'Monthly Budget')}
            </Text>
            <Text className="font-body text-sm text-on-surface-variant">
              {settings.monthlyBudget} {settings.currency}
            </Text>
          </View>
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="font-body text-sm font-bold text-on-surface">
              {t('profile.notifications', 'Notifications')}
            </Text>
            <Toggle
              value={settings.notificationsEnabled}
              onPress={() =>
                dispatch(
                  updateSettings({
                    notificationsEnabled: !settings.notificationsEnabled,
                  }),
                )
              }
            />
          </View>
        </View>

        <Text className="px-5 pb-2 pt-5 font-label text-[11px] font-extrabold uppercase tracking-[2px] text-on-surface-variant">
          {t('profile.shortcuts', 'Shortcuts')}
        </Text>
        <View className="mx-5 rounded-2xl bg-surface-container-lowest p-2 shadow-editorial">
          {settings.shortcuts.map(shortcut => (
            <View
              key={shortcut.id}
              className="flex-row items-center justify-between rounded-xl px-3 py-3"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">{shortcut.emoji}</Text>
                <Text className="font-body text-sm font-bold text-on-surface">
                  {shortcut.customLabel || shortcut.i18nKey?.split('.').pop()}
                </Text>
              </View>
              <Text className="font-body text-sm font-bold text-primary">
                {shortcut.defaultAmount} {settings.currency}
              </Text>
            </View>
          ))}
        </View>

        <Text className="px-5 pb-2 pt-5 font-label text-[11px] font-extrabold uppercase tracking-[2px] text-on-surface-variant">
          {t('informations')}
        </Text>
        <View className="mx-5 rounded-2xl bg-surface-container-lowest shadow-editorial overflow-hidden">
          {[
            { page: 'info', label: t('informations') },
            { page: 'privacy', label: t('politique') },
            { page: 'terms', label: t('conditions_util') },
            { page: 'sitemap', label: t('plan_site') },
          ].map(item => (
            <TouchableOpacity
              key={item.page}
              onPress={() =>
                navigation.navigate('LegalScreen', { page: item.page })
              }
              className="flex-row items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700"
            >
              <Text className="font-body text-sm font-bold text-on-surface">
                {item.label}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#005994" />
            </TouchableOpacity>
          ))}
        </View>

        <Text className="px-5 pb-2 pt-5 font-label text-[11px] font-extrabold uppercase tracking-[2px] text-on-surface-variant">
          {t('profile.data', 'Data')}
        </Text>
        <View className="mx-5 rounded-2xl bg-surface-container-lowest shadow-editorial">
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-4"
            onPress={exportCsv}
          >
            <Text className="font-body text-sm font-bold text-on-surface">
              {t('profile.exportCsv', 'Export CSV')}
            </Text>
            <MaterialIcons name="download" size={20} color="#005994" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-4"
            onPress={() =>
              Alert.alert(
                t('profile.resetTitle', 'Reset?'),
                t('profile.resetMessage', 'This cannot be undone'),
                [
                  { text: t('common.cancel', 'Cancel'), style: 'cancel' },
                  {
                    text: t('profile.resetConfirm', 'Reset'),
                    style: 'destructive',
                    onPress: () => dispatch(resetAll()),
                  },
                ],
              )
            }
          >
            <Text className="font-body text-sm font-bold text-secondary">
              {t('profile.resetAllData', 'Reset All Data')}
            </Text>
            <MaterialIcons name="delete-forever" size={20} color="#bc000d" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mx-5 mt-6 rounded-xl bg-primary py-4"
          onPress={() => signOut()}
        >
          <Text className="text-center font-label text-xs font-extrabold uppercase tracking-[1px] text-white">
            {t('profile.signOut', 'Sign Out')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
