import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';

interface SocialGateScreenProps {
  t: any;
}

const networks = [
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Share your LoyalSpin progress on Facebook and earn bonus points.',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Invite friends via WhatsApp to unlock a loyalty reward.',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Post your LoyalSpin achievement for extra loyalty perks.',
  },
];

const SocialGateScreen: React.FC<SocialGateScreenProps> = ({ t }) => {
  const [connected, setConnected] = useState<string[]>([]);

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const toggleNetwork = (networkId: string) => {
    setConnected(prev =>
      prev.includes(networkId)
        ? prev.filter(item => item !== networkId)
        : [...prev, networkId],
    );
  };

  const handleShare = (networkId: string) => {
    toggleNetwork(networkId);
    Alert.alert(
      tCommon('web.socialGate.sharedTitle', 'Network connected!'),
      tCommon(
        'web.socialGate.sharedMessage',
        'Your account is now linked. You will receive loyalty credit for your next referral.',
      ),
    );
  };

  return (
    <ScrollView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black text-slate-900 dark:text-white">
        {tCommon('web.socialGate.title', 'Social Gate')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl">
        {tCommon(
          'web.socialGate.subtitle',
          'Connect your social networks to unlock bonus rewards and share your LoyalSpin journey.',
        )}
      </Text>

      <View className="mt-10 grid gap-6 lg:grid-cols-3">
        {networks.map(network => {
          const isConnected = connected.includes(network.id);
          return (
            <View
              key={network.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm"
            >
              <Text className="text-xs font-black uppercase tracking-[0.24em] text-[#F97316]">
                {network.label}
              </Text>
              <Text className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {tCommon(
                  `web.socialGate.networks.${network.id}.label`,
                  network.label,
                )}
              </Text>
              <Text className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {tCommon(
                  `web.socialGate.networks.${network.id}.description`,
                  network.description,
                )}
              </Text>
              <View className="mt-6 flex flex-col gap-3">
                <TouchableOpacity
                  onPress={() => handleShare(network.id)}
                  className={`rounded-3xl px-4 py-3 text-sm font-black text-white transition ${
                    isConnected
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-[#1E3A5F] hover:bg-[#152a47]'
                  }`}
                >
                  {isConnected
                    ? tCommon('web.socialGate.connectedButton', 'Connected')
                    : tCommon(
                        'web.socialGate.connectButton',
                        'Connect & Share',
                      )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      <View className="mt-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
        <Text className="text-sm font-black uppercase tracking-[0.24em] text-slate-700 dark:text-slate-300">
          {tCommon('web.socialGate.benefitsTitle', 'Why connect?')}
        </Text>
        <Text className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {tCommon(
            'web.socialGate.benefitsText',
            'Linking your accounts helps us deliver more personalized rewards, faster promotions, and exclusive loyalty bonus offers.',
          )}
        </Text>
        <Text className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
          {tCommon(
            'web.socialGate.completedSteps', 'Connected networks:')} {connected.length}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SocialGateScreen;
