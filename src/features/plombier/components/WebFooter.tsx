import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import FooterLinks from './FooterLinks';
import { Role } from '../utils/webTranslations';

interface WebFooterProps {
  businessName: string;
  currentTheme: string;
  currentRole: Role;
  supportWhatsAppDigits: string;
  supportWhatsAppNumber: string;
  supportEmail: string;
  t: any;
  setActiveTab: (tab: string) => void;
}

export const WebFooter: React.FC<WebFooterProps> = ({
  businessName,
  currentTheme,
  currentRole,
  supportWhatsAppDigits,
  supportWhatsAppNumber,
  supportEmail,
  t,
  setActiveTab,
}) => {
  const tc = (key: string, fallback: string) =>
    t(key, { defaultValue: fallback });

  const openWhatsApp = () => {
    const msg = tc('web.whatsapp_msg', "Bonjour, j'ai besoin d'un plombier.");
    const url = `https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
      msg,
    )}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View>
      <View
        className={`border-t transition-colors ${
          currentTheme === 'dark'
            ? 'bg-[#0B0F19] border-slate-800 text-slate-400'
            : 'bg-slate-100 border-slate-200 text-slate-600'
        } py-12`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <View className="space-y-4">
            <Text className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              🛠️ {businessName}
            </Text>
            <Text className="text-xs leading-relaxed font-semibold text-slate-900 dark:text-slate-100">
              {tc(
                'web.foot_desc',
                'Votre expert en plomberie, climatisation et gaz en Tunisie.',
              )}
            </Text>
          </View>

          <FooterLinks
            setActiveTab={setActiveTab}
            currentRole={currentRole}
            supportWhatsAppDigits={supportWhatsAppDigits}
            supportWhatsAppNumber={supportWhatsAppNumber}
            supportEmail={supportEmail}
          />
        </View>

        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 text-center text-xs font-bold">
          <Text className="text-slate-900 dark:text-slate-100">
            {tc(
              'web.credits',
              `© ${new Date().getFullYear()} ${businessName}. Tous droits réservés.`,
            )}
          </Text>
        </View>
      </View>

      {currentRole !== 'admin' && (
        <TouchableOpacity
          onPress={openWhatsApp}
          accessibilityLabel="WhatsApp Support Urgent"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <Text
            style={{ fontSize: 22 }}
            className="text-slate-900 dark:text-slate-100"
          >
            💬
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default WebFooter;
