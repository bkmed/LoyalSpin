import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export const FailedScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('payment.failed.title')}</Text>
      <Text style={styles.message}>{t('payment.failed.message')}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Subscription.Payment')}
      >
        <Text style={styles.buttonText}>{t('payment.retry')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  message: { fontSize: 16, color: '#666', marginBottom: 24 },
  button: { backgroundColor: '#0a84ff', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default FailedScreen;
