import React from 'react';
import { ServiceIcon, ServiceIconName } from '../../../components/ServiceIcon';
import { ProductVisual } from '../components/ProductSVGs';

interface HomeScreenWebProps {
  nextLanguage: string;
  experienceYears: number;
  supportWhatsAppDigits: string;
  galleryItems: any[];
  products: any[];
  favorites: string[];
  t: (key: string, options?: any) => string;
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (prod: any) => void;
  toggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const HomeScreenWeb: React.FC<HomeScreenWebProps> = ({
  experienceYears,
  supportWhatsAppDigits,
  galleryItems,
  products,
  favorites,
  t,
  setActiveTab,
  setSelectedProduct,
  toggleFavorite,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  return (
    <div className="animate-fade-in text-left bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-100">
      {/* Premium Hero Banner */}
      <section className="relative bg-[#0F172A] text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#F97316_0%,transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="bg-[#F97316] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
              Tunisie Dépannage Express 24h/7j
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-6 leading-tight">
              {tCommon(
                'web.homeHeroTitle',
                'Vos Urgences Plomberie Réglées en un Record',
              )}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-medium mt-4 max-w-xl">
              {tCommon(
                'web.homeHeroDescription',
                'Artisans loyalspins qualifiés à votre service pour les fuites, pannes thermiques et raccordements gaz dans tout le pays.',
              )}
            </p>

            {/* Action buttons CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <button
                onClick={() => setActiveTab('Zones')}
                className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-7 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transform"
              >
                <span>{t('contactez_experts')}</span>
              </button>

              <a
                href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                  t('whatsapp_msg'),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-7 py-4 rounded-xl transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transform"
              >
                <span>{t('whatsapp')} Support 24/7</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-slate-150 dark:bg-slate-900/60 py-10 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {
                val: `${experienceYears}+`,
                lbl: t('experience_lbl'),
                color: 'text-[#1E3A5F] dark:text-sky-400',
              },
              {
                val: t('dispo_val'),
                lbl: t('dispo_lbl'),
                color: 'text-[#F97316]',
              },
              {
                val: t('gov_val'),
                lbl: t('gov_lbl'),
                color: 'text-[#1E3A5F] dark:text-sky-400',
              },
              {
                val: t('satisfaction_val'),
                lbl: t('satisfaction_lbl'),
                color: 'text-emerald-500',
              },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}
                >
                  {stat.val}
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.lbl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Services Key Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-transparent">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight">
            {t('webServices.nos_services')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
            {t('webServices.nos_services_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(
            [
              {
                title: t('plomberie_generale'),
                icon: 'plumbing',
                desc: tCommon(
                  'web.servicePlumbingDesc',
                  'Recherche de fuites, installations de sanitaires et de chauffe-eau.',
                ),
              },
              {
                title: t('climatisation'),
                icon: 'ac',
                desc: tCommon(
                  'web.serviceAcDesc',
                  'Installation de climatiseurs split, recharges de gaz et entretien.',
                ),
              },
              {
                title: t('installation_gaz'),
                icon: 'gas',
                desc: tCommon(
                  'web.serviceGasDesc',
                  'Tuyauteries de gaz conformes, branchements et détection de fuites.',
                ),
              },
              {
                title: t('chauffage_central'),
                icon: 'heater',
                desc: tCommon(
                  'web.serviceHeatingDesc',
                  'Chaudières, détartrages de radiateurs et régulations connectées.',
                ),
              },
            ] as Array<{
              title: string;
              icon: ServiceIconName;
              desc: string;
            }>
          ).map((serv, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab('Services')}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:border-[#F97316] hover:shadow-lg transition-all duration-300 text-left group hover:-translate-y-1 transform focus:outline-none"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] dark:text-sky-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors mb-5">
                <ServiceIcon
                  name={serv.icon}
                  className="w-6 h-6"
                  title={serv.title}
                />
              </div>
              <h3 className="text-base font-black group-hover:text-[#F97316] transition-colors">
                {serv.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {serv.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setActiveTab('Services')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E3A5F] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-[#152a47] dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            {t('voir_tout')}
          </button>
        </div>
      </section>

      {/* Real Photo Gallery Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
              Galerie Réalisations
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {tCommon('web.gallerySectionTitle', 'Nos Réalisations en Images')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 max-w-2xl">
              {tCommon(
                'web.gallerySectionDescription',
                'Découvrez une sélection de projets réels ajoutés par l’administrateur, accompagnés de titres, sous-titres et descriptions.',
              )}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('Gallery')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#F97316] bg-transparent px-6 py-3 text-xs font-black uppercase tracking-wider text-[#F97316] shadow-sm transition hover:bg-[#F97316] hover:text-white"
          >
            {tCommon('web.viewGalleryButton', 'Voir la galerie')}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.imageUri}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {item.title}
                </div>
                {item.subtitle ? (
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </div>
                ) : null}
                {item.description ? (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}

          {galleryItems.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
              {tCommon(
                'web.homeEmptyGallery',
                'Aucune photo ajoutée pour le moment. Les réalisations réelles apparaîtront ici dès qu’elles seront publiées par l’administrateur.',
              )}
            </div>
          )}
        </div>
      </section>

      {/* Used Parts Showcase Grid */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                {t('pieces')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
                {tCommon(
                  'web.usedPartsDescription',
                  "Équipez-vous au meilleur prix avec nos pièces d'occasion révisées et testées.",
                )}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('Marketplace')}
              className="text-xs font-black text-[#F97316] hover:underline flex items-center gap-1.5"
            >
              <span>{t('boutique_acces')}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(prod => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1E3A5F] dark:hover:border-slate-500 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
              >
                {/* Product visual wrapper */}
                <div className="bg-slate-50 dark:bg-slate-900 py-10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
                  <span className="absolute top-3 right-3 z-10 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-350 text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    {prod.condition}
                  </span>

                  {/* Heart favorite toggle */}
                  <button
                    onClick={e => toggleFavorite(prod.id, e)}
                    className="absolute top-3 left-3 z-10 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={
                        favorites.includes(prod.id) ? 'currentColor' : 'none'
                      }
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={
                        favorites.includes(prod.id) ? 'text-rose-500' : ''
                      }
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <ProductVisual image={prod.image} />
                </div>

                <div className="p-4 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">
                      {prod.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 mt-1 leading-tight group-hover:text-[#F97316] transition-colors">
                      {prod.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-750 pt-3 mt-4">
                    <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                      {prod.price}{' '}
                      <span className="text-[9px] font-bold">DT</span>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                      }}
                      className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition"
                    >
                      {tCommon('web.buyButton', 'Commander')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomeScreenWeb;
