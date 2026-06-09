import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSubscriptionGuard } from '../context/SubscriptionGuardContext';

interface TrialBannerProps {
  onChoosePlan?: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ onChoosePlan }) => {
  const { t } = useTranslation();
  const { isTrialActive, remainingTrialUses } = useSubscriptionGuard();

  const tCommon = (key: string, defaultValue: string, options?: any) =>
    t(key, { defaultValue, ...options });

  if (!isTrialActive) {
    return null;
  }

  return (
    <View className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3 mx-4 rounded-lg mb-4 shadow-lg border border-orange-600">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white font-black text-base mb-1">
            {tCommon(
              'subscription.trialBanner.title',
              '🎯 Essai gratuit actif',
            )}
          </Text>
          <Text className="text-orange-50 text-sm font-semibold">
            {tCommon(
              'subscription.trialBanner.message',
              '{{remaining}} utilisations restantes sur {{limit}}',
              {
                remaining: remainingTrialUses,
                limit: 15,
              },
            )}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onChoosePlan}
          className="bg-white rounded-lg px-4 py-2 ml-2"
        >
          <Text className="text-orange-600 font-black text-xs">
            {tCommon('subscription.choosePlan', 'CHOISIR')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrialBanner;
