import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const ProfileSettingsScreen = ({ navigation }: any) => {
  const { user, updateProfile, signOut } = useAuth();
  const { showToast } = useToast();

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
      showToast('Un email est requis.', 'error');
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
      showToast('Profil mis à jour avec succès.', 'success');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Impossible de mettre à jour le profil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Déconnexion réussie.', 'success');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast('Impossible de se déconnecter.', 'error');
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
            Paramètres du profil
          </Text>
          <Text className="text-slate-500 text-sm mt-2">
            Mettez à jour vos informations personnelles et de contact.
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                Prénom
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Prénom"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>
            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                Nom
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Nom"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>

            <View className="space-y-2">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                Téléphone
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Téléphone"
                keyboardType={Platform.OS === 'web' ? 'default' : 'phone-pad'}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
              Ville
            </Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ville"
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
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-1 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-5 py-4 text-center hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Text className="text-slate-700 dark:text-slate-200 font-black text-sm text-center">
                Annuler
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-4 rounded-3xl bg-red-600 hover:bg-red-700 px-5 py-4 text-center"
          >
            <Text className="text-white font-black text-sm text-center">
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileSettingsScreen;
