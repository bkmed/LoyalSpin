import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ProductVisual } from '../components/ProductSVGs';
import { Role } from '../utils/webTranslations';

interface ProfileScreenWebProps {
  currentRole: Role;
  businessName: string;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  profileCity: string;
  favorites: string[];
  products: any[];
  t: any;
  showToast: any;
  setBypassAuth: (bypass: boolean) => void;
  setSigninEmail: (email: string) => void;
  setSigninPassword: (password: string) => void;
  setActiveTab: (tab: string) => void;
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  setSelectedProduct: (prod: any) => void;
}

export const ProfileScreenWeb: React.FC<ProfileScreenWebProps> = ({
  currentRole,
  businessName,
  profileName,
  profileEmail,
  profilePhone,
  profileCity,
  favorites,
  products,
  t,
  showToast,
  setBypassAuth,
  setSigninEmail,
  setSigninPassword,
  setActiveTab,
  toggleFavorite,
  setSelectedProduct,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const [currentMdp, setCurrentMdp] = React.useState('');
  const [newMdp, setNewMdp] = React.useState('');
  const [newsletterEmail, setNewsletterEmail] = React.useState('');

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      {currentRole === 'anonyme' ? (
        // GUEST CONNEXION PROMPT STATE
        <View className="max-w-xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] p-8 sm:p-12 text-center shadow-lg space-y-6">
          <View className="w-16 h-16 rounded-full bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 mx-auto">
            🔒
          </View>
          <Text className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {tCommon('web.profileLoginRequiredTitle', 'Identification Requise')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
            {tCommon(
              'web.profileLoginRequiredDescription',
              `Rejoignez ${businessName} pour sauvegarder vos pièces favorites, demander des interventions immédiates en priorité et modifier votre mot de passe.`,
            )}
          </Text>

          <View className="pt-4 flex flex-col gap-3">
            <TouchableOpacity
              onPress={() => {
                setBypassAuth(false);
                setSigninEmail('');
                setSigninPassword('');
              }}
              className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
            >
              {tCommon(
                'web.profileLoginButton',
                "Accéder à l'écran de connexion",
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('Accueil')}
              className="text-xs font-black text-slate-400 hover:text-slate-600"
            >
              {tCommon('web.retour_accueil', "← Retour à l'accueil")}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // LOGGED CLIENT INTERFACE
        <View>
          <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {tCommon('web.tableau_bord', 'Mon tableau de bord')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
            {tCommon(
              'web.tableau_bord_desc',
              'Gérez vos favoris, votre sécurité et vos préférences.',
            )}
          </Text>

          <View className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
            {/* Left details (lg:col-span-4) */}
            <View className="lg:col-span-4 space-y-6">
              {/* Client Card */}
              <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6 text-center">
                <View className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#1E3A5F] to-[#F97316] p-1 shadow-md">
                  <View className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 font-black text-2xl">
                    {profileName.charAt(0) || 'U'}
                  </View>
                </View>

                <View>
                  <Text className="text-base font-black text-slate-800 dark:text-slate-100">
                    {profileName}
                  </Text>
                  <Text className="inline-block mt-1 text-[9px] font-black px-3 py-1 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                    {tCommon('web.compte_particulier', 'Compte Particulier')}
                  </Text>
                </View>

                {/* Profile information */}
                <View className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-3.5 text-left font-semibold text-xs text-slate-500 dark:text-slate-500">
                  <View className="space-y-1">
                    <Text className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      Email
                    </Text>
                    <Text className="font-black text-slate-800 dark:text-slate-200">
                      {profileEmail}
                    </Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.telephone', 'Téléphone')}
                    </Text>
                    <Text className="font-black text-slate-800 dark:text-slate-200">
                      {profilePhone}
                    </Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.ville', 'Ville')}
                    </Text>
                    <Text className="font-black text-slate-800 dark:text-slate-200">
                      {profileCity}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Security details updates */}
              <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {tCommon('web.securite', 'Sécurité')}
                </Text>

                <View className="space-y-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.mdp_actuel', 'Mot de passe actuel')}
                    </Text>
                    <TextInput
                      secureTextEntry
                      value={currentMdp}
                      onChangeText={setCurrentMdp}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </View>

                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.nouveau_mdp', 'Nouveau mot de passe')}
                    </Text>
                    <TextInput
                      secureTextEntry
                      value={newMdp}
                      onChangeText={setNewMdp}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (!currentMdp || !newMdp) return;
                      showToast(
                        tCommon(
                          'web.profilePasswordUpdated',
                          'Sécurité mise à jour avec succès !',
                        ),
                        'success',
                      );
                      setCurrentMdp('');
                      setNewMdp('');
                    }}
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[11px] font-black py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                  >
                    {tCommon('web.mettre_a_jour', 'Mettre à jour')}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {tCommon('web.quickUserActions', 'Accès rapides')}
                </Text>
                <View className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: tCommon(
                        'web.userDashboard.coupons',
                        'Mes coupons',
                      ),
                      description: tCommon(
                        'web.userDashboard.couponsDesc',
                        'Voir et utiliser vos bons de réduction.',
                      ),
                      tab: 'UserCoupons',
                    },
                    {
                      label: tCommon('web.userDashboard.history', 'Historique'),
                      description: tCommon(
                        'web.userDashboard.historyDesc',
                        'Consulter vos dernières interventions.',
                      ),
                      tab: 'UserPurchaseHistory',
                    },
                    {
                      label: tCommon(
                        'web.userDashboard.notifications',
                        'Notifications',
                      ),
                      description: tCommon(
                        'web.userDashboard.notificationsDesc',
                        'Consulter vos alertes récentes.',
                      ),
                      tab: 'UserNotifications',
                    },
                    {
                      label: tCommon(
                        'web.userDashboard.dashboard',
                        'Mon tableau de bord',
                      ),
                      description: tCommon(
                        'web.userDashboard.dashboardDesc',
                        'Retourner à votre espace personnel.',
                      ),
                      tab: 'UserDashboard',
                    },
                  ].map(action => (
                    <TouchableOpacity
                      key={action.tab}
                      onPress={() => setActiveTab(action.tab)}
                      className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 hover:border-[#F97316] hover:bg-[#F97316]/10 transition"
                    >
                      <Text className="text-sm font-black text-slate-900 dark:text-white">
                        {action.label}
                      </Text>
                      <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {action.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Payment maintenance card (moved into Profile) */}
              <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <Text className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {tCommon('web.maintenance', 'Maintenance')}
                </Text>

                <Text className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {tCommon('web.bientot_dispo', 'Bientôt disponible')}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
                  {tCommon(
                    'web.maintenance_desc',
                    'Le paiement en ligne sera disponible très prochainement.',
                  )}
                </Text>

                <View className="space-y-3 pt-4 max-w-full">
                  <View className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Text className="text-[10px] text-slate-400">
                      {tCommon('web.progression', 'Progression')}
                    </Text>
                    <Text className="text-[#F97316]">85%</Text>
                  </View>
                  <View className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#F97316] rounded-full"
                      style={{ width: '85%' }}
                    />
                  </View>
                  <Text className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wide">
                    {tCommon(
                      'web.sslTestsInProgress',
                      "Tests d'homologation de sécurité SSL et cryptage en cours avec la SMT.",
                    )}
                  </Text>
                </View>

                <View className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
                  <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center dark:text-slate-400">
                    {tCommon(
                      'web.profileNotifyMeHeader',
                      "M'avertir lors de la mise en service",
                    )}
                  </Text>
                  <View className="mt-3 flex gap-2">
                    <TextInput
                      keyboardType="email-address"
                      placeholder={tCommon(
                        'web.email_placeholder',
                        'votre.email@domaine.tn',
                      )}
                      value={newsletterEmail}
                      onChangeText={setNewsletterEmail}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        if (!newsletterEmail) return;
                        showToast(
                          tCommon(
                            'web.profileNewsletterSuccess',
                            'Merci ! Vous recevrez une alerte prioritaire.',
                          ),
                          'success',
                        );
                        setNewsletterEmail('');
                      }}
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-4 py-3 rounded-xl transition"
                    >
                      {tCommon('web.avertir', "M'avertir")}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Favorites grid (lg:col-span-8) */}
            <View className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <View className="flex justify-between items-center">
                <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {tCommon('web.mes_favoris', 'Mes favoris')}
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveTab('Marketplace')}
                  className="text-xs font-black text-[#F97316] hover:underline"
                >
                  {tCommon('web.parcourir_market', 'Parcourir le marketplace')}
                </TouchableOpacity>
              </View>

              {favorites.length === 0 ? (
                <View className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3">
                  <Text className="text-xs text-slate-400 font-bold dark:text-slate-300">
                    {tCommon(
                      'web.plus_favoris_desc',
                      "Aucun favori pour l'instant. Explorez le marketplace !",
                    )}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActiveTab('Marketplace')}
                    className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl text-xs font-black"
                  >
                    {tCommon('web.boutique_acces', 'Accéder à la boutique')}
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {favorites.map(id => {
                    const prod = products.find(p => p.id === id);
                    if (!prod) return null;
                    return (
                      <View
                        key={prod.id}
                        className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between"
                      >
                        <View className="bg-slate-50 dark:bg-slate-900 py-6 flex items-center justify-center relative">
                          <TouchableOpacity
                            onPress={() => toggleFavorite(prod.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition"
                          >
                            ✕
                          </TouchableOpacity>
                          <ProductVisual
                            image={prod.image}
                            className="w-12 h-12"
                          />
                        </View>

                        <View className="p-4 space-y-4">
                          <View>
                            <View className="flex justify-between items-start gap-2">
                              <Text className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                                {prod.title}
                              </Text>
                              <Text className="text-xs font-black text-[#F97316] whitespace-nowrap">
                                {prod.price} DT
                              </Text>
                            </View>
                            <Text className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed dark:text-slate-300">
                              {prod.description}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => setSelectedProduct(prod)}
                            className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black py-2.5 rounded-lg transition"
                          >
                            {tCommon('web.consulter', 'Consulter')}
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default ProfileScreenWeb;
