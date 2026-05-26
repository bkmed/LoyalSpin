import React from 'react';
import FooterLinks from './FooterLinks';
import { Role } from '../utils/webTranslations';

interface WebFooterProps {
  businessName: string;
  currentTheme: string;
  currentRole: Role;
  supportWhatsAppDigits: string;
  supportWhatsAppNumber: string;
  supportEmail: string;
  t: any;
  setActiveTab: (tab: string) => void;
}

export const WebFooter: React.FC<WebFooterProps> = ({
  businessName,
  currentTheme,
  currentRole,
  supportWhatsAppDigits,
  supportWhatsAppNumber,
  supportEmail,
  t,
  setActiveTab,
}) => {
  return (
    <>
      <footer
        className={`border-t transition-colors ${
          currentTheme === 'dark'
            ? 'bg-[#0B0F19] border-slate-800 text-slate-400'
            : 'bg-slate-100 border-slate-200 text-slate-600'
        } py-12`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div className="space-y-4">
            <span className="text-lg font-black text-slate-850 dark:text-slate-105 flex items-center gap-2">
              🛠️ {businessName}
            </span>
            <p className="text-xs leading-relaxed font-semibold">
              {t.foot_desc}
            </p>
          </div>

          <FooterLinks
            setActiveTab={setActiveTab}
            currentRole={currentRole}
            supportWhatsAppDigits={supportWhatsAppDigits}
            supportWhatsAppNumber={supportWhatsAppNumber}
            supportEmail={supportEmail}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-880 mt-10 pt-6 text-center text-xs font-bold">
          {t.credits}
        </div>
      </footer>

      {currentRole !== 'admin' && (
        <a
          href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
            t.whatsapp_msg,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="WhatsApp Support Urgent"
        >
          💬
        </a>
      )}
    </>
  );
};
export default WebFooter;
