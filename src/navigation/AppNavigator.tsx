import React from 'react';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';

if (Platform.OS === 'web') {
  enableScreens(false);
}

import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';

// Import all LoyalSpin screens
import { WebAuthScreen } from '../features/loyalspin/screens/WebAuthScreen';
import HomeScreenWeb from '../features/loyalspin/screens/HomeScreen.web';
import ProfileScreenWeb from '../features/loyalspin/screens/ProfileScreen.web';
import GalleryScreen from '../features/loyalspin/screens/GalleryScreen';
import MarketplaceScreen from '../features/loyalspin/screens/MarketplaceScreen';
import AdminProfileScreen from '../features/loyalspin/screens/AdminProfileScreen';
import AdminAnalyticsScreen from '../features/loyalspin/screens/AdminAnalyticsScreen';
import AdminGalleryEditor from '../features/loyalspin/screens/AdminGalleryEditor';
import AdminServicesEditor from '../features/loyalspin/screens/AdminServicesEditor';
import ZonesScreen from '../features/loyalspin/screens/ZonesScreen';
import LegalPages from '../features/loyalspin/screens/LegalPages';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootState } from '../store';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const uiState = useSelector((state: RootState) => state.ui);
  const { bypassAuth } = uiState;

  const { user: authUser } = useAuth();
  const { sessionUser, currentRole } = useSelector(
    (state: RootState) => (state as any).webSession || {},
  );

  const isAuthenticated = (authUser || sessionUser) && !bypassAuth;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Auth" component={WebAuthScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreenWeb} />
            <Stack.Screen name="Profile" component={ProfileScreenWeb} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
            <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
            <Stack.Screen name="Informations" component={LegalPages} />
            <Stack.Screen name="Politique" component={LegalPages} />
            <Stack.Screen name="Conditions" component={LegalPages} />
            <Stack.Screen name="PlanSite" component={LegalPages} />

            {currentRole === 'admin' && (
              <>
                <Stack.Screen name="AdminAccueil" component={HomeScreenWeb} />
                <Stack.Screen
                  name="AdminProfile"
                  component={AdminProfileScreen}
                />
                <Stack.Screen
                  name="AdminGallery"
                  component={AdminGalleryEditor}
                />
                <Stack.Screen
                  name="AdminAnnouncements"
                  component={AdminServicesEditor}
                />
                <Stack.Screen name="AdminZones" component={ZonesScreen} />
                <Stack.Screen
                  name="AdminAnalytics"
                  component={AdminAnalyticsScreen}
                />
              </>
            )}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
