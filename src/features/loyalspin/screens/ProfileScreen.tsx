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
  sessionUser?: any; // To pass firstName, lastName, etc.
  currentTheme?: string;
  setCurrentTheme?: (theme: string) => void;
  setCurrentLang?: (lang: string) => void;
  nextLanguage?: string;
  t: any;
  showToast: any;
  setBypassAuth: (bypass: boolean) => void;
  setSigninEmail: (email: string) => void;
  setSigninPassword: (password: string) => void;
  setSessionUser?: (user: any) => void;
}

export const ProfileScreenWeb: React.FC<ProfileScreenWebProps> = ({
  currentRole,
  businessName,
  sessionUser,
  currentTheme,
  setCurrentTheme,
  setCurrentLang,
  nextLanguage,
  t,
  showToast,
  setBypassAuth,
  setSigninEmail,
  setSigninPassword,
  setSessionUser,
}) => {
  const profileName = sessionUser ? `${sessionUser.firstName || ''} ${sessionUser.lastName || sessionUser.name || ''}`.trim() : '';
  const profileEmail = sessionUser?.email || '';
  const profilePhone = sessionUser?.phone || '';
  const profileCity = sessionUser?.city || '';

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const [currentMdp, setCurrentMdp] = React.useState('');
  const [newMdp, setNewMdp] = React.useState('');
  
  // Reclamations State
  const [reclamationSubject, setReclamationSubject] = React.useState('');
  const [reclamationMessage, setReclamationMessage] = React.useState('');

  // Profile Edit State
  const [editFirstName, setEditFirstName] = React.useState(sessionUser?.firstName || '');
  const [editLastName, setEditLastName] = React.useState(sessionUser?.lastName || '');

  const loyaltyPoints = 4300;
  const loyaltyLevel = 'Silver';
  const loyaltyCode = 'LOYAL-4320';

  const handleShareLoyaltyCard = async () => {
    const message = tCommon(
      'web.profile.shareMessage',
      `I just earned ${loyaltyPoints} LoyalSpin points! Join me and enjoy exclusive offers. Code: ${loyaltyCode}`,
    );

    try {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        Alert.alert(
          tCommon('web.profile.shareSuccess', 'Share ready'),
          tCommon(
            'web.profile.shareCopiedWeb',
            'Share message copied to clipboard.',
          ),
        );
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      console.error('Error sharing loyalty card:', error);
      Alert.alert(
        tCommon('web.profile.shareError', 'Share error'),
        tCommon(
          'web.profile.shareErrorDetails',
          'Unable to share right now. Please try again later.',
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
            {tCommon('web.profileLoginRequiredTitle', 'Login Required')}
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
                'Go to login screen',
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              className="text-xs font-black text-slate-400 hover:text-slate-600"
            >
              {tCommon('web.retour_accueil', '← Back to home')}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // LOGGED CLIENT INTERFACE
        <View>
          <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {tCommon('web.tableau_bord', 'My dashboard')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
            {tCommon(
              'web.tableau_bord_desc',
              'Manage your favorites, security, and preferences.',
            )}
          </Text>

          <View className="mt-8 rounded-3xl bg-gradient-to-br from-[#1E3A5F] to-[#F97316] p-6 text-white shadow-lg">
            <Text className="text-sm font-black uppercase tracking-[0.24em] text-amber-100">
              {tCommon('web.profile.loyaltyTitle', 'LoyalSpin digital card')}
            </Text>
            <Text className="mt-3 text-3xl font-black tracking-tight">
              {tCommon(
                'web.profile.loyaltySub',
                'Your prestige status and benefits',
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
                  {tCommon('web.profile.level', 'Level')}
                </Text>
                <Text className="mt-2 text-3xl font-black">{loyaltyLevel}</Text>
              </View>
              <View>
                <Text className="text-xs uppercase tracking-[0.24em] text-amber-100/80">
                  {tCommon('web.profile.card', 'Loyalty code')}
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
                  'Share your code and earn extra points by inviting friends.',
                )}
              </Text>
              <TouchableOpacity
                onPress={handleShareLoyaltyCard}
                className="mt-4 inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-black text-[#1E3A5F] hover:bg-slate-100 transition"
              >
                {tCommon('web.profile.shareButton', 'Share my card')}
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
                    {tCommon('web.compte_particulier', 'Personal Account')}
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
                      {tCommon('web.telephone', 'Phone')}
                    </Text>
                    <Text className="font-black text-slate-800 dark:text-slate-200">
                      {profilePhone}
                    </Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.ville', 'City')}
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
                  {tCommon('web.securite', 'Security')}
                </Text>

                <View className="space-y-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.mdp_actuel', 'Current password')}
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
                      {tCommon('web.nouveau_mdp', 'New password')}
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
                          'Security updated successfully!',
                        ),
                        'success',
                      );
                      setCurrentMdp('');
                      setNewMdp('');
                    }}
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[11px] font-black py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                  >
                    {tCommon('web.mettre_a_jour', 'Update')}
                  </TouchableOpacity>
                </View>
              </View>
              {/* Global Settings */}
              <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {tCommon('web.globalSettings', 'Global Settings')}
                </Text>
                
                <View className="grid grid-cols-2 gap-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.firstName', 'First name')}
                    </Text>
                    <TextInput
                      value={editFirstName}
                      onChangeText={setEditFirstName}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </View>
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.lastName', 'Last name')}
                    </Text>
                    <TextInput
                      value={editLastName}
                      onChangeText={setEditLastName}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </View>
                </View>

                <View className="flex-row items-center gap-4 mt-4">
                  <TouchableOpacity
                    onPress={() => setCurrentLang && nextLanguage && setCurrentLang(nextLanguage)}
                    className="flex-1 py-3 rounded-xl border flex-row items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Text className="text-xs font-black tracking-wider uppercase text-slate-700 dark:text-slate-200">
                      {tCommon('web.changeLanguage', 'Change Language')} ({nextLanguage || 'FR'})
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setCurrentTheme && currentTheme && setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
                    className="flex-1 py-3 rounded-xl border flex-row items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Text className="text-xs font-black tracking-wider uppercase text-slate-700 dark:text-slate-200">
                      {currentTheme === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (setSessionUser && sessionUser) {
                      setSessionUser({ ...sessionUser, firstName: editFirstName, lastName: editLastName });
                      showToast(tCommon('web.profileUpdatedSuccess', 'Profile updated!'), 'success');
                    }
                  }}
                  className="w-full mt-4 bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[11px] font-black py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                >
                  <Text className="text-center text-white text-[11px] font-black uppercase">
                    {tCommon('web.updateProfileButton', 'Update profile')}
                  </Text>
                </TouchableOpacity>
              </View>
 
              {/* Reclamations */}
              <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {tCommon('web.reclamations', 'My claims')}
                </Text>
 
                <View className="space-y-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.reclamationSubject', 'Sujet')}
                    </Text>
                    <TextInput
                      value={reclamationSubject}
                      onChangeText={setReclamationSubject}
                      placeholder={tCommon(
                        'web.reclamationSubjectPlaceholder',
                        'Ex: Technical issue',
                      )}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </View>
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      {tCommon('web.reclamationMessage', 'Message')}
                    </Text>
                    <TextInput
                      multiline
                      numberOfLines={4}
                      value={reclamationMessage}
                      onChangeText={setReclamationMessage}
                      placeholder={tCommon(
                        'web.reclamationMessagePlaceholder',
                        'Describe your issue in detail...',
                      )}
                      className="w-full min-h-[100px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (!reclamationSubject || !reclamationMessage) return;
                      showToast(
                        tCommon('web.reclamationSubmitted', 'Claim submitted successfully'),
                        'success',
                      );
                      setReclamationSubject('');
                      setReclamationMessage('');
                    }}
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[11px] font-black py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                  >
                    <Text className="text-center text-white text-[11px] font-black uppercase">
                      {tCommon('web.sendReclamationButton', 'Send claim')}
                    </Text>
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
