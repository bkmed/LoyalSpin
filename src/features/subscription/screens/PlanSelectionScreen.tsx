import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export const PlanSelectionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('subscription.choosePlan')}</Text>
      <ScrollView contentContainerStyle={styles.list}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Subscription.Register')}
        >
          <Text style={styles.planTitle}>{t('plans.starter.name')}</Text>
          <Text style={styles.planFeature}>{t('plans.starter.feature1')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Subscription.Register')}
        >
          <Text style={styles.planTitle}>{t('plans.business.name')}</Text>
          <Text style={styles.planFeature}>{t('plans.business.feature1')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Subscription.Register')}
        >
          <Text style={styles.planTitle}>{t('plans.enterprise.name')}</Text>
          <Text style={styles.planFeature}>
            {t('plans.enterprise.feature1')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  list: { paddingBottom: 24 },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 1,
  },
  planTitle: { fontSize: 16, fontWeight: '700' },
  planFeature: { fontSize: 13, color: '#666', marginTop: 6 },
});

export default PlanSelectionScreen;
