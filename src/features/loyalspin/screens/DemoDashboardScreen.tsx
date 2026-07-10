import React from 'react';
import { View, ScrollView, Text, Platform, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from '../../../theme';

interface DemoDashboardScreenProps {
  isDarkMode?: boolean;
}

export const DemoDashboardScreen: React.FC<DemoDashboardScreenProps> = ({
  isDarkMode = false,
}) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  const isWeb = Platform.OS === 'web';
  const { t } = useTranslation();

  // Mock data
  const customerData = {
    name: 'Jean Dupont',
    points: 2850,
    level: 'Gold',
    lastVisit: 'Today at 14:30',
    visits: 23,
  };

  const rewards = [
    {
      id: 1,
      title: t('loyalspin.demoDashboard.rewards.freeCoffee.title', {
        defaultValue: 'Free Coffee',
      }),
      value: '2.50€',
      icon: '☕',
      condition: t('loyalspin.demoDashboard.rewards.freeCoffee.condition', {
        defaultValue: '250 points',
      }),
    },
    {
      id: 2,
      title: t('loyalspin.demoDashboard.rewards.freeCroissant.title', {
        defaultValue: 'Free Croissant',
      }),
      value: '1.20€',
      icon: '🥐',
      condition: t('loyalspin.demoDashboard.rewards.freeCroissant.condition', {
        defaultValue: '150 points',
      }),
    },
    {
      id: 3,
      title: t('loyalspin.demoDashboard.rewards.discount20.title', {
        defaultValue: '20% Discount',
      }),
      value: '-20%',
      icon: '🏷️',
      condition: t('loyalspin.demoDashboard.rewards.discount20.condition', {
        defaultValue: '500 points',
      }),
    },
    {
      id: 4,
      title: t('loyalspin.demoDashboard.rewards.mysteryGift.title', {
        defaultValue: 'Mystery Gift',
      }),
      value: '?',
      icon: '🎁',
      condition: t('loyalspin.demoDashboard.rewards.mysteryGift.condition', {
        defaultValue: '1000 points',
      }),
    },
  ];

  const stats = [
    {
      label: t('loyalspin.demoDashboard.stats.totalVisits', {
        defaultValue: 'Visites Totales',
      }),
      value: '23',
      unit: '',
    },
    {
      label: t('loyalspin.demoDashboard.stats.pointsEarned', {
        defaultValue: 'Points Earned',
      }),
      value: '2,850',
      unit: 'pts',
    },
    {
      label: t('loyalspin.demoDashboard.stats.rewardsEarned', {
        defaultValue: 'Rewards Earned',
      }),
      value: '8',
      unit: '',
    },
    {
      label: t('loyalspin.demoDashboard.stats.level', {
        defaultValue: 'Level',
      }),
      value: 'GOLD',
      unit: '',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: isWeb ? 24 : 16,
      paddingVertical: isWeb ? 20 : 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: isWeb ? 24 : 22,
      fontWeight: '700',
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.colors.subText,
      marginTop: 4,
    },
    scrollContent: {
      paddingHorizontal: isWeb ? 24 : 16,
      paddingVertical: 20,
    },
    profileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: isWeb ? 24 : 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    profileHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    profileLevel: {
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 4,
    },
    profileBadge: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 32,
    },
    pointsContainer: {
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pointsText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    pointsLabel: {
      fontSize: 13,
      color: theme.colors.subText,
      marginTop: 4,
    },
    statsContainer: {
      marginTop: 16,
      gap: 12,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    statLabel: {
      fontSize: 13,
      color: theme.colors.subText,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
      marginTop: 20,
    },
    rewardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    rewardCard: {
      width: isWeb ? '48%' : '100%',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardIcon: {
      fontSize: 40,
      marginBottom: 8,
    },
    rewardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    rewardValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.accent,
      marginTop: 4,
    },
    rewardCondition: {
      fontSize: 12,
      color: theme.colors.subText,
      marginTop: 6,
      textAlign: 'center',
    },
    infoText: {
      fontSize: 13,
      color: theme.colors.subText,
      textAlign: 'center',
      marginVertical: 16,
      paddingHorizontal: 16,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('loyalspin.demoDashboard.title', {
            defaultValue: 'Demo LoyalSpin',
          })}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t('loyalspin.demoDashboard.subtitle', {
            defaultValue: 'Explore the full customer experience',
          })}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{customerData.name}</Text>
              <Text style={styles.profileLevel}>
                Level: {customerData.level}
              </Text>
            </View>
            <View style={styles.profileBadge}>
              <Text>👤</Text>
            </View>
          </View>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{customerData.points}</Text>
            <Text style={styles.pointsLabel}>
              {t('loyalspin.demoDashboard.pointsAvailable', {
                defaultValue: 'Points disponibles',
              })}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>
                  {stat.value} {stat.unit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.infoText}>
          {t('loyalspin.demoDashboard.demoNotice', {
            defaultValue: 'ℹ️ This is a read-only interactive demo',
          })}
        </Text>

        {/* Rewards Section */}
        <Text style={styles.sectionTitle}>
          {t('loyalspin.demoDashboard.rewardsSectionTitle', {
            defaultValue: 'Available rewards',
          })}
        </Text>
        <View style={styles.rewardsGrid}>
          {rewards.map(reward => (
            <View key={reward.id} style={styles.rewardCard}>
              <Text style={styles.rewardIcon}>{reward.icon}</Text>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardValue}>{reward.value}</Text>
              <Text style={styles.rewardCondition}>{reward.condition}</Text>
            </View>
          ))}
        </View>

        {/* Spin Wheel Section */}
        <Text style={styles.sectionTitle}>
          {t('loyalspin.demoDashboard.spinWheelSectionTitle', {
            defaultValue: 'Spin the Wheel',
          })}
        </Text>
        <View style={styles.rewardCard}>
          <Text style={{ fontSize: 60, marginBottom: 12 }}>🎡</Text>
          <Text style={styles.rewardTitle}>
            {t('loyalspin.demoDashboard.spinWheelTitle', {
              defaultValue: 'Your 3D Wheel',
            })}
          </Text>
          <Text style={styles.rewardCondition}>
            {t('loyalspin.demoDashboard.spinWheelDescription', {
              defaultValue:
                'At each visit, spin the wheel and win instant rewards!',
            })}
          </Text>
        </View>

        {/* Coupon Section */}
        <Text style={styles.sectionTitle}>
          {t('loyalspin.demoDashboard.couponsSectionTitle', {
            defaultValue: 'Your Coupons',
          })}
        </Text>
        <View style={styles.rewardCard}>
          <Text style={{ fontSize: 60, marginBottom: 12 }}>🎟️</Text>
          <Text style={styles.rewardTitle}>
            {t('loyalspin.demoDashboard.activeCouponsTitle', {
              defaultValue: 'Active Coupons',
            })}
          </Text>
          <Text
            style={[
              styles.rewardValue,
              { color: theme.colors.accent, fontSize: 24 },
            ]}
          >
            3
          </Text>
          <Text style={styles.rewardCondition}>
            {t('loyalspin.demoDashboard.activeCouponsDescription', {
              defaultValue:
                'View your available coupons and present them at the counter',
            })}
          </Text>
        </View>

        {/* Card Section */}
        <Text style={styles.sectionTitle}>
          {t('loyalspin.demoDashboard.loyaltyCardSectionTitle', {
            defaultValue: 'Your Loyalty Card',
          })}
        </Text>
        <View style={styles.rewardCard}>
          <Text style={{ fontSize: 60, marginBottom: 12 }}>💳</Text>
          <Text style={styles.rewardTitle}>
            {t('loyalspin.demoDashboard.digitalCardTitle', {
              defaultValue: 'Digital Loyalty Card',
            })}
          </Text>
          <Text style={styles.rewardCondition}>
            {t('loyalspin.demoDashboard.digitalCardDescription', {
              defaultValue:
                'Access your personal QR code to present at each visit',
            })}
          </Text>
        </View>

        {/* Footer Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default DemoDashboardScreen;
