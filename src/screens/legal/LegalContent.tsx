import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export type LegalPage = 'info' | 'privacy' | 'terms' | 'sitemap';

interface LegalContentProps {
  page: LegalPage;
  onBack?: () => void;
  onShowLegalPage?: (page: LegalPage) => void;
  onNavigateAppPage?: (route: string) => void;
}

const LEGAL_LINKS: Array<{ page: LegalPage; key: string }> = [
  { page: 'privacy', key: 'politique' },
  { page: 'terms', key: 'conditions_util' },
  { page: 'sitemap', key: 'plan_site' },
];

const SITEMAP_ROUTES = [
  { key: 'sitemap_page_accueil', route: 'Home' },
  { key: 'sitemap_page_services', route: 'Home' },
  { key: 'sitemap_page_zones', route: 'Home' },
  { key: 'sitemap_page_pieces', route: 'Home' },
  { key: 'sitemap_page_profil', route: 'Profile' },
  { key: 'sitemap_page_contact', route: 'Profile' },
];

export const LegalContent = ({
  page,
  onBack,
  onShowLegalPage,
  onNavigateAppPage,
}: LegalContentProps) => {
  const { t } = useTranslation();

  const renderPages = () => {
    switch (page) {
      case 'privacy':
        return (
          <View className="space-y-4">
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t('privacy_intro')}
            </Text>
            {[
              t('privacy_point_1'),
              t('privacy_point_2'),
              t('privacy_point_3'),
            ].map((item, idx) => (
              <View
                key={idx}
                className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4"
              >
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'terms':
        return (
          <View className="space-y-4">
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t('terms_intro')}
            </Text>
            <View className="space-y-3">
              {[t('terms_point_1'), t('terms_point_2'), t('terms_point_3')].map(
                (point, idx) => (
                  <View
                    key={idx}
                    className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4"
                  >
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">{`${
                      idx + 1
                    }. ${point}`}</Text>
                  </View>
                ),
              )}
            </View>
          </View>
        );
      case 'sitemap':
        return (
          <View className="space-y-4">
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t('sitemap_intro')}
            </Text>
            <View className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SITEMAP_ROUTES.map(item => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => onNavigateAppPage?.(item.route)}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4"
                >
                  <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t(item.key)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return (
          <View className="space-y-4">
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t('informations_desc')}
            </Text>
            <View className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {LEGAL_LINKS.map(link => (
                <TouchableOpacity
                  key={link.page}
                  onPress={() => onShowLegalPage?.(link.page)}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4"
                >
                  <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t(link.key)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background px-5 py-8"
      contentContainerClassName="pb-20"
    >
      <View className="mb-6 flex-row items-center justify-between">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2"
          >
            <Text className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
              {t('back')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <Text className="text-sm font-black uppercase tracking-[0.32em] text-[#F97316]">
          {t(
            page === 'info'
              ? 'informations'
              : page === 'privacy'
              ? 'politique'
              : page === 'terms'
              ? 'conditions_util'
              : 'plan_site',
          )}
        </Text>
        <Text className="mt-4 text-3xl font-black text-slate-950 dark:text-slate-100">
          {t(
            page === 'info'
              ? 'informations'
              : page === 'privacy'
              ? 'politique'
              : page === 'terms'
              ? 'conditions_util'
              : 'plan_site',
          )}
        </Text>
        <View className="mt-6">{renderPages()}</View>
      </View>
    </ScrollView>
  );
};
