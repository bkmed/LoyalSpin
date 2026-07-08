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

const AuthWrapper = (props: any) => (
  <WebAuthScreen
    {...props}
    businessName="LoyalSpin"
    currentTheme="dark"
    setCurrentTheme={() => {}}
    setCurrentLang={() => {}}
    t={(key: string) => key}
    showToast={() => {}}
    startWebSession={() => {}}
    setBypassAuth={() => {}}
    setCurrentRole={() => {}}
    setSessionUser={() => {}}
    setActiveTab={() => {}}
  />
);

const Stack = createNativeStackNavigator();

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading...</Text>
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
