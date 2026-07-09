import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { Coupon, WheelSegment } from '../types';

interface SpinResultModalProps {
  visible: boolean;
  onClose: () => void;
  segment: WheelSegment | null;
  coupon: Coupon | null;
  title: string;
  message: string;
  actionLabel: string;
}

const SpinResultModal: React.FC<SpinResultModalProps> = React.memo(
  ({ visible, onClose, segment, coupon, title, message, actionLabel }) => {
    const { theme } = useTheme();

    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
            <Text style={[styles.hero, { color: theme.colors.primary }]}>🎉</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.subText }]}>{message}</Text>

            {segment && (
              <View style={[styles.rewardPill, { backgroundColor: segment.color + '22' }]}> 
                <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>{segment.title}</Text>
                <Text style={[styles.rewardDescription, { color: theme.colors.subText }]}>
                  {segment.description}
                </Text>
              </View>
            )}

            {coupon && (
              <View style={[styles.couponCard, { borderColor: theme.colors.primary }]}> 
                <Text style={[styles.couponLabel, { color: theme.colors.subText }]}>Coupon</Text>
                <Text style={[styles.couponCode, { color: theme.colors.text }]}>{coupon.code}</Text>
                <Text style={[styles.couponExpiry, { color: theme.colors.subText }]}>
                  {coupon.expiresAt}
                </Text>
                <Text style={[styles.couponDetails, { color: theme.colors.subText }]}>{coupon.details}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={onClose}
            >
              <Text style={[styles.actionText, { color: theme.colors.card }]}>{actionLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.16)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.16,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
    }),
    elevation: 12,
  },
  hero: {
    fontSize: 46,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  rewardPill: {
    width: '100%',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  couponCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  couponLabel: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  couponCode: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  couponExpiry: {
    fontSize: 13,
    marginBottom: 8,
  },
  couponDetails: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SpinResultModal;
