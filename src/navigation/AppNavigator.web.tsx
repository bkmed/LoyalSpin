import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
import { addService } from '../store/slices/servicesSlice';
import { toggleFavoriteAction } from '../store/slices/partsSlice';

// Shared Components & Screens
import { WebSplashScreen } from '../features/loyalspin/components/WebSplashScreen';
import { WebAuthScreen } from '../features/loyalspin/screens/WebAuthScreen';
import { WebNavbar } from '../features/loyalspin/components/WebNavbar';
import { WebFooter } from '../features/loyalspin/components/WebFooter';
import { ProductDetailModal } from '../features/loyalspin/components/ProductDetailModal';

// Screens
import HomeScreenWeb from '../features/loyalspin/screens/HomeScreen.web';
import ServicesScreen from '../features/loyalspin/screens/ServicesScreen';
import ZonesScreen from '../features/loyalspin/screens/ZonesScreen';
import MarketplaceScreen from '../features/loyalspin/screens/MarketplaceScreen';
import GalleryScreen from '../features/loyalspin/screens/GalleryScreen';
import ProfileScreenWeb from '../features/loyalspin/screens/ProfileScreen.web';
import LegalPages from '../features/loyalspin/screens/LegalPages';
import AdminDashboard from '../features/loyalspin/screens/AdminDashboard';
import AdminAnnonces from '../features/loyalspin/screens/AdminAnnonces';
import AdminCategories from '../features/loyalspin/screens/AdminCategories';
import AdminUsers from '../features/loyalspin/screens/AdminUsers';
import AdminProfileScreen from '../features/loyalspin/screens/AdminProfileScreen';
import AdminAnalyticsScreen from '../features/loyalspin/screens/AdminAnalyticsScreen';
import AdminGalleryEditor from '../features/loyalspin/screens/AdminGalleryEditor';
import AdminServicesEditor from '../features/loyalspin/screens/AdminServicesEditor';

import {
  Role,
  WebSessionUser,
  LocalCategory,
} from '../features/loyalspin/utils/webTranslations';
import { User } from '../services/authService';

export const AppNavigator = () => {
  const { user: authUser, signIn, signOut } = useAuth();
  const { showToast } = useToast();
  const { t: translate, i18n } = useTranslation();

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.parts.listings);
  const favorites = useSelector((state: RootState) => state.parts.favorites);
  const reduxCategories = useSelector(
    (state: RootState) => state.categories.items,
  );
  const usersList = useSelector((state: RootState) => state.users.items);
  const galleryItems = useSelector((state: RootState) => state.gallery.items);
  const loyalspinSettings = useSelector(
    (state: RootState) => state.loyalspinSettings,
  );
  const uiState = useSelector((state: RootState) => state.ui);
  const { currentLang, currentTheme, activeTab, bypassAuth } = uiState;

  const { sessionUser, currentRole } = useSelector(
    (state: RootState) => (state as any).webSession,
  );

  // Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const galleryTitle = translate('web.gallery.title', {
    defaultValue: 'Galerie',
  });
  const galleryManageLabel = translate('web.gallery.manageGallery', {
    defaultValue: 'Gérer la galerie',
  });
  const isRTL = i18n.language === 'ar';
  const businessName = loyalspinSettings.businessName || 'LoyalSpin Tunisie';
  const experienceYears = loyalspinSettings.experienceYears || 15;
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
    loyalspinSettings.supportEmail || profileEmail || sessionUser?.email || '';
  const supportWhatsAppNumber =
    loyalspinSettings.supportPhone || profilePhone || sessionUser?.phone || '';
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
      initialServices.forEach(s => dispatch(addService(s)));
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
      setBypassAuth(true);
      setActiveTab('Accueil');
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
      setActiveTab(restoredUser.role === 'admin' ? 'AdminAccueil' : 'Accueil');
    }
  }, [authUser]);

  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  useEffect(() => {
    document.title = businessName ? `${businessName} | LoyalSpin` : 'LoyalSpin';
  }, [businessName]);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        currentTheme === 'dark'
          ? 'bg-[#0B0F19] text-slate-100'
          : 'bg-slate-50 text-slate-800'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <WebSplashScreen
        showSplash={showSplash}
        loadingProgress={loadingProgress}
        businessName={businessName}
        t={translate}
      />

      {!bypassAuth && !sessionUser && (
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
              interventionZones={loyalspinSettings.interventionZones}
            />
          )}

          {activeTab === 'Marketplace' && (
            <MarketplaceScreen
              t={translate}
              setSelectedProduct={setSelectedProduct}
            />
          )}

          {activeTab === 'Gallery' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <GalleryScreen />
            </div>
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

          {['Informations', 'Politique', 'Conditions', 'PlanSite'].includes(
            activeTab,
          ) && (
            <LegalPages
              page={activeTab as any}
              t={translate}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'AdminAccueil' && (
            <AdminDashboard
              t={translate}
              businessName={businessName}
              products={products}
              reduxCategories={reduxCategories}
              usersList={usersList}
            />
          )}

          {activeTab === 'GestionAnnonce' && (
            <AdminAnnonces showToast={showToast} translate={translate} />
          )}

          {activeTab === 'GestionCategorie' && (
            <AdminCategories showToast={showToast} translate={translate} />
          )}

          {activeTab === 'AdminGallery' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <AdminGalleryEditor />
            </div>
          )}

          {activeTab === 'AdminServices' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
              <AdminServicesEditor />
            </div>
          )}

          {activeTab === 'GestionUser' && (
            <AdminUsers showToast={showToast} t={translate} />
          )}

          {activeTab === 'AdminProfile' && (
            <AdminProfileScreen currentLang={currentLang} t={translate} />
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
    </div>
  );
};
export default AppNavigator;
