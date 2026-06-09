import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { ServiceIcon, ServiceIconName } from '../../../components/ServiceIcon';
import { ProductVisual } from '../components/ProductSVGs';

interface HomeScreenWebProps {
  nextLanguage: string;
  experienceYears: number;
  supportWhatsAppDigits: string;
  dispoVal?: string;
  govVal?: string;
  galleryItems: any[];
  products: any[];
  favorites: string[];
  t: (key: string, options?: any) => string;
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (prod: any) => void;
  toggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const HomeScreenWeb: React.FC<HomeScreenWebProps> = ({
  experienceYears,
  supportWhatsAppDigits,
  dispoVal,
  govVal,
  galleryItems,
  products,
  favorites,
  t,
  setActiveTab,
  setSelectedProduct,
  toggleFavorite,
}) => {
  const tCommon = (key: string, defaultValue?: string) =>
    t(key, { defaultValue: defaultValue ?? key });
  const stats = [
    {
      val: `${experienceYears}+`,
      lbl: tCommon('web.experience_lbl'),
      color: 'text-[#1E3A5F] dark:text-sky-400',
    },
    {
      val: dispoVal || tCommon('web.dispo_val'),
      lbl: tCommon('web.dispo_lbl'),
      color: 'text-[#F97316]',
    },
    {
      val: govVal || tCommon('web.gov_val'),
      lbl: tCommon('web.gov_lbl'),
      color: 'text-[#1E3A5F] dark:text-sky-400',
    },
    {
      val: tCommon('web.satisfaction_val'),
      lbl: tCommon('web.satisfaction_lbl'),
      color: 'text-emerald-500',
    },
  ];

  return (
    <View className="animate-fade-in text-left bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-100">
      {/* Premium Hero Banner */}
      <section className="relative bg-[#0F172A] text-white py-24 sm:py-32 overflow-hidden">
        <View className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#F97316_0%,transparent_50%)] pointer-events-none" />
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <View className="max-w-3xl">
            <Text className="bg-[#F97316] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
              {tCommon('web.home.hero_badge')}
            </Text>
            <Text className="text-4xl sm:text-6xl font-black tracking-tight mt-6 leading-tight text-white">
              {tCommon('web.home.hero_title')}
            </Text>
            <Text className="text-slate-300 text-base sm:text-lg font-medium mt-4 max-w-xl">
              {tCommon('web.home.hero_subtitle')}
            </Text>

            {/* Action buttons CTAs */}
            <View className="flex flex-wrap items-center gap-4 mt-10">
              <TouchableOpacity
                onPress={() => setActiveTab('Zones')}
                className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-7 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transform"
              >
                <Text className="text-white">
                  {tCommon('web.contactez_experts')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                      t('whatsapp_msg'),
                    )}`,
                  )
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-7 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transform"
              >
                <Text className="text-white">
                  {t('whatsapp')} {tCommon('web.home.support_badge')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-10 border-y border-slate-200 dark:border-slate-800">
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <View key={idx} className="space-y-1">
                <Text
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}
                >
                  {stat.val}
                </Text>
                <Text className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.lbl}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </section>

      {/* Technical Services Key Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-transparent">
        <View className="text-center max-w-2xl mx-auto mb-16">
          <Text className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            {t('webServices.nos_services')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
            {t('webServices.nos_services_subtitle')}
          </Text>
        </View>

        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(
            [
              {
                title: tCommon('web.loyalspin_rewards'),
                icon: 'rewards',
                desc: tCommon('web.home.service_desc_rewards'),
              },
              {
                title: tCommon('web.climatisation'),
                icon: 'ac',
                desc: tCommon('web.home.service_desc_ac'),
              },
              {
                title: tCommon('web.installation_gaz'),
                icon: 'gas',
                desc: tCommon('web.home.service_desc_gas'),
              },
              {
                title: tCommon('web.chauffage_central'),
                icon: 'heater',
                desc: tCommon('web.home.service_desc_heater'),
              },
            ] as Array<{
              title: string;
              icon: ServiceIconName;
              desc: string;
            }>
          ).map((serv, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setActiveTab('Services')}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:border-[#F97316] hover:shadow-lg transition-all duration-300 text-left group hover:-translate-y-1 transform focus:outline-none"
            >
              <View className="w-12 h-12 rounded-2xl bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors mb-5">
                <ServiceIcon
                  name={serv.icon}
                  className="w-6 h-6"
                  title={serv.title}
                />
              </View>
              <Text className="text-base font-black group-hover:text-[#F97316] transition-colors text-slate-800 dark:text-slate-100">
                {serv.title}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {serv.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-10 flex justify-center">
          <TouchableOpacity
            onPress={() => setActiveTab('Services')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E3A5F] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-[#152a47] dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            <Text className="text-white font-black">
              {tCommon('web.voir_tout')}
            </Text>
          </TouchableOpacity>
        </View>
      </section>

      {/* Real Photo Gallery Preview */}
      <View className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <View>
            <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {tCommon('web.gallery_realizations')}
            </Text>
            <Text className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {tCommon('web.home.gallery_section_title')}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 max-w-2xl">
              {tCommon('web.home.gallery_section_desc')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveTab('Gallery')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#F97316] bg-transparent px-6 py-3 text-xs font-black uppercase tracking-wider text-[#F97316] shadow-sm transition hover:bg-[#F97316] hover:text-white"
          >
            <Text className="text-[#F97316]">{tCommon('web.view_all')}</Text>
          </TouchableOpacity>
        </View>

        <View className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map(item => (
            <View
              key={item.id}
              className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm"
            >
              <View className="h-56 overflow-hidden">
                <Image
                  source={{ uri: item.imageUri }}
                  accessibilityLabel={item.title}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
              <View className="p-5">
                <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {item.title}
                </Text>
                {item.subtitle ? (
                  <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </Text>
                ) : null}
                {item.description ? (
                  <Text className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}

          {galleryItems.length === 0 && (
            <View className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
              {tCommon('web.home.gallery_section_empty')}
            </View>
          )}
        </View>
      </View>

      {/* Used Parts Showcase Grid */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-20 border-t border-slate-200 dark:border-slate-800">
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <View>
              <Text className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                {t('pieces')}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
                {tCommon('web.home.parts_section_desc')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveTab('Marketplace')}
              className="text-xs font-black text-[#F97316] hover:underline flex items-center gap-1.5"
            >
              <Text className="text-[#F97316]">
                {tCommon('web.boutique_acces')}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(prod => (
              <TouchableOpacity
                key={prod.id}
                onPress={() => setSelectedProduct(prod)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1E3A5F] dark:hover:border-slate-500 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
              >
                {/* Product visual wrapper */}
                <View className="bg-slate-50 dark:bg-slate-900 py-10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
                  <Text className="absolute top-3 right-3 z-10 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    {prod.condition}
                  </Text>

                  {/* Heart favorite toggle */}
                  <TouchableOpacity
                    onPress={e => toggleFavorite(prod.id, e as any)}
                    className="absolute top-3 left-3 z-10 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={
                        favorites.includes(prod.id) ? 'currentColor' : 'none'
                      }
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={
                        favorites.includes(prod.id) ? 'text-rose-500' : ''
                      }
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </TouchableOpacity>

                  <ProductVisual image={prod.image} />
                </View>

                <View className="p-4 text-left flex-1 flex flex-col justify-between">
                  <View>
                    <Text className="text-[9px] font-black text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      {prod.category}
                    </Text>
                    <Text className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 mt-1 leading-tight group-hover:text-[#F97316] transition-colors">
                      {prod.title}
                    </Text>
                  </View>

                  <View className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-3 mt-4">
                    <Text className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                      {prod.price}{' '}
                      <Text className="text-[9px] font-bold">
                        {tCommon('web.tndSymbol')}
                      </Text>
                    </Text>

                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                      }}
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Text className="text-white font-black">
                        {tCommon('web.home.call_to_buy')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </section>
    </View>
  );
};
export default HomeScreenWeb;
