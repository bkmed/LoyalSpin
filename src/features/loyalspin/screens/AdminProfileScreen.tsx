import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useToast } from '../../../context/ToastContext';
import {
  updateAppSettings,
  addInterventionZone,
  updateInterventionZone,
  removeInterventionZone,
} from '../../../store/slices/appSettingsSlice';

type Lang = 'FR' | 'AR' | 'EN';
interface AdminProfileScreenProps {
  currentLang: Lang;
  t: any;
}

const AdminProfileScreen = ({ t }: AdminProfileScreenProps) => {
  const getTranslation = (key: string): string => {
    if (typeof t === 'function') {
      try {
        const val = t(key);
        if (typeof val === 'string') return val;
      } catch {
        // Fallback
      }
    }

    if (t && typeof t === 'object') {
      const flatKey = key.replace(/\./g, '_');
      if (typeof (t as any)[flatKey] === 'string') {
        return (t as any)[flatKey];
      }

      const parts = key.split('.');
      let obj: any = t;
      for (const part of parts) {
        if (obj && typeof obj === 'object') {
          obj = obj[part];
        } else {
          obj = undefined;
          break;
        }
      }
      if (typeof obj === 'string') return obj;

      if (typeof (t as any)[key] === 'string') {
        return (t as any)[key];
      }
    }

    const parts = key.split('.');
    return parts[parts.length - 1] || key;
  };
  const tr = getTranslation;
  const { user, updateProfile } = useAuth();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const appSettings = useSelector((state: RootState) => state.appSettings);

  const [businessNameInput, setBusinessNameInput] = useState('');
  const [businessNameArInput, setBusinessNameArInput] = useState('');
  const [experienceYearsInput, setExperienceYearsInput] = useState('');
  const [supportEmailInput, setSupportEmailInput] = useState('');
  const [supportPhoneInput, setSupportPhoneInput] = useState('');
  const [dispoValInput, setDispoValInput] = useState('');
  const [govValInput, setGovValInput] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [zoneInput, setZoneInput] = useState('');
  const [editingZoneIndex, setEditingZoneIndex] = useState<number | null>(null);
  const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);
  const [showZoneDeleteConfirm, setShowZoneDeleteConfirm] = useState(false);
  const zones = useSelector(
    (state: RootState) => state.appSettings?.interventionZones ?? [],
  );

  const availableZones = [
    'Grand Tunis',
    'Sahel',
    'Ariana',
    'Béja',
    'Ben Arous',
    'Bizerte',
    'Gabès',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kébili',
    'Le Kef',
    'Mahdia',
    'La Manouba',
    'Médenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis',
    'Zaghouan',
  ];

  const getZoneTranslationKey = (zone: string) => {
    return `zones.${zone
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/é/g, 'e')
      .replace(/è/g, 'e')}`;
  };

  useEffect(() => {
    if (user) {
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
    }
    setBusinessNameInput(appSettings?.businessName ?? 'LoyalSpin');
    setBusinessNameArInput(appSettings?.businessNameAr ?? 'لويال سبين');
    setExperienceYearsInput(String(appSettings?.experienceYears ?? 15));
    setSupportEmailInput(appSettings?.supportEmail || user?.email || '');
    setSupportPhoneInput(appSettings?.supportPhone || user?.phone || '');
    setDispoValInput(appSettings?.dispoVal || '24/7');
    setGovValInput(appSettings?.govVal || '24');
  }, [user, appSettings]);

  const handleAdminProfileUpdate = async (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!profileEmail) {
      showToast(tr('admin.errorInvalidEmail'), 'error');
      return;
    }
    if (!profilePhone) {
      showToast(tr('admin.errorInvalidPhone'), 'error');
      return;
    }

    try {
      await updateProfile({ email: profileEmail, phone: profilePhone });
      showToast(tr('admin.successProfileUpdated'), 'success');
    } catch (error) {
      showToast(tr('admin.errorProfileUpdate'), 'error');
      console.error('Profile update error:', error);
    }
  };

  const handleAdminBrandSettingsUpdate = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    const trimmedBusinessName = businessNameInput.trim();
    const years = Number(experienceYearsInput);

    if (!trimmedBusinessName) {
      showToast(tr('admin.errorBusinessNameRequired'), 'error');
      return;
    }

    if (!Number.isFinite(years) || years < 1 || years > 80) {
      showToast(tr('admin.errorInvalidExperience'), 'error');
      return;
    }

    if (!supportEmailInput.trim()) {
      showToast(tr('admin.errorSupportEmailRequired'), 'error');
      return;
    }

    if (!supportPhoneInput.trim()) {
      showToast(tr('admin.errorSupportPhoneRequired'), 'error');
      return;
    }

    dispatch(
      updateAppSettings({
        businessName: trimmedBusinessName,
        businessNameAr: businessNameArInput.trim(),
        experienceYears: Math.round(years),
        supportEmail: supportEmailInput.trim(),
        supportPhone: supportPhoneInput.trim(),
        dispoVal: dispoValInput,
        govVal: govValInput,
      }),
    );
    showToast(tr('admin.successBrandUpdated'), 'success');
  };

  const handleZoneSubmit = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    const trimmedZone = zoneInput.trim();
    if (!trimmedZone) {
      showToast(tr('admin.errorZoneRequired'), 'error');
      return;
    }

    if (editingZoneIndex !== null) {
      dispatch(
        updateInterventionZone({ index: editingZoneIndex, name: trimmedZone }),
      );
      showToast(tr('admin.successZoneUpdated'), 'success');
      setEditingZoneIndex(null);
    } else {
      if (zones.includes(trimmedZone)) {
        showToast(tr('admin.errorZoneExists'), 'error');
        return;
      }
      dispatch(addInterventionZone(trimmedZone));
      showToast(tr('admin.successZoneAdded'), 'success');
    }

    setZoneInput('');
  };

  const handleEditZone = (index: number) => {
    setEditingZoneIndex(index);
    setZoneInput(zones[index]);
  };

  const handleCancelZoneEdit = () => {
    setEditingZoneIndex(null);
    setZoneInput('');
  };

  const handleDeleteZoneClick = (index: number) => {
    setZoneToDelete(index);
    setShowZoneDeleteConfirm(true);
  };

  const confirmDeleteZone = () => {
    if (zoneToDelete === null) return;
    dispatch(removeInterventionZone(zoneToDelete));
    if (editingZoneIndex === zoneToDelete) {
      handleCancelZoneEdit();
    }
    showToast(tr('admin.successZoneDeleted'), 'success');
    setShowZoneDeleteConfirm(false);
    setZoneToDelete(null);
  };

  const cancelDeleteZone = () => {
    setShowZoneDeleteConfirm(false);
    setZoneToDelete(null);
  };

  return (
    <View className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
        {tr('admin.adminProfileTitle')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
        {tr('admin.adminProfileDescription')}
      </Text>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-start">
        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center shadow-sm space-y-6">
          <View className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black text-[#F97316] mx-auto border-2 border-[#F97316]">
            <Text className="text-3xl font-black text-[#F97316]">★</Text>
          </View>
          <View>
            <Text className="text-base font-black text-slate-800 dark:text-slate-100">
              {user?.name || tr('admin.defaultAdminName')}
            </Text>
            <Text className="inline-block mt-1 text-[8.5px] font-black px-3 py-1 rounded-full uppercase bg-amber-100 text-amber-700">
              {tr('admin.administratorRole')}
            </Text>
          </View>
          <View className="text-left text-xs font-semibold text-slate-400 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <View className="flex-row flex-wrap items-center">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-300">
                {tr('common.email')}:{' '}
              </Text>
              <Text className="font-black text-slate-700 dark:text-slate-200 ml-1">
                {profileEmail}
              </Text>
            </View>
            <View className="flex-row flex-wrap items-center">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-300">
                {tr('support.whatsapp')}:{' '}
              </Text>
              <Text className="font-black text-slate-700 dark:text-slate-200 ml-1">
                {appSettings?.supportPhone || profilePhone}
              </Text>
            </View>
            <View className="flex-row flex-wrap items-center">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-300">
                {tr('support.email_label')}:{' '}
              </Text>
              <Text className="font-black text-slate-700 dark:text-slate-200 ml-1">
                {appSettings?.supportEmail || profileEmail}
              </Text>
            </View>
            <View className="flex-row flex-wrap items-center">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-300">
                {tr('admin.status')}:{' '}
              </Text>
              <Text className="font-black text-emerald-500 ml-1">
                {tr('admin.active')}
              </Text>
            </View>
          </View>
        </View>

        <View className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            {tr('admin.contactSecurity')}
          </Text>

          <View className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.businessNameLabel')}
              </Text>
              <TextInput
                value={businessNameInput}
                onChangeText={setBusinessNameInput}
                placeholder="Ex: LoyalSpin"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.businessNameArLabel')}
              </Text>
              <TextInput
                value={businessNameArInput}
                onChangeText={setBusinessNameArInput}
                placeholder="مثال: لويال سبين"
                textAlign="right"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.experienceYearsLabel')}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={experienceYearsInput}
                onChangeText={setExperienceYearsInput}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.dispoValLabel')}
              </Text>
              <TextInput
                value={dispoValInput}
                onChangeText={setDispoValInput}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.govValLabel')}
              </Text>
              <TextInput
                value={govValInput}
                onChangeText={setGovValInput}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="sm:col-span-2">
              <TouchableOpacity
                onPress={() => handleAdminBrandSettingsUpdate({} as any)}
                className="bg-[#1E3A5F] hover:bg-[#152a47] flex items-center justify-center px-6 py-3.5 rounded-xl transition shadow-sm"
              >
                <Text className="text-white text-xs font-black uppercase tracking-wider">
                  {tr('admin.saveBrandIdentity')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="space-y-6 border-b border-slate-100 dark:border-slate-700 pb-6">
            <View className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <View>
                <Text className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {tr('admin.interventionZones')}
                </Text>
                <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {tr('admin.interventionZonesDescription')}
                </Text>
              </View>
              <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                {zones.length} {tr('admin.zonesLabel')}
              </Text>
            </View>

            <View className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={zoneInput}
                onChange={e => setZoneInput(e.target.value)}
                className="w-full sm:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              >
                <option value="" disabled>
                  {tr('admin.selectZone')}
                </option>
                {availableZones.map(zone => (
                  <option key={zone} value={zone}>
                    {getTranslation(getZoneTranslationKey(zone)) || zone}
                  </option>
                ))}
              </select>
              <View className="flex flex-wrap gap-2 items-center">
                <TouchableOpacity
                  onPress={() => handleZoneSubmit({} as any)}
                  className="bg-[#F97316] hover:bg-[#e0630b] flex items-center justify-center px-5 py-3 rounded-xl transition shadow-sm"
                >
                  <Text className="text-white text-xs font-black uppercase tracking-wider">
                    {editingZoneIndex !== null
                      ? tr('admin.saveZone')
                      : tr('admin.addZone')}
                  </Text>
                </TouchableOpacity>
                {editingZoneIndex !== null && (
                  <TouchableOpacity
                    onPress={handleCancelZoneEdit}
                    className="bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Text className="text-slate-700 dark:text-slate-200 text-xs font-black">
                      {tr('common.cancel')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View className="grid grid-cols-1 gap-3">
              {zones.length > 0 ? (
                zones.map((zone, index) => (
                  <View
                    key={`${zone}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3"
                  >
                    <Text className="text-sm font-black text-slate-700 dark:text-slate-100">
                      {getTranslation(getZoneTranslationKey(zone)) || zone}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity onPress={() => handleEditZone(index)}>
                        <Text className="text-[10px] font-black uppercase tracking-wider text-[#1E3A5F] hover:underline">
                          {tr('common.edit')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteZoneClick(index)}
                      >
                        <Text className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:underline">
                          {tr('common.delete')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                  {tr('admin.noZonesYet')}
                </View>
              )}
            </View>
          </View>

          <View className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {getTranslation('admin.admin_edit_email')}
              </Text>
              <TextInput
                keyboardType="email-address"
                value={profileEmail}
                onChangeText={setProfileEmail}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {getTranslation('admin.admin_edit_phone')}
              </Text>
              <TextInput
                keyboardType="phone-pad"
                value={profilePhone}
                onChangeText={setProfilePhone}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {getTranslation('support.email_label')}
              </Text>
              <TextInput
                keyboardType="email-address"
                value={supportEmailInput}
                onChangeText={setSupportEmailInput}
                placeholder="support@loyalspin.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {getTranslation('support.whatsapp')}
              </Text>
              <TextInput
                keyboardType="phone-pad"
                value={supportPhoneInput}
                onChangeText={setSupportPhoneInput}
                placeholder="+216 22 456 789"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </View>
            <View className="sm:col-span-2">
              <TouchableOpacity
                onPress={() => handleAdminProfileUpdate({} as any)}
                className="bg-[#F97316] hover:bg-[#e0630b] flex items-center justify-center px-6 py-3.5 rounded-xl transition shadow-sm"
              >
                <Text className="text-white text-xs font-black uppercase tracking-wider">
                  {tr('admin.saveContactDetails')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="space-y-4">
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.newAdminPassword')}
              </Text>
              <TextInput
                secureTextEntry
                placeholder="Ex: admin123"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </View>
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-300">
                {tr('admin.confirmPassword')}
              </Text>
              <TextInput
                secureTextEntry
                placeholder="Ex: admin123"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                showToast(tr('admin.adminPasswordUpdated'), 'success')
              }
              className="bg-[#1E3A5F] hover:bg-[#152a47] flex items-center justify-center px-6 py-3.5 rounded-xl transition shadow-sm"
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">
                {tr('admin.updateSecurity')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showZoneDeleteConfirm && zoneToDelete !== null && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {tr('admin.confirmDelete')}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {tr('admin.confirmDeleteZone')}
              </Text>
            </View>
            <View className="flex gap-3">
              <TouchableOpacity
                onPress={cancelDeleteZone}
                className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-xl px-4 py-3 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center"
              >
                <Text className="text-slate-700 dark:text-slate-200 font-black">
                  {tr('admin.cancelButton')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteZone}
                className="flex-1 bg-rose-600 rounded-xl px-4 py-3 hover:bg-rose-700 transition flex items-center justify-center"
              >
                <Text className="text-white font-black">
                  {tr('admin.deleteButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AdminProfileScreen;
