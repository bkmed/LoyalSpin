import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface LegalPagesProps {
  page: 'Informations' | 'Politique' | 'Conditions' | 'PlanSite';
  t: any;
  setActiveTab: (tab: string) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  page,
  t,
  setActiveTab,
}) => {
  const tc = (key: string, fallback: string) =>
    t(`legal.${key}`, { defaultValue: fallback });

  if (page === 'Informations') {
    return (
      <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <View className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm">
          <View className="space-y-4 text-center">
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {tc('informations', 'Legal Info')}
            </Text>
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {tc('informations', 'Legal Information')}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {tc(
                'informations_desc',
                'Find all legal information here.',
              )}
            </Text>
          </View>

          <View className="grid gap-4 md:grid-cols-3 mt-10">
            {[
              {
                id: 'Politique',
                label: tc('politique', 'Privacy policy'),
                desc: tc(
                  'privacy_intro',
                  'Learn how we protect your data.',
                ),
              },
              {
                id: 'Conditions',
                label: tc('conditions_util', 'Terms of use'),
                desc: tc(
                  'terms_intro',
                  'The rules for using our service.',
                ),
              },
              {
                id: 'PlanSite',
                label: tc('plan_site', 'Sitemap'),
                desc: tc(
                  'sitemap_intro',
                  'Navigate our site easily.',
                ),
              },
            ].map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveTab(item.id)}
                className="text-left bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 hover:border-[#F97316] transition"
              >
                <Text className="text-xs uppercase font-black text-[#F97316]">
                  {item.label}
                </Text>
                <Text className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {item.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (page === 'Politique') {
    return (
      <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <View className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
          <View className="space-y-4">
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {tc('politique', 'Privacy policy')}
            </Text>
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {tc('politique', 'Privacy policy')}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {tc('privacy_intro', 'We respect your privacy.')}
            </Text>
          </View>

          <View className="grid gap-4 sm:grid-cols-3">
            {[
              tc('privacy_point_1', 'Your data is secure.'),
              tc('privacy_point_2', 'No resale to third parties.'),
              tc('privacy_point_3', 'You can request deletion.'),
            ].map((point, idx) => (
              <View
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5"
              >
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {point}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => setActiveTab('Informations')}
              className="py-2 px-1 transition"
            >
              <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316]">
                {tc('retour_accueil', '← Back')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('PlanSite')}
              className="py-2 px-1 transition"
            >
              <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F]">
                {tc('plan_site', 'Sitemap')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (page === 'Conditions') {
    return (
      <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <View className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
          <View className="space-y-4">
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {tc('conditions_util', 'Terms of use')}
            </Text>
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {tc('conditions_util', 'Terms of use')}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {tc(
                'terms_intro',
                'En utilisant notre service vous acceptez ces conditions.',
              )}
            </Text>
          </View>

          <View className="space-y-3">
            {[
              tc('terms_point_1', 'Use for legal purposes only.'),
              tc('terms_point_2', 'Respect other users.'),
              tc(
                'terms_point_3',
                'We reserve the right to change these terms.',
              ),
            ].map((point, idx) => (
              <View
                key={idx}
                className="flex flex-row items-start gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
              >
                <Text className="text-[#F97316] font-black text-sm">
                  {idx + 1}.
                </Text>
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1">
                  {point}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => setActiveTab('Informations')}
              className="py-2 px-1 transition"
            >
              <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316]">
                {tc('retour_accueil', '← Back')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('Politique')}
              className="py-2 px-1 transition"
            >
              <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F]">
                {tc('politique', 'Politique')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // PlanSite
  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
      <View className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
        <View className="space-y-4">
          <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
            {tc('plan_site', 'Sitemap')}
          </Text>
          <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            {tc('plan_site', 'Sitemap')}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {tc('sitemap_intro', 'Find all pages on our site.')}
          </Text>
        </View>

        <View className="grid gap-3 sm:grid-cols-2">
          {[
            { label: tc('sitemap_page_accueil', 'Accueil'), tab: 'Accueil' },
            { label: tc('sitemap_page_services', 'Services'), tab: 'Services' },
            {
              label: tc('sitemap_page_zones', "Zones d'intervention"),
              tab: 'Zones',
            },
            {
              label: tc('sitemap_page_pieces', 'Marketplace'),
              tab: 'Marketplace',
            },
            { label: tc('sitemap_page_profil', 'Mon profil'), tab: 'Profile' },
            { label: tc('sitemap_page_contact', 'Contact'), tab: 'Profile' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setActiveTab(item.tab)}
              className="text-left rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 hover:border-[#F97316] transition"
            >
              <Text className="text-slate-700 dark:text-slate-200 font-semibold">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex flex-wrap gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab('Informations')}
            className="py-2 px-1 transition"
          >
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316]">
              {tc('retour_accueil', '← Back')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('Conditions')}
            className="py-2 px-1 transition"
          >
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F]">
              {tc('conditions_util', 'Conditions')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default LegalPages;
