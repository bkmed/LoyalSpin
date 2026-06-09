import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LogoSVG } from '../components/LogoSVG';
import { WebSessionUser, Role } from '../utils/webTranslations';

interface WebAuthScreenProps {
  businessName: string;
  nextLanguage: string;
  currentTheme: string;
  setCurrentLang: (lang: any) => void;
  setCurrentTheme: (theme: any) => void;
  t: (key: string, options?: any) => string;
  showToast: any;
  startWebSession: (user: WebSessionUser, tab: string) => void;
  setBypassAuth: (bypass: boolean) => void;
  setCurrentRole: (role: Role) => void;
  setSessionUser: (user: WebSessionUser | null) => void;
  setActiveTab: (tab: string) => void;
}

export const WebAuthScreen: React.FC<WebAuthScreenProps> = ({
  businessName,
  nextLanguage,
  currentTheme,
  setCurrentLang,
  setCurrentTheme,
  t,
  showToast,
  startWebSession,
  setBypassAuth,
  setCurrentRole,
  setSessionUser,
  setActiveTab,
}) => {
  const tCommon = (key: string, defaultValue: string, options?: any) =>
    t(key, { defaultValue, ...options });
  const [authTab, setAuthTab] = React.useState<'signin' | 'signup' | 'forgot'>(
    'signin',
  );
  const [signinEmail, setSigninEmail] = React.useState('');
  const [signinPassword, setSigninPassword] = React.useState('');
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [forgotStatusMessage, setForgotStatusMessage] = React.useState<
    string | null
  >(null);

  const [signupName, setSignupName] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [signupPhone, setSignupPhone] = React.useState('');
  const [signupCity, setSignupCity] = React.useState('Tunis');
  const [signupPassword, setSignupPassword] = React.useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = React.useState('');

  const handleSignIn = () => {
    if (signinEmail === 'super@demo.com' && signinPassword === 'super123') {
      const superSession: WebSessionUser = {
        id: 'super-web-demo',
        name: 'Super Administrator',
        email: 'super@demo.com',
        role: 'super-admin',
        phone: '+216 22 999 999',
        status: 'active',
        addresses: ['Tunis'],
        city: 'Tunis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      startWebSession(superSession, 'SuperAdminAccueil');
      showToast(
        tCommon('web.welcomeSuper', 'Bienvenue Super Admin !'),
        'success',
      );
    } else if (
      signinEmail === 'admin@demo.com' &&
      signinPassword === 'admin123'
    ) {
      const adminSession: WebSessionUser = {
        id: 'admin-web-demo',
        name: 'Admin LoyaltySpin',
        email: 'admin@demo.com',
        role: 'admin',
        phone: '+216 22 000 111',
        status: 'active',
        addresses: ['Tunis'],
        city: 'Tunis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      startWebSession(adminSession, 'AdminAccueil');
      showToast(
        tCommon(
          'web.welcomeAdmin',
          "Bienvenue dans votre espace d'administration !",
        ),
        'success',
      );
    } else if (
      signinEmail === 'user@demo.com' &&
      signinPassword === 'user123'
    ) {
      const userSession: WebSessionUser = {
        id: 'user-web-demo',
        name: 'Ahmed Ben Ali',
        email: 'user@demo.com',
        role: 'user',
        phone: '+216 22 456 789',
        status: 'active',
        addresses: ['Ariana'],
        city: 'Ariana',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      startWebSession(userSession, 'Accueil');
      showToast(
        tCommon('web.welcomeUser', 'Ravi de vous revoir, Ahmed Ben Ali !'),
        'success',
      );
    } else {
      showToast(
        tCommon('web.invalidCredentials', 'Identifiants invalides'),
        'error',
      );
    }
  };

  const handleSignUp = () => {
    if (signupPassword !== signupConfirmPassword) {
      showToast(
        tCommon(
          'web.passwordsMismatch',
          'Les mots de passe ne correspondent pas',
        ),
        'error',
      );
      return;
    }
    const newUser: WebSessionUser = {
      id: 'user-' + Date.now(),
      name: signupName,
      email: signupEmail,
      role: 'user',
      phone: signupPhone,
      status: 'active',
      addresses: [signupCity],
      city: signupCity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    startWebSession(newUser, 'Accueil');
    showToast(
      tCommon('web.signupSuccess', 'Compte créé avec succès !'),
      'success',
    );
  };

  const handleForgotSubmit = () => {
    setForgotStatusMessage(
      tCommon(
        'web.resetLinkSent',
        'Le lien de réinitialisation a été envoyé !',
      ),
    );
  };

  return (
    <View className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Left panel branding visual presentation (desktop only) */}
      <View className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#0F2942] to-[#0A1724] p-12 flex-col justify-between overflow-hidden border-r border-slate-200 dark:border-slate-800">
        <View className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#F97316_0%,transparent_50%)] pointer-events-none" />

        <View className="flex items-center gap-3 relative z-10">
          <LogoSVG size={52} />
          <View className="text-left">
            <Text className="text-2xl font-black tracking-tight text-white">
              {businessName}
            </Text>
            <Text className="text-[9px] text-[#F97316] font-extrabold tracking-widest uppercase mt-0.5">
              {tCommon(
                'web.branding_services',
                'Roulette · Coupons · Récompenses · Partenaires',
              )}
            </Text>
          </View>
        </View>

        <View className="my-auto space-y-6 relative z-10 text-left">
          <Text className="bg-[#F97316] text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider leading-none">
            {tCommon('web.branding_platform', 'PLATEFORME LOYALSPIN')}
          </Text>
          <Text className="text-4xl sm:text-5xl font-black text-white leading-tight">
            {tCommon(
              'web.branding_leader',
              'Tournez, gagnez et conservez vos récompenses.',
            )}
          </Text>
          <Text className="text-slate-300 text-sm leading-relaxed font-semibold">
            {tCommon(
              'web.branding_description',
              'Participez à la roue de fidélité, gagnez des coupons et découvrez des offres partenaires sur web, Android et iOS.',
            )}
          </Text>
          <View className="grid grid-cols-2 gap-6 pt-6">
            <View>
              <Text className="text-2xl font-black text-[#F97316]">
                {tCommon('web.branding_24h', 'Gagnez chaque jour')}
              </Text>
              <Text className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 dark:text-slate-300">
                {tCommon(
                  'web.branding_urgentIntervention',
                  'Tournez tous les jours',
                )}
              </Text>
            </View>
            <View>
              <Text className="text-2xl font-black text-[#F97316]">
                {tCommon('web.branding_tested', 'Récompenses sécurisées')}
              </Text>
              <Text className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 dark:text-slate-300">
                {tCommon('web.branding_partsWarranty', 'Offres vérifiées')}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xs text-slate-500 font-bold relative z-10 dark:text-slate-400">
          {tCommon(
            'web.branding_copyright',
            '© 2026 {{businessName}}. Créé pour les clients fidèles et les partenaires.',
            { businessName },
          )}
        </Text>
      </View>

      {/* Right panel login/register panel */}
      <View className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-100 dark:bg-[#080B11] transition-colors duration-300">
        <View className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative transition-all duration-300">
          {/* Premium Floating Preferences Toolbar */}
          <View className="absolute top-6 right-6 flex-row items-center gap-2 z-50">
            <TouchableOpacity
              onPress={() => setCurrentLang(nextLanguage)}
              className="h-11 px-3.5 rounded-lg border flex-row items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Text className="text-[10px] font-black tracking-wider uppercase text-slate-700 dark:text-slate-200">
                {nextLanguage === 'AR'
                  ? 'العربية'
                  : nextLanguage === 'EN'
                  ? 'English'
                  : 'Français'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
              }
              className="w-11 h-11 rounded-lg border flex items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Text className="text-base text-slate-700 dark:text-slate-200">
                {currentTheme === 'light' ? '🌙' : '☀️'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="text-center pt-2">
            <View className="lg:hidden mx-auto mb-4 flex justify-center">
              <LogoSVG size={56} />
            </View>
            <Text className="text-2xl font-black text-slate-950 dark:text-white">
              {authTab === 'signin' && tCommon('web.signinTitle', 'Connexion')}
              {authTab === 'signup' &&
                tCommon('web.signupTitle', 'Inscription')}
              {authTab === 'forgot' &&
                tCommon('web.forgotTitle', 'Mot de passe oublié')}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold">
              {authTab === 'signin' &&
                tCommon(
                  'web.signinSubtitle',
                  'Connectez-vous pour accéder à votre espace premium.',
                )}
              {authTab === 'signup' &&
                tCommon(
                  'web.signupSubtitle',
                  'Créez votre compte client gratuit en quelques secondes.',
                )}
              {authTab === 'forgot' &&
                tCommon(
                  'web.forgotSubtitle',
                  'Entrez votre email pour recevoir les instructions de réinitialisation.',
                )}
            </Text>
          </View>

          {authTab === 'signin' && (
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.emailLabel', 'Adresse Email')}
                </Text>
                <TextInput
                  keyboardType="email-address"
                  placeholder="exemple@email.com"
                  value={signinEmail}
                  onChangeText={setSigninEmail}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </View>

              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.passwordLabel', 'Mot de Passe')}
                </Text>
                <TextInput
                  secureTextEntry
                  placeholder="••••••••"
                  value={signinPassword}
                  onChangeText={setSigninPassword}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </View>

              <View className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold">
                <TouchableOpacity
                  onPress={() => {
                    setAuthTab('forgot');
                    setForgotEmail(signinEmail);
                    setForgotStatusMessage(null);
                  }}
                  className="text-[#F97316] hover:underline bg-transparent border-0 p-0"
                >
                  <Text className="text-[#F97316]">
                    {tCommon('web.forgotPasswordLink', 'Forgot Password?')}
                  </Text>
                </TouchableOpacity>
                <Text className="text-[10px]">
                  {tCommon('web.secureLoginBadge', 'Secure login')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSignIn}
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                <Text className="text-white text-xs font-black text-center">
                  {tCommon('web.secureLoginButton', 'Secure login')}
                </Text>
              </TouchableOpacity>

              <View className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
                <Text className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-bold mb-2.5">
                  {tCommon(
                    'web.demoAccountsLabel',
                    'LOYALSPIN DEMO ACCOUNTS (DIRECT ACCESS)',
                  )}
                </Text>
                <View className="grid grid-cols-2 gap-3 text-center">
                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('user@demo.com');
                      setSigninPassword('user123');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const userSession: WebSessionUser = {
                          id: 'user-web-demo',
                          name: 'Ahmed Ben Ali',
                          email: 'user@demo.com',
                          role: 'user',
                          phone: '+216 22 456 789',
                          status: 'active',
                          addresses: ['Ariana'],
                          city: 'Ariana',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(userSession, 'Accueil');
                        showToast(
                          tCommon(
                            'web.welcomeUser',
                            'Ravi de vous revoir, Ahmed Ben Ali !',
                          ),
                          'success',
                        );
                      }, 250);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                  >
                    <Text className="text-slate-800 dark:text-slate-200 text-[10px] font-black text-center">
                      Client LoyaltySpin (Ahmed Ben Ali)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('admin@demo.com');
                      setSigninPassword('admin123');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const adminSession: WebSessionUser = {
                          id: 'admin-web-demo',
                          name: 'Admin LoyaltySpin',
                          email: 'admin@demo.com',
                          role: 'admin',
                          phone: '+216 22 000 111',
                          status: 'active',
                          addresses: ['Tunis'],
                          city: 'Tunis',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(adminSession, 'AdminAccueil');
                        showToast(
                          tCommon(
                            'web.welcomeAdmin',
                            "Bienvenue dans votre espace d'administration !",
                          ),
                          'success',
                        );
                      }, 250);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                  >
                    <Text className="text-slate-800 dark:text-slate-200 text-[10px] font-black text-center">
                      Admin LoyaltySpin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {tCommon(
                    'web.noAccountQuestion',
                    `Nouveau sur ${businessName} ?`,
                  )}{' '}
                  <TouchableOpacity
                    onPress={() => {
                      setAuthTab('signup');
                      setSigninEmail('');
                      setSigninPassword('');
                    }}
                    className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0"
                  >
                    <Text className="text-[#F97316] font-extrabold">
                      {tCommon('web.createAccountLink', 'Créer un compte')}
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          )}

          {authTab === 'forgot' && (
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.emailLabel', 'Adresse Email')}
                </Text>
                <TextInput
                  keyboardType="email-address"
                  placeholder="exemple@email.com"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </View>

              {forgotStatusMessage && (
                <View className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <Text className="text-emerald-700 text-sm">
                    {forgotStatusMessage}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleForgotSubmit}
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                <Text className="text-white text-xs font-black text-center">
                  {tCommon('web.sendResetLinkButton', 'Send reset link')}
                </Text>
              </TouchableOpacity>

              <View className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <TouchableOpacity
                  onPress={() => {
                    setAuthTab('signin');
                    setForgotStatusMessage(null);
                  }}
                  className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0"
                >
                  <Text className="text-[#F97316] font-extrabold">
                    {tCommon('web.backToSignIn', 'Back to sign in')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {authTab === 'signup' && (
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.fullNameLabel', 'Nom Complet')}
                </Text>
                <TextInput
                  placeholder="Ahmed Ben Salem"
                  value={signupName}
                  onChangeText={setSignupName}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                />
              </View>

              <View className="grid grid-cols-2 gap-4">
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {tCommon('web.emailLabel', 'Email')}
                  </Text>
                  <TextInput
                    keyboardType="email-address"
                    placeholder="nom@email.tn"
                    value={signupEmail}
                    onChangeText={setSignupEmail}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {tCommon('web.phoneLabel', 'Téléphone')}
                  </Text>
                  <TextInput
                    placeholder="+216 22 111 222"
                    value={signupPhone}
                    onChangeText={setSignupPhone}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
              </View>

              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.cityGovernorateLabel', 'Ville / Gouvernorat')}
                </Text>
                <View className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden">
                  <Picker
                    selectedValue={signupCity}
                    onValueChange={setSignupCity}
                    style={{ height: 40 }}
                  >
                    <Picker.Item label="Tunis" value="Tunis" />
                    <Picker.Item label="Ariana" value="Ariana" />
                    <Picker.Item label="Ben Arous" value="Ben Arous" />
                    <Picker.Item label="Sousse" value="Sousse" />
                    <Picker.Item label="Sfax" value="Sfax" />
                    <Picker.Item label="Monastir" value="Monastir" />
                  </Picker>
                </View>
              </View>

              <View className="grid grid-cols-2 gap-4">
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {tCommon('web.passwordLabel', 'Mot de Passe')}
                  </Text>
                  <TextInput
                    secureTextEntry
                    placeholder="••••••••"
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {tCommon('web.confirmPasswordLabel', 'Confirmation')}
                  </Text>
                  <TextInput
                    secureTextEntry
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChangeText={setSignupConfirmPassword}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3.5 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                <Text className="text-white text-xs font-black text-center">
                  {tCommon(
                    'web.createAccountButton',
                    'Créer mon compte client',
                  )}
                </Text>
              </TouchableOpacity>

              <View className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {tCommon('web.alreadyRegisteredQuestion', 'Déjà inscrit ?')}{' '}
                  <TouchableOpacity
                    onPress={() => {
                      setAuthTab('signin');
                      setSignupName('');
                      setSignupEmail('');
                      setSignupPhone('');
                      setSignupPassword('');
                      setSignupConfirmPassword('');
                    }}
                    className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0"
                  >
                    <Text className="text-[#F97316] font-extrabold">
                      {tCommon('web.signInLink', 'Se connecter')}
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          )}

          {/* BYPASS AUTH / CONTINUE AS GUEST */}
          <View className="border-t border-slate-200 dark:border-slate-800 pt-5 text-center flex flex-col gap-3">
            <TouchableOpacity
              onPress={() => {
                setBypassAuth(true);
                setCurrentRole('anonyme');
                setSessionUser(null);
                setActiveTab('Accueil');
                showToast(
                  tCommon('web.guestAccessToast', 'Accès Invité autorisé.'),
                  'info',
                );
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white text-xs font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 hover:scale-[1.01] transform"
            >
              <Text className="text-slate-600 dark:text-slate-300">
                {tCommon(
                  'web.continueAsGuestButton',
                  "Continuer en tant qu'invité (Anonyme) →",
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
