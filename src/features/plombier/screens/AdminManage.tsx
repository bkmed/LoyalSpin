import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AdminManageProps {
  t: any;
  setActiveTab: (tab: string) => void;
}

const AdminManage: React.FC<AdminManageProps> = ({ t, setActiveTab }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const manageLinks = [
    {
      id: 'GestionAnnonce',
      label: tCommon('web.manageAds', 'Manage Ads'),
      icon: '📢',
      description: 'Gérer les annonces et publications',
    },
    {
      id: 'GestionCategorie',
      label: tCommon('web.manageCategories', 'Manage Categories'),
      icon: '🗂️',
      description: 'Gérer les catégories de produits',
    },
    {
      id: 'AdminServices',
      label: tCommon('web.servicesLabel', 'Services'),
      icon: '🔧',
      description: 'Gérer les services proposés',
    },
    {
      id: 'GestionUser',
      label: tCommon('web.manageUsers', 'User Manage'),
      icon: '👥',
      description: 'Gérer les utilisateurs et permissions',
    },
    {
      id: 'AdminGallery',
      label: tCommon('web.gallery.manageGallery', 'Manage Gallery'),
      icon: '🖼️',
      description: 'Gérer les images de la galerie',
    },
  ];

  return (
    <View className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <Text className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-8">
        {tCommon('web.manage', 'Manage')}
      </Text>

      <View className="flex flex-row flex-wrap -mx-3">
        {manageLinks.map(link => (
          <View key={link.id} className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
            <TouchableOpacity
              onPress={() => setActiveTab(link.id)}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
            >
              <View className="flex flex-row items-center mb-4">
                <Text className="text-4xl mr-4 text-slate-900 dark:text-slate-100">
                  {link.icon}
                </Text>
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {link.label}
                </Text>
              </View>
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                {link.description}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AdminManage;
