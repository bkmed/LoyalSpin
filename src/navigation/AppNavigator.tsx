import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, Text } from 'react-native';

import { WebAuthScreen } from '../features/loyalspin/screens/WebAuthScreen';
import SuperAdminDashboard from '../features/loyalspin/screens/SuperAdminDashboard';
import AdminDashboard from '../features/loyalspin/screens/AdminDashboard';
import ClientDashboard from '../features/loyalspin/screens/client/ClientDashboard';
import ClientSpinScreen from '../features/loyalspin/screens/client/ClientSpinScreen';
import QRScannerScreen from '../features/loyalspin/screens/client/QRScannerScreen';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

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

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthWrapper} />
        ) : user.role === 'super-admin' ? (
          <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
        ) : user.role === 'admin' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <>
            <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
            <Stack.Screen name="ClientSpin" component={ClientSpinScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
