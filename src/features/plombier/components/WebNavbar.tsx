import React from 'react';
import { LogoSVG } from './LogoSVG';
import { Role, WebSessionUser } from '../utils/webTranslations';

interface WebNavbarProps {
  businessName: string;
  nextLanguage: string;
  currentTheme: string;
  currentRole: Role;
  sessionUser: WebSessionUser | null;
  activeTab: string;
  isRTL: boolean;
  galleryManageLabel: string;
  galleryTitle: string;
  t: any;
  setActiveTab: (tab: string) => void;
  setCurrentLang: (lang: any) => void;
  setCurrentTheme: (theme: any) => void;
  handleLogout: () => void;
  setBypassAuth: (bypass: boolean) => void;
  setSessionUser: (user: WebSessionUser | null) => void;
}

export const WebNavbar: React.FC<WebNavbarProps> = ({
  businessName,
  nextLanguage,
  currentTheme,
  currentRole,
  sessionUser,
  activeTab,
  isRTL,
  galleryManageLabel,
  galleryTitle,
  t,
  setActiveTab,
  setCurrentLang,
  setCurrentTheme,
  handleLogout,
  setBypassAuth,
  setSessionUser,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors backdrop-blur-md ${
        currentTheme === 'dark'
          ? 'bg-[#0F172A]/90 border-slate-800'
          : 'bg-white/95 border-slate-200'
      } shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo area */}
        <button
          onClick={() => {
            if (currentRole === 'admin') {
              setActiveTab('AdminAccueil');
            } else {
              setActiveTab('Accueil');
            }
          }}
          className="flex items-center gap-3 focus:outline-none"
        >
          <LogoSVG size={44} />
          <div className="text-left">
            <span
              className={`text-xl font-black tracking-tight ${
                isRTL ? 'font-arabic font-extrabold' : ''
              }`}
            >
              {businessName}
            </span>
            <p className="text-[9px] text-[#F97316] font-bold tracking-widest uppercase mt-0.5 leading-none">
              {t('tagline')}
            </p>
          </div>
        </button>

        {/* Navigation Tabs based on Role */}
        <nav className="hidden lg:flex items-center gap-7 font-black text-xs uppercase tracking-wider">
          {currentRole === 'admin'
            ? [
                {
                  id: 'AdminAccueil',
                  label: tCommon('web.adminHome', 'Accueil'),
                },
                {
                  id: 'GestionAnnonce',
                  label: tCommon('web.manageAds', 'Gestion Annonce'),
                },
                {
                  id: 'GestionCategorie',
                  label: tCommon('web.manageCategories', 'Gestion Catégorie'),
                },
                {
                  id: 'AdminGallery',
                  label: tCommon(
                    'web.gallery.manageGallery',
                    galleryManageLabel,
                  ),
                },
                {
                  id: 'AdminServices',
                  label: tCommon('web.servicesLabel', 'Services'),
                },
                {
                  id: 'GestionUser',
                  label: tCommon('web.manageUsers', 'Gestion User'),
                },
                {
                  id: 'AdminProfile',
                  label: tCommon('web.adminProfile', 'Profil'),
                },
                {
                  id: 'Analytics',
                  label: tCommon('web.analyticsLabel', 'Analytics'),
                },
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`transition-colors py-2.5 relative leading-none ${
                    activeTab === link.id
                      ? 'text-[#F97316]'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{link.label}</span>
                  {activeTab === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                  )}
                </button>
              ))
            : [
                {
                  id: 'Accueil',
                  label: t('web.accueil', { defaultValue: 'Accueil' }),
                },
                {
                  id: 'Services',
                  label: t('web.services', { defaultValue: 'Services' }),
                },
                {
                  id: 'Zones',
                  label: t('web.zones', { defaultValue: 'Zones' }),
                },
                {
                  id: 'Marketplace',
                  label: t('web.pieces', { defaultValue: 'Marketplace' }),
                },
                { id: 'Gallery', label: galleryTitle },
                {
                  id: 'Profile',
                  label: t('web.mon_profil', { defaultValue: 'Mon profil' }),
                },
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`transition-colors py-2.5 relative leading-none ${
                    activeTab === link.id
                      ? 'text-[#F97316]'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{link.label}</span>
                  {activeTab === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                  )}
                </button>
              ))}
        </nav>

        {/* Utility Preferences Header Right */}
        <div className="flex items-center gap-3 sm:gap-4 ml-3">
          {/* Language toggle button */}
          <button
            onClick={() => setCurrentLang(nextLanguage)}
            className="min-h-[44px] min-w-[44px] px-3 rounded-lg border text-[11px] font-black shadow-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {nextLanguage}
          </button>

          {/* Dark mode toggler */}
          <button
            onClick={() =>
              setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
            }
            className="w-9 h-9 rounded-lg border flex items-center justify-center bg-slate-50 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
          >
            {currentTheme === 'light' ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-amber-400"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
              </svg>
            )}
          </button>

          {/* Logged user badge & Logout option */}
          <div className="flex items-center gap-2">
            {currentRole === 'anonyme' ? (
              <button
                onClick={() => {
                  setBypassAuth(false);
                  setSessionUser(null);
                }}
                className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-4.5 py-2.5 rounded-xl transition shadow-md"
              >
                {tCommon('web.loginAction', "Connexion / S'inscrire")}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs font-black bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 text-[#1E3A5F] dark:text-sky-400 px-3 py-1.5 rounded-lg border border-[#1E3A5F]/10">
                  {sessionUser?.name} ({currentRole.toUpperCase()})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow-md"
                  title={tCommon('web.logoutAction', 'Déconnexion')}
                >
                  {tCommon('web.logoutAction', 'Déconnexion')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Mobile Nav Header Toggles */}
      <div className="lg:hidden flex overflow-x-auto border-t border-slate-200 dark:border-slate-800 px-4 py-2 gap-3 text-center no-scrollbar">
        {currentRole === 'admin'
          ? [
              {
                id: 'AdminAccueil',
                label: tCommon('web.adminHome', 'Accueil'),
              },
              {
                id: 'GestionAnnonce',
                label: tCommon('web.manageAds', 'Annonces'),
              },
              {
                id: 'GestionCategorie',
                label: tCommon('web.manageCategories', 'Catégories'),
              },
              {
                id: 'AdminGallery',
                label: tCommon('web.gallery.manageGallery', galleryManageLabel),
              },
              {
                id: 'AdminServices',
                label: tCommon('web.servicesLabel', 'Services'),
              },
              {
                id: 'GestionUser',
                label: tCommon('web.adminUsers', 'Membres'),
              },
              {
                id: 'AdminProfile',
                label: tCommon('web.adminProfile', 'Profil'),
              },
              {
                id: 'Analytics',
                label: tCommon('web.analyticsLabel', 'Analytics'),
              },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition ${
                  activeTab === link.id
                    ? 'bg-[#F97316] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {link.label}
              </button>
            ))
          : [
              {
                id: 'Accueil',
                label: t('web.accueil', { defaultValue: 'Accueil' }),
              },
              {
                id: 'Services',
                label: t('web.services', { defaultValue: 'Services' }),
              },
              {
                id: 'Zones',
                label: t('web.zones', { defaultValue: 'Zones' }),
              },
              {
                id: 'Marketplace',
                label: t('web.pieces', { defaultValue: 'Marketplace' }),
              },
              { id: 'Gallery', label: galleryTitle },
              {
                id: 'Profile',
                label: t('web.mon_profil', { defaultValue: 'Mon profil' }),
              },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition ${
                  activeTab === link.id
                    ? 'bg-[#F97316] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {link.label}
              </button>
            ))}
      </div>
    </header>
  );
};
export default WebNavbar;
