import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectTotalPageViews,
  selectTotalShares,
  selectCallClicks,
  selectPageViews,
} from '../../../store/slices/analyticsSlice';
import type { RootState } from '../../../store';

interface AdminAnalyticsScreenProps {
  t: any;
}

const AdminAnalyticsScreen = ({ t }: AdminAnalyticsScreenProps) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const totalViews = useSelector(selectTotalPageViews);
  const totalShares = useSelector(selectTotalShares);
  const callClicks = useSelector(selectCallClicks);
  const pageViewsMap = useSelector(selectPageViews);
  const sharesMap = useSelector(
    (state: RootState) => state.analytics?.shares || {},
  );

  const calculatePercent = (val: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((val / total) * 100)}%`;
  };

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
        {tCommon(
          'admin.realtimeAnalyticsTitle',
          "Statistiques Réelles d'Utilisation",
        )}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'admin.realtimeAnalyticsDescription',
          'Consultez les vues de pages, les partages et les clics sur appel.',
        )}
      </Text>

      <View className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: tCommon('admin.totalViews', 'Vues Totales'),
            value: totalViews.toString(),
            detail: tCommon('admin.totalViewsDetail', 'Pages consultées'),
          },
          {
            label: tCommon('admin.totalShares', 'Partages Totaux'),
            value: totalShares.toString(),
            detail: tCommon(
              'admin.totalSharesDetail',
              'Sur Facebook et WhatsApp',
            ),
          },
          {
            label: tCommon('admin.callClicks', 'Clics sur Appel'),
            value: callClicks.toString(),
            detail: tCommon('admin.callClicksDetail', 'Demandes de contact'),
          },
          {
            label: tCommon('admin.engagementRate', "Taux d'Engagement"),
            value:
              totalViews > 0
                ? `${Math.round(
                    ((totalShares + callClicks) / totalViews) * 100,
                  )}%`
                : '0%',
            detail: tCommon(
              'admin.engagementDetail',
              '(Partages + Appels) / Vues',
            ),
          },
        ].map((metric, idx) => (
          <View
            key={idx}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
          >
            <Text className="block text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
              {metric.label}
            </Text>
            <Text className="mt-2 block text-2xl font-black text-slate-800 dark:text-white">
              {metric.value}
            </Text>
            <Text className="mt-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {metric.detail}
            </Text>
          </View>
        ))}
      </View>

      <View className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            {tCommon('admin.pageViewsChartTitle', 'Vues par page')}
          </Text>
          <View className="space-y-4 pt-4">
            {Object.entries(pageViewsMap || {}).length === 0 ? (
              <Text className="text-slate-400 text-xs dark:text-slate-300">
                {tCommon(
                  'admin.noPageViewsData',
                  'Aucune donnée de vue pour le moment.',
                )}
              </Text>
            ) : (
              Object.entries(pageViewsMap || {})
                .sort((a, b) => b[1] - a[1])
                .map(([page, val], idx) => (
                  <View key={idx} className="space-y-1.5 text-xs font-semibold">
                    <View className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <Text className="text-slate-500 dark:text-slate-400">
                        {page}
                      </Text>
                      <Text className="font-black text-slate-800 dark:text-white">
                        {val} {tCommon('admin.viewsCount', 'vue(s)')}
                      </Text>
                    </View>
                    <View className="h-4 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative">
                      <View
                        className="h-full bg-gradient-to-r from-sky-600 to-[#1E3A5F] rounded-lg transition-all duration-500"
                        style={{
                          width: calculatePercent(val, totalViews) as any,
                        }}
                      />
                    </View>
                  </View>
                ))
            )}
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            {tCommon(
              'admin.sharesBreakdownTitle',
              'Éléments les plus partagés',
            )}
          </Text>
          <View className="space-y-5 pt-4 text-xs font-bold text-slate-500">
            {Object.entries(sharesMap || {}).length === 0 ? (
              <Text className="text-slate-400 dark:text-slate-300">
                {tCommon('admin.noSharesData', 'Aucun partage pour le moment.')}
              </Text>
            ) : (
              Object.entries(sharesMap || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([key, shareCount], idx) => {
                  const colors = [
                    'bg-blue-500',
                    'bg-amber-500',
                    'bg-emerald-500',
                    'bg-rose-500',
                    'bg-purple-500',
                  ];
                  const color = colors[idx % colors.length];
                  const [platform, ...itemNameParts] = key.split('_');
                  const itemName = itemNameParts.join('_');

                  return (
                    <View key={idx} className="space-y-1">
                      <View className="flex justify-between items-center text-slate-700 dark:text-slate-200">
                        <View className="flex items-center gap-2">
                          <View
                            className={`w-2.5 h-2.5 rounded-full ${color}`}
                          />
                          <Text className="text-slate-700 dark:text-slate-200">
                            {itemName} ({platform})
                          </Text>
                        </View>
                        <Text className="text-slate-700 dark:text-slate-200">
                          {shareCount}
                        </Text>
                      </View>
                      <View className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <View
                          className={`h-full ${color}`}
                          style={{
                            width: calculatePercent(
                              shareCount,
                              totalShares,
                            ) as any,
                          }}
                        />
                      </View>
                    </View>
                  );
                })
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminAnalyticsScreen;
