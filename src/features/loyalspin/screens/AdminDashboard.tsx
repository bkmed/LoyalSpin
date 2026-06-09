import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  selectTotalPageViews,
  selectTotalShares,
  selectCallClicks,
  selectPageViews,
} from '../../../store/slices/analyticsSlice';
import { useSubscriptionGuard } from '../../../context/SubscriptionGuardContext';
import { TrialBanner } from '../../../components/TrialBanner';
import { selectAllCategories } from '../../../store/slices/categoriesSlice';
import { selectAllUsers } from '../../../store/slices/usersSlice';
import { selectGalleryItems } from '../../../store/slices/gallerySlice';
import { selectServices } from '../../../store/slices/servicesSlice';

interface AdminDashboardProps {
  businessName: string;
  products: any[];
  t: any;
  setActiveTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businessName,
  products,
  t,
  setActiveTab,
}) => {
  const tCommon = (
    key: string,
    defaultValue: string,
    options?: Record<string, any>,
  ) => t(key, { defaultValue, ...options });

  const nav = (tab: string) => () => setActiveTab && setActiveTab(tab);

  const categories = useSelector(selectAllCategories) || [];
  const users = useSelector(selectAllUsers) || [];
  const webSession =
    useSelector((state: RootState) => (state as any).webSession) || {};
  const sessionUser = webSession.sessionUser;
  const currentRole = webSession.currentRole as any;

  const myClients = React.useMemo(() => {
    if (currentRole === 'super-admin') return users;
    if (!sessionUser) return [];
    return users.filter(
      u => u.managerId === sessionUser.id || u.id === sessionUser.id,
    );
  }, [users, sessionUser, currentRole]);
  const galleryItems = useSelector(selectGalleryItems) || [];

  const { isTrialActive } = useSubscriptionGuard();
  const services = useSelector(selectServices) || [];

  const totalViews = useSelector(selectTotalPageViews);
  const totalShares = useSelector(selectTotalShares);
  const callClicks = useSelector(selectCallClicks);
  const pageViewsMap = useSelector(selectPageViews) || {};

  const overviewCards = [
    {
      title: tCommon('adminAnnonces.title', 'Annonces'),
      count: products.length,
      desc: tCommon('admin.activeListingsDesc', 'Fiches dans le catalogue'),
      icon: '📦',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      countColor: 'text-blue-600 dark:text-blue-400',
      tab: 'GestionAnnonce',
    },
    {
      title: tCommon('admin.categoriesTitle', 'Catégories'),
      count: categories.length,
      desc: tCommon('admin.categoriesDesc', 'Familles de produits'),
      icon: '🗂️',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      countColor: 'text-purple-600 dark:text-purple-400',
      tab: 'GestionCategorie',
    },
    {
      title: tCommon('webServices.services_title', 'Services'),
      count: services.length,
      desc: tCommon(
        'admin.servicesInterventionsDesc',
        "Services d'interventions",
      ),
      icon: '🔧',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      countColor: 'text-amber-600 dark:text-amber-400',
      tab: 'AdminServices',
    },
    {
      title: tCommon('admin.registeredUsersTitle', 'Utilisateurs'),
      count: currentRole === 'super-admin' ? users.length : myClients.length,
      desc:
        currentRole === 'super-admin'
          ? tCommon('admin.registeredUsersDesc', 'Membres inscrits')
          : tCommon('admin.myClientsDesc', 'Mes clients'),
      icon: '👥',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      countColor: 'text-emerald-600 dark:text-emerald-400',
      tab: 'GestionUser',
    },
    {
      title: tCommon('gallery.title', 'Galerie'),
      count: galleryItems.length,
      desc: tCommon('admin.galleryPhotosDesc', 'Photos de réalisations'),
      icon: '🖼️',
      iconBg: 'bg-rose-100 dark:bg-rose-900/40',
      countColor: 'text-rose-600 dark:text-rose-400',
      tab: 'AdminGallery',
    },
  ];

  const quickActions = [
    {
      id: 'GestionAnnonce',
      label: tCommon('admin.manageProducts', 'Gérer les Annonces'),
      desc: tCommon(
        'admin.manageProductsDesc',
        'Créez de nouvelles fiches produits et gérez les disponibilités.',
      ),
      icon: '📢',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'GestionCategorie',
      label: tCommon('admin.manageCategories', 'Gérer les Catégories'),
      desc: tCommon(
        'admin.manageCategoriesDesc',
        'Organisez vos familles de produits et pièces.',
      ),
      icon: '🗂️',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'AdminServices',
      label: tCommon('admin.manageServicesLabel', 'Gérer les Services'),
      desc: tCommon(
        'admin.manageServicesDesc',
        'Modifiez les services proposés et les illustrations avant/après.',
      ),
      icon: '🔧',
      iconBg: 'bg-amber-500',
    },
    {
      id: 'GestionUser',
      label: tCommon('web.manageUsers', 'Gérer les Utilisateurs'),
      desc: tCommon(
        'admin.manageUsersDesc',
        'Gérez les comptes membres, mettez à jour les rôles et permissions.',
      ),
      icon: '👥',
      iconBg: 'bg-emerald-500',
    },
    {
      id: 'AdminGallery',
      label: tCommon('admin.manageGalleryLabel', 'Gérer la Galerie'),
      desc: tCommon(
        'admin.manageGalleryDesc',
        'Ajoutez, modifiez ou supprimez des photos de réalisations.',
      ),
      icon: '🖼️',
      iconBg: 'bg-rose-500',
    },
    {
      id: 'AdminProfile',
      label: tCommon('admin.adminProfileTitle', 'Identité & Profil'),
      desc: tCommon(
        'admin.adminProfileDesc',
        'Configurez le nom du site, contact WhatsApp et sécurité.',
      ),
      icon: '⚙️',
      iconBg: 'bg-slate-600',
    },
    {
      id: 'Analytics',
      label: tCommon('admin.globalAnalytics', 'Statistiques Détaillées'),
      desc: tCommon(
        'admin.globalAnalyticsDesc',
        "Visualisez les graphiques de visites, taux d'engagement et partages.",
      ),
      icon: '📈',
      iconBg: 'bg-indigo-500',
    },
  ];

  const metrics = [
    {
      label: tCommon('admin.totalViews', 'Vues'),
      value: totalViews,
      color: 'text-sky-600 dark:text-sky-400',
    },
    {
      label: tCommon('admin.totalShares', 'Partages'),
      value: totalShares,
      color: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: tCommon('admin.callClicks', 'Appels'),
      value: callClicks,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* ── Hero Banner ── */}
      <View className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-3xl p-8 sm:p-10 mb-10 overflow-hidden relative">
        <View className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#fff_0%,transparent_60%)] pointer-events-none" />
        <View className="flex-row items-center gap-2 self-start bg-white/20 rounded-full px-4 py-1.5 mb-5">
          <View className="w-2 h-2 rounded-full bg-emerald-400" />
          <Text className="text-white text-[11px] font-bold">
            {tCommon('admin.adminConsole', "Console d'Administration")}
          </Text>
        </View>
        <Text className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-2">
          {tCommon('common.welcome', 'Bienvenue')},{' '}
          {tCommon('admin.defaultAdminName', 'Admin')} 👋
        </Text>
        <Text className="text-indigo-200 text-sm font-medium max-w-lg leading-relaxed">
          {t('admin.dashboardDescription', {
            defaultValue: `Gérez l'activité globale, le catalogue et les configurations pour ${businessName}.`,
            businessName,
          })}
        </Text>
      </View>

      {isTrialActive && (
        <TrialBanner onChoosePlan={() => setActiveTab?.('AdminAccueil')} />
      )}

      {/* ── Overview Stats ── */}
      <Text className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
        {tCommon('admin.status', "Vue d'Ensemble")}
      </Text>
      <View className="flex-row flex-wrap gap-3 mb-10">
        {overviewCards.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={nav(item.tab)}
            className="flex-1 min-w-[130px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View
                className={`w-10 h-10 rounded-xl items-center justify-center ${item.iconBg}`}
              >
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className={`text-2xl font-black ${item.countColor}`}>
                {item.count}
              </Text>
            </View>
            <Text className="text-xs font-black text-slate-800 dark:text-slate-100 mb-0.5">
              {item.title}
            </Text>
            <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              {item.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Bottom Grid ── */}
      <View className="flex-row flex-wrap gap-6 items-start">
        {/* Quick Actions */}
        <View className="flex-[2] min-w-[280px]">
          <Text className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            {tCommon('admin.quickActions', 'Raccourcis de Gestion')}
          </Text>
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-2 shadow-sm">
            {quickActions.map((action, idx) => (
              <TouchableOpacity
                key={action.id}
                onPress={nav(action.id)}
                className={`flex-row items-center gap-4 px-3 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                  idx < quickActions.length - 1
                    ? 'border-b border-slate-100 dark:border-slate-700/50'
                    : ''
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center ${action.iconBg}`}
                >
                  <Text className="text-lg">{action.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-black text-slate-800 dark:text-slate-100 mb-0.5">
                    {action.label}
                  </Text>
                  <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                    {action.desc}
                  </Text>
                </View>
                <Text className="text-slate-300 dark:text-slate-600 text-xl font-bold">
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Panel */}
        <View className="flex-1 min-w-[240px]">
          <Text className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            {tCommon('admin.globalAnalytics', 'Activité & Trafic')}
          </Text>
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm gap-4">
            {/* Metric pills */}
            <View className="flex-row gap-2">
              {metrics.map((m, i) => (
                <View
                  key={i}
                  className="flex-1 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-3 items-center"
                >
                  <Text className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                    {m.label}
                  </Text>
                  <Text className={`text-xl font-black ${m.color}`}>
                    {m.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Top pages */}
            <View>
              <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                {tCommon(
                  'admin.viewedPagesDetailTitle',
                  'Pages les plus consultées',
                )}
              </Text>
              {Object.entries(pageViewsMap).length === 0 ? (
                <Text className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
                  {tCommon(
                    'admin.noPageViewsData',
                    'Aucune page consultée pour le moment.',
                  )}
                </Text>
              ) : (
                Object.entries(pageViewsMap)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .slice(0, 3)
                  .map(([page, views], idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                    >
                      <Text
                        className="text-xs font-bold text-slate-700 dark:text-slate-200 flex-1"
                        numberOfLines={1}
                      >
                        {page}
                      </Text>
                      <Text className="text-[10px] font-black text-indigo-500 dark:text-indigo-400">
                        {views as number}{' '}
                        {tCommon('admin.viewsCount', 'vue(s)')}
                      </Text>
                    </View>
                  ))
              )}
            </View>

            {/* Analytics link */}
            <TouchableOpacity
              onPress={nav('Analytics')}
              className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <Text className="text-xs font-black text-slate-600 dark:text-slate-300">
                {tCommon('admin.globalAnalytics', 'Statistiques Détaillées')} →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminDashboard;
