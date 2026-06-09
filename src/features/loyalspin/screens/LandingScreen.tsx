import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';

interface LandingScreenProps {
  businessName: string;
  currentTheme: string;
  nextLanguage: string;
  setCurrentLang: (lang: 'FR' | 'AR' | 'EN') => void;
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  t: (key: string, options?: any) => string;
  setShowLandingPage: (show: boolean) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  businessName,
  currentTheme,
  nextLanguage,
  setCurrentLang,
  setCurrentTheme,
  t,
  setShowLandingPage,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <ScrollView
      className={`flex-1 ${
        currentTheme === 'dark'
          ? 'bg-[#0B0F19] text-slate-100'
          : 'bg-white text-slate-900'
      }`}
    >
      {/* Header */}
      <View
        className={`border-b ${
          currentTheme === 'dark'
            ? 'border-slate-700 bg-[#0F172A]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-3">
            <View className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
              <Text className="text-white font-bold text-sm">LS</Text>
            </View>
            <Text className="text-lg font-bold text-[#F97316]">
              {businessName}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() =>
                setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')
              }
              className={`p-2 rounded-lg ${
                currentTheme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Text className="text-lg">
                {currentTheme === 'dark' ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                currentTheme === 'dark'
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
              onPress={() => setCurrentLang(nextLanguage as any)}
            >
              <Text
                className={
                  currentTheme === 'dark'
                    ? 'text-white'
                    : 'text-slate-900'
                }
              >
                {nextLanguage}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View
        className={`relative py-24 sm:py-32 overflow-hidden ${
          currentTheme === 'dark'
            ? 'bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0B0F19]'
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
        }`}
      >
        <View className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#F97316_0%,transparent_50%)] pointer-events-none" />

        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <View className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <View>
              <Text className="bg-[#F97316] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block mb-6">
                {tCommon('landing.innovative', 'Innovant')}
              </Text>

              <Text
                className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tCommon(
                  'landing.hero_title',
                  'Transformez chaque café en expérience inoubliable',
                )}
              </Text>

              <Text
                className={`text-lg font-medium mb-8 ${
                  currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {tCommon(
                  'landing.hero_subtitle',
                  "La première solution hybride gamifiée qui booste votre chiffre d'affaires et crée de l'affection client avec une roulette 3D interactive.",
                )}
              </Text>

              <View className="flex flex-row gap-4 flex-wrap">
                <TouchableOpacity
                  onPress={() => setShowLandingPage(false)}
                  className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-8 py-4 rounded-xl transition shadow-lg hover:scale-105 transform"
                >
                  <Text className="text-white">
                    {tCommon('landing.cta_start', 'Essai gratuit 15 jours')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://demo.loyalspin.com')}
                  className={`px-8 py-4 rounded-xl transition font-black text-xs border-2 hover:scale-105 transform ${
                    currentTheme === 'dark'
                      ? 'border-slate-500 hover:bg-slate-800'
                      : 'border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Text
                    className={`font-black text-xs ${
                      currentTheme === 'dark'
                        ? 'text-slate-200'
                        : 'text-slate-700'
                    }`}
                  >
                    {tCommon('landing.view_demo', 'Voir la démo')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right - 3D Roulette Visual */}
            <View className="flex items-center justify-center">
              <View
                className={`w-80 h-80 rounded-full border-8 flex items-center justify-center animate-spin-slow ${
                  currentTheme === 'dark'
                    ? 'border-[#F97316] bg-gradient-to-br from-[#1E3A5F] to-[#0B0F19]'
                    : 'border-[#F97316] bg-gradient-to-br from-blue-50 to-white'
                }`}
              >
                <View
                  className={`w-64 h-64 rounded-full flex items-center justify-center ${
                    currentTheme === 'dark' ? 'bg-[#0F172A]' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-6xl font-black ${
                      currentTheme === 'dark'
                        ? 'text-[#F97316]'
                        : 'text-[#F97316]'
                    }`}
                  >
                    💰
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Why LoyalSpin Section */}
      <View
        className={`py-20 ${
          currentTheme === 'dark' ? 'bg-[#0B0F19]' : 'bg-slate-50'
        }`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="text-center mb-16">
            <Text
              className={`text-3xl sm:text-4xl font-black mb-4 ${
                currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {tCommon('landing.why_section', 'Pourquoi passer à LoyalSpin ?')}
            </Text>
            <View className="w-24 h-1 bg-[#F97316] mx-auto rounded-full" />
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Way */}
            <View
              className={`p-8 rounded-2xl border-2 ${
                currentTheme === 'dark'
                  ? 'border-slate-700 bg-slate-900/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <View className="flex flex-row items-center gap-3 mb-4">
                <Text className="text-3xl">❌</Text>
                <Text
                  className={`text-xl font-black ${
                    currentTheme === 'dark'
                      ? 'text-slate-100'
                      : 'text-slate-900'
                  }`}
                >
                  {tCommon('landing.old_way', "L'ancienne carte papier")}
                </Text>
              </View>
              <View className="space-y-2">
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  • {tCommon('landing.old_1', 'Coûteux à imprimer')}
                </Text>
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  •{' '}
                  {tCommon('landing.old_2', 'Aucune donnée client exploitable')}
                </Text>
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  • {tCommon('landing.old_3', 'Peu efficace')}
                </Text>
              </View>
            </View>

            {/* LoyalSpin Way */}
            <View
              className={`p-8 rounded-2xl border-2 border-[#F97316] ${
                currentTheme === 'dark' ? 'bg-[#1a2d4d]/50' : 'bg-orange-50'
              }`}
            >
              <View className="flex flex-row items-center gap-3 mb-4">
                <Text className="text-3xl">✅</Text>
                <Text className={`text-xl font-black text-[#F97316]`}>
                  {tCommon('landing.new_way', 'La révolution LoyalSpin')}
                </Text>
              </View>
              <View className="space-y-2">
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  • {tCommon('landing.new_1', 'Roulette 3D interactive')}
                </Text>
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  • {tCommon('landing.new_2', 'Expérience de jeu addictive')}
                </Text>
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  •{' '}
                  {tCommon(
                    'landing.new_3',
                    'Statistiques clients en temps réel',
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View
        className={`py-20 ${
          currentTheme === 'dark' ? 'bg-[#0F172A]' : 'bg-white'
        }`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="text-center mb-16">
            <Text
              className={`text-3xl sm:text-4xl font-black mb-4 ${
                currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {tCommon('landing.features', 'Fonctionnalités')}
            </Text>
            <Text
              className={`text-lg ${
                currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {tCommon(
                'landing.features_desc',
                'Tout ce dont vous avez besoin',
              )}
            </Text>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎡',
                title: 'landing.feature_roulette',
                desc: 'landing.feature_roulette_desc',
              },
              {
                icon: '📊',
                title: 'landing.feature_analytics',
                desc: 'landing.feature_analytics_desc',
              },
              {
                icon: '🔔',
                title: 'landing.feature_notifications',
                desc: 'landing.feature_notifications_desc',
              },
              {
                icon: '🎟️',
                title: 'landing.feature_coupons',
                desc: 'landing.feature_coupons_desc',
              },
            ].map((feature, idx) => (
              <View
                key={idx}
                className={`p-6 rounded-xl text-center ${
                  currentTheme === 'dark'
                    ? 'bg-slate-800/50 hover:bg-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200'
                } transition`}
              >
                <Text className="text-4xl mb-3">{feature.icon}</Text>
                <Text
                  className={`font-black text-lg mb-2 ${
                    currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {tCommon(feature.title, feature.title)}
                </Text>
                <Text
                  className={`text-sm ${
                    currentTheme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {tCommon(feature.desc, feature.desc)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Pricing Section */}
      <View
        className={`py-20 ${
          currentTheme === 'dark' ? 'bg-[#0B0F19]' : 'bg-slate-50'
        }`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="text-center mb-16">
            <Text
              className={`text-3xl sm:text-4xl font-black mb-4 ${
                currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {tCommon(
                'landing.simple_pricing',
                'Un plan pour chaque établissement',
              )}
            </Text>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                nameKey: 'landing.pricing.manual',
                defaultName: 'Manuel',
                price: '167 DT',
                period: '/mois',
                features: [
                  'landing.pricing_feat_1',
                  'landing.pricing_feat_2',
                  'landing.pricing_feat_3',
                ],
                cta: false,
              },
              {
                nameKey: 'landing.pricing.quarterly',
                defaultName: 'Trimestriel',
                price: '153 DT',
                period: '/mois',
                features: [
                  'landing.pricing_feat_1',
                  'landing.pricing_feat_2',
                  'landing.pricing_feat_3',
                  'landing.pricing_feat_4',
                ],
                cta: true,
              },
              {
                nameKey: 'landing.pricing.annual',
                defaultName: 'Annuel',
                price: '133 DT',
                period: '/mois',
                features: [
                  'landing.pricing_feat_1',
                  'landing.pricing_feat_2',
                  'landing.pricing_feat_3',
                  'landing.pricing_feat_4',
                  'landing.pricing_feat_5',
                ],
                cta: false,
              },
            ].map((plan, idx) => (
              <View
                key={idx}
                className={`p-8 rounded-2xl border-2 relative ${
                  plan.cta
                    ? `border-[#F97316] ${
                        currentTheme === 'dark'
                          ? 'bg-[#1a2d4d]/50'
                          : 'bg-orange-50'
                      }`
                    : currentTheme === 'dark'
                    ? 'border-slate-700 bg-slate-900/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {plan.cta && (
                  <View className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F97316] px-4 py-1 rounded-full">
                    <Text className="text-xs font-black text-white">
                      {tCommon('landing.popular', 'POPULAIRE')}
                    </Text>
                  </View>
                )}

                <Text
                  className={`text-xl font-black mb-2 ${
                    currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {tCommon(plan.nameKey, plan.defaultName)}
                </Text>
                <Text className="text-3xl font-black text-[#F97316] mb-1">
                  {plan.price}
                </Text>
                <Text
                  className={`text-sm mb-6 ${
                    currentTheme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {plan.period}
                </Text>

                <View className="space-y-3 mb-6">
                  {plan.features.map((feat, fidx) => (
                    <Text
                      key={fidx}
                      className={`text-sm flex flex-row ${
                        currentTheme === 'dark'
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }`}
                    >
                      ✓ {tCommon(feat, feat)}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => setShowLandingPage(false)}
                  className={`w-full py-3 rounded-lg transition items-center justify-center ${
                    plan.cta
                      ? 'bg-[#F97316] hover:bg-[#e0630b]'
                      : currentTheme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  <Text
                    className={`font-black ${
                      plan.cta
                        ? 'text-white'
                        : currentTheme === 'dark'
                        ? 'text-white'
                        : 'text-slate-900'
                    }`}
                  >
                    {tCommon('landing.get_started', 'Commencer')}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Testimonials */}
      <View
        className={`py-20 ${
          currentTheme === 'dark' ? 'bg-[#0F172A]' : 'bg-white'
        }`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="text-center mb-16">
            <Text
              className={`text-3xl sm:text-4xl font-black mb-4 ${
                currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {tCommon('landing.testimonials', 'Ils nous font confiance')}
            </Text>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: 'landing.testimonial_1',
                author: 'Marc Lefebvre',
                role: 'Propriétaire - La Café Noir',
              },
              {
                quote: 'landing.testimonial_2',
                author: 'Sarah Chen',
                role: 'Manager - Espresso Lounge',
              },
            ].map((testi, idx) => (
              <View
                key={idx}
                className={`p-8 rounded-2xl ${
                  currentTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'
                }`}
              >
                <Text className="text-2xl mb-4">⭐⭐⭐⭐⭐</Text>
                <Text
                  className={`italic mb-4 ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  "{tCommon(testi.quote, testi.quote)}"
                </Text>
                <View className="border-t border-slate-300/30 pt-4">
                  <Text
                    className={`font-black ${
                      currentTheme === 'dark'
                        ? 'text-slate-100'
                        : 'text-slate-900'
                    }`}
                  >
                    {testi.author}
                  </Text>
                  <Text
                    className={`text-sm ${
                      currentTheme === 'dark'
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {testi.role}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Final CTA */}
      <View
        className={`py-20 text-center ${
          currentTheme === 'dark'
            ? 'bg-gradient-to-r from-[#0F172A] to-[#1E3A5F]'
            : 'bg-gradient-to-r from-blue-600 to-blue-700'
        }`}
      >
        <View className="max-w-3xl mx-auto px-4">
          <Text className="text-white text-3xl sm:text-4xl font-black mb-4">
            {tCommon(
              'landing.ready_title',
              'Prêt à dynamiser votre fidélité ?',
            )}
          </Text>
          <Text className="text-blue-100 mb-8 text-lg">
            {tCommon(
              'landing.ready_subtitle',
              'Rejoignez plus de 200 cafés qui utilisent LoyalSpin',
            )}
          </Text>

          <TouchableOpacity
            onPress={() => setShowLandingPage(false)}
            className="bg-[#F97316] hover:bg-[#e0630b] text-white text-sm font-black px-8 py-4 rounded-xl transition shadow-lg hover:scale-105 transform inline-block"
          >
            <Text className="text-white">
              {tCommon('landing.start_free', "C'est parti !")} 🚀
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View
        className={`border-t ${
          currentTheme === 'dark'
            ? 'border-slate-700 bg-[#0B0F19]'
            : 'border-slate-200 bg-slate-50'
        }`}
      >
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <View className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <View>
              <Text
                className={`font-black mb-4 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {businessName}
              </Text>
              <Text
                className={`text-sm ${
                  currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {tCommon(
                  'landing.footer_desc',
                  'La solution complète pour la fidélité client',
                )}
              </Text>
            </View>
            <View>
              <Text
                className={`font-black mb-4 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tCommon('landing.product', 'Produit')}
              </Text>
              <Text
                className={`text-sm cursor-pointer ${
                  currentTheme === 'dark'
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tCommon('landing.features', 'Fonctionnalités')}
              </Text>
            </View>
            <View>
              <Text
                className={`font-black mb-4 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tCommon('landing.company', 'Entreprise')}
              </Text>
              <Text
                className={`text-sm cursor-pointer ${
                  currentTheme === 'dark'
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tCommon('landing.about', 'À propos')}
              </Text>
            </View>
            <View>
              <Text
                className={`font-black mb-4 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tCommon('landing.legal', 'Légal')}
              </Text>
              <Text
                className={`text-sm cursor-pointer ${
                  currentTheme === 'dark'
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tCommon('landing.privacy', 'Politique de confidentialité')}
              </Text>
            </View>
          </View>

          <View
            className={`border-t pt-8 text-center text-sm ${
              currentTheme === 'dark'
                ? 'border-slate-700 text-slate-400'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <Text>
              © ${new Date().getFullYear()} {businessName}.{' '}
              {tCommon('landing.footer_rights', 'Tous droits réservés.')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LandingScreen;
