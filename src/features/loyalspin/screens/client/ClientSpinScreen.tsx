import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import LoyaltyWheel from '../../components/LoyaltyWheel';
import SocialShareGate from '../../components/SocialShareGate';
import { fetchRouletteConfig } from '../../../../store/slices/rouletteConfigSlice';
import { recordSpin } from '../../../../store/slices/spinHistorySlice';
import { selectProjectById } from '../../../../store/slices/projectsSlice';
import type { WheelSegment } from '../../types';
import type { RouletteSegment } from '../../../../database/schema';

// ─── Mapper ───────────────────────────────────────────────────────────────────

const toWheelSegment = (seg: RouletteSegment): WheelSegment => ({
  id: seg.id,
  title: seg.label,
  description: seg.description ?? '',
  color: seg.color,
});

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: 'd1', title: '🎁 Cadeau', description: '', color: '#10b981' },
  { id: 'd2', title: '⭐ Bonus', description: '', color: '#3b82f6' },
  { id: 'd3', title: '🏆 -10%', description: '', color: '#f59e0b' },
  { id: 'd4', title: '🎉 Offert', description: '', color: '#8b5cf6' },
  { id: 'd5', title: '💎 VIP', description: '', color: '#ec4899' },
  { id: 'd6', title: '🍀 Chance', description: '', color: '#14b8a6' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientSpinScreen({ route, navigation }: any) {
  const dispatch = useDispatch();
  const projectId: string = route?.params?.projectId || 'default';

  // Redux state
  const config = useSelector(
    (state: RootState) => state.rouletteConfig.configs[projectId],
  );
  const loadingConfig = useSelector((state: RootState) => state.rouletteConfig.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const project = useSelector(selectProjectById(projectId));

  // Local state
  const [hasShared, setHasShared] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);

  // Fetch config if not in store
  useEffect(() => {
    if (!config) {
      (dispatch as any)(fetchRouletteConfig(projectId));
    }
  }, [projectId, config, dispatch]);

  // Wheel segments: use store config or defaults
  const wheelSegments: WheelSegment[] =
    config?.segments?.length
      ? config.segments.map(toWheelSegment)
      : DEFAULT_SEGMENTS;

  // Social links from project (may be undefined if project not in store)
  const socialLinks = {
    googleMapsUrl: project?.googleMapsUrl,
    facebookUrl: project?.facebookUrl,
    instagramUrl: project?.instagramUrl,
    tiktokUrl: project?.tiktokUrl,
  };

  const handleFinish = (segment: WheelSegment) => {
    setResult(segment);
    const originalSeg = config?.segments?.find(s => s.id === segment.id);
    const isGift = originalSeg?.isGift ?? true;

    (dispatch as any)(
      recordSpin({
        projectId,
        userId: user?.id || 'anonymous',
        segmentId: segment.id,
        segmentLabel: segment.title,
        outcome: isGift ? 'win' : 'lose',
        spinDate: new Date().toISOString(),
      }),
    );
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loadingConfig && !config) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white text-lg">Chargement…</Text>
      </View>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      className="flex-1 bg-slate-900"
      contentContainerStyle={{ paddingTop: 52, paddingBottom: 40, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── STEP 1 : Social Share Gate ──────────────────────────────────── */}
      {!hasShared && (
        <SocialShareGate
          links={socialLinks}
          businessName={project?.name}
          onShared={() => setHasShared(true)}
        />
      )}

      {/* ── STEP 2 : Spin Wheel ─────────────────────────────────────────── */}
      {hasShared && !result && (
        <>
          <View className="items-center mb-8">
            {/* Success badge */}
            <View className="bg-emerald-500/20 border border-emerald-500/40 px-5 py-2 rounded-full mb-6">
              <Text className="text-emerald-400 font-bold text-sm">
                ✅ Partage confirmé — Bonne chance !
              </Text>
            </View>

            <Text className="text-3xl font-black text-white mb-2 text-center">
              Tournez la roue !
            </Text>
            <Text className="text-slate-400 text-center">
              Tentez votre chance pour gagner une récompense.
            </Text>
          </View>

          <LoyaltyWheel segments={wheelSegments} onFinish={handleFinish} />
        </>
      )}

      {/* ── STEP 3 : Result ─────────────────────────────────────────────── */}
      {result && (
        <View className="items-center pt-8">
          <View className="bg-white p-8 rounded-3xl items-center shadow-xl w-full max-w-sm">
            <Text className="text-5xl mb-4">
              {(() => {
                const originalSeg = config?.segments?.find(s => s.id === result.id);
                return (originalSeg?.isGift ?? true) ? '🎉' : '😢';
              })()}
            </Text>
            <Text className="text-2xl font-black text-slate-900 mb-2 text-center">
              {(() => {
                const originalSeg = config?.segments?.find(s => s.id === result.id);
                return (originalSeg?.isGift ?? true)
                  ? 'Félicitations !'
                  : 'Dommage !';
              })()}
            </Text>
            <Text className="text-lg text-slate-500 text-center mb-8">
              Vous avez obtenu :{' '}
              <Text className="font-bold text-slate-800">{result.title}</Text>
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('ClientDashboard')}
              className="bg-[#1E3A5F] w-full py-4 rounded-2xl items-center"
            >
              <Text className="text-white font-bold text-base">
                Retour au Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
