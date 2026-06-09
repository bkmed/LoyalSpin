import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSubscriptionGuard } from '../../context/SubscriptionGuardContext';

interface SubscriptionExpiredScreenProps {
  onChoosePlan?: (planId: string) => void;
  onContactSupport?: () => void;
}

export const SubscriptionExpiredScreen: React.FC<SubscriptionExpiredScreenProps> = ({
  onChoosePlan,
  onContactSupport,
}) => {
  const { t } = useTranslation();
  const { subscription } = useSubscriptionGuard();

  const tCommon = (key: string, defaultValue: string, options?: any) =>
    t(key, { defaultValue, ...options });

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0B0F19] dark:to-[#080B11]">
      <View className="min-h-screen px-6 py-12 flex items-center justify-center">
        <View className="w-full max-w-md space-y-8">
          {/* Icon */}
          <View className="flex items-center justify-center">
            <View className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <Text className="text-5xl">⏰</Text>
            </View>
          </View>

          {/* Title */}
          <View className="space-y-2">
            <Text className="text-3xl font-black text-center text-slate-900 dark:text-white">
              {tCommon(
                'subscription.trialExpired.title',
                'Votre période d\'essai est terminée',
              )}
            </Text>
            <Text className="text-base text-center text-slate-600 dark:text-slate-300">
              {tCommon(
                'subscription.trialExpired.subtitle',
                'Choisissez un abonnement pour continuer à utiliser LoyalSpin.',
              )}
            </Text>
          </View>

          {/* Trial Summary */}
          {subscription && (
            <View className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-700">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {tCommon('subscription.trialUsed', 'Essais utilisés:')}
                </Text>
                <Text className="text-base font-bold text-slate-900 dark:text-white">
                  {subscription.trialUsed || 0} / {subscription.trialLimit || 15}
                </Text>
              </View>
              <View className="bg-slate-100 dark:bg-slate-700 rounded-lg h-2 overflow-hidden">
                <View
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-full"
                  style={{
                    width: `${((subscription.trialUsed || 0) / (subscription.trialLimit || 15)) * 100}%`,
                  }}
                />
              </View>
            </View>
          )}

          {/* Plans Section */}
          <View className="space-y-4">
            <Text className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {tCommon('subscription.choosePlan', 'Choisissez votre abonnement')}
            </Text>

            {/* Starter Plan */}
            <TouchableOpacity
              onPress={() => onChoosePlan?.('starter')}
              activeOpacity={0.8}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-lg font-black text-slate-900 dark:text-white">
                    {tCommon('subscription.plans.starter.name', 'Starter')}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {tCommon(
                      'subscription.plans.starter.description',
                      'Pour débuter',
                    )}
                  </Text>
                </View>
                <Text className="text-2xl font-black text-orange-500">
                  9,99€<Text className="text-xs text-slate-600 dark:text-slate-400">/mois</Text>
                </Text>
              </View>
              <View className="space-y-2">
                <PlanFeature
                  text={tCommon('subscription.plans.starter.f1', '1 établissement')}
                />
                <PlanFeature
                  text={tCommon('subscription.plans.starter.f2', '500 clients')}
                />
                <PlanFeature
                  text={tCommon('subscription.plans.starter.f3', 'Roulette')}
                />
                <PlanFeature
                  text={tCommon('subscription.plans.starter.f4', 'Coupons')}
                />
              </View>
              <TouchableOpacity
                onPress={() => onChoosePlan?.('starter')}
                className="bg-orange-500 rounded-lg py-3 mt-4"
              >
                <Text className="text-white font-bold text-center">
                  {tCommon('subscription.subscribe', 'Souscrire')}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Business Plan (Featured) */}
            <TouchableOpacity
              onPress={() => onChoosePlan?.('business')}
              activeOpacity={0.8}
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-5 space-y-3 border-2 border-blue-400 dark:border-blue-500 relative"
            >
              <View className="absolute top-3 right-3 bg-yellow-400 px-3 py-1 rounded-full">
                <Text className="text-xs font-black text-slate-900">
                  {tCommon('subscription.popular', 'POPULAIRE')}
                </Text>
              </View>
              <View className="flex-row justify-between items-start mb-2 pr-24">
                <View>
                  <Text className="text-lg font-black text-white">
                    {tCommon('subscription.plans.business.name', 'Business')}
                  </Text>
                  <Text className="text-sm text-blue-100 mt-1">
                    {tCommon(
                      'subscription.plans.business.description',
                      'Recommandé',
                    )}
                  </Text>
                </View>
                <Text className="text-2xl font-black text-white">
                  29,99€<Text className="text-xs text-blue-100">/mois</Text>
                </Text>
              </View>
              <View className="space-y-2">
                <PlanFeatureLight
                  text={tCommon('subscription.plans.business.f1', '3 établissements')}
                />
                <PlanFeatureLight
                  text={tCommon(
                    'subscription.plans.business.f2',
                    'Clients illimités',
                  )}
                />
                <PlanFeatureLight
                  text={tCommon(
                    'subscription.plans.business.f3',
                    'Analytiques avancées',
                  )}
                />
                <PlanFeatureLight
                  text={tCommon('subscription.plans.business.f4', 'Branding')}
                />
              </View>
              <TouchableOpacity
                onPress={() => onChoosePlan?.('business')}
                className="bg-white rounded-lg py-3 mt-4"
              >
                <Text className="text-blue-600 font-bold text-center">
                  {tCommon('subscription.subscribe', 'Souscrire')}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Enterprise Plan */}
            <TouchableOpacity
              onPress={() => onChoosePlan?.('enterprise')}
              activeOpacity={0.8}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-lg font-black text-slate-900 dark:text-white">
                    {tCommon('subscription.plans.enterprise.name', 'Enterprise')}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {tCommon(
                      'subscription.plans.enterprise.description',
                      'Pour les grands projets',
                    )}
                  </Text>
                </View>
                <Text className="text-2xl font-black text-slate-900 dark:text-white">
                  299€<Text className="text-xs text-slate-600 dark:text-slate-400">/an</Text>
                </Text>
              </View>
              <View className="space-y-2">
                <PlanFeature
                  text={tCommon(
                    'subscription.plans.enterprise.f1',
                    'Établissements illimités',
                  )}
                />
                <PlanFeature
                  text={tCommon(
                    'subscription.plans.enterprise.f2',
                    'Support prioritaire',
                  )}
                />
                <PlanFeature
                  text={tCommon(
                    'subscription.plans.enterprise.f3',
                    'Multi-admin',
                  )}
                />
                <PlanFeature
                  text={tCommon('subscription.plans.enterprise.f4', 'API')}
                />
              </View>
              <TouchableOpacity
                onPress={() => onChoosePlan?.('enterprise')}
                className="bg-slate-900 dark:bg-slate-700 rounded-lg py-3 mt-4"
              >
                <Text className="text-white font-bold text-center">
                  {tCommon('subscription.subscribe', 'Souscrire')}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Support Button */}
          <TouchableOpacity
            onPress={onContactSupport}
            className="py-4 px-6 rounded-lg border border-slate-300 dark:border-slate-600"
          >
            <Text className="text-center font-semibold text-slate-700 dark:text-slate-300">
              {tCommon('subscription.contactSupport', 'Contacter le support')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

interface PlanFeatureProps {
  text: string;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ text }) => (
  <View className="flex-row items-center gap-3">
    <View className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
      <Text className="text-xs">✓</Text>
    </View>
    <Text className="text-sm text-slate-700 dark:text-slate-300 flex-1">{text}</Text>
  </View>
);

const PlanFeatureLight: React.FC<PlanFeatureProps> = ({ text }) => (
  <View className="flex-row items-center gap-3">
    <View className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
      <Text className="text-xs text-white">✓</Text>
    </View>
    <Text className="text-sm text-blue-50 flex-1">{text}</Text>
  </View>
);

export default SubscriptionExpiredScreen;
