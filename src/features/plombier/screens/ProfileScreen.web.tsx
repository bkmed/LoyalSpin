import React from 'react';
import { ProductVisual } from '../components/ProductSVGs';
import { Role } from '../utils/webTranslations';

interface ProfileScreenWebProps {
  currentRole: Role;
  businessName: string;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  profileCity: string;
  favorites: string[];
  products: any[];
  t: any;
  showToast: any;
  setBypassAuth: (bypass: boolean) => void;
  setSigninEmail: (email: string) => void;
  setSigninPassword: (password: string) => void;
  setActiveTab: (tab: string) => void;
  toggleFavorite: (id: string, e: React.MouseEvent) => void;
  setSelectedProduct: (prod: any) => void;
}

export const ProfileScreenWeb: React.FC<ProfileScreenWebProps> = ({
  currentRole,
  businessName,
  profileName,
  profileEmail,
  profilePhone,
  profileCity,
  favorites,
  products,
  t,
  showToast,
  setBypassAuth,
  setSigninEmail,
  setSigninPassword,
  setActiveTab,
  toggleFavorite,
  setSelectedProduct,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const [currentMdp, setCurrentMdp] = React.useState('');
  const [newMdp, setNewMdp] = React.useState('');
  const [newsletterEmail, setNewsletterEmail] = React.useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      {currentRole === 'anonyme' ? (
        // GUEST CONNEXION PROMPT STATE
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 mx-auto">
            🔒
          </div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-slate-100">
            {tCommon('web.profileLoginRequiredTitle', 'Identification Requise')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
            {tCommon(
              'web.profileLoginRequiredDescription',
              `Rejoignez ${businessName} pour sauvegarder vos pièces favorites, demander des interventions immédiates en priorité et modifier votre mot de passe.`,
            )}
          </p>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setBypassAuth(false);
                setSigninEmail('');
                setSigninPassword('');
              }}
              className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
            >
              {tCommon(
                'web.profileLoginButton',
                "Accéder à l'écran de connexion",
              )}
            </button>
            <button
              onClick={() => setActiveTab('Accueil')}
              className="text-xs font-black text-slate-400 hover:text-slate-655"
            >
              {t.retour_accueil}
            </button>
          </div>
        </div>
      ) : (
        // LOGGED CLIENT INTERFACE
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {t.tableau_bord}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
            {t.tableau_bord_desc}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
            {/* Left details (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Client Card */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#1E3A5F] to-[#F97316] p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 font-black text-2xl">
                    {profileName.charAt(0) || 'U'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-850 dark:text-slate-100">
                    {profileName}
                  </h3>
                  <span className="inline-block mt-1 text-[9px] font-black px-3 py-1 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                    {t.compte_particulier}
                  </span>
                </div>

                {/* Profile information */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-3.5 text-left font-semibold text-xs text-slate-500 dark:text-slate-450">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                      Email
                    </span>
                    <p className="font-black text-slate-800 dark:text-slate-200">
                      {profileEmail}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                      {t.telephone}
                    </span>
                    <p className="font-black text-slate-800 dark:text-slate-200">
                      {profilePhone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                      {t.ville}
                    </span>
                    <p className="font-black text-slate-800 dark:text-slate-200">
                      {profileCity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security details updates */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {t.securite}
                </h3>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!currentMdp || !newMdp) return;
                    showToast(
                      tCommon(
                        'web.profilePasswordUpdated',
                        'Sécurité mise à jour avec succès !',
                      ),
                      'success',
                    );
                    setCurrentMdp('');
                    setNewMdp('');
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t.mdp_actuel}
                    </label>
                    <input
                      type="password"
                      required
                      value={currentMdp}
                      onChange={e => setCurrentMdp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t.nouveau_mdp}
                    </label>
                    <input
                      type="password"
                      required
                      value={newMdp}
                      onChange={e => setNewMdp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[11px] font-black py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
                  >
                    {t.mettre_a_jour}
                  </button>
                </form>
              </div>

              {/* Payment maintenance card (moved into Profile) */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {t.maintenance}
                </span>

                <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">
                  {t.bientot_dispo}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
                  {t.maintenance_desc}
                </p>

                <div className="space-y-3 pt-4 max-w-full">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{t.progression}</span>
                    <span className="text-[#F97316]">85%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#F97316] rounded-full"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">
                    Tests d'homologation de sécurité SSL et cryptage en cours
                    avec la SMT.
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
                  <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center">
                    {tCommon(
                      'web.profileNotifyMeHeader',
                      "M'avertir lors de la mise en service",
                    )}
                  </h4>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!newsletterEmail) return;
                      showToast(
                        tCommon(
                          'web.profileNewsletterSuccess',
                          'Merci ! Vous recevrez une alerte prioritaire.',
                        ),
                        'success',
                      );
                      setNewsletterEmail('');
                    }}
                    className="mt-3 flex gap-2"
                  >
                    <input
                      type="email"
                      required
                      placeholder="votre.email@domaine.tn"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black px-4 py-3 rounded-xl transition"
                    >
                      {t.avertir}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Favorites grid (lg:col-span-8) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {t.mes_favoris}
                </h3>
                <button
                  onClick={() => setActiveTab('Marketplace')}
                  className="text-xs font-black text-[#F97316] hover:underline"
                >
                  {t.parcourir_market}
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="border border-dashed border-slate-350 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3">
                  <p className="text-xs text-slate-400 font-bold">
                    {t.plus_favoris_desc}
                  </p>
                  <button
                    onClick={() => setActiveTab('Marketplace')}
                    className="bg-slate-100 dark:bg-slate-750 px-4 py-2 rounded-xl text-xs font-black"
                  >
                    {t.boutique_acces}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {favorites.map(id => {
                    const prod = products.find(p => p.id === id);
                    if (!prod) return null;
                    return (
                      <div
                        key={prod.id}
                        className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between"
                      >
                        <div className="bg-slate-50 dark:bg-slate-900 py-6 flex items-center justify-center relative">
                          <button
                            onClick={e => toggleFavorite(prod.id, e)}
                            className="absolute top-2 right-2 w-7.5 h-7.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition"
                          >
                            ✕
                          </button>
                          <ProductVisual
                            image={prod.image}
                            className="w-12 h-12"
                          />
                        </div>

                        <div className="p-4 space-y-4">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                                {prod.title}
                              </h4>
                              <span className="text-xs font-black text-[#F97316] whitespace-nowrap">
                                {prod.price} DT
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {prod.description}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedProduct(prod)}
                            className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black py-2.5 rounded-lg transition"
                          >
                            {t.consulter}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileScreenWeb;
