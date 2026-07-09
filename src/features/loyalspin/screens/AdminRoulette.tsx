import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  fetchRouletteConfig,
  saveRouletteConfig,
  selectRouletteConfig,
  selectRouletteSaving,
} from '../../../store/slices/rouletteConfigSlice';
import { useToast } from '../../../context/ToastContext';
import type { RouletteConfig, RouletteSegment } from '../../../database/schema';

interface AdminRouletteProps {
  t?: any;
  projectId?: string | null;
}

const SEGMENT_COLORS = [
  '#F97316', '#3B82F6', '#10B981', '#8B5CF6',
  '#EF4444', '#F59E0B', '#06B6D4', '#EC4899',
];

const makeSegment = (index: number): RouletteSegment => ({
  id: `seg_${Date.now()}_${index}`,
  label: `Segment ${index + 1}`,
  color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  probability: 0,
  isGift: false,
  iconEmoji: '',
  giftValue: '',
});

const DEFAULT_SEGMENTS: RouletteSegment[] = [
  { id: 'seg_1', label: 'Café gratuit', color: '#F97316', probability: 20, isGift: true, iconEmoji: '☕' },
  { id: 'seg_2', label: '10% de réduction', color: '#3B82F6', probability: 30, isGift: false, iconEmoji: '🏷️' },
  { id: 'seg_3', label: 'Dessert offert', color: '#10B981', probability: 15, isGift: true, iconEmoji: '🍰' },
  { id: 'seg_4', label: 'Points x2', color: '#8B5CF6', probability: 20, isGift: false, iconEmoji: '⭐' },
  { id: 'seg_5', label: 'Rien cette fois', color: '#6B7280', probability: 15, isGift: false, iconEmoji: '😅' },
];

