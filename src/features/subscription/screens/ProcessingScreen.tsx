import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export const ProcessingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Placeholder: in real flow verify payment via PaymentService then navigate
    const timer = setTimeout(() => {
      navigation.replace('Subscription.Success');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>{t('payment.processing')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { marginTop: 12, fontSize: 16 },
});

export default ProcessingScreen;
