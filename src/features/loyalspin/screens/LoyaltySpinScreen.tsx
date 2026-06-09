import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import LoyaltyWheel from '../components/LoyaltyWheel';
import { useDispatch, useSelector } from 'react-redux';
import { claimPrize } from '../../../store/slices/loyalSpinSlice';
import type { AppDispatch, RootState } from '../../../store';
import { useTheme } from '../../../context/ThemeContext';

const LoyaltySpinScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const claimed = useSelector((s: RootState) => s.loyal?.claimed || []);
  const prizes = [
    t('loyalspin.prize.discount10', { defaultValue: '10% off' }),
    t('loyalspin.prize.free_shipping', { defaultValue: 'Free shipping' }),
    t('loyalspin.prize.bonus_points', { defaultValue: '50 bonus points' }),
    t('loyalspin.prize.gift', { defaultValue: 'Free gift' }),
  ];

  const onFinish = (prize: string) => {
    dispatch(claimPrize({ prize }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '900', color: theme.colors.text, marginBottom: 12 }}>
        {t('loyalspin.title', { defaultValue: 'Roulette de fidélité' })}
      </Text>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: theme.colors.subText }}>{t('loyalspin.yourLevel', { defaultValue: 'Niveau fidélité' })}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ fontWeight: '800', color: theme.colors.primary }}>Silver</Text>
          <TouchableOpacity onPress={() => {}} style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
            <Text style={{ color: theme.colors.card, fontWeight: '800' }}>{t('loyalspin.spin', { defaultValue: 'Spin' })}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: 18, borderRadius: 24, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.card, padding: 18 }}>
        <Text style={{ fontWeight: '900', color: theme.colors.text, marginBottom: 8 }}>{t('loyalspin.howItWorksTitle', { defaultValue: 'Comment ça marche' })}</Text>
        <Text style={{ color: theme.colors.subText, lineHeight: 20 }}>
          {t('loyalspin.howItWorksText', {
            defaultValue:
              'Appuyez sur la roue pour la lancer, remportez une récompense instantanée et conservée dans votre compte LoyalSpin.',
          })}
        </Text>
        <View style={{ marginTop: 14 }}>
          {prizes.map((prize, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }} />
              <Text style={{ color: theme.colors.text }}>{prize}</Text>
            </View>
          ))}
        </View>
      </View>

      <LoyaltyWheel segments={prizes} onFinish={onFinish} />

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: '800', color: theme.colors.text, marginBottom: 8 }}>{t('loyalspin.recentWinsTitle', { defaultValue: 'Derniers gains' })}</Text>
        {claimed.length === 0 ? (
          <Text style={{ color: theme.colors.subText }}>{t('loyalspin.noWins', { defaultValue: 'Aucun gain récent' })}</Text>
        ) : (
          claimed.slice(-5).reverse().map((c, idx) => (
            <View key={idx} style={{ padding: 12, borderRadius: 12, backgroundColor: theme.colors.card, marginBottom: 8 }}>
              <Text style={{ fontWeight: '700', color: theme.colors.text }}>{c.prize}</Text>
              <Text style={{ color: theme.colors.subText, fontSize: 12 }}>{new Date(c.claimedAt).toLocaleString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default LoyaltySpinScreen;
