import React from 'react';
import { View } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { LegalContent, type LegalPage } from './LegalContent';

type LegalRouteParams = {
  LegalScreen: {
    page?: LegalPage;
  };
};

export const LegalScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<LegalRouteParams, 'LegalScreen'>>();
  const page = route.params?.page ?? 'info';

  return (
    <View className="flex-1 bg-background">
      <LegalContent
        page={page}
        onBack={() => navigation.goBack()}
        onShowLegalPage={nextPage =>
          navigation.navigate('LegalScreen', { page: nextPage })
        }
        onNavigateAppPage={routeName => navigation.navigate(routeName)}
      />
    </View>
  );
};
