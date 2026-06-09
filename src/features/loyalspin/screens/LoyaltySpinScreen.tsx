import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import LoyaltyWheel from '../components/LoyaltyWheel';
import { useDispatch } from 'react-redux';
import { claimPrize } from '../../../store/slices/loyalSpinSlice';
import type { AppDispatch } from '../../../store';

const LoyaltySpinScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
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
    <View className="p-6 flex-1 items-center justify-start">
      <Text className="text-2xl font-black mb-6">
        {t('loyalspin.title', { defaultValue: 'Roulette de fidélité' })}
      </Text>
      <LoyaltyWheel segments={prizes} onFinish={onFinish} />
    </View>
  );
};

export default LoyaltySpinScreen;
