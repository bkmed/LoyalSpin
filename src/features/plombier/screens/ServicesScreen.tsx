import React from 'react';
import { ServiceIcon, ServiceIconName } from '../../../components/ServiceIcon';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectServices } from '../../../store/slices/servicesSlice';
import { useTranslation } from 'react-i18next';

const ServicesScreen = ({
  supportWhatsAppDigits,
}: {
  supportWhatsAppDigits?: string;
}) => {
  const services = useSelector((state: RootState) => selectServices(state));
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left bg-slate-50 dark:bg-transparent">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
          {t('webServices.nos_services')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">
          {t('webServices.nos_services')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">
          {t('webServices.nos_services_subtitle')}
        </p>
      </div>

      <div className="space-y-16">
        {services.map((service, idx) => (
          <div
            key={service.name}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-slate-200 dark:border-slate-800 pb-16 last:border-b-0 last:pb-0 ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white font-extrabold text-sm">
                  <ServiceIcon
                    name={service.icon as ServiceIconName}
                    className="w-5 h-5"
                    title={t(`services_local.${service.name}`)}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-slate-100">
                  {t(`services_local.${service.name}`)}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-405 leading-relaxed font-semibold">
                {service.desc ? t(`services_local.${service.desc}`) : ''}
              </p>

              <ul className="space-y-2.5 font-bold text-xs text-slate-650 dark:text-slate-300">
                {service.pts &&
                  service.pts.map((point: string, idx2: number) => (
                    <li key={idx2} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span>{t(`services_local.${point}`)}</span>
                    </li>
                  ))}
              </ul>

              <a
                href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                  (service.whatsappText ? t(service.whatsappText) : '') +
                    ' ' +
                    t(`services_local.${service.name}`),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-6 py-3.5 rounded-xl transition shadow-md hover:scale-[1.02] transform"
              >
                <span>{t('demander_devis')}</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <span className="absolute top-2.5 left-2.5 bg-slate-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase">
                  {t('services_local.before_intervention')}
                </span>
                <div className="flex-1 flex items-center justify-center p-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight mt-6">
                  {service.imgBefore
                    ? t(`services_local.${service.imgBefore}`)
                    : ''}
                </div>
                <div className="h-1 bg-amber-500 rounded-full w-full" />
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded uppercase">
                  {t('services_local.after_intervention')}
                </span>
                <div className="flex-1 flex items-center justify-center p-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase leading-tight mt-6">
                  {service.imgAfter
                    ? t(`services_local.${service.imgAfter}`)
                    : ''}
                </div>
                <div className="h-1 bg-emerald-500 rounded-full w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesScreen;
