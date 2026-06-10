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
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  TSpan,
  Path,
} from 'react-native-svg';
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

const MIN_SEGMENTS = 2;
const MAX_SEGMENTS = 8;
const SPIN_DURATION = 4200;

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) => {
  const rad = toRadians(angle - 90);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

const isDarkHex = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  const value = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (r * 0.299 + g * 0.587 + b * 0.114) < 150;
};

const splitTitle = (title: string, maxChars = 12) => {
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length > maxChars && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 2);
};

const LoyaltyWheel: React.FC<LoyaltyWheelProps> = ({ segments, onFinish }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const spinValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  const safeSegments = useMemo(() => {
    if (segments.length >= MIN_SEGMENTS) {
      return segments.slice(0, MAX_SEGMENTS);
    }

    const placeholderA = {
      id: 'placeholder-1',
      title: t('loyalspin.segment.placeholder', { defaultValue: 'Chance' }),
      description: '',
      color: theme.colors.border || '#999999',
    } as WheelSegment;

    const placeholderB = {
      id: 'placeholder-2',
      title: t('loyalspin.segment.placeholder', { defaultValue: 'Chance' }),
      description: '',
      color: theme.colors.border || '#999999',
    } as WheelSegment;

    if (segments.length === 1) {
      return [segments[0], placeholderA];
    }

    return [placeholderA, placeholderB];
  }, [segments, t, theme.colors.border]);

  const segmentCount = safeSegments.length;
  const segmentAngle = 360 / segmentCount;
  const wheelSize = useMemo(() => Math.min(Math.max(width * 0.84, 300), 360), [width]);
  const radius = wheelSize / 2;
  const labelRadius = radius * 0.62;

  const segmentShapes = useMemo(
    () =>
      safeSegments.map((segment, index) => {
        const start = index * segmentAngle;
        const end = start + segmentAngle;
        const mid = start + segmentAngle / 2;
        const path = describeArc(radius, radius, radius, start - 90, end - 90);
        const labelPosition = polarToCartesian(radius, radius, labelRadius, mid);
        const textRotation = mid > 90 && mid < 270 ? mid + 180 : mid;
        return {
          ...segment,
          path,
          mid,
          labelPosition,
          textRotation,
          textLines: splitTitle(segment.title, 12),
          textColor: isDarkHex(segment.color) ? '#FFFFFF' : '#111111',
        };
      }),
    [safeSegments, segmentAngle, radius, labelRadius],
  );

  const animatedWheelStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${spinValue.value}deg` },
      { scale: scaleValue.value },
    ],
  }));

  const finishSpin = useCallback(
    (targetIndex: number) => {
      const prize = safeSegments[targetIndex];
      setResult(prize);
      setShowConfetti(Boolean(ConfettiCannon));
      setConfettiKey(prev => prev + 1);
      setSpinning(false);
      onFinish?.(prize);
    },
    [onFinish, safeSegments],
  );

  const spin = useCallback(() => {
    if (spinning || safeSegments.length === 0) return;
    setSpinning(true);

    const targetIndex = Math.floor(Math.random() * safeSegments.length);
    const targetMidAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const currentRotation = normalizeAngle(spinValue.value);
    const desiredRotation = currentRotation + 360 * 6 + (360 - targetMidAngle);

    scaleValue.value = withTiming(1.04, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });

    spinValue.value = withTiming(
      desiredRotation,
      {
        duration: SPIN_DURATION,
        easing: Easing.bezier(0.32, 0.03, 0.18, 1),
      },
      finished => {
        if (finished) {
          scaleValue.value = withTiming(1, {
            duration: 320,
            easing: Easing.out(Easing.quad),
          });
          runOnJS(finishSpin)(targetIndex);
        }
      },
    );
  }, [finishSpin, segmentAngle, safeSegments, scaleValue, spinValue, spinning]);

  const centerLabel = t('loyalspin.wheel.centerLabel', { defaultValue: 'SPIN' });

  return (
    <View style={styles.container}>
      <View style={[styles.wheelWrap, { width: wheelSize, height: wheelSize }]}> 
        <Animated.View style={[styles.wheelShadow, animatedWheelStyle]}>
          <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
            <Defs>
              <LinearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </LinearGradient>
              <LinearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
                <Stop offset="100%" stopColor={theme.colors.surface} />
              </LinearGradient>
            </Defs>
            <Circle
              cx={radius}
              cy={radius}
              r={radius}
              fill={theme.colors.card}
            />
            {segmentShapes.map(segment => (
              <Path
                key={segment.id}
                d={segment.path}
                fill={segment.color}
                stroke={theme.colors.background}
                strokeWidth={1}
              />
            ))}
            <Circle
              cx={radius}
              cy={radius}
              r={radius - 8}
              fill="none"
              stroke="url(#rimGradient)"
              strokeWidth={16}
            />
            <Circle cx={radius} cy={radius} r={radius * 0.28} fill="url(#centerGradient)" />
            <Circle
              cx={radius}
              cy={radius}
              r={radius * 0.2}
              fill={theme.colors.card}
              stroke={theme.colors.border}
              strokeWidth={2}
            />
            {segmentShapes.map(segment => (
              <SvgText
                key={`${segment.id}-label`}
                x={segment.labelPosition.x}
                y={segment.labelPosition.y}
                fill={segment.textColor}
                fontSize={12}
                fontWeight="700"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${segment.textRotation} ${segment.labelPosition.x} ${segment.labelPosition.y})`}
              >
                {segment.textLines.map((line, index) => (
                  <TSpan
                    key={`${segment.id}-line-${index}`}
                    x={segment.labelPosition.x}
                    dy={index === 0 ? 0 : 14}
                  >
                    {line}
                  </TSpan>
                ))}
              </SvgText>
            ))}
          </Svg>
        </Animated.View>

        <View
          style={[
            styles.wheelCenter,
            {
              width: radius * 0.44,
              height: radius * 0.44,
              borderRadius: radius * 0.22,
              backgroundColor: theme.colors.card,
            },
          ]}
        > 
          <Text style={[styles.centerText, { color: theme.colors.text }]}>
            {centerLabel}
          </Text>
        </View>

        <View style={[styles.indicator, { borderBottomColor: theme.colors.accent }]} />
      </View>

      <TouchableOpacity
        activeOpacity={0.86}
        onPress={spin}
        disabled={spinning || safeSegments.length === 0}
        style={[
          styles.spinButton,
          { backgroundColor: theme.colors.primary },
          spinning && styles.disabledButton,
        ]}
      >
        <Text style={styles.spinButtonText}>
          {spinning
            ? t('loyalspin.spinButton.loading', { defaultValue: 'Lancement...' })
            : t('loyalspin.spinButton', { defaultValue: 'Lancer' })}
        </Text>
      </TouchableOpacity>

      {showConfetti && ConfettiCannon && (
        <ConfettiCannon
          key={`confetti-${confettiKey}`}
          count={120}
          origin={{ x: wheelSize / 2, y: 0 }}
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
            <Text style={[styles.modalDescription, { color: theme.colors.subText }]}> 
              {result?.description}
            </Text>
            <TouchableOpacity
              onPress={() => setResult(null)}
              style={[styles.closeBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.closeBtnText}>
                {t('loyalspin.spinResult.tryAgain', { defaultValue: 'Réessayer' })}
              </Text>
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
  wheelShadow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 30,
    elevation: 18,
    backgroundColor: 'transparent',
  },
  wheelCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
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
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  spinButton: {
    marginTop: 24,
    minWidth: 160,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  spinButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.56)',
  },
  modalCard: {
    width: '90%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
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
