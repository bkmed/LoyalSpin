import React from 'react';
import { LogoSVG } from './LogoSVG';

interface WebSplashScreenProps {
  showSplash: boolean;
  loadingProgress: number;
  businessName: string;
  t: (key: string, options?: any) => string;
}

export const WebSplashScreen: React.FC<WebSplashScreenProps> = ({
  showSplash,
  loadingProgress,
  businessName,
  t,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  if (!showSplash) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0F2942',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s ease',
        opacity: loadingProgress === 100 ? 0 : 1,
      }}
    >
      <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
        <LogoSVG size={96} />
      </div>
      <div className="text-center mb-8">
        <div className="text-white text-3xl font-black tracking-tight leading-tight">
          {businessName}
        </div>
        <div className="text-[#F97316] text-[10px] sm:text-xs font-black tracking-widest uppercase mt-2.5">
          {t('tagline')}
        </div>
        <div className="text-slate-400/60 text-xs font-bold mt-2">
          {tCommon(
            'web.splashServiceList',
            'سباكة · تكييف · غاز · تدفئة مركزية',
          )}
        </div>
      </div>

      {/* Loading bar */}
      <div className="w-56 mt-4 mb-3">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #F97316, #ea580c)',
              borderRadius: 99,
              width: `${loadingProgress}%`,
              transition: 'width 0.15s ease',
            }}
          />
        </div>
      </div>
      <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
        {t('web.loadingPremium', {
          defaultValue: 'Chargement premium...',
        })}{' '}
        {loadingProgress}%
      </div>
    </div>
  );
};
