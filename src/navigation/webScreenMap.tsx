import React from 'react';
import { View } from 'react-native';
import HomeScreen from '../features/plombier/screens/HomeScreen';
import ServicesScreen from '../features/plombier/screens/ServicesScreen';
import ZonesScreen from '../features/plombier/screens/ZonesScreen';
import MarketplaceScreen from '../features/plombier/screens/MarketplaceScreen';
import GalleryScreen from '../features/plombier/screens/GalleryScreen';
import ProfileScreen from '../features/plombier/screens/ProfileScreen';
import LegalPages from '../features/plombier/screens/LegalPages';
import AdminDashboard from '../features/plombier/screens/AdminDashboard';
import AdminAnnonces from '../features/plombier/screens/AdminAnnonces';
import AdminCategories from '../features/plombier/screens/AdminCategories';
import AdminGalleryEditor from '../features/plombier/screens/AdminGalleryEditor';
import AdminServicesEditor from '../features/plombier/screens/AdminServicesEditor';
import AdminUsers from '../features/plombier/screens/AdminUsers';
import AdminProfileScreen from '../features/plombier/screens/AdminProfileScreen';
import AdminAnalyticsScreen from '../features/plombier/screens/AdminAnalyticsScreen';

interface WebScreenMapProps {
  activeTab: string;
  nextLanguage: string;
  experienceYears: number;
  dispoVal: string;
  govVal: string;
  supportWhatsAppDigits: string;
  galleryItems: any[];
  products: any[];
  favorites: string[];
  translate: any;
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (prod: any) => void;
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  supportWhatsAppNumber: string;
  interventionZones: string[];
  usersList?: any[];
  reduxCategories?: any[];
  currentRole: string;
  currentLang: string;
  businessName: string;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  profileCity: string;
  showToast: any;
  setBypassAuth: (bypass: boolean) => void;
  setSigninEmail: (email: string) => void;
  setSigninPassword: (password: string) => void;
}

export const renderWebScreen = ({
  activeTab,
  nextLanguage,
  experienceYears,
  dispoVal,
  govVal,
  supportWhatsAppDigits,
  galleryItems,
  products,
  favorites,
  translate,
  setActiveTab,
  setSelectedProduct,
  toggleFavorite,
  supportWhatsAppNumber,
  interventionZones,
  usersList,
  reduxCategories,
  currentRole,
  currentLang,
  businessName,
  profileName,
  profileEmail,
  profilePhone,
  profileCity,
  showToast,
  setBypassAuth,
  setSigninEmail,
  setSigninPassword,
}: WebScreenMapProps) => {
  switch (activeTab) {
    case 'Accueil':
      return (
        <HomeScreen
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
      );
    case 'Services':
      return <ServicesScreen supportWhatsAppDigits={supportWhatsAppDigits} />;
    case 'Zones':
      return (
        <ZonesScreen
          t={translate}
          supportWhatsAppDigits={supportWhatsAppDigits}
          supportWhatsAppNumber={supportWhatsAppNumber}
          interventionZones={interventionZones}
        />
      );
    case 'Marketplace':
      return (
        <MarketplaceScreen
          t={translate}
          setSelectedProduct={setSelectedProduct}
        />
      );
    case 'Gallery':
      return (
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
          <GalleryScreen />
        </View>
      );
    case 'Profile':
      return (
        <ProfileScreen
          currentRole={currentRole as any}
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
          setSigninEmail={setSigninEmail}
          setSigninPassword={setSigninPassword}
          setActiveTab={setActiveTab}
          toggleFavorite={toggleFavorite}
          setSelectedProduct={setSelectedProduct}
        />
      );
    case 'Informations':
    case 'Politique':
    case 'Conditions':
    case 'PlanSite':
      return (
        <LegalPages
          page={activeTab as any}
          t={translate}
          setActiveTab={setActiveTab}
        />
      );
    case 'AdminAccueil':
      return (
        <AdminDashboard
          t={translate}
          businessName={businessName}
          products={products}
          setActiveTab={setActiveTab}
        />
      );
    case 'GestionAnnonce':
      return <AdminAnnonces showToast={showToast} translate={translate} />;
    case 'GestionCategorie':
      return <AdminCategories showToast={showToast} translate={translate} />;
    case 'AdminGallery':
      return (
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
          <AdminGalleryEditor />
        </View>
      );
    case 'AdminServices':
      return (
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
          <AdminServicesEditor />
        </View>
      );
    case 'GestionUser':
      return <AdminUsers showToast={showToast} t={translate} />;
    case 'AdminProfile':
      return (
        <AdminProfileScreen currentLang={currentLang as any} t={translate} />
      );
    case 'Analytics':
      return <AdminAnalyticsScreen t={translate} />;
    default:
      return null;
  }
};
