import React from 'react';

interface LegalPagesProps {
  page: 'Informations' | 'Politique' | 'Conditions' | 'PlanSite';
  t: any;
  setActiveTab: (tab: string) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  page,
  t,
  setActiveTab,
}) => {
  if (page === 'Informations') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div className="space-y-4 text-center">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {t.informations}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {t.informations}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t.informations_desc}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-10">
            {[
              {
                id: 'Politique',
                label: t.politique,
                desc: t.privacy_intro,
              },
              {
                id: 'Conditions',
                label: t.conditions_util,
                desc: t.terms_intro,
              },
              {
                id: 'PlanSite',
                label: t.plan_site,
                desc: t.sitemap_intro,
              },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="text-left bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 hover:border-[#F97316] transition"
              >
                <p className="text-xs uppercase font-black text-[#F97316]">
                  {item.label}
                </p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === 'Politique') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {t.politique}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {t.politique}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.privacy_intro}
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            {[t.privacy_point_1, t.privacy_point_2, t.privacy_point_3].map(
              (point, idx) => (
                <li
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  {point}
                </li>
              ),
            )}
          </ul>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('Informations')}
              className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316] transition"
            >
              {t.retour_accueil}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PlanSite')}
              className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F] transition"
            >
              {t.plan_site}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'Conditions') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              {t.conditions_util}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {t.conditions_util}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.terms_intro}
            </p>
          </div>

          <ol className="list-decimal list-inside space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200 font-semibold">
            <li>{t.terms_point_1}</li>
            <li>{t.terms_point_2}</li>
            <li>{t.terms_point_3}</li>
          </ol>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('Informations')}
              className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316] transition"
            >
              {t.retour_accueil}
            </button>
            <button
              onClick={() => setActiveTab('Politique')}
              className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F] transition"
            >
              {t.politique}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PlanSite
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
            {t.plan_site}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            {t.plan_site}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.sitemap_intro}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
          {[
            { label: t.sitemap_page_accueil, tab: 'Accueil' },
            { label: t.sitemap_page_services, tab: 'Services' },
            { label: t.sitemap_page_zones, tab: 'Zones' },
            { label: t.sitemap_page_pieces, tab: 'Marketplace' },
            { label: t.sitemap_page_profil, tab: 'Profile' },
            { label: t.sitemap_page_contact, tab: 'Profile' },
          ].map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActiveTab(item.tab)}
              className="text-left rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 hover:border-[#F97316] transition"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('Informations')}
            className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3A5F] hover:text-[#F97316] transition"
          >
            {t.retour_accueil}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Conditions')}
            className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316] hover:text-[#1E3A5F] transition"
          >
            {t.conditions_util}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LegalPages;
