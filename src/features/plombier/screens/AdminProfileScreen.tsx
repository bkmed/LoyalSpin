import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useToast } from '../../../context/ToastContext';
import {
  updateLoyalSpinSettings,
  addInterventionZone,
  updateInterventionZone,
  removeInterventionZone,
} from '../../../store/slices/loyalspinSettingsSlice';

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
  const loyalspinSettings = useSelector(
    (state: RootState) => state.loyalspinSettings,
  );

  const [businessNameInput, setBusinessNameInput] = useState('');
  const [experienceYearsInput, setExperienceYearsInput] = useState('');
  const [supportEmailInput, setSupportEmailInput] = useState('');
  const [supportPhoneInput, setSupportPhoneInput] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [zoneInput, setZoneInput] = useState('');
  const [editingZoneIndex, setEditingZoneIndex] = useState<number | null>(null);
  const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);
  const [showZoneDeleteConfirm, setShowZoneDeleteConfirm] = useState(false);
  const zones = useSelector(
    (state: RootState) => state.loyalspinSettings?.interventionZones ?? [],
  );

  const availableZones = ['Grand Tunis', 'Sahel', 'Sfax'];

  useEffect(() => {
    if (user) {
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
    }
    setBusinessNameInput(loyalspinSettings?.businessName ?? 'LoyalSpin Tunisie');
    setExperienceYearsInput(String(loyalspinSettings?.experienceYears ?? 15));
    setSupportEmailInput(loyalspinSettings?.supportEmail || user?.email || '');
    setSupportPhoneInput(loyalspinSettings?.supportPhone || user?.phone || '');
  }, [user, loyalspinSettings]);

  const handleAdminProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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
    e.preventDefault();
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
      updateLoyalSpinSettings({
        businessName: trimmedBusinessName,
        experienceYears: Math.round(years),
        supportEmail: supportEmailInput.trim(),
        supportPhone: supportPhoneInput.trim(),
      }),
    );
    showToast(tr('admin.successBrandUpdated'), 'success');
  };

  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <h1 className="text-3xl font-black tracking-tight">
        {tr('admin.adminProfileTitle')}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
        {tr('admin.adminProfileDescription')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-start">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center shadow-sm space-y-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black text-[#F97316] mx-auto border-2 border-[#F97316]">
            ★
          </div>
          <div>
            <h3 className="text-base font-black text-slate-850 dark:text-slate-100">
              {user?.name || tr('admin.defaultAdminName')}
            </h3>
            <span className="inline-block mt-1 text-[8.5px] font-black px-3 py-1 rounded-full uppercase bg-amber-100 text-amber-700">
              {tr('admin.administratorRole')}
            </span>
          </div>
          <div className="text-left text-xs font-semibold text-slate-400 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div>
              {tr('common.email')}:{' '}
              <span className="font-black text-slate-700 dark:text-slate-200">
                {profileEmail}
              </span>
            </div>
            <div>
              {tr('support.whatsapp')}:{' '}
              <span className="font-black text-slate-700 dark:text-slate-200">
                {loyalspinSettings.supportPhone || profilePhone}
              </span>
            </div>
            <div>
              {tr('support.email_label')}:{' '}
              <span className="font-black text-slate-700 dark:text-slate-200">
                {loyalspinSettings.supportEmail || profileEmail}
              </span>
            </div>
            <div>
              {tr('admin.status')}:{' '}
              <span className="font-black text-emerald-500">
                {tr('admin.active')}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider">
            {tr('admin.contactSecurity')}
          </h3>

          <form
            onSubmit={handleAdminBrandSettingsUpdate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {tr('admin.businessNameLabel')}
              </label>
              <input
                type="text"
                required
                value={businessNameInput}
                onChange={e => setBusinessNameInput(e.target.value)}
                placeholder="Ex: Mohamed Ben Khedher"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {tr('admin.experienceYearsLabel')}
              </label>
              <input
                type="number"
                required
                min="1"
                max="80"
                value={experienceYearsInput}
                onChange={e => setExperienceYearsInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
              >
                {tr('admin.saveBrandIdentity')}
              </button>
            </div>
          </form>

          <div className="space-y-6 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {tr('admin.interventionZones')}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {tr('admin.interventionZonesDescription')}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {zones.length} {tr('admin.zonesLabel')}
              </span>
            </div>

            <form
              onSubmit={handleZoneSubmit}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
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
                    {zone}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="submit"
                  className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                >
                  {editingZoneIndex !== null
                    ? tr('admin.saveZone')
                    : tr('admin.addZone')}
                </button>
                {editingZoneIndex !== null && (
                  <button
                    type="button"
                    onClick={handleCancelZoneEdit}
                    className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-black px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    {tr('common.cancel')}
                  </button>
                )}
              </div>
            </form>

            <div className="grid grid-cols-1 gap-3">
              {zones.length > 0 ? (
                zones.map((zone, index) => (
                  <div
                    key={`${zone}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3"
                  >
                    <span className="text-sm font-black text-slate-700 dark:text-slate-100">
                      {zone}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditZone(index)}
                        className="text-[10px] font-black uppercase tracking-wider text-[#1E3A5F] hover:underline"
                      >
                        {tr('common.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteZoneClick(index)}
                        className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:underline"
                      >
                        {tr('common.delete')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                  {tr('admin.noZonesYet')}
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleAdminProfileUpdate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {getTranslation('admin.admin_edit_email')}
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {getTranslation('admin.admin_edit_phone')}
              </label>
              <input
                type="tel"
                required
                value={profilePhone}
                onChange={e => setProfilePhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {getTranslation('support.email_label')}
              </label>
              <input
                type="email"
                required
                value={supportEmailInput}
                onChange={e => setSupportEmailInput(e.target.value)}
                placeholder="support@loyalspin-tunisie.tn"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {getTranslation('support.whatsapp')}
              </label>
              <input
                type="tel"
                required
                value={supportPhoneInput}
                onChange={e => setSupportPhoneInput(e.target.value)}
                placeholder="+216 22 456 789"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
              >
                {tr('admin.saveContactDetails')}
              </button>
            </div>
          </form>

          <form
            onSubmit={e => {
              e.preventDefault();
              showToast(tr('admin.adminPasswordUpdated'), 'success');
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {tr('admin.newAdminPassword')}
              </label>
              <input
                type="password"
                required
                placeholder="Ex: admin123"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {tr('admin.confirmPassword')}
              </label>
              <input
                type="password"
                required
                placeholder="Ex: admin123"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider"
            >
              {tr('admin.updateSecurity')}
            </button>
          </form>
        </div>
      </div>

      {showZoneDeleteConfirm && zoneToDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {tr('admin.confirmDelete')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {tr('admin.confirmDeleteZone')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDeleteZone}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tr('admin.cancelButton')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteZone}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tr('admin.deleteButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileScreen;
