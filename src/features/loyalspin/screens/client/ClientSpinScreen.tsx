import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import WheelWeb from '../../components/WheelWeb.web';
import { recordSpin } from '../../../../store/slices/spinHistorySlice';

export default function ClientSpinScreen({ route, navigation }: any) {
  const dispatch = useDispatch();
  const projectId = route?.params?.projectId || 'default';
  const config = useSelector((state: RootState) => state.rouletteConfig.configs[projectId]);
  const user = useSelector((state: RootState) => state.auth.user);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const segments = config?.segments || Array(8).fill({ label: 'Cadeau', probability: 12.5, isGift: true });

  const handleSpinComplete = (segmentIdx: number) => {
    setSpinning(false);
    const winSegment = segments[segmentIdx];
    setResult(winSegment);

    (dispatch as any)(recordSpin({
      projectId,
      userId: user?.id || 'anonymous',
      segmentId: winSegment.id || 'seg',
      segmentLabel: winSegment.label,
      outcome: winSegment.isGift ? 'win' : 'lose',
      spinDate: new Date().toISOString(),
    }));
  };

  const handleSpinClick = () => {
    if (spinning || result) return;
    setSpinning(true);
    // Real logic inside WheelWeb will call onComplete
  };

  return (
    <View className="flex-1 bg-slate-900 items-center justify-center p-4">
      <Text className="text-3xl font-black text-white mb-2 text-center">Tournez la roue !</Text>
      <Text className="text-slate-400 mb-8 text-center">Tentez votre chance pour gagner une récompense.</Text>

      <View className="items-center justify-center bg-white/5 p-8 rounded-full">
        {/* Placeholder for the wheel component */}
        <View className="w-80 h-80 rounded-full border-4 border-slate-700 bg-slate-800 items-center justify-center overflow-hidden relative">
          <Text className="text-white opacity-50">Animation de la roue ici</Text>
          <TouchableOpacity 
            onPress={handleSpinClick}
            disabled={spinning || result}
            className="absolute z-10 w-20 h-20 rounded-full bg-emerald-500 items-center justify-center shadow-lg border-4 border-slate-900"
          >
            <Text className="text-white font-black text-xl">GO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {result && (
        <View className="mt-12 bg-white p-6 rounded-2xl items-center shadow-xl w-full max-w-sm">
          <Text className="text-2xl font-black text-slate-900 mb-2">
            {result.isGift ? 'Félicitations ! 🎉' : 'Dommage ! 😢'}
          </Text>
          <Text className="text-lg text-slate-600 text-center mb-6">
            Vous avez obtenu : {result.label}
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('ClientDashboard')}
            className="bg-[#1E3A5F] w-full py-3 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-lg">Retour au Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
