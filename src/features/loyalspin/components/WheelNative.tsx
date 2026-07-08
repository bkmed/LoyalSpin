import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText, TSpan } from 'react-native-svg';
import { useTheme } from '../../../context/ThemeContext';

type Choice = { label: string; probability: number };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
  const rad = toRadians(angle - 90);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
};

const describeArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

const splitTitle = (title: string, maxChars = 12) => {
  const words = title.split(' ');
  const lines: string[] = [];
  let current = '';
  words.forEach(w => {
    const cand = current ? `${current} ${w}` : w;
    if (cand.length > maxChars && current) {
      lines.push(current);
      current = w;
    } else current = cand;
  });
  if (current) lines.push(current);
  return lines.slice(0, 2);
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const WheelNative: React.FC = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [choices, setChoices] = useState<Choice[]>([
    { label: 'Option 1', probability: 0 },
    { label: 'Option 2', probability: 0 },
  ]);
  const [lastOption, setLastOption] = useState(3);
  const [probMode, setProbMode] = useState<'equal' | 'custom'>('equal');
  const [error, setError] = useState('');
  const [winner, setWinner] = useState('');
  const [spinning, setSpinning] = useState(false);

  const spinValue = useSharedValue(0);

  const segmentCount = choices.length;
  const segmentAngle = 360 / Math.max(2, segmentCount);
  const wheelSize = Math.min(Math.max(width * 0.84, 300), 360);
  const radius = wheelSize / 2;

  const segmentShapes = useMemo(() => {
    return choices.map((seg, idx) => {
      const start = idx * segmentAngle;
      const end = start + segmentAngle;
      const mid = start + segmentAngle / 2;
      const path = describeArc(radius, radius, radius, start - 90, end - 90);
      const labelRadius = radius * 0.56;
      const labelPos = polarToCartesian(radius, radius, labelRadius, mid);
      const lines = splitTitle(seg.label, Math.max(6, 12 - segmentCount));
      let textRot = mid + 90;
      if (textRot > 90 && textRot < 270) textRot += 180;
      return { ...seg, path, labelPos, lines, textRot };
    });
  }, [choices, radius, segmentAngle, segmentCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinValue.value}deg` }],
  }));

  const setEqualProbabilities = useCallback(() => {
    const n = choices.length;
    const base = Math.round(100 / n);
    const arr = choices.map(c => ({ ...c, probability: base }));
    let sum = arr.reduce((s, a) => s + a.probability, 0);
    if (sum < 100) arr[n - 1].probability += 100 - sum;
    else if (sum > 100) arr[n - 1].probability -= sum - 100;
    setChoices(arr);
  }, [choices]);

  const finishSpin = useCallback((idx: number) => {
    setSpinning(false);
    setWinner(choices[idx]?.label ?? '');
  }, [choices]);

  const startSpin = useCallback(() => {
    if (spinning || choices.length === 0) return;
    setSpinning(true);
    let targetIndex = 0;
    if (probMode === 'custom') {
      const sum = choices.reduce((s, c) => s + c.probability, 0);
      if (sum !== 100) {
        setError(`Probabilities sum must be 100 (got ${sum})`);
        setSpinning(false);
        return;
      }
      const draw = getRandomInt(1, 100);
      let acc = 0;
      for (let i = 0; i < choices.length; i++) {
        if (acc + choices[i].probability >= draw) {
          targetIndex = i;
          break;
        }
        acc += choices[i].probability;
      }
    } else {
      targetIndex = getRandomInt(0, choices.length - 1);
    }

    const targetMidAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const currentRotation = ((spinValue.value % 360) + 360) % 360;
    const desired = currentRotation + 360 * 5 + (360 - targetMidAngle);

    spinValue.value = withTiming(desired, { duration: 8000, easing: Easing.out(Easing.cubic) }, finished => {
      if (finished) runOnJS(finishSpin)(targetIndex);
    });
  }, [choices, probMode, segmentAngle, spinValue, spinning, finishSpin]);

  const addRow = () => {
    if (choices.length >= 20) return;
    setChoices(prev => [...prev, { label: `Option ${lastOption}`, probability: 0 }]);
    setLastOption(n => n + 1);
  };

  const updateLabel = (i: number, text: string) => setChoices(prev => prev.map((c, idx) => idx === i ? { ...c, label: text } : c));
  const updateProbability = (i: number, v: number) => setChoices(prev => prev.map((c, idx) => idx === i ? { ...c, probability: v } : c));
  const removeRow = (i: number) => setChoices(prev => prev.filter((_, idx) => idx !== i));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.wheelWrap, { width: wheelSize, height: wheelSize }]}> 
        <Animated.View style={[styles.wheelShadow, animatedStyle]}>
          <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
            <Circle cx={radius} cy={radius} r={radius} fill={theme.colors.card} />
            {segmentShapes.map((s, idx) => (
              <G key={idx}>
                <Path d={s.path} fill={(s as any).color || theme.colors.primary} stroke={theme.colors.background} strokeWidth={1} />
                <G transform={`translate(${s.labelPos.x} ${s.labelPos.y}) rotate(${s.textRot})`}>
                  <SvgText fill={isFinite(0) ? '#fff' : '#000'} fontSize={12} fontWeight="700" textAnchor="middle" alignmentBaseline="middle" y={-8}>
                    {s.lines.map((line: string, i: number) => (
                      <TSpan key={i} x={0} dy={i === 0 ? 0 : 14}>{line}</TSpan>
                    ))}
                  </SvgText>
                </G>
              </G>
            ))}
            <Circle cx={radius} cy={radius} r={radius * 0.28} fill={theme.colors.surface} />
          </Svg>
        </Animated.View>

        <Pressable onPress={startSpin} style={[styles.centerButton, { width: radius * 0.44, height: radius * 0.44, borderRadius: radius * 0.22, backgroundColor: theme.colors.primary }] }>
          <Text style={[styles.centerText, { color: theme.colors.card }]}>SPIN</Text>
        </Pressable>
      </View>

      <View style={styles.controls}>
        <View style={styles.controlsInner}>
          <Pressable onPress={() => setProbMode(m => m === 'equal' ? 'custom' : 'equal')} style={styles.toggleButton}>
            <Text style={styles.toggleText}>Mode: {probMode}</Text>
          </Pressable>

          <View style={{ maxHeight: 300 }}>
            {choices.map((c, i) => (
              <View key={i} style={styles.row}>
                <TextInput style={styles.input} value={c.label} onChangeText={t => updateLabel(i, t)} />
                <TextInput style={[styles.input, { width: 80 }]} keyboardType="number-pad" value={`${c.probability}`} onChangeText={t => updateProbability(i, Math.max(0, Math.min(100, Math.floor(Number(t) || 0))))} />
                <Pressable onPress={() => removeRow(i)} style={styles.del}><Text style={{color:'#fff'}}>-</Text></Pressable>
              </View>
            ))}
          </View>

          <Pressable onPress={addRow} style={styles.addButton}><Text>Add</Text></Pressable>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.winner}>{winner}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 20 },
  wheelWrap: { alignItems: 'center', justifyContent: 'center' },
  wheelShadow: { alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: 'transparent' },
  centerButton: { position: 'absolute', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.16)' },
  centerText: { fontSize: 15, fontWeight: '900', letterSpacing: 1.6, textTransform: 'uppercase' },
  controls: { width: '90%', marginTop: 16 },
  controlsInner: { backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  toggleButton: { padding: 8, backgroundColor: '#eee', borderRadius: 8, marginBottom: 8 },
  toggleText: { fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { flex: 1, backgroundColor: '#f7f7f7', padding: 8, borderRadius: 6, marginRight: 8 },
  del: { width: 32, height: 32, backgroundColor: '#c00', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  addButton: { marginTop: 8, padding: 10, backgroundColor: '#e3b053', borderRadius: 8, alignItems: 'center' },
  error: { color: 'red', marginTop: 8 },
  winner: { fontWeight: '900', marginTop: 8 },
});

export default WheelNative;
