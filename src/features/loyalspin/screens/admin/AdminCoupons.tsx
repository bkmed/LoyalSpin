import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
} from '../../../../store/slices/couponsSlice';
import { useToast } from '../../../../context/ToastContext';
import type { Coupon, CouponType } from '../../../../database/schema';

interface FormState {
  code: string;
  title: string;
  description: string;
  type: CouponType;
  value: string;
  totalQuantity: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  code: '',
  title: '',
  description: '',
  type: 'percentage',
  value: '',
  totalQuantity: '',
  isActive: true,
};

interface AdminCouponsProps {
  projectId?: string | null;
}

export default function AdminCoupons({ projectId }: AdminCouponsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const allCoupons = useSelector((state: RootState) => state.coupons?.items || []);
  const isLoading = useSelector((state: RootState) => state.coupons?.loading || false);

  const coupons = projectId
    ? allCoupons.filter(c => c.projectId === projectId)
    : allCoupons;

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchCoupons(projectId));
    }
  }, [projectId, dispatch]);

  const setField = (key: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.code.trim()) newErrors.code = 'Le code est obligatoire.';
    if (!form.title.trim()) newErrors.title = 'Le titre est obligatoire.';
    if ((form.type === 'percentage' || form.type === 'fixed_amount') && !form.value.trim()) {
      newErrors.value = 'La valeur est obligatoire pour ce type de coupon.';
    }
    if (form.type === 'percentage' && form.value) {
      const v = parseFloat(form.value);
      if (isNaN(v) || v <= 0 || v > 100) newErrors.value = 'La valeur doit être entre 1 et 100%.';
    }
    if (form.value && isNaN(parseFloat(form.value))) {
      newErrors.value = 'La valeur doit être un nombre.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsCreating(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value != null ? String(coupon.value) : '',
      totalQuantity: coupon.totalQuantity != null ? String(coupon.totalQuantity) : '',
      isActive: coupon.isActive,
    });
    setErrors({});
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!projectId) {
      showToast('Aucun projet sélectionné.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        projectId,
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        value: form.value ? parseFloat(form.value) : undefined,
        totalQuantity: form.totalQuantity ? parseInt(form.totalQuantity, 10) : undefined,
        isActive: form.isActive,
      };

      if (editingId) {
        await dispatch(updateCoupon({ id: editingId, data: { ...payload, updatedAt: new Date().toISOString() } })).unwrap();
        showToast('Coupon mis à jour avec succès !', 'success');
      } else {
        await dispatch(createCoupon(payload)).unwrap();
        showToast('Coupon créé avec succès !', 'success');
      }
      handleCancel();
    } catch (error) {
      console.error('AdminCoupons save error:', error);
      showToast('Erreur lors de la sauvegarde du coupon.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce coupon ?')) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      showToast('Coupon supprimé.', 'info');
    } catch (error) {
      console.error('AdminCoupons delete error:', error);
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await dispatch(toggleCouponActive({ id: coupon.id, isActive: !coupon.isActive })).unwrap();
      showToast(`Coupon ${!coupon.isActive ? 'activé' : 'désactivé'}.`, 'info');
    } catch (error) {
      console.error('AdminCoupons toggle active error:', error);
      showToast('Erreur lors de la mise à jour.', 'error');
    }
  };

  const typeLabels: Record<CouponType, string> = {
    percentage: 'Pourcentage (%)',
    fixed_amount: 'Montant fixe (€)',
    free_item: 'Article gratuit',
    custom: 'Personnalisé',
  };

  return (
    <View className="max-w-5xl">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            Gestion des Coupons
          </Text>
          {projectId && (
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {coupons.length} coupon{coupons.length !== 1 ? 's' : ''} pour ce projet
            </Text>
          )}
        </View>
        {!isCreating && (
          <TouchableOpacity
            onPress={handleOpenCreate}
            className="bg-[#1E3A5F] px-5 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">+ Nouveau Coupon</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Form */}
      {isCreating && (
        <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
          <Text className="text-xl font-bold mb-5 dark:text-white">
            {editingId ? 'Modifier le coupon' : 'Créer un coupon'}
          </Text>

          {/* Code */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Code <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={form.code}
              onChangeText={v => setField('code', v.toUpperCase())}
              placeholder="Ex: ETE2026"
              autoCapitalize="characters"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 dark:text-white ${errors.code ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            />
            {!!errors.code && <Text className="text-red-500 text-xs mt-1">{errors.code}</Text>}
          </View>

          {/* Titre */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Titre <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={form.title}
              onChangeText={v => setField('title', v)}
              placeholder="Ex: -20% sur tout le menu"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 dark:text-white ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            />
            {!!errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</Text>
            <TextInput
              value={form.description}
              onChangeText={v => setField('description', v)}
              placeholder="Description optionnelle..."
              multiline
              numberOfLines={2}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white"
            />
          </View>

          {/* Type + Valeur */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Type <Text className="text-red-500">*</Text>
              </Text>
              <View className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden h-12 justify-center">
                <Picker
                  selectedValue={form.type}
                  onValueChange={v => setField('type', v)}
                  style={{ height: 50, width: '100%' }}
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <Picker.Item key={key} label={label} value={key} />
                  ))}
                </Picker>
              </View>
            </View>
            {(form.type === 'percentage' || form.type === 'fixed_amount') && (
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Valeur <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={form.value}
                  onChangeText={v => setField('value', v)}
                  placeholder={form.type === 'percentage' ? 'Ex: 20' : 'Ex: 5.00'}
                  keyboardType="numeric"
                  className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 dark:text-white ${errors.value ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                />
                {!!errors.value && <Text className="text-red-500 text-xs mt-1">{errors.value}</Text>}
              </View>
            )}
          </View>

          {/* Quantité + Actif */}
          <View className="flex-row gap-4 mb-6 items-center">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantité totale (vide = illimitée)
              </Text>
              <TextInput
                value={form.totalQuantity}
                onChangeText={v => setField('totalQuantity', v)}
                placeholder="Ex: 100"
                keyboardType="numeric"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white"
              />
            </View>
            <View className="flex-row items-center gap-3 mt-4">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">Actif</Text>
              <Switch
                value={form.isActive}
                onValueChange={v => setField('isActive', v)}
                trackColor={{ true: '#10B981' }}
              />
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={handleCancel}
              className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700"
              disabled={saving}
            >
              <Text className="text-slate-800 dark:text-white font-bold">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="px-6 py-3 rounded-xl bg-[#1E3A5F]"
              disabled={saving}
            >
              <Text className="text-white font-bold">
                {saving ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Sauvegarder')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Coupon list */}
      {isLoading ? (
        <View className="p-8 items-center">
          <Text className="text-slate-500 dark:text-slate-400">Chargement...</Text>
        </View>
      ) : (
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {coupons.length === 0 ? (
            <View className="p-10 items-center">
              <Text className="text-2xl mb-2">🎟️</Text>
              <Text className="text-slate-500 dark:text-slate-400 font-semibold">Aucun coupon pour ce projet</Text>
              <Text className="text-slate-400 text-sm mt-1">Créez votre premier coupon via le bouton ci-dessus.</Text>
            </View>
          ) : (
            coupons.map((coupon, idx) => (
              <View
                key={coupon.id}
                className={`p-4 ${idx !== coupons.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-4">
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <Text className="font-black text-base dark:text-white">{coupon.title}</Text>
                      <View className={`px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-slate-100 dark:bg-slate-700'}`}>
                        <Text className={`text-xs font-bold ${coupon.isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}>
                          {coupon.isActive ? 'Actif' : 'Inactif'}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row flex-wrap gap-3 mt-1">
                      <Text className="text-sm text-slate-500 dark:text-slate-400">
                        Code: <Text className="font-mono font-bold text-slate-700 dark:text-slate-200">{coupon.code}</Text>
                      </Text>
                      <Text className="text-sm text-slate-500 dark:text-slate-400">
                        Type: {typeLabels[coupon.type]}
                      </Text>
                      {coupon.value != null && (
                        <Text className="text-sm text-slate-500 dark:text-slate-400">
                          Valeur: <Text className="font-bold text-[#1E3A5F] dark:text-blue-300">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}€`}
                          </Text>
                        </Text>
                      )}
                      <Text className="text-sm text-slate-500 dark:text-slate-400">
                        Utilisés: {coupon.usedQuantity}/{coupon.totalQuantity ?? '∞'}
                      </Text>
                    </View>
                    {coupon.description && (
                      <Text className="text-xs text-slate-400 mt-1">{coupon.description}</Text>
                    )}
                  </View>
                  {/* Actions */}
                  <View className="flex-row gap-2 items-center">
                    <Switch
                      value={coupon.isActive}
                      onValueChange={() => handleToggleActive(coupon)}
                      trackColor={{ true: '#10B981', false: '#6B7280' }}
                    />
                    <TouchableOpacity
                      onPress={() => handleOpenEdit(coupon)}
                      className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-blue-700 dark:text-blue-300 font-bold text-sm">Éditer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(coupon.id)}
                      className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-red-700 dark:text-red-300 font-bold text-sm">Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}
