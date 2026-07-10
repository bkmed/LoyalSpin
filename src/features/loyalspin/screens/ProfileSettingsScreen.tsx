import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const ProfileSettingsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { user, updateProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName || (user.name?.split(' ')[0] ?? ''));
    setLastName(user.lastName || (user.name?.split(' ').slice(1).join(' ') ?? ''));
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setCity(user.city || '');
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!email.trim()) {
      showToast(tCommon('profileSettings.errorEmailRequired', 'Email is required.'), 'error');
      return;
    }

    setSaving(true);
    try {
      const updatedName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await updateProfile({
        id: user.id,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        name: updatedName || user.name,
        email: email.trim(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
      });
      showToast(
        tCommon('profileSettings.successProfileUpdated', 'Profile updated successfully.'),
        'success',
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(
        tCommon('profileSettings.errorProfileUpdate', 'Unable to update profile.'),
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showToast(
        tCommon('profileSettings.successLogout', 'Logged out successfully.'),
        'success',
      );
    } catch (error) {
      console.error('Error logging out:', error);
      showToast(
        tCommon('profileSettings.errorLogout', 'Unable to log out.'),
        'error',
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-slate-50 dark:bg-[#0B0F19] p-4"
    >
      <View className="max-w-4xl mx-auto w-full">
        <View className="mb-8">
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            {tCommon('profileSettings.title', 'Profile settings')}
          </Text>
          <Text className="text-slate-500 text-sm mt-2">
            {tCommon(
              'profileSettings.subtitle',
              'Update your personal and contact information.',
            )}
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                {tCommon('profileSettings.firstNameLabel', 'First name')}
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder={tCommon('profileSettings.firstNamePlaceholder', 'First name')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>
            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                {tCommon('profileSettings.lastNameLabel', 'Last name')}
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder={tCommon('profileSettings.lastNamePlaceholder', 'Last name')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                {tCommon('profileSettings.emailLabel', 'Email')}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={tCommon('profileSettings.emailPlaceholder', 'Email')}
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>

            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                {tCommon('profileSettings.phoneLabel', 'Phone')}
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={tCommon('profileSettings.phonePlaceholder', 'Phone')}
                keyboardType={Platform.OS === 'web' ? 'default' : 'phone-pad'}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
              {tCommon('profileSettings.cityLabel', 'City')}
            </Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder={tCommon('profileSettings.cityPlaceholder', 'City')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </View>

          <View className="flex flex-col md:flex-row gap-4 mt-4">
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className={`flex-1 rounded-3xl px-5 py-4 text-center ${
                saving
                  ? 'bg-slate-400'
                  : 'bg-[#1E3A5F] hover:bg-[#152a47]'
              }`}
            >
              <Text className="text-white font-black text-sm text-center">
                {saving
                  ? tCommon('profileSettings.saving', 'Saving...')
                  : tCommon(
                      'profileSettings.saveChanges',
                      'Enregistrer les modifications',
                    )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-1 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-5 py-4 text-center hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Text className="text-slate-700 dark:text-slate-200 font-black text-sm text-center">
                {tCommon('profileSettings.cancel', 'Cancel')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-4 rounded-3xl bg-red-600 hover:bg-red-700 px-5 py-4 text-center"
          >
            <Text className="text-white font-black text-sm text-center">
              {tCommon('profileSettings.logoutButton', 'Log out')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileSettingsScreen;
