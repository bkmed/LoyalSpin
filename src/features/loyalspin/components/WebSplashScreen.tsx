import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogoSVG } from './LogoSVG';

interface WebSplashScreenProps {
  showSplash: boolean;
  loadingProgress: number;
  businessName: string;
  t: (key: string, options?: any) => string;
}

export const WebSplashScreen: React.FC<WebSplashScreenProps> = ({
  showSplash,
  loadingProgress,
  businessName,
  t,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  if (!showSplash) return null;

  return (
    <View
      style={[styles.overlay, { opacity: loadingProgress === 100 ? 0 : 1 }]}
    >
      <View className="mb-8 transform hover:scale-105 transition-transform duration-300">
        <LogoSVG size={96} />
      </View>
      <View className="text-center mb-8">
        <Text
          style={styles.title}
          className="text-slate-900 dark:text-slate-100"
        >
          {businessName}
        </Text>
        <Text className="text-[#F97316] text-[10px] sm:text-xs font-black tracking-widest uppercase mt-2.5">
          {t('tagline')}
        </Text>
        <Text className="text-slate-400/60 text-xs font-bold mt-2 text-slate-900 dark:text-slate-100">
          {tCommon(
            'web.splashServiceList',
            'سباكة · تكييف · غاز · تدفئة مركزية',
          )}
        </Text>
      </View>

      <View className="w-56 mt-4 mb-3">
        <View className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <View
            style={{
              height: '100%',
              backgroundColor: '#F97316',
              borderRadius: 99,
              width: `${loadingProgress}%`,
            }}
          />
        </View>
      </View>
      <Text className="text-slate-400 text-[10px] font-black uppercase tracking-wider dark:text-slate-300">
        {t('web.loadingPremium', {
          defaultValue: 'Chargement premium...',
        })}{' '}
        {loadingProgress}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
});
