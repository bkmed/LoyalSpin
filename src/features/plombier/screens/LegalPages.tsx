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
    t(key, { defaultValue: fallback });

  if (page === 'Informations') {
    return (
      <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <View className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm">
          <View className="space-y-4 text-center">
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {tc('informations', 'Informations')}
            </Text>
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {tc('informations', 'Informations légales')}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {tc(
                'informations_desc',
                'Retrouvez ici toutes les informations légales.',
              )}
            </Text>
          </View>

          <View className="grid gap-4 md:grid-cols-3 mt-10">
            {[
              {
                id: 'Politique',
                label: tc('politique', 'Politique de confidentialité'),
                desc: tc(
                  'privacy_intro',
                  'Découvrez comment nous protégeons vos données.',
                ),
              },
              {
                id: 'Conditions',
                label: tc('conditions_util', "Conditions d'utilisation"),
                desc: tc(
                  'terms_intro',
                  "Les règles d'utilisation de notre service.",
                ),
              },
              {
                id: 'PlanSite',
                label: tc('plan_site', 'Plan du site'),
                desc: tc(
                  'sitemap_intro',
                  'Naviguez facilement dans notre site.',
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
              {tc('politique', 'Politique de confidentialité')}
            </Text>
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {tc('politique', 'Politique de confidentialité')}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {tc('privacy_intro', 'Nous respectons votre vie privée.')}
            </Text>
          </View>

          <View className="grid gap-4 sm:grid-cols-3">
            {[
              tc('privacy_point_1', 'Vos données sont sécurisées.'),
              tc('privacy_point_2', 'Aucune revente à des tiers.'),
              tc('privacy_point_3', 'Vous pouvez demander leur suppression.'),
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
                {tc('retour_accueil', '← Retour')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('PlanSite')}
              className="py-2 px-1 transition"
            >
              <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F]">
                {tc('plan_site', 'Plan du site')}
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
              {tc('conditions_util', "Conditions d'utilisation")}
            </Text>
            <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {tc('conditions_util', "Conditions d'utilisation")}
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
              tc('terms_point_1', 'Utilisation à des fins légales uniquement.'),
              tc('terms_point_2', 'Respect des autres utilisateurs.'),
              tc(
                'terms_point_3',
                'Nous nous réservons le droit de modifier les conditions.',
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
                {tc('retour_accueil', '← Retour')}
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
            {tc('plan_site', 'Plan du site')}
          </Text>
          <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            {tc('plan_site', 'Plan du site')}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {tc('sitemap_intro', 'Retrouvez toutes les pages de notre site.')}
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
              {tc('retour_accueil', '← Retour')}
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
