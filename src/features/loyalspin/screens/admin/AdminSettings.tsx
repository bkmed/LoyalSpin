import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { updateProject } from '../../../store/slices/projectsSlice';
import { Project } from '../../../database/schema';
import { useToast } from '../../../context/ToastContext';

interface AdminSettingsProps {
  projectId?: string | null;
}

export default function AdminSettings({ projectId }: AdminSettingsProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const project = useSelector((state: RootState) =>
    projectId ? state.projects.items.find(p => p.id === projectId) : null,
  );

  const [form, setForm] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        description: project.description,
        email: project.email,
        phone: project.phone,
        websiteUrl: project.websiteUrl,
        facebookUrl: project.facebookUrl,
        instagramUrl: project.instagramUrl,
        tiktokUrl: project.tiktokUrl,
        googleMapsUrl: project.googleMapsUrl,
        isActive: project.isActive,
      });
    }
  }, [project]);

  const handleChange = (key: keyof Project, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!projectId) {
      showToast(t('adminSettings.noProject', 'Aucun projet sélectionné.'), 'error');
      return;
    }

    setSaving(true);
    try {
      await dispatch(
        updateProject({
          id: projectId,
          data: {
            name: form.name || '',
            description: form.description || '',
            email: form.email || '',
            phone: form.phone || '',
            websiteUrl: form.websiteUrl || '',
            facebookUrl: form.facebookUrl || '',
            instagramUrl: form.instagramUrl || '',
            tiktokUrl: form.tiktokUrl || '',
            googleMapsUrl: form.googleMapsUrl || '',
            isActive: form.isActive ?? true,
          },
        }),
      ).unwrap();
      showToast(t('adminSettings.saveSuccess', 'Project settings saved.'), 'success');
    } catch (error) {
      console.error('AdminSettings save error:', error);
      showToast(t('adminSettings.saveError', 'Unable to save project settings.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!projectId) {
    return (
      <View className="max-w-5xl">
        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          {t('adminSettings.title', 'Project Settings')}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400">
          {t('adminSettings.noProjectAssigned', 'No project is assigned to this administrator yet.')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="max-w-5xl" contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="text-3xl font-black text-slate-900 dark:text-white mb-8">
        {t('adminSettings.title', 'Project Settings')}
      </Text>

      <View className="grid gap-6 lg:grid-cols-2">
        {[
          { key: 'name', label: t('adminSettings.projectName', 'Project Name') },
          { key: 'email', label: t('adminSettings.email', 'Contact Email') },
          { key: 'phone', label: t('adminSettings.phone', 'Contact Phone') },
          { key: 'websiteUrl', label: t('adminSettings.website', 'Website URL') },
          { key: 'googleMapsUrl', label: t('adminSettings.googleMaps', 'Google Maps URL') },
          { key: 'facebookUrl', label: t('adminSettings.facebook', 'Facebook URL') },
          { key: 'instagramUrl', label: t('adminSettings.instagram', 'Instagram URL') },
          { key: 'tiktokUrl', label: t('adminSettings.tiktok', 'TikTok URL') },
        ].map(field => (
          <View key={field.key} className="flex flex-col">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </Text>
            <TextInput
              value={(form[field.key as keyof Project] as string) || ''}
              onChangeText={(value) => handleChange(field.key as keyof Project, value)}
              placeholder={field.label}
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </View>
        ))}

        <View className="flex flex-col">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {t('adminSettings.status', 'Project Active')}
          </Text>
          <TouchableOpacity
            onPress={() => handleChange('isActive', !(form.isActive ?? true))}
            className={`inline-flex items-center justify-center rounded-3xl px-4 py-3 ${form.isActive ?? true ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            <Text className="font-black text-white">
              {form.isActive ?? true
                ? t('adminSettings.active', 'Active')
                : t('adminSettings.inactive', 'Inactive')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-10 flex flex-row gap-4">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#1E3A5F] px-6 py-4 rounded-3xl"
          disabled={saving}
        >
          <Text className="text-white font-black">
            {saving ? t('adminSettings.saving', 'Saving...') : t('adminSettings.saveButton', 'Save Settings')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (project) setForm({
              name: project.name,
              description: project.description,
              email: project.email,
              phone: project.phone,
              websiteUrl: project.websiteUrl,
              facebookUrl: project.facebookUrl,
              instagramUrl: project.instagramUrl,
              tiktokUrl: project.tiktokUrl,
              googleMapsUrl: project.googleMapsUrl,
              isActive: project.isActive,
            });
          }}
          className="bg-slate-200 dark:bg-slate-800 px-6 py-4 rounded-3xl"
        >
          <Text className="font-black text-slate-900 dark:text-slate-100">
            {t('adminSettings.reset', 'Reset')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
