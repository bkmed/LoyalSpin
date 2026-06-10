import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useDispatch } from 'react-redux';
import LoyaltyWheel from '../components/LoyaltyWheel';
import SpinResultModal from '../components/SpinResultModal';
import { claimPrize } from '../../../store/slices/loyalSpinSlice';
import type { AppDispatch } from '../../../store';
import type { WheelSegment, Coupon, SpinHistoryItem } from '../types';
import { claimReward, getHistory } from '../../../services/loyalSpinService';

const LoyaltySpinScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [lastPrize, setLastPrize] = useState<WheelSegment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  const segments = useMemo<WheelSegment[]>(
    () => [
      {
        id: 'free-coffee',
        title: t('loyalspin.segment.coffee', 'Café offert'),
        description: t('loyalspin.segment.coffeeDesc', 'Un expresso gratuit'),
        color: '#4A90D9',
      },
      {
        id: 'free-croissant',
        title: t('loyalspin.segment.croissant', 'Croissant offert'),
        description: t(
          'loyalspin.segment.croissantDesc',
          'Une viennoiserie gratuite',
        ),
        color: '#F39C12',
      },
      {
        id: 'discount-10',
        title: t('loyalspin.segment.discount10', '-10%'),
        description: t(
          'loyalspin.segment.discount10Desc',
          'Réduction immédiate',
        ),
        color: '#8E44AD',
      },
      {
        id: 'discount-20',
        title: t('loyalspin.segment.discount20', '-20%'),
        description: t(
          'loyalspin.segment.discount20Desc',
          'Economisez maintenant',
        ),
        color: '#27AE60',
      },
      {
        id: 'mystery-gift',
        title: t('loyalspin.segment.mysteryGift', 'Cadeau mystère'),
        description: t(
          'loyalspin.segment.mysteryGiftDesc',
          'Récompense surprise',
        ),
        color: '#E67E22',
      },
      {
        id: 'double-points',
        title: t('loyalspin.segment.doublePoints', 'Double points'),
        description: t('loyalspin.segment.doublePointsDesc', 'Points doublés'),
        color: '#2C3E50',
      },
      {
        id: 'no-win',
        title: t('loyalspin.segment.noWin', 'Rien cette fois'),
        description: t('loyalspin.segment.noWinDesc', 'Retentez votre chance'),
        color: '#34495E',
      },
    ],
    [t],
  );

  const availablePoints = useMemo(() => 260 + history.length * 45, [history]);
  const loyaltyLevel = useMemo(() => {
    if (availablePoints < 320) return t('loyalspin.level.bronze', 'Bronze');
    if (availablePoints < 700) return t('loyalspin.level.silver', 'Silver');
    if (availablePoints < 1200) return t('loyalspin.level.gold', 'Gold');
    return t('loyalspin.level.platinum', 'Platinum');
  }, [availablePoints, t]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const savedHistory = await getHistory();
      setHistory(savedHistory);
    } catch (err) {
      console.error('Error loading history:', err);
      setError(t('loyalspin.status.error', 'Une erreur s’est produite.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSpinFinish = useCallback(
    async (segment: WheelSegment) => {
      setError(null);

      try {
        const result = await claimReward(segment);
        dispatch(claimPrize({ prize: segment.title }));
        setSelectedCoupon(result.coupon);
        setLastPrize(segment);
        setModalVisible(true);
        const savedHistory = await getHistory();
        setHistory(savedHistory);
      } catch (err) {
        console.error('Error claiming reward:', err);
        setError(t('loyalspin.status.error', 'Une erreur s’est produite.'));
      } finally {
        // spin false will be handled by the wheel component itself, we just need to update the history and show the result
      }
    },
    [dispatch, t],
  );

  const closeModal = useCallback(() => setModalVisible(false), []);

  const headerName = user?.name || t('loyalspin.header.guest', 'Invité');
  const cardWidth = Math.min(width - 32, 960);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.root,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={[styles.screen, { width: cardWidth }]}>
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.userRow}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.avatarText}>
                {headerName
                  .split(' ')
                  .map(part => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
                {t('loyalspin.header.welcome', {
                  name: headerName,
                })}
              </Text>
              <Text
                style={[styles.subtitleText, { color: theme.colors.subText }]}
              >
                {t('loyalspin.header.title', 'Roulette de fidélité')}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.primaryBackground },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
                {t('loyalspin.header.level', 'Niveau')}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {loyaltyLevel}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.successBackground },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
                {t('loyalspin.header.points', 'Points disponibles')}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {availablePoints}
              </Text>
            </View>
          </View>
        </View>

        {loading ? (
          <View
            style={[styles.centerCard, { backgroundColor: theme.colors.card }]}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[styles.centerMessage, { color: theme.colors.subText }]}
            >
              {t('loyalspin.status.loading', 'Chargement...')}
            </Text>
          </View>
        ) : error ? (
          <View
            style={[styles.centerCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[
                styles.retryButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={loadHistory}
            >
              <Text style={[styles.retryText, { color: theme.colors.card }]}>
                {t('loyalspin.status.tryAgain', 'Réessayer')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.text }]}
                >
                  {t('loyalspin.wheel.title', 'Votre Roulette 3D')}
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: theme.colors.subText },
                  ]}
                >
                  {t(
                    'loyalspin.wheel.description',
                    'Un spin premium pour gagner des récompenses café.',
                  )}
                </Text>
              </View>
              <LoyaltyWheel segments={segments} onFinish={handleSpinFinish} />
            </View>

            <View
              style={[
                styles.couponPanel,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View style={styles.panelHeader}>
                <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
                  {t('loyalspin.coupon.title', 'Coupon Généré')}
                </Text>
                <Text
                  style={[
                    styles.panelSubtitle,
                    { color: theme.colors.subText },
                  ]}
                >
                  {t(
                    'loyalspin.coupon.details',
                    'Présentez ce coupon à la caisse pour utiliser votre récompense.',
                  )}
                </Text>
              </View>
              {selectedCoupon ? (
                <View
                  style={[
                    styles.couponBox,
                    { borderColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={[styles.couponCode, { color: theme.colors.text }]}
                  >
                    {selectedCoupon.code}
                  </Text>
                  <Text
                    style={[
                      styles.couponExpiry,
                      { color: theme.colors.subText },
                    ]}
                  >
                    {t('loyalspin.coupon.expires', 'Valide jusqu’au')}{' '}
                    {selectedCoupon.expiresAt}
                  </Text>
                  <Text
                    style={[
                      styles.couponDetailText,
                      { color: theme.colors.subText },
                    ]}
                  >
                    {selectedCoupon.details}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[styles.emptyText, { color: theme.colors.subText }]}
                >
                  {t(
                    'loyalspin.coupon.empty',
                    'Aucun coupon généré. Lancez la roulette !',
                  )}
                </Text>
              )}
            </View>

            <View
              style={[
                styles.historyCard,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('loyalspin.history.title', 'Historique des gains')}
              </Text>
              {history.length === 0 ? (
                <Text
                  style={[styles.emptyText, { color: theme.colors.subText }]}
                >
                  {t(
                    'loyalspin.history.empty',
                    'Aucun gain encore, tentez votre chance.',
                  )}
                </Text>
              ) : (
                history.map(item => (
                  <View
                    key={item.id}
                    style={[
                      styles.historyRow,
                      { borderColor: theme.colors.border },
                    ]}
                  >
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <View style={styles.historyMeta}>
                      <Text
                        style={[
                          styles.historyPrize,
                          { color: theme.colors.text },
                        ]}
                      >
                        {item.prize}
                      </Text>
                      <Text
                        style={[
                          styles.historyTime,
                          { color: theme.colors.subText },
                        ]}
                      >
                        {item.earnedAt}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </View>

      <SpinResultModal
        visible={modalVisible}
        onClose={closeModal}
        segment={lastPrize}
        coupon={selectedCoupon}
        title={t('loyalspin.spinResult.title', '🎉 Félicitations')}
        message={t('loyalspin.spinResult.message', {
          reward:
            lastPrize?.title || t('loyalspin.wheel.title', 'Votre Roulette 3D'),
        })}
        actionLabel={t('loyalspin.spinResult.tryAgain', 'Réessayer')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%',
  },
  screen: {
    width: '100%',
    maxWidth: 960,
    paddingHorizontal: 16,
  },
  headerCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitleText: {
    marginTop: 4,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: 18,
    padding: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  centerCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  centerMessage: {
    marginTop: 16,
    fontSize: 15,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  retryText: {
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  sectionHeader: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  couponPanel: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  panelHeader: {
    marginBottom: 14,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  panelSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  couponBox: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  couponCode: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  couponExpiry: {
    fontSize: 13,
    marginBottom: 8,
  },
  couponDetailText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  historyCard: {
    borderRadius: 28,
    padding: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  historyMeta: {
    flex: 1,
  },
  historyPrize: {
    fontSize: 15,
    fontWeight: '700',
  },
  historyTime: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default LoyaltySpinScreen;
