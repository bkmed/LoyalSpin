import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Modal,
} from 'react-native';
import { Platform } from 'react-native';

let ConfettiCannon: any = null;
if (Platform.OS !== 'web') {
  try {
    ConfettiCannon = require('react-native-confetti-cannon').default;
  } catch (e) {
    console.warn('Could not load react-native-confetti-cannon', e);
  }
}
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';

interface LoyaltyWheelProps {
  segments: string[];
  onFinish?: (prize: string) => void;
}

const SEGMENT_ANGLE = 360;

const LoyaltyWheel: React.FC<LoyaltyWheelProps> = ({ segments, onFinish }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const spin = () => {
    if (spinning || segments.length === 0) return;
    setSpinning(true);
    // random target segment
    const targetIndex = Math.floor(Math.random() * segments.length);
    const rotations = 4 + Math.floor(Math.random() * 3); // 4..6 rotations
    const targetDeg =
      rotations * 360 +
      targetIndex * (360 / segments.length) +
      360 / (segments.length * 2);

    Animated.timing(spinAnim, {
      toValue: targetDeg,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const prize = segments[targetIndex];
      setResult(prize);
      setShowConfetti(true);
      setConfettiKey(prev => prev + 1);
      setSpinning(false);
      spinAnim.setValue(targetDeg % 360);
      onFinish?.(prize);
    });
  };

  const rotate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.wheelWrap}>
        <Animated.View style={[styles.wheel, { transform: [{ rotate }] }]}>
          {segments.map((s, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  transform: [
                    { rotate: `${(i * SEGMENT_ANGLE) / segments.length}deg` },
                  ],
                },
              ]}
            >
              <Text style={styles.segmentText}>{s}</Text>
            </View>
          ))}
        </Animated.View>
        <View
          style={[styles.indicator, { borderBottomColor: theme.colors.accent }]}
        />
      </View>

      <TouchableOpacity
        onPress={spin}
        disabled={spinning}
        style={[
          styles.spinButton,
          spinning && styles.disabledButton,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Text style={styles.spinButtonText}>
          {t('loyalspin.spinButton', { defaultValue: 'Spin' })}
        </Text>
      </TouchableOpacity>

      {showConfetti && ConfettiCannon && (
        <ConfettiCannon
          key={`confetti-${confettiKey}`}
          count={120}
          origin={{ x: 120, y: 0 }}
          fadeOut
          fallSpeed={3000}
          colors={[
            theme.colors.primary,
            theme.colors.accent,
            theme.colors.secondary || '#F97316',
          ]}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
      <Modal visible={!!result} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View
            style={[styles.modalCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t('loyalspin.congrats', { defaultValue: 'Félicitations !' })}
            </Text>
            <Text style={[styles.modalPrize, { color: theme.colors.text }]}>
              {result}
            </Text>
            <Text style={{ fontSize: 36, marginVertical: 8 }}>🎉</Text>
            <TouchableOpacity
              onPress={() => setResult(null)}
              style={[
                styles.closeBtn,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={styles.closeBtnText}>
                {t('loyalspin.close', { defaultValue: 'Fermer' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  wheelWrap: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '50%',
    top: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    transform: [{ rotate: '90deg' }],
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F97316',
  },
  spinButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  spinButtonText: { color: '#fff', fontWeight: '800' },
  disabledButton: { opacity: 0.6 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    minWidth: 260,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  modalPrize: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  closeBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  closeBtnText: { color: '#fff', fontWeight: '700' },
});

export default LoyaltyWheel;
