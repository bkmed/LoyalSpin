import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import type { WheelSegment } from '../types';

let ConfettiCannon: any = null;
if (Platform.OS !== 'web') {
  try {
    ConfettiCannon = require('react-native-confetti-cannon').default;
  } catch (e) {
    console.warn('Could not load react-native-confetti-cannon', e);
  }
}

interface LoyaltyWheelProps {
  segments: WheelSegment[];
  onFinish?: (segment: WheelSegment) => void;
}

const LoyaltyWheel: React.FC<LoyaltyWheelProps> = ({ segments, onFinish }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const segmentCount = Math.max(2, segments.length);
  const segmentAngle = 360 / segmentCount;
  const wheelSize = useMemo(() => Math.min(Math.max(width * 0.84, 280), 360), [width]);
  const borderRadius = wheelSize / 2;
  const spinValue = useSharedValue(0);

  const animatedWheelStyle = useAnimatedStyle(() => ({
    width: wheelSize,
    height: wheelSize,
    borderRadius,
    transform: [
      { perspective: 700 },
      { rotateX: '10deg' },
      { rotateZ: `${spinValue.value % 360}deg` },
      { scale: spinning ? 1.02 : 1 },
    ],
  }));

  const finishSpin = useCallback(
    (targetIndex: number) => {
      const prize = segments[targetIndex];
      setResult(prize);
      setShowConfetti(true);
      setConfettiKey(prev => prev + 1);
      setSpinning(false);
      onFinish?.(prize);
    },
    [onFinish, segments],
  );

  const spin = useCallback(() => {
    if (spinning || segments.length === 0) return;
    setSpinning(true);
    const targetIndex = Math.floor(Math.random() * segmentCount);
    const targetAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const totalRotation = 360 * 5 + 360 - targetAngle;

    spinValue.value = withTiming(
      totalRotation,
      {
        duration: 4200,
        easing: Easing.bezier(0.32, 0.03, 0.18, 1),
      },
      finished => {
        if (finished) {
          spinValue.value = totalRotation % 360;
          runOnJS(finishSpin)(targetIndex);
        }
      },
    );
  }, [segmentAngle, segmentCount, segments.length, spinning, spinValue, finishSpin]);

  const containerWidth = wheelSize;
  const segmentWidth = wheelSize / 2;

  return (
    <View style={styles.container}>
      <View style={[styles.wheelWrap, { width: containerWidth, height: containerWidth }]}> 
        <Animated.View style={[styles.wheel, animatedWheelStyle]}>
          {segments.map((segment, index) => (
            <View
              key={segment.id}
              style={[
                styles.segmentClip,
                {
                  width: segmentWidth,
                  height: containerWidth,
                  transform: [{ rotate: `${index * segmentAngle}deg` }],
                },
              ]}
            >
              <View
                style={[
                  styles.segment,
                  {
                    width: containerWidth,
                    height: containerWidth,
                    borderRadius,
                    backgroundColor: segment.color,
                    transform: [{ rotate: `${segmentAngle / 2}deg` }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.segmentLabel,
                    { transform: [{ rotate: `${90 + segmentAngle / 2}deg` }] },
                  ]}
                >
                  <Text style={styles.segmentText} numberOfLines={2}>
                    {segment.title}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={[styles.wheelCenter, { width: wheelSize * 0.22, height: wheelSize * 0.22, borderRadius: wheelSize * 0.11, backgroundColor: theme.colors.surface }]}> 
          <Text style={[styles.centerText, { color: theme.colors.text }]}>SPIN</Text>
        </View>

        <View style={[styles.indicator, { borderBottomColor: theme.colors.accent }]} />
      </View>

      <TouchableOpacity
        activeOpacity={0.86}
        onPress={spin}
        disabled={spinning}
        style={[
          styles.spinButton,
          { backgroundColor: theme.colors.primary },
          spinning && styles.disabledButton,
        ]}
      >
        <Text style={styles.spinButtonText}>
          {t('loyalspin.spinButton', { defaultValue: 'Lancer' })}
        </Text>
      </TouchableOpacity>

      {showConfetti && ConfettiCannon && (
        <ConfettiCannon
          key={`confetti-${confettiKey}`}
          count={120}
          origin={{ x: containerWidth / 2, y: 0 }}
          fadeOut
          fallSpeed={2600}
          colors={[theme.colors.primary, theme.colors.accent, theme.colors.secondary || '#F39C12']}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      <Modal visible={!!result} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.card }]}> 
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}> 
              {t('loyalspin.spinResult.title', { defaultValue: '🎉 Félicitations' })}
            </Text>
            <Text style={[styles.modalPrize, { color: theme.colors.text }]}>{result?.title}</Text>
            <Text style={[styles.modalDescription, { color: theme.colors.subText }]}>{result?.description}</Text>
            <TouchableOpacity
              onPress={() => setResult(null)}
              style={[styles.closeBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.closeBtnText}>{t('loyalspin.spinResult.tryAgain', { defaultValue: 'Réessayer' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  wheelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  segmentClip: {
    position: 'absolute',
    left: '50%',
    top: 0,
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    left: -9999,
    top: 0,
    borderWidth: 0,
  },
  segmentLabel: {
    position: 'absolute',
    right: 16,
    top: '36%',
    width: 120,
    alignItems: 'flex-end',
  },
  segmentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    lineHeight: 16,
  },
  wheelCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  centerText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  spinButton: {
    marginTop: 22,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },
  spinButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    width: '90%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  modalPrize: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default React.memo(LoyaltyWheel);
