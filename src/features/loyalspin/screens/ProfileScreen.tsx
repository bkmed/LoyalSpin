import React from 'react';
import {
  Alert,
  Platform,
  Share,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Role } from '../utils/webTranslations';

interface ProfileScreenWebProps {
  currentRole: Role;
  businessName: string;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  profileCity: string;
  t: any;
  showToast: any;
  setBypassAuth: (bypass: boolean) => void;
  setSigninEmail: (email: string) => void;
  setSigninPassword: (password: string) => void;
}

export const ProfileScreenWeb: React.FC<ProfileScreenWebProps> = ({
  currentRole,
  businessName,
  profileName,
  profileEmail,
  profilePhone,
  profileCity,
  t,
  showToast,
  setBypassAuth,
  setSigninEmail,
  setSigninPassword,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const [currentMdp, setCurrentMdp] = React.useState('');
  const [newMdp, setNewMdp] = React.useState('');

  const loyaltyPoints = 4300;
  const loyaltyLevel = 'Silver';
  const loyaltyCode = 'LOYAL-4320';

  const handleShareLoyaltyCard = async () => {
    const message = tCommon(
      'web.profile.shareMessage',
      `Je viens de gagner ${loyaltyPoints} points LoyalSpin ! Rejoins-moi et profite des offres exclusives. Code : ${loyaltyCode}`,
    );

    try {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        Alert.alert(
          tCommon('web.profile.shareSuccess', 'Partage prêt'),
          tCommon(
            'web.profile.shareCopiedWeb',
            'Le message de partage a été copié dans le presse-papiers.',
          ),
        );
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      console.error('Error sharing loyalty card:', error);
      Alert.alert(
        tCommon('web.profile.shareError', 'Erreur de partage'),
        tCommon(
          'web.profile.shareErrorDetails',
          'Impossible de partager pour le moment. Réessayez plus tard.',
        ),
      );
    }
  };

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
              onPress={() => {}}
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

          <View className="mt-8 rounded-3xl bg-gradient-to-br from-[#1E3A5F] to-[#F97316] p-6 text-white shadow-lg">
            <Text className="text-sm font-black uppercase tracking-[0.24em] text-amber-100">
              {tCommon('web.profile.loyaltyTitle', 'Carte LoyalSpin numérique')}
            </Text>
            <Text className="mt-3 text-3xl font-black tracking-tight">
              {tCommon(
                'web.profile.loyaltySub',
                'Votre statut prestige et vos avantages',
              )}
            </Text>
            <View className="mt-6 grid gap-4 sm:grid-cols-3">
              <View>
                <Text className="text-xs uppercase tracking-[0.24em] text-amber-100/80">
                  {tCommon('web.profile.points', 'Points')}
                </Text>
                <Text className="mt-2 text-3xl font-black">
                  {loyaltyPoints}
                </Text>
              </View>
              <View>
                <Text className="text-xs uppercase tracking-[0.24em] text-amber-100/80">
                  {tCommon('web.profile.level', 'Niveau')}
                </Text>
                <Text className="mt-2 text-3xl font-black">{loyaltyLevel}</Text>
              </View>
              <View>
                <Text className="text-xs uppercase tracking-[0.24em] text-amber-100/80">
                  {tCommon('web.profile.card', 'Code fidélité')}
                </Text>
                <Text className="mt-2 text-3xl font-black tracking-widest">
                  {loyaltyCode}
                </Text>
              </View>
            </View>
            <View className="mt-6 bg-white/10 rounded-3xl p-4 border border-white/15">
              <Text className="text-sm font-semibold text-white/90">
                {tCommon(
                  'web.profile.shareCard',
                  'Partagez votre code et gagnez des points supplémentaires en invitant vos amis.',
                )}
              </Text>
              <TouchableOpacity
                onPress={handleShareLoyaltyCard}
                className="mt-4 inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-black text-[#1E3A5F] hover:bg-slate-100 transition"
              >
                {tCommon('web.profile.shareButton', 'Partager ma carte')}
              </TouchableOpacity>
            </View>
          </View>

          <View className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
            {/* Left details (lg:col-span-12) */}
            <View className="lg:col-span-12 space-y-6">
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
                      {tCommon('web.email_label', 'Email')}
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
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default ProfileScreenWeb;
