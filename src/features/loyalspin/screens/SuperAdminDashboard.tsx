import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface Props {
  t: any;
  setActiveTab?: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<Props> = ({ t, setActiveTab }) => {
  const users = useSelector((state: RootState) => state.users?.items || []);
  const services = useSelector(
    (state: RootState) => state.services?.items || [],
  );
  const categories = useSelector(
    (state: RootState) => state.categories?.items || [],
  );

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
      <Text className="text-3xl font-black mb-6">
        {tCommon('superadmin.title', 'Super Admin Dashboard')}
      </Text>

      <View className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <View className="p-6 bg-white rounded-2xl shadow">
          <Text className="text-sm font-bold">
            {tCommon('superadmin.users', 'Total Users')}
          </Text>
          <Text className="text-2xl font-extrabold">{users.length}</Text>
        </View>
        <View className="p-6 bg-white rounded-2xl shadow">
          <Text className="text-sm font-bold">
            {tCommon('superadmin.services', 'Total Services')}
          </Text>
          <Text className="text-2xl font-extrabold">{services.length}</Text>
        </View>
        <View className="p-6 bg-white rounded-2xl shadow">
          <Text className="text-sm font-bold">
            {tCommon('superadmin.categories', 'Total Categories')}
          </Text>
          <Text className="text-2xl font-extrabold">{categories.length}</Text>
        </View>
      </View>

      <View className="mt-8">
        <TouchableOpacity
          onPress={() => setActiveTab && setActiveTab('GestionUser')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          <Text className="text-white">
            {tCommon('superadmin.manageUsers', 'Manage Users')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuperAdminDashboard;
