import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useColorScheme } from 'nativewind';
import { RootState } from '../store';
import {
  setActiveTab as setActiveTabAction,
  setCurrentLang as setCurrentLangAction,
  setCurrentTheme as setCurrentThemeAction,
  setBypassAuth as setBypassAuthAction,
} from '../store/slices/uiSlice';
import {
  setSessionUser,
  setCurrentRole,
  clearSession,
} from '../store/slices/webSessionSlice';
import { addCategory } from '../store/slices/categoriesSlice';
import { setServices } from '../store/slices/servicesSlice';
import { toggleFavoriteAction } from '../store/slices/partsSlice';

// Shared Components & Screens
import { WebSplashScreen } from '../features/loyalspin/components/WebSplashScreen';
import { WebAuthScreen } from '../features/loyalspin/screens/WebAuthScreen';
import { WebNavbar } from '../features/loyalspin/components/WebNavbar';
import { WebFooter } from '../features/loyalspin/components/WebFooter';
import { ProductDetailModal } from '../features/loyalspin/components/ProductDetailModal';

// Screens
import LandingScreen from '../features/loyalspin/screens/LandingScreen';
import HomeScreenWeb from '../features/loyalspin/screens/HomeScreen';
import ServicesScreen from '../features/loyalspin/screens/ServicesScreen';
import ZonesScreen from '../features/loyalspin/screens/ZonesScreen';
import MarketplaceScreen from '../features/loyalspin/screens/MarketplaceScreen';
import GalleryScreen from '../features/loyalspin/screens/GalleryScreen';
import ProfileScreenWeb from '../features/loyalspin/screens/ProfileScreen';
import UserDashboardMobile from '../features/loyalspin/screens/UserDashboardMobile';
import CouponMobile from '../features/loyalspin/screens/CouponMobile';
import PurchaseHistory from '../features/loyalspin/screens/PurchaseHistory';
import NotificationsScreen from '../features/loyalspin/screens/NotificationsScreen';
import LegalPages from '../features/loyalspin/screens/LegalPages';
import AdminDashboard from '../features/loyalspin/screens/AdminDashboard';
import AdminAnnonces from '../features/loyalspin/screens/AdminAnnonces';
import AdminCategories from '../features/loyalspin/screens/AdminCategories';
import SuperAdminDashboard from '../features/loyalspin/screens/SuperAdminDashboard';
import AdminUsers from '../features/loyalspin/screens/AdminUsers';
import AdminProfileScreen from '../features/loyalspin/screens/AdminProfileScreen';
import AdminAnalyticsScreen from '../features/loyalspin/screens/AdminAnalyticsScreen';
import AdminGalleryEditor from '../features/loyalspin/screens/AdminGalleryEditor';
import AdminServicesEditor from '../features/loyalspin/screens/AdminServicesEditor';
import AdminRoulette from '../features/loyalspin/screens/AdminRoulette';
import AdminSticker from '../features/loyalspin/screens/AdminSticker';
import AdminSettings from '../features/loyalspin/screens/AdminSettings';
import AdminManage from '../features/loyalspin/screens/AdminManage';
import DemoOnboardingScreen from '../features/loyalspin/screens/DemoOnboardingScreen';
import DemoDashboardScreen from '../features/loyalspin/screens/DemoDashboardScreen';

import {
  Role,
  WebSessionUser,
  LocalCategory,
} from '../features/loyalspin/utils/webTranslations';
import { User } from '../services/authService';

