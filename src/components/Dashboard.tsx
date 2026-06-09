import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

type User = { name?: string; points?: number; coupons?: number };

export default function Dashboard({
  user,
  isAnonymous,
}: {
  user?: User;
  isAnonymous?: boolean;
}) {
  const { t } = useTranslation();

  if (isAnonymous) {
    return (
      <View
        style={{ padding: 16, borderRadius: 12, backgroundColor: '#0f172a' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>
              {t('loyalspin.welcome')}
            </Text>
            <Text style={{ marginTop: 8, color: '#cbd5e1' }}>
              {t('loyalspin.connectPrompt')}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: '#06b6d4',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#071014', fontWeight: '700' }}>
                  {t('loyalspin.login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#334155',
                }}
              >
                <Text style={{ color: '#cbd5e1' }}>
                  {t('loyalspin.explore')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#1e293b',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
              {t('loyalspin.preview')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const safeUser = user || {
    name: t('loyalspin.userDefault'),
    points: 0,
    coupons: 0,
  };

  return (
    <View style={{ padding: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#0f172a' }}>
            {t('loyalspin.hello', { name: safeUser.name })}
          </Text>
          <Text style={{ color: '#64748b' }}>
            {t('loyalspin.dashboardSubtitle')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#06b6d4',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff' }}>{t('loyalspin.spin')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <Text style={{ color: '#0f172a' }}>{t('loyalspin.history')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            marginRight: 8,
            padding: 12,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#64748b', fontSize: 12 }}>
            {t('loyalspin.points')}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>
            {safeUser.points}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: 8,
            marginRight: 8,
            padding: 12,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#64748b', fontSize: 12 }}>
            {t('loyalspin.coupons')}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>
            {safeUser.coupons}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: 8,
            padding: 12,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#64748b', fontSize: 12 }}>
            {t('loyalspin.nextRewardLabel')}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>
            {t('loyalspin.nextReward')}
          </Text>
        </View>
      </View>

      <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>
          {t('loyalspin.quickActions')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#06b6d4',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff' }}>{t('loyalspin.play')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <Text>{t('loyalspin.createCoupon')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <Text>{t('loyalspin.viewAnalytics')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
