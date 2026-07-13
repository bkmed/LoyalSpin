import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useSelector } from 'react-redux';
import { useToast } from '../../../context/ToastContext';
import { RootState } from '../../../store';
import { selectAllProjects, selectProjectById } from '../../../store/slices/projectsSlice';

import AdminStats from './admin/AdminStats';
import AdminRoulette from './admin/AdminRoulette';
import AdminSticker from './AdminSticker';
import AdminCoupons from './admin/AdminCoupons';
import AdminHistory from './admin/AdminHistory';
import { AdminUsers } from './AdminUsers';
import AdminSettings from './admin/AdminSettings';

export default function AdminDashboard({ businessName, navigation }: any) {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const projects = useSelector(selectAllProjects);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'roulette' | 'sticker' | 'coupons' | 'history' | 'settings'>('stats');

  const adminProjectId =
    user?.projectId || projects.find(project => project.adminId === user?.id)?.id || null;

  const project = useSelector((state: RootState) =>
    adminProjectId ? selectProjectById(adminProjectId)(state) : null,
  );

  const nextLanguage =
    i18n.language === 'fr' ? 'en' : i18n.language === 'en' ? 'ar' : 'fr';

  const handleToggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const handleToggleLanguage = () => {
    i18n.changeLanguage(nextLanguage);
  };

  const languageLabel =
    i18n.language === 'ar'
      ? t('languages.languageLabelAR', 'العربية')
      : i18n.language === 'en'
      ? t('languages.languageLabelEN', 'English')
      : t('languages.languageLabelFR', 'Français');

  const languageNextLabel =
    nextLanguage === 'ar'
      ? t('languages.languageLabelAR', 'العربية')
      : nextLanguage === 'en'
      ? t('languages.languageLabelEN', 'English')
      : t('languages.languageLabelFR', 'Français');

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats />;
      case 'roulette':
        return <AdminRoulette />;
      case 'sticker':
        return <AdminSticker />;
      case 'coupons':
        return <AdminCoupons />;
      case 'users':
        return <AdminUsers t={t} showToast={showToast} projectId={project?.id ?? adminProjectId} />;
      case 'history':
        return <AdminHistory />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <View className="flex-1 flex-row bg-slate-50 dark:bg-[#0B0F19]">
      {/* Sidebar */}
      <View className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
        <View className="px-4 mb-4">
          <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">
            {t('adminDashboard.headerTitle', { businessName, defaultValue: `Admin ${businessName}` })}
          </Text>
          {project?.name ? (
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {t('adminDashboard.projectLabel', 'Project')}: {project.name}
            </Text>
          ) : (
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {t('adminDashboard.noProjectAssigned', 'No project assigned yet.')}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 mb-4"
          >
            <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
              {t('common.viewEditProfile', 'Voir / modifier mon profil')}
            </Text>
          </TouchableOpacity>
          <View className="flex-row flex-wrap gap-2 items-center">
            <TouchableOpacity
              onPress={handleToggleTheme}
              className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-2"
            >
              <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
                {themeMode === 'dark'
                  ? t('common.themeLight', 'Mode clair')
                  : t('common.themeDark', 'Mode sombre')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleLanguage}
              className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-2"
            >
              <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
                {t('common.languageSwitcher', 'Lang')}: {languageLabel} → {languageNextLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="space-y-2">
          <TouchableOpacity 
            onPress={() => setActiveTab('stats')}
            className={`p-4 rounded-xl ${activeTab === 'stats' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'stats' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.stats', 'Statistics')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('roulette')}
            className={`p-4 rounded-xl ${activeTab === 'roulette' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'roulette' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.roulette', 'Roulette Settings')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('sticker')}
            className={`p-4 rounded-xl ${activeTab === 'sticker' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'sticker' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.sticker', 'Sticker Design')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('coupons')}
            className={`p-4 rounded-xl ${activeTab === 'coupons' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'coupons' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.coupons', 'Coupons Management')}</Text>
          </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => setActiveTab('users')}
            className={`p-4 rounded-xl ${activeTab === 'users' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'users' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.users', 'Users')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('history')}
            className={`p-4 rounded-xl ${activeTab === 'history' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'history' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.history', 'History & Clients')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('settings')}
            className={`p-4 rounded-xl ${activeTab === 'settings' ? 'bg-[#1E3A5F]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Text className={`font-bold ${activeTab === 'settings' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t('adminDashboard.tabs.settings', 'Project Settings')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-8">
        {renderContent()}
      </ScrollView>
    </View>
  );
}