export const AppNavigator = () => {
  const { setColorScheme } = useColorScheme();
  const { user: authUser, signIn, signOut } = useAuth();
  const { showToast } = useToast();
  const { t: translate, i18n } = useTranslation();

  const dispatch = useDispatch();
  const products = useSelector(
    (state: RootState) => state.parts?.listings || [],
  );
  const favorites = useSelector(
    (state: RootState) => state.parts?.favorites || [],
  );
  const reduxCategories = useSelector(
    (state: RootState) => state.categories?.items || [],
  );

  const galleryItems = useSelector(
    (state: RootState) => state.gallery?.items || [],
  );
  const plombierSettings =
    useSelector((state: RootState) => state.plombierSettings) || ({} as any);
  const uiState = useSelector((state: RootState) => state.ui) || ({} as any);
  const {
    currentLang = 'FR',
    currentTheme = 'light',
    activeTab = 'Accueil',
    bypassAuth = false,
  } = uiState;

  const { sessionUser, currentRole } =
    useSelector((state: RootState) => (state as any).webSession) || {};

  // Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showDemoOnboarding, setShowDemoOnboarding] = useState(false);
  const [showDemoDashboard, setShowDemoDashboard] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const galleryTitle = translate('web.gallery.title', {
    defaultValue: 'Galerie',
  });
  const galleryManageLabel = translate('web.gallery.manageGallery', {
    defaultValue: 'Gérer la galerie',
  });
  const isRTL = i18n.language === 'ar';
  const businessName =
    isRTL && plombierSettings.businessNameAr
      ? plombierSettings.businessNameAr
      : plombierSettings.businessName || 'Plombier Tunisie';
  const experienceYears = plombierSettings.experienceYears || 15;
  const dispoVal =
    plombierSettings.dispoVal ||
    translate('web.dispo_val', { defaultValue: '24/7' });
  const govVal =
    plombierSettings.govVal || translate('web.gov_val', { defaultValue: '24' });
  const languageOrder: Array<'FR' | 'AR' | 'EN'> = ['FR', 'AR', 'EN'];
  const nextLanguage =
    languageOrder[
      (languageOrder.indexOf(currentLang) + 1) % languageOrder.length
    ];

  const profileName = sessionUser?.name || '';
  const profileEmail = sessionUser?.email || '';
  const profilePhone = sessionUser?.phone || '';
  const profileCity = sessionUser?.city || '';

  const supportEmail =
    plombierSettings.supportEmail || profileEmail || sessionUser?.email || '';
  const supportWhatsAppNumber =
    plombierSettings.supportPhone || profilePhone || sessionUser?.phone || '';
  const supportWhatsAppDigits = supportWhatsAppNumber.replace(/\D/g, '');
  const tCommon = (key: string, defaultValue: string) =>
    translate(key, { defaultValue });

  const setActiveTab = (tab: string) => dispatch(setActiveTabAction(tab));
  const setCurrentLang = (lang: 'FR' | 'AR' | 'EN') =>
    dispatch(setCurrentLangAction(lang));
  const setCurrentTheme = (theme: 'light' | 'dark') =>
    dispatch(setCurrentThemeAction(theme));
  const setBypassAuth = (value: boolean) =>
    dispatch(setBypassAuthAction(value));

  const startWebSession = async (userData: WebSessionUser, tab: string) => {
    dispatch(setSessionUser(userData));
    dispatch(setCurrentRole(userData.role as Role));
    setBypassAuth(true);
    setActiveTab(tab);
    await signIn(userData as unknown as User);
  };

  const handleLogout = async () => {
    dispatch(clearSession());
    setBypassAuth(false);
    setActiveTab('Accueil');
    await signOut();
    showToast(
      tCommon('web.logoutSuccess', 'Déconnexion réussie ! A bientôt.'),
      'info',
    );
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentRole === 'anonyme') {
      showToast(
        tCommon(
          'web.favoriteLoginRequired',
          'Veuillez vous connecter pour gérer vos favoris.',
        ),
        'info',
      );
      return;
    }
    dispatch(toggleFavoriteAction(id));
    if (favorites.includes(id)) {
      showToast(tCommon('web.favoriteRemoved', 'Retiré des favoris'), 'info');
    } else {
      showToast(
        tCommon('web.favoriteAdded', 'Ajouté aux favoris !'),
        'success',
      );
    }
  };

  const handleViewDemo = () => {
    setShowLandingPage(false);
    setShowDemoOnboarding(true);
  };

  const handleFinishDemo = () => {
    setShowDemoOnboarding(false);
    setShowDemoDashboard(true);
  };

  const closeDemoOnboarding = () => {
    setShowDemoOnboarding(false);
    setShowDemoDashboard(false);
    setShowLandingPage(true);
  };

  // Seed Initial state
  useEffect(() => {
    if (reduxCategories.length === 0) {
      const initialCats: LocalCategory[] = [
        {
          id: 'cat-1',
          name: 'Robinetterie',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-2',
          name: 'Chauffe-eau',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-3',
          name: 'Canalisation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-4',
          name: 'Climatisation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-5',
          name: 'Radiateurs',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-6',
          name: 'Vannes',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat-7',
          name: 'Autre',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      initialCats.forEach(cat => dispatch(addCategory(cat)));
    }
    const servicesSeeded = (window as any).__initialServicesSeeded;
    if (!servicesSeeded) {
      const initialServices = [
        {
          id: 'srv-1',
          name: 'plomberie_generale',
          icon: 'plumbing',
          desc: 'plomberie_desc_long',
          pts: ['plomberie_desc_1', 'plomberie_desc_2', 'plomberie_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_plomberie',
          imgAfter: 'service_after_plomberie',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'srv-2',
          name: 'climatisation',
          icon: 'ac',
          desc: 'clim_desc_long',
          pts: ['clim_desc_1', 'clim_desc_2', 'clim_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_clim',
          imgAfter: 'service_after_clim',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'srv-3',
          name: 'installation_gaz',
          icon: 'gas',
          desc: 'gaz_desc_long',
          pts: ['gaz_desc_1', 'gaz_desc_2', 'gaz_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_gaz',
          imgAfter: 'service_after_gaz',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'srv-4',
          name: 'chauffage_central',
          icon: 'heater',
          desc: 'chauffage_desc_long',
          pts: ['chauffage_desc_1', 'chauffage_desc_2', 'chauffage_desc_3'],
          whatsappText: 'devis_msg',
          imgBefore: 'service_before_chauffage',
          imgAfter: 'service_after_chauffage',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      dispatch(setServices(initialServices));
      (window as any).__initialServicesSeeded = true;
    }
  }, [reduxCategories, dispatch]);

  useEffect(() => {
    i18n.changeLanguage(currentLang.toLowerCase());
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang, i18n]);

  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 22 + 9;
      if (prog >= 100) {
        prog = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setShowSplash(false), 450);
      } else {
        setLoadingProgress(Math.round(prog));
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authUser) {
      dispatch(clearSession());
      setBypassAuth(false);
      setActiveTab('Accueil');
      setShowLandingPage(true);
      return;
    }
    const restoredUser: WebSessionUser = {
      ...authUser,
      role: authUser.role as Role,
      city: authUser.addresses?.[0] || 'Tunis',
      status: authUser.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(setSessionUser(restoredUser));
    dispatch(setCurrentRole(restoredUser.role as Role));
    setBypassAuth(true);
    if (!sessionUser) {
      if (restoredUser.role === 'super-admin')
        setActiveTab('SuperAdminAccueil');
      else
        setActiveTab(
          restoredUser.role === 'admin' ? 'AdminAccueil' : 'Accueil',
        );
    }
  }, [authUser]);

  useEffect(() => {
    setColorScheme(currentTheme);
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme, setColorScheme]);

  useEffect(() => {
    document.title = businessName ? `${businessName} | Plombier` : 'Plombier';
  }, [businessName]);

  return (
    <View
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        currentTheme === 'dark'
          ? 'bg-[#0B0F19] text-slate-100'
          : 'bg-slate-50 text-slate-800'
      }`}
    >
      <WebSplashScreen
        showSplash={showSplash}
        loadingProgress={loadingProgress}
        businessName={businessName}
        t={translate}
      />

      {!bypassAuth && !sessionUser && showLandingPage && (
        <LandingScreen
          businessName={businessName}
          currentTheme={currentTheme}
          nextLanguage={nextLanguage}
          setCurrentLang={setCurrentLang}
          setCurrentTheme={setCurrentTheme}
          t={translate}
          setShowLandingPage={setShowLandingPage}
          onViewDemo={handleViewDemo}
        />
      )}

      {!bypassAuth && !sessionUser && showDemoOnboarding && (
        <DemoOnboardingScreen
          isDarkMode={currentTheme === 'dark'}
          onFinish={handleFinishDemo}
        />
      )}

      {!bypassAuth && !sessionUser && showDemoDashboard && (
        <View className="flex-1">
          <View className="absolute top-4 right-4 z-50">
            <TouchableOpacity
              onPress={closeDemoOnboarding}
              className={`p-2 rounded-lg ${
                currentTheme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>
          <DemoDashboardScreen isDarkMode={currentTheme === 'dark'} />
        </View>
      )}

      {!bypassAuth && !sessionUser && !showLandingPage && !showDemoOnboarding && !showDemoDashboard && (
        <WebAuthScreen
          businessName={businessName}
          nextLanguage={nextLanguage}
          currentTheme={currentTheme}
          setCurrentLang={setCurrentLang}
          setCurrentTheme={setCurrentTheme}
          t={translate}
          showToast={showToast}
          startWebSession={startWebSession}
          setBypassAuth={setBypassAuth}
          setCurrentRole={role => dispatch(setCurrentRole(role))}
          setSessionUser={user => dispatch(setSessionUser(user))}
          setActiveTab={setActiveTab}
        />
      )}

      {(bypassAuth || sessionUser) && (
        <WebNavbar
          businessName={businessName}
          nextLanguage={nextLanguage}
          currentTheme={currentTheme}
          currentRole={currentRole}
          sessionUser={sessionUser}
          activeTab={activeTab}
          isRTL={isRTL}
          galleryManageLabel={galleryManageLabel}
          galleryTitle={galleryTitle}
          t={translate}
          setActiveTab={setActiveTab}
          setCurrentLang={setCurrentLang}
          setCurrentTheme={setCurrentTheme}
          handleLogout={handleLogout}
          setBypassAuth={setBypassAuth}
          setSessionUser={user => dispatch(setSessionUser(user))}
        />
      )}

      {(bypassAuth || sessionUser) && (
        <main className="min-h-[calc(100vh-280px)] bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-100 transition-colors duration-300">
          {activeTab === 'Accueil' && (
            <HomeScreenWeb
              nextLanguage={nextLanguage}
              experienceYears={experienceYears}
              dispoVal={dispoVal}
              govVal={govVal}
              supportWhatsAppDigits={supportWhatsAppDigits}
              galleryItems={galleryItems}
              products={products}
              favorites={favorites}
              t={translate}
              setActiveTab={setActiveTab}
              setSelectedProduct={setSelectedProduct}
              toggleFavorite={toggleFavorite}
            />
          )}

          {activeTab === 'Services' && (
            <ServicesScreen supportWhatsAppDigits={supportWhatsAppDigits} />
          )}

          {activeTab === 'Zones' && (
            <ZonesScreen
              t={translate}
              supportWhatsAppDigits={supportWhatsAppDigits}
              supportWhatsAppNumber={supportWhatsAppNumber}
              interventionZones={plombierSettings.interventionZones}
            />
          )}

          {activeTab === 'Marketplace' && (
            <MarketplaceScreen
              t={translate}
              setSelectedProduct={setSelectedProduct}
            />
          )}

          {activeTab === 'Gallery' && (
            <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <GalleryScreen />
            </View>
          )}

          {activeTab === 'Profile' && (
            <ProfileScreenWeb
              currentRole={currentRole}
              businessName={businessName}
              profileName={profileName}
              profileEmail={profileEmail}
              profilePhone={profilePhone}
              profileCity={profileCity}
              favorites={favorites}
              products={products}
              t={translate}
              showToast={showToast}
              setBypassAuth={setBypassAuth}
              setSigninEmail={() => {}}
              setSigninPassword={() => {}}
              setActiveTab={setActiveTab}
              toggleFavorite={toggleFavorite}
              setSelectedProduct={setSelectedProduct}
            />
          )}

          {activeTab === 'UserDashboard' && (
            <UserDashboardMobile t={translate} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'UserCoupons' && <CouponMobile t={translate} />}

          {activeTab === 'UserPurchaseHistory' && (
            <PurchaseHistory t={translate} />
          )}

          {activeTab === 'UserNotifications' && (
            <NotificationsScreen t={translate} />
          )}

          {['Informations', 'Politique', 'Conditions', 'PlanSite'].includes(
            activeTab,
          ) && (
            <LegalPages
              page={activeTab as any}
              t={translate}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'SuperAdminAccueil' && (
            <SuperAdminDashboard t={translate} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'AdminAccueil' && (
            <AdminDashboard
              t={translate}
              businessName={businessName}
              products={products}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'AdminRoulette' && <AdminRoulette t={translate} />}

          {activeTab === 'AdminSticker' && <AdminSticker t={translate} />}

          {activeTab === 'AdminSettings' && <AdminSettings t={translate} />}

          {activeTab === 'AdminManage' && (
            <AdminManage t={translate} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'GestionAnnonce' && (
            <AdminAnnonces showToast={showToast} translate={translate} />
          )}

          {activeTab === 'GestionCategorie' && (
            <AdminCategories showToast={showToast} translate={translate} />
          )}

          {activeTab === 'AdminGallery' && (
            <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <AdminGalleryEditor />
            </View>
          )}

          {activeTab === 'AdminServices' && (
            <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <AdminServicesEditor />
            </View>
          )}

          {activeTab === 'GestionUser' && (
            <AdminUsers showToast={showToast} t={translate} />
          )}

          {activeTab === 'AdminProfile' && (
            <AdminProfileScreen
              currentLang={currentLang as any}
              t={translate}
            />
          )}

          {activeTab === 'Analytics' && <AdminAnalyticsScreen t={translate} />}
        </main>
      )}

      <ProductDetailModal
        selectedProduct={selectedProduct}
        supportWhatsAppDigits={supportWhatsAppDigits}
        t={translate}
        setSelectedProduct={setSelectedProduct}
      />

      {(bypassAuth || sessionUser) && (
        <WebFooter
          businessName={businessName}
          currentTheme={currentTheme}
          currentRole={currentRole}
          supportWhatsAppDigits={supportWhatsAppDigits}
          supportWhatsAppNumber={supportWhatsAppNumber}
          supportEmail={supportEmail}
          t={translate}
          setActiveTab={setActiveTab}
        />
      )}
    </View>
  );
};
export default AppNavigator;
