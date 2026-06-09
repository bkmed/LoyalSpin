import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('subscription.register.title')}</Text>
      {/* Form fields should be implemented using project's form components */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Subscription.Establishment')}
      >
        <Text style={styles.buttonText}>{t('subscription.continue')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  button: { backgroundColor: '#0a84ff', padding: 12, borderRadius: 8, marginTop: 24 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default RegisterScreen;
