import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LogoSVG } from '../components/LogoSVG';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
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
  const { signIn, signUp } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'forgot'>(
    'signin',
  );
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatusMessage, setForgotStatusMessage] = useState<string | null>(null);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('Tunis');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleSignIn = async () => {
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
        tCommon('web.welcomeSuper', 'Welcome Super Admin !'),
        'success',
      );
      return;
    }

    if (signinEmail === 'admin@demo.com' && signinPassword === 'admin123') {
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
        tCommon('web.welcomeAdmin', "Bienvenue dans votre espace d'administration !"),
        'success',
      );
      return;
    }

    if (signinEmail === 'user@demo.com' && signinPassword === 'user123') {
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
      startWebSession(userSession, 'UserDashboard');
      showToast(
        tCommon('web.welcomeUser', 'Nice to see you again, Ahmed Ben Ali !'),
        'success',
      );
      return;
    }

    setIsProcessing(true);
    try {
      const user = await authService.login(signinEmail.trim(), signinPassword);
      await signIn(user);
      showToast(tCommon('web.welcomeBack', 'Welcome back!'), 'success');
    } catch (error: any) {
      showToast(
        error?.message || tCommon('web.invalidCredentials', 'Invalid credentials'),
        'error',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignUp = async () => {
    if (signupPassword !== signupConfirmPassword) {
      showToast(
        tCommon('web.passwordsMismatch', 'Passwords do not match'),
        'error',
      );
      return;
    }

    setIsProcessing(true);
    try {
      const user = await authService.register(
        signupName.trim(),
        signupEmail.trim(),
        signupPassword,
        'user',
      );
      await signUp(user);
      showToast(
        tCommon('web.signupSuccess', 'Account created successfully!'),
        'success',
      );
    } catch (error: any) {
      showToast(
        error?.message || tCommon('web.signupFailed', 'Unable to create account.'),
        'error',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotSubmit = () => {
    setForgotStatusMessage(
      tCommon('web.resetLinkSent', 'The reset link has been sent !'),
    );
  };

  const socialProviders = [
    { id: 'gmail', label: tCommon('web.socialProviderGmail', 'Gmail') },
    {
      id: 'facebook',
      label: tCommon('web.socialProviderFacebook', 'Facebook'),
    },
    {
      id: 'instagram',
      label: tCommon('web.socialProviderInstagram', 'Instagram'),
    },
    { id: 'tiktok', label: tCommon('web.socialProviderTikTok', 'TikTok') },
  ];

  const handleSocialAuth = (provider: string) => {
    showToast(
      tCommon(
        authTab === 'signin' ? 'web.socialAuthTitle' : 'web.socialAuthTitle',
        authTab === 'signin' ? 'Social sign in' : 'Social sign up',
      ) +
        ': ' +
        provider,
      'info',
    );
  };

  return (
    <View style={{ flex: 1, ...(Platform.OS === 'web' ? { minHeight: '100vh' as any } : {}) }} className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
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
              {tCommon('web.branding_services', 'Roulette · Coupons · Rewards · Partners',
              )}
            </Text>
          </View>
        </View>

        <View className="my-auto space-y-6 relative z-10 text-left">
          <Text className="bg-[#F97316] text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider leading-none">
            {tCommon('web.branding_platform', 'LOYALSPIN PLATFORM')}
          </Text>
          <Text className="text-4xl sm:text-5xl font-black text-white leading-tight">
            {tCommon('web.branding_leader', 'Spin, win and keep your rewards.',
            )}
          </Text>
          <Text className="text-slate-300 text-sm leading-relaxed font-semibold">
            {tCommon('web.branding_description', 'Join the loyalty wheel, earn coupons and discover partner offers on web, Android and iOS.',
            )}
          </Text>
          <View className="grid grid-cols-2 gap-6 pt-6">
            <View>
              <Text className="text-2xl font-black text-[#F97316]">
                {tCommon('web.branding_24h', 'Win every day')}
              </Text>
              <Text className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 dark:text-slate-300">
                {tCommon('web.branding_urgentIntervention', 'Spin every day',
                )}
              </Text>
            </View>
            <View>
              <Text className="text-2xl font-black text-[#F97316]">
                {tCommon('web.branding_tested', 'Secured rewards')}
              </Text>
              <Text className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 dark:text-slate-300">
                {tCommon('web.branding_partsWarranty', 'Verified offers')}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xs text-slate-500 font-bold relative z-10 dark:text-slate-400">
          {tCommon('web.branding_copyright', '© ${new Date().getFullYear()}{{businessName}}. Built for loyal customers and partners.',
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
                {nextLanguage === 'ar'
                  ? tCommon('web.languageArabicLabel', 'Arabic')
                  : nextLanguage === 'en'
                  ? tCommon('web.languageEnglishLabel', 'English')
                  : tCommon('web.languageFrenchLabel', 'French')}
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
              {authTab === 'signin' && tCommon('web.signinTitle', 'Sign in')}
              {authTab === 'signup' &&
                tCommon('web.signupTitle', 'Sign up')}
              {authTab === 'forgot' &&
                tCommon('web.forgotTitle', 'Forgot Password')}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold">
              {authTab === 'signin' &&
                tCommon('web.signinSubtitle', 'Sign in to access your premium space.',
                )}
              {authTab === 'signup' &&
                tCommon('web.signupSubtitle', 'Create your free customer account in seconds.',
                )}
              {authTab === 'forgot' &&
                tCommon('web.forgotSubtitle', 'Enter your email to receive reset instructions.',
                )}
            </Text>
          </View>

          {authTab === 'signin' && (
            <form
              className="space-y-4"
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSignIn();
              }}
            >
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.emailLabel', 'Email Address')}
                </Text>
                <TextInput
                  keyboardType="email-address"
                  placeholder={tCommon('web.emailPlaceholder', 'example@email.com')}
                  value={signinEmail}
                  onChangeText={setSigninEmail}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </View>

              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.passwordLabel', 'Password')}
                </Text>
                <TextInput
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  placeholder={tCommon('web.passwordPlaceholder', '••••••••')}
                  value={signinPassword}
                  onChangeText={setSigninPassword}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </View>

              <View className="space-y-3">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.socialLoginTitle', 'Or sign in with')}
                </Text>
                <View className="grid grid-cols-2 gap-3">
                  {socialProviders.map(provider => (
                    <TouchableOpacity
                      key={provider.id}
                      onPress={() => handleSocialAuth(provider.label)}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-xs font-black text-slate-800 dark:text-slate-200 transition"
                    >
                      <Text className="text-center text-slate-800 dark:text-slate-200">
                        {provider.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
                  {tCommon('web.demoAccountsLabel', 'LOYALSPIN DEMO ACCOUNTS (DIRECT ACCESS)',
                  )}
                </Text>
                <View className="grid grid-cols-2 gap-3 text-center">
                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('super@demo.com');
                      setSigninPassword('super123');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const superSession: WebSessionUser = {
                          id: 'super-web-demo',
                          name: 'Super Admin LoyaltySpin',
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
                      {tCommon('web.demoAccount.superAdmin', 'Super Admin LoyaltySpin')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('admin1@demo.com');
                      setSigninPassword('admin123');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const admin1Session: WebSessionUser = {
                          id: 'admin1-web-demo',
                          name: 'Admin LoyaltySpin 1',
                          email: 'admin1@demo.com',
                          role: 'admin',
                          phone: '+216 22 000 111',
                          status: 'active',
                          addresses: ['Tunis'],
                          city: 'Tunis',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(admin1Session, 'AdminAccueil');
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
                      {tCommon('web.demoAccount.admin1', 'Admin LoyaltySpin 1')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('admin2@demo.com');
                      setSigninPassword('admin234');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const admin2Session: WebSessionUser = {
                          id: 'admin2-web-demo',
                          name: 'Admin LoyaltySpin 2',
                          email: 'admin2@demo.com',
                          role: 'admin',
                          phone: '+216 22 000 222',
                          status: 'active',
                          addresses: ['Sfax'],
                          city: 'Sfax',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(admin2Session, 'AdminAccueil');
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
                      {tCommon('web.demoAccount.admin2', 'Admin LoyaltySpin 2')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('user1@demo.com');
                      setSigninPassword('user123');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const client1Session: WebSessionUser = {
                          id: 'user1-web-demo',
                          name: 'Client LoyaltySpin 1',
                          email: 'user1@demo.com',
                          role: 'user',
                          phone: '+216 22 456 789',
                          status: 'active',
                          addresses: ['Ariana'],
                          city: 'Ariana',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(client1Session, 'UserDashboard');
                        showToast(
                          tCommon('web.welcomeUser', 'Nice to see you again, Ahmed Ben Ali !',
                          ),
                          'success',
                        );
                      }, 250);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                  >
                    <Text className="text-slate-800 dark:text-slate-200 text-[10px] font-black text-center">
                      {tCommon('web.demoAccount.client1', 'Client LoyaltySpin 1')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSigninEmail('user2@demo.com');
                      setSigninPassword('user234');
                      showToast(
                        tCommon('web.signingIn', 'Signing in...'),
                        'info',
                      );
                      setTimeout(() => {
                        const client2Session: WebSessionUser = {
                          id: 'user2-web-demo',
                          name: 'Client LoyaltySpin 2',
                          email: 'user2@demo.com',
                          role: 'user',
                          phone: '+216 22 456 790',
                          status: 'active',
                          addresses: ['Sousse'],
                          city: 'Sousse',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(client2Session, 'UserDashboard');
                        showToast(
                          tCommon('web.welcomeUser', 'Nice to see you again, Ahmed Ben Ali !',
                          ),
                          'success',
                        );
                      }, 250);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                  >
                    <Text className="text-slate-800 dark:text-slate-200 text-[10px] font-black text-center">
                      {tCommon('web.demoAccount.client2', 'Client LoyaltySpin 2')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {tCommon(
                    'web.noAccountQuestion',
                    `New to ${businessName}?`,
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
                      {tCommon('web.createAccountLink', 'Create an account')}
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </form>
          )}

          {authTab === 'forgot' && (
            <form
              className="space-y-4"
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleForgotSubmit();
              }}
            >
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.emailLabel', 'Email Address')}
                </Text>
                <TextInput
                  keyboardType="email-address"
                  placeholder={tCommon('web.emailPlaceholder', 'example@email.com')}
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
            </form>
          )}

          {authTab === 'signup' && (
            <form
              className="space-y-4"
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSignUp();
              }}
            >
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.fullNameLabel', 'Full Name')}
                </Text>
                <TextInput
                  placeholder={tCommon('web.fullNamePlaceholder', 'Ahmed Ben Salem')}
                  value={signupName}
                  onChangeText={setSignupName}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                />
              </View>

              <View className="grid grid-cols-2 gap-4">
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {tCommon('web.emailLabel', 'Email Address')}
                  </Text>
                  <TextInput
                    keyboardType="email-address"
                    placeholder={tCommon('web.emailPlaceholder', 'name@email.com')}
                    value={signupEmail}
                    onChangeText={setSignupEmail}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {tCommon('web.phoneLabel', 'Phone')}
                  </Text>
                  <TextInput
                    placeholder={tCommon('web.phonePlaceholder', '+216 22 111 222')}
                    value={signupPhone}
                    onChangeText={setSignupPhone}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
              </View>

              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.cityGovernorateLabel', 'City / Governorate')}
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
                    {tCommon('web.passwordLabel', 'Password')}
                  </Text>
                  <TextInput
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    placeholder={tCommon('web.passwordPlaceholder', '••••••••')}
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    placeholder={tCommon('web.passwordPlaceholder', '••••••••')}
                    value={signupConfirmPassword}
                    onChangeText={setSignupConfirmPassword}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </View>
              </View>

              <View className="space-y-3">
                <Text className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.socialSignUpTitle', 'Or sign up with')}
                </Text>
                <View className="grid grid-cols-2 gap-3">
                  {socialProviders.map(provider => (
                    <TouchableOpacity
                      key={provider.id}
                      onPress={() => handleSocialAuth(provider.label)}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-xs font-black text-slate-800 dark:text-slate-200 transition"
                    >
                      <Text className="text-center text-slate-800 dark:text-slate-200">
                        {provider.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3.5 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                <Text className="text-white text-xs font-black text-center">
                  {tCommon('web.createAccountButton', 'Create my customer account',
                  )}
                </Text>
              </TouchableOpacity>

              <View className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <Text className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {tCommon('web.alreadyRegisteredQuestion', 'Already registered?')}{' '}
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
                      {tCommon('web.signInLink', 'Sign in')}
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </form>
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
                  tCommon('web.guestAccessToast', 'Guest access granted.'),
                  'info',
                );
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white text-xs font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 hover:scale-[1.01] transform"
            >
              <Text className="text-slate-600 dark:text-slate-300">
                {tCommon(
                  'web.continueAsGuestButton',
                  'Continue as guest (Anonymous) →',
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
