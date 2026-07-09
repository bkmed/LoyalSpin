import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [hovered, setHovered] = useState(false);
  const spinValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const indicatorRotation = useSharedValue(0);
  const indicatorScale = useSharedValue(1);

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

  const segmentLabelMaxChars = Math.max(6, Math.min(12, 14 - segmentCount));

  const segmentShapes = useMemo(
    () =>
      safeSegments.map((segment, index) => {
        const start = index * segmentAngle;
        const end = start + segmentAngle;
        const mid = start + segmentAngle / 2;
        const path = describeArc(radius, radius, radius, start - 90, end - 90);
        const textLines = splitTitle(segment.title, segmentLabelMaxChars);
        const textLength = textLines.join(' ').length;
        const countAdjustment = (segmentCount - 2) * 0.01;
        const textAdjustment = Math.min(0.05, Math.max(0, textLength - 7) * 0.007);
        const labelRadiusRatio = clamp(0.58 - countAdjustment - textAdjustment, 0.50, 0.60);
        const labelPosition = polarToCartesian(radius, radius, radius * labelRadiusRatio, mid);
        const fontSize = Math.round(clamp(radius * 0.032, 10, 12));
        const lineHeight = Math.round(fontSize * 1.3);
        let textRotation = mid + 90;
        if (textRotation > 90 && textRotation < 270) {
          textRotation += 180;
        }
        return {
          ...segment,
          path,
          mid,
          labelPosition,
          textLines,
          fontSize,
          lineHeight,
          textRotation,
          textColor: isDarkHex(segment.color) ? '#FFFFFF' : '#111111',
        };
      }),
    [safeSegments, segmentAngle, radius, segmentCount, segmentLabelMaxChars],
  );

  const animatedWheelStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${spinValue.value}deg` },
      { scale: scaleValue.value },
    ],
  }));

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${indicatorRotation.value}deg` },
      { scale: indicatorScale.value },
    ],
  }));

  useEffect(() => {
    indicatorRotation.value = withRepeat(
      withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    indicatorScale.value = withRepeat(
      withTiming(1.06, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [indicatorRotation, indicatorScale]);

  const finishSpin = useCallback(
    (targetIndex: number) => {
      const prize = safeSegments[targetIndex];
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
              <G
                key={`${segment.id}-label-group`}
                transform={`translate(${segment.labelPosition.x} ${segment.labelPosition.y}) rotate(${segment.textRotation})`}
              >
                <SvgText
                  fill={segment.textColor}
                  fontSize={segment.fontSize}
                  fontWeight="700"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  y={-((segment.textLines.length - 1) * segment.lineHeight) / 2}
                >
                  {segment.textLines.map((line, index) => (
                    <TSpan
                      key={`${segment.id}-line-${index}`}
                      x={0}
                      dy={index === 0 ? 0 : segment.lineHeight}
                    >
                      {line}
                    </TSpan>
                  ))}
                </SvgText>
              </G>
            ))}
          </Svg>
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={spin}
          disabled={spinning || safeSegments.length === 0}
          style={[
            styles.wheelCenter,
            {
              width: radius * 0.44,
              height: radius * 0.44,
              borderRadius: radius * 0.22,
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.surface,
            },
            spinning && styles.disabledButton,
          ]}
        >
          <Text style={[styles.centerText, { color: theme.colors.card }]}> 
            {centerLabel}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.indicator,
            animatedIndicatorStyle,
            {
              borderBottomColor: theme.colors.accent,
              elevation: 10,
              ...Platform.select({
                web: {
                  boxShadow: `0px 10px 12px ${theme.colors.accent}38` as any,
                },
                default: {
                  shadowColor: theme.colors.accent,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.22,
                  shadowRadius: 12,
                }
              })
            },
          ]}
        />
      </View>

      <Pressable
        onPress={spin}
        disabled={spinning || safeSegments.length === 0}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={({ pressed }) => [
          styles.spinButton,
          {
            backgroundColor: theme.colors.primary,
            transform: [
              { scale: pressed ? 0.96 : hovered ? 1.02 : 1 },
              { perspective: 1000 },
            ],
            shadowOpacity: pressed ? 0.32 : hovered ? 0.28 : 0.18,
          },
          (spinning || safeSegments.length === 0) && styles.disabledButton,
        ]}
      >
        <Text style={styles.spinButtonText}>
          {spinning
            ? t('loyalspin.spinButton.loading', { defaultValue: 'Lancement...' })
            : t('loyalspin.spinButton', { defaultValue: 'Lancer' })}
        </Text>
      </Pressable>

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
    backgroundColor: 'transparent',
    elevation: 18,
    ...Platform.select({
      web: {
        boxShadow: '0px 18px 30px rgba(0, 0, 0, 0.24)' as any,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.24,
        shadowRadius: 30,
      }
    }),
  },
  wheelCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.16)',
    elevation: 10,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.12)' as any,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      }
    }),
  },
  centerText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.14)' as any,
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.14)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      }
    }),
  },
  indicator: {
    position: 'absolute',
    top: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  spinButton: {
    marginTop: 28,
    minWidth: 180,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 28,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    ...Platform.select({
      web: {
        boxShadow: '0px 14px 20px rgba(0, 0, 0, 0.24)' as any,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.24,
        shadowRadius: 20,
      }
    }),
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
});

export default React.memo(LoyaltyWheel);
