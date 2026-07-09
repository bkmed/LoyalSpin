import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Animated,
  Platform as RNPlatform,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialLinks {
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

interface Platform {
  key: 'google' | 'facebook' | 'instagram' | 'tiktok';
  label: string;
  action: string;      // e.g. "Laisser un avis"
  emoji: string;
  bgColor: string;
  borderColor: string;
  urlKey: keyof SocialLinks;
  fallbackUrl: string;
}

interface SocialShareGateProps {
  links: SocialLinks;
  businessName?: string;
  onShared: () => void;
}

// ─── Platform definitions ─────────────────────────────────────────────────────

const PLATFORMS: Platform[] = [
  {
    key: 'google',
    label: 'Google Maps',
    action: 'Laisser un avis ⭐',
    emoji: '🗺️',
    bgColor: '#ffffff',
    borderColor: '#EA4335',
    urlKey: 'googleMapsUrl',
    fallbackUrl: 'https://maps.google.com',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    action: 'Partager sur Facebook',
    emoji: '📘',
    bgColor: '#1877F2',
    borderColor: '#1877F2',
    urlKey: 'facebookUrl',
    fallbackUrl: 'https://facebook.com',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    action: 'Partager sur Instagram',
    emoji: '📸',
    bgColor: '#E1306C',
    borderColor: '#E1306C',
    urlKey: 'instagramUrl',
    fallbackUrl: 'https://instagram.com',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    action: 'Partager sur TikTok',
    emoji: '🎵',
    bgColor: '#010101',
    borderColor: '#69C9D0',
    urlKey: 'tiktokUrl',
    fallbackUrl: 'https://tiktok.com',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SocialShareGate({
  links,
  businessName = 'notre établissement',
  onShared,
}: SocialShareGateProps) {
  const [clickedPlatform, setClickedPlatform] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePlatformPress = async (platform: Platform) => {
    const url = links[platform.urlKey] || platform.fallbackUrl;
    setClickedPlatform(platform.key);

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(platform.fallbackUrl);
      }
    } catch {
      await Linking.openURL(platform.fallbackUrl);
    }
  };

  const handleConfirm = () => {
    if (!clickedPlatform) return;
    setConfirmed(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 180,
        useNativeDriver: RNPlatform.OS !== 'web',
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: RNPlatform.OS !== 'web',
      }),
    ]).start(() => {
      onShared();
    });
  };

  // Filter platforms that have a configured URL or always show all
  const availablePlatforms = PLATFORMS.filter(
    p => !links || links[p.urlKey] !== undefined ? true : true, // show all, highlight configured
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.giftIcon}>🎁</Text>
        <Text style={styles.title}>Un cadeau vous attend !</Text>
        <Text style={styles.subtitle}>
          Partagez votre expérience chez{' '}
          <Text style={styles.businessName}>{businessName}</Text> pour
          débloquer la roue et tenter de gagner.
        </Text>
      </View>

      {/* Step indicator */}
      <View style={styles.stepsRow}>
        <StepBadge number={1} label="Partagez" active />
        <View style={styles.stepLine} />
        <StepBadge number={2} label="Confirmez" active={!!clickedPlatform} />
        <View style={styles.stepLine} />
        <StepBadge number={3} label="Tournez !" active={false} />
      </View>

      {/* Platform cards */}
      <Text style={styles.sectionLabel}>Choisissez une plateforme :</Text>

      <View style={styles.platformGrid}>
        {availablePlatforms.map(platform => {
          const isSelected = clickedPlatform === platform.key;
          const isConfigured = !!links[platform.urlKey];

          return (
            <TouchableOpacity
              key={platform.key}
              onPress={() => handlePlatformPress(platform)}
              activeOpacity={0.82}
              style={[
                styles.platformCard,
                { backgroundColor: isSelected ? platform.bgColor : '#1e2a3a' },
                isSelected && styles.platformCardSelected,
                isConfigured && !isSelected && styles.platformCardAvailable,
              ]}
            >
              <Text style={styles.platformEmoji}>{platform.emoji}</Text>
              <View style={styles.platformTextWrap}>
                <Text
                  style={[
                    styles.platformLabel,
                    isSelected && styles.textWhite,
                  ]}
                >
                  {platform.label}
                </Text>
                <Text
                  style={[
                    styles.platformAction,
                    isSelected && styles.textWhiteOpacity,
                  ]}
                >
                  {platform.action}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              )}
              {isConfigured && !isSelected && (
                <View style={styles.configuredDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Confirm button */}
      {clickedPlatform && !confirmed && (
        <View style={styles.confirmSection}>
          <Text style={styles.confirmHint}>
            ✅ Vous avez partagé ? Confirmez pour débloquer la roue.
          </Text>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.85}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>
                🎯 J'ai partagé — Tourner la roue !
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Not clicked yet hint */}
      {!clickedPlatform && (
        <Text style={styles.tapHint}>
          👆 Appuyez sur une plateforme ci-dessus pour commencer
        </Text>
      )}
    </View>
  );
}

// ─── StepBadge ────────────────────────────────────────────────────────────────

function StepBadge({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active: boolean;
}) {
  return (
    <View style={styles.stepWrap}>
      <View
        style={[
          styles.stepCircle,
          active ? styles.stepCircleActive : styles.stepCircleInactive,
        ]}
      >
        <Text
          style={[
            styles.stepNumber,
            active ? styles.stepNumberActive : styles.stepNumberInactive,
          ]}
        >
          {number}
        </Text>
      </View>
      <Text
        style={[
          styles.stepLabel,
          active ? styles.stepLabelActive : styles.stepLabelInactive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 4,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  giftIcon: {
    fontSize: 52,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  businessName: {
    color: '#10b981',
    fontWeight: '700',
  },

  // Steps
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 6,
    maxWidth: 40,
  },
  stepWrap: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepCircleActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepCircleInactive: {
    backgroundColor: 'transparent',
    borderColor: '#334155',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  stepNumberActive: { color: '#fff' },
  stepNumberInactive: { color: '#475569' },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepLabelActive: { color: '#10b981' },
  stepLabelInactive: { color: '#475569' },

  // Section label
  sectionLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Platform cards
  platformGrid: {
    gap: 10,
    marginBottom: 24,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#1e2a3a',
    position: 'relative',
    overflow: 'hidden',
  },
  platformCardSelected: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    ...RNPlatform.select({
      web: { boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.35)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
    }),
    elevation: 10,
  },
  platformCardAvailable: {
    borderColor: '#10b981',
    borderWidth: 1.5,
  },
  platformEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  platformTextWrap: {
    flex: 1,
  },
  platformLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  platformAction: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  textWhite: {
    color: '#ffffff',
  },
  textWhiteOpacity: {
    color: 'rgba(255,255,255,0.75)',
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkIcon: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  configuredDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Confirm section
  confirmSection: {
    marginTop: 4,
    gap: 12,
  },
  confirmHint: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#10b981',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...RNPlatform.select({
      web: { boxShadow: '0px 8px 18px rgba(16, 185, 129, 0.45)' },
      default: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
      },
    }),
    elevation: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 17,
    letterSpacing: 0.3,
  },

  // Hint
  tapHint: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