const buildDefaultConfig = (projectId: string): RouletteConfig => ({
  id: `roulette_${projectId}`,
  projectId,
  wheelName: 'Ma Roulette Fidélité',
  segments: DEFAULT_SEGMENTS,
  isActive: true,
  spinLimitType: 'per_day',
  spinLimitValue: 1,
  primaryColor: '#F97316',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const AdminRoulette: React.FC<AdminRouletteProps> = ({ t, projectId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const tFn = t && typeof t === 'function' ? t : null;
  const tr = (key: string, fallback: string) =>
    tFn ? tFn(key, { defaultValue: fallback }) : fallback;

  const savedConfig = useSelector(
    (state: RootState) => projectId ? selectRouletteConfig(projectId)(state) : null
  );
  const isSaving = useSelector(selectRouletteSaving);

  const [localConfig, setLocalConfig] = useState<RouletteConfig | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [segErrors, setSegErrors] = useState<Record<string, string>>({});

  // Sync from Redux when saved config loads
  useEffect(() => {
    if (projectId) {
      if (savedConfig) {
        setLocalConfig(JSON.parse(JSON.stringify(savedConfig)));
      } else {
        dispatch(fetchRouletteConfig(projectId)).catch(() => {
          setLocalConfig(buildDefaultConfig(projectId));
        });
      }
    }
  }, [projectId, savedConfig?.id]);

  // After fetch, if still nothing set default
  useEffect(() => {
    if (projectId && !savedConfig && !localConfig) {
      const timer = setTimeout(() => {
        setLocalConfig(buildDefaultConfig(projectId));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [projectId, savedConfig, localConfig]);

  const totalProbability = localConfig?.segments.reduce((sum, s) => sum + (Number(s.probability) || 0), 0) ?? 0;

  const updateField = (field: keyof RouletteConfig, value: any) => {
    setLocalConfig(prev => prev ? { ...prev, [field]: value } : prev);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateSegment = (id: string, field: keyof RouletteSegment, value: any) => {
    setLocalConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        segments: prev.segments.map(s =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      };
    });
    setSegErrors(prev => ({ ...prev, [`${id}_${field}`]: '' }));
  };

  const addSegment = () => {
    if (!localConfig) return;
    if (localConfig.segments.length >= 8) {
      showToast('Maximum 8 segments autorisés.', 'error');
      return;
    }
    const newSeg = makeSegment(localConfig.segments.length);
    setLocalConfig(prev => prev ? { ...prev, segments: [...prev.segments, newSeg] } : prev);
  };

  const removeSegment = (id: string) => {
    if (!localConfig) return;
    if (localConfig.segments.length <= 2) {
      showToast('Minimum 2 segments requis.', 'error');
      return;
    }
    setLocalConfig(prev => prev ? { ...prev, segments: prev.segments.filter(s => s.id !== id) } : prev);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newSegErrors: Record<string, string> = {};

    if (!localConfig) return false;
    if (!localConfig.wheelName.trim()) newErrors.wheelName = 'Le nom de la roulette est obligatoire.';
    if (!localConfig.spinLimitValue || localConfig.spinLimitValue < 1) newErrors.spinLimitValue = 'Minimum 1 spin par jour.';

    localConfig.segments.forEach(seg => {
      if (!seg.label.trim()) newSegErrors[`${seg.id}_label`] = 'Le nom du segment est requis.';
      if (seg.probability < 0 || seg.probability > 100) newSegErrors[`${seg.id}_probability`] = '0-100 requis.';
    });

    if (totalProbability !== 100) newErrors.total = `Le total des probabilités doit être 100% (actuellement ${totalProbability}%).`;

    setErrors(newErrors);
    setSegErrors(newSegErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newSegErrors).length === 0;
  };

  const handleSave = async () => {
    if (!localConfig || !validate()) return;
    try {
      const configToSave: RouletteConfig = {
        ...localConfig,
        updatedAt: new Date().toISOString(),
      };
      await dispatch(saveRouletteConfig(configToSave)).unwrap();
      showToast('Configuration de la roulette sauvegardée !', 'success');
    } catch (err) {
      showToast('Erreur lors de la sauvegarde.', 'error');
      console.error('AdminRoulette save error:', err);
    }
  };

  if (!projectId) {
    return (
      <View className="py-16 items-center">
        <Text className="text-4xl mb-3">🎯</Text>
        <Text className="text-slate-500 dark:text-slate-400 font-semibold">
          Sélectionnez un projet pour configurer la roulette.
        </Text>
      </View>
    );
  }

  if (!localConfig) {
    return (
      <View className="py-16 items-center">
        <Text className="text-slate-500 dark:text-slate-400">Chargement de la configuration...</Text>
      </View>
    );
  }

  return (
    <View className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            {tr('adminRoulette.title', 'Configuration de la Roulette')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Personnalisez les segments, probabilités et règles du jeu.
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300">Activer</Text>
          <Switch
            value={localConfig.isActive}
            onValueChange={v => updateField('isActive', v)}
            trackColor={{ true: '#10B981', false: '#6B7280' }}
          />
        </View>
      </View>

      <View className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* LEFT: Config panel */}
        <View className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
          
          {/* Wheel Name */}
          <View className="mb-6">
            <Text className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              {tr('adminRoulette.wheelName', 'Nom de la Roulette')} <Text className="text-red-400">*</Text>
            </Text>
            <TextInput
              value={localConfig.wheelName}
              onChangeText={v => updateField('wheelName', v)}
              placeholder="Ex: Roulette Café Premium"
              className={`w-full rounded-2xl border px-4 py-3 text-sm text-white bg-slate-900 ${errors.wheelName ? 'border-red-500' : 'border-slate-700'}`}
              placeholderTextColor="#6B7280"
            />
            {!!errors.wheelName && <Text className="text-red-400 text-xs mt-1">{errors.wheelName}</Text>}
          </View>

          {/* Spin rules */}
          <View className="grid grid-cols-2 gap-4 mb-6">
            <View className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {tr('adminRoulette.spinsPerDay', 'Tours / Jour')} <Text className="text-red-400">*</Text>
              </Text>
              <TextInput
                value={String(localConfig.spinLimitValue)}
                onChangeText={v => updateField('spinLimitValue', parseInt(v, 10) || 1)}
                keyboardType="numeric"
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-white bg-slate-950 ${errors.spinLimitValue ? 'border-red-500' : 'border-slate-700'}`}
                placeholderTextColor="#6B7280"
              />
              {!!errors.spinLimitValue && <Text className="text-red-400 text-xs mt-1">{errors.spinLimitValue}</Text>}
            </View>
            <View className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">Couleur principale</Text>
              <TextInput
                value={localConfig.primaryColor || '#F97316'}
                onChangeText={v => updateField('primaryColor', v)}
                placeholder="#F97316"
                className="w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm text-white bg-slate-950"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          {/* Segments */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-bold text-slate-100">
                {tr('adminRoulette.segments', 'Segments')} ({localConfig.segments.length}/8)
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className={`text-xs font-bold ${totalProbability === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Total: {totalProbability}%
                  {totalProbability === 100 ? ' ✔' : ' ✗'}
                </Text>
                <TouchableOpacity
                  onPress={addSegment}
                  className="bg-[#F97316] px-3 py-1.5 rounded-xl"
                  disabled={localConfig.segments.length >= 8}
                >
                  <Text className="text-white text-xs font-bold">+ Segment</Text>
                </TouchableOpacity>
              </View>
            </View>

            {!!errors.total && (
              <View className="bg-red-900/30 border border-red-700 rounded-xl p-3 mb-3">
                <Text className="text-red-400 text-xs font-bold">{errors.total}</Text>
              </View>
            )}

            <View className="space-y-3">
              {localConfig.segments.map((seg, index) => (
                <View
                  key={seg.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4"
                >
                  {/* Color + Emoji + Label row */}
                  <View className="flex-row gap-3 items-center mb-3">
                    {/* Color swatch */}
                    <View
                      style={{ backgroundColor: seg.color, width: 36, height: 36, borderRadius: 10, flexShrink: 0 }}
                    />
                    {/* Emoji */}
                    <TextInput
                      value={seg.iconEmoji || ''}
                      onChangeText={v => updateSegment(seg.id, 'iconEmoji', v)}
                      placeholder="🎁"
                      className="w-12 text-center rounded-xl border border-slate-700 bg-slate-950 px-2 py-2 text-white text-base"
                      maxLength={2}
                    />
                    {/* Label */}
                    <View className="flex-1">
                      <TextInput
                        value={seg.label}
                        onChangeText={v => updateSegment(seg.id, 'label', v)}
                        placeholder={`Segment ${index + 1} *`}
                        className={`w-full rounded-xl border px-3 py-2 text-sm text-white bg-slate-950 ${segErrors[`${seg.id}_label`] ? 'border-red-500' : 'border-slate-700'}`}
                        placeholderTextColor="#6B7280"
                      />
                      {!!segErrors[`${seg.id}_label`] && (
                        <Text className="text-red-400 text-xs mt-0.5">{segErrors[`${seg.id}_label`]}</Text>
                      )}
                    </View>
                    {/* Delete */}
                    <TouchableOpacity
                      onPress={() => removeSegment(seg.id)}
                      className="w-9 h-9 items-center justify-center rounded-xl bg-red-900/40"
                    >
                      <Text className="text-red-400 text-base">🗑</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Color hex + Probability + isGift row */}
                  <View className="flex-row gap-3 items-center">
                    <View className="flex-1">
                      <Text className="text-xs text-slate-500 mb-1">Couleur (hex)</Text>
                      <TextInput
                        value={seg.color}
                        onChangeText={v => updateSegment(seg.id, 'color', v)}
                        placeholder="#F97316"
                        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs"
                        placeholderTextColor="#6B7280"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-slate-500 mb-1">Probabilité (%) *</Text>
                      <TextInput
                        value={String(seg.probability)}
                        onChangeText={v => updateSegment(seg.id, 'probability', Number(v) || 0)}
                        keyboardType="numeric"
                        className={`rounded-xl border px-3 py-2 text-white text-xs bg-slate-950 ${segErrors[`${seg.id}_probability`] ? 'border-red-500' : 'border-slate-700'}`}
                        placeholderTextColor="#6B7280"
                      />
                      {!!segErrors[`${seg.id}_probability`] && (
                        <Text className="text-red-400 text-xs mt-0.5">{segErrors[`${seg.id}_probability`]}</Text>
                      )}
                    </View>
                    <View className="items-center gap-1">
                      <Text className="text-xs text-slate-500">Cadeau</Text>
                      <Switch
                        value={seg.isGift}
                        onValueChange={v => updateSegment(seg.id, 'isGift', v)}
                        trackColor={{ true: '#F97316', false: '#374151' }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            className="mt-6 w-full rounded-3xl bg-[#F97316] py-4 items-center"
          >
            <Text className="text-white font-black text-base">
              {isSaving ? 'Enregistrement...' : 'Enregistrer la configuration'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* RIGHT: Live preview */}
        <View className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
          <Text className="text-xs uppercase tracking-widest text-slate-500 mb-4">Aperçu en direct</Text>

          {/* Wheel visual */}
          <View className="items-center mb-6">
            <View
              style={{
                width: 240,
                height: 240,
                borderRadius: 120,
                overflow: 'hidden',
                borderWidth: 4,
                borderColor: localConfig.primaryColor || '#F97316',
              }}
            >
              {localConfig.segments.map((seg, i) => {
                const angle = (seg.probability / 100) * 360;
                return (
                  <View
                    key={seg.id}
                    style={{
                      flex: seg.probability,
                      backgroundColor: seg.color,
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 30,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: '#fff', fontWeight: '800', textAlign: 'center', paddingHorizontal: 4 }} numberOfLines={1}>
                      {seg.iconEmoji ? `${seg.iconEmoji} ` : ''}{seg.label}
                    </Text>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{seg.probability}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Segments legend */}
          <View className="space-y-2">
            {localConfig.segments.map(seg => (
              <View key={seg.id} className="flex-row items-center gap-3">
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: seg.color, flexShrink: 0 }} />
                <Text className="text-xs text-slate-700 dark:text-slate-300 flex-1" numberOfLines={1}>
                  {seg.iconEmoji ? `${seg.iconEmoji} ` : ''}{seg.label || '(Sans nom)'}
                </Text>
                <Text className="text-xs font-bold text-slate-500">{seg.probability}%</Text>
              </View>
            ))}
          </View>

          {/* Total indicator */}
          <View className={`mt-4 rounded-2xl p-3 ${totalProbability === 100 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <Text className={`text-center text-sm font-black ${totalProbability === 100 ? 'text-emerald-600' : 'text-red-500'}`}>
              {totalProbability === 100
                ? '✅ Total: 100% — Prêt à enregistrer'
                : `⚠️ Total: ${totalProbability}% — Doit être exactement 100%`}
            </Text>
          </View>

          {/* Config summary */}
          <View className="mt-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <Text className="text-xs uppercase tracking-widest text-slate-400 mb-2">Paramètres</Text>
            <Text className="text-sm text-slate-700 dark:text-slate-300">
              🎯 <Text className="font-bold">{localConfig.spinLimitValue}</Text> tour(s) par jour
            </Text>
            <Text className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              {localConfig.isActive ? '🟢 Roulette active' : '🔴 Roulette désactivée'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminRoulette;
