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
import { useTranslation } from 'react-i18next';

interface LoyaltyWheelProps {
  segments: string[];
  onFinish?: (prize: string) => void;
}

const SEGMENT_ANGLE = 360;

const LoyaltyWheel: React.FC<LoyaltyWheelProps> = ({
  segments,
  onFinish,
}) => {
  const { t } = useTranslation();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (spinning || segments.length === 0) return;
    setSpinning(true);
    // random target segment
    const targetIndex = Math.floor(Math.random() * segments.length);
    const rotations = 4 + Math.floor(Math.random() * 3); // 4..6 rotations
    const targetDeg = rotations * 360 + (targetIndex * (360 / segments.length)) + (360 / (segments.length * 2));

    Animated.timing(spinAnim, {
      toValue: targetDeg,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const prize = segments[targetIndex];
      setResult(prize);
      setSpinning(false);
      spinAnim.setValue(targetDeg % 360);
      onFinish && onFinish(prize);
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
            <View key={i} style={[styles.segment, { transform: [{ rotate: `${(i * SEGMENT_ANGLE) / segments.length}deg` }] }]}>
              <Text style={styles.segmentText}>{s}</Text>
            </View>
          ))}
        </Animated.View>
        <View style={styles.indicator} />
      </View>

      <TouchableOpacity onPress={spin} disabled={spinning} style={[styles.spinButton, spinning && styles.disabledButton]}>
        <Text style={styles.spinButtonText}>{t('loyalspin.spinButton', { defaultValue: 'Spin' })}</Text>
      </TouchableOpacity>

      <Modal visible={!!result} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('loyalspin.congrats', { defaultValue: 'Félicitations !' })}</Text>
            <Text style={styles.modalPrize}>{result}</Text>
            <TouchableOpacity onPress={() => setResult(null)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>{t('loyalspin.close', { defaultValue: 'Fermer' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  wheelWrap: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  wheel: { width: 240, height: 240, borderRadius: 120, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  segment: { position: 'absolute', width: '50%', height: '50%', left: '50%', top: '25%', alignItems: 'center', justifyContent: 'center' },
  segmentText: { transform: [{ rotate: '90deg' }], fontSize: 12, fontWeight: '700', textAlign: 'center' },
  indicator: { position: 'absolute', top: 6, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 16, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#F97316' },
  spinButton: { marginTop: 16, backgroundColor: '#F97316', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  spinButtonText: { color: '#fff', fontWeight: '800' },
  disabledButton: { opacity: 0.6 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, minWidth: 260, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  modalPrize: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  closeBtn: { backgroundColor: '#F97316', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  closeBtnText: { color: '#fff', fontWeight: '700' },
});

export default LoyaltyWheel;
