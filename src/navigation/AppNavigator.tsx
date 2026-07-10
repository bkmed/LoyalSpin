import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, Text, Platform } from 'react-native';

import { WebAuthScreen } from '../features/loyalspin/screens/WebAuthScreen';
import SuperAdminDashboard from '../features/loyalspin/screens/SuperAdminDashboard';
import AdminDashboard from '../features/loyalspin/screens/AdminDashboard';
import ClientDashboard from '../features/loyalspin/screens/client/ClientDashboard';
import ClientSpinScreen from '../features/loyalspin/screens/client/ClientSpinScreen';
import QRScannerScreen from '../features/loyalspin/screens/client/QRScannerScreen';
import ProfileSettingsScreen from '../features/loyalspin/screens/ProfileSettingsScreen';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

// ── Detect preview mode from URL (web only) ──────────────────────────────────
function getPreviewParamsFromUrl(): { isPreview: boolean; projectId: string | null } {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { isPreview: false, projectId: null };
  }
  const pathname = window.location.pathname; // ex: "/spin/abc123"
  const search = window.location.search;     // ex: "?preview=true"
  const spinMatch = pathname.match(/^\/spin\/([^/?]+)/);
  const isPreview = new URLSearchParams(search).get('preview') === 'true';
  return {
    isPreview: isPreview && !!spinMatch,
    projectId: spinMatch ? spinMatch[1] : null,
  };
}

const AuthWrapper = (props: any) => {
  const { t, i18n } = useTranslation();
  const { theme, setThemeMode } = useTheme();
  const { showToast } = useToast();
  const { signIn } = useAuth();

  const nextLanguage = i18n.language === 'fr' ? 'en' : i18n.language === 'en' ? 'ar' : 'fr';

  return (
    <WebAuthScreen
      {...props}
      businessName="LoyalSpin"
      currentTheme={theme.dark ? 'dark' : 'light'}
      setCurrentTheme={setThemeMode}
      setCurrentLang={(lang: string) => i18n.changeLanguage(lang)}
      nextLanguage={nextLanguage}
      t={t}
      showToast={showToast}
      startWebSession={(userSession: any) => {
        signIn(userSession);
      }}
      setBypassAuth={() => {}}
      setCurrentRole={() => {}}
      setSessionUser={() => {}}
      setActiveTab={() => {}}
    />
  );
};

const Stack = createNativeStackNavigator();

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F19' }}>
    <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>Loading AppNavigator...</Text>
  </View>
);

// ── Wrapper qui injecte projectId depuis l'URL dans ClientSpinScreen ──────────
const PreviewSpinScreen = (props: any) => {
  const { projectId } = getPreviewParamsFromUrl();
  // Simuler le format de route attendu par ClientSpinScreen
  const fakeRoute = { params: { projectId: projectId || 'default' } };
  const fakeNavigation = { navigate: () => {} };
  return <ClientSpinScreen {...props} route={fakeRoute} navigation={fakeNavigation} />;
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  // Lire les paramètres d'URL une seule fois au montage
  const { isPreview, projectId } = getPreviewParamsFromUrl();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || isLoading) {
    return <SplashScreen />;
  }

  // ── Mode preview : affiche la page client peu importe le rôle ────────────
  if (isPreview && projectId) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="PreviewSpin" component={PreviewSpinScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthWrapper} />
        ) : user.role === 'super-admin' ? (
          <>
            <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
            <Stack.Screen name="Profile" component={ProfileSettingsScreen} />
          </>
        ) : user.role === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="Profile" component={ProfileSettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
            <Stack.Screen name="ClientSpin" component={ClientSpinScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="Profile" component={ProfileSettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
