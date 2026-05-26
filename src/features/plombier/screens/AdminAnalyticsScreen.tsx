import React from 'react';

interface AdminAnalyticsScreenProps {
  t: any;
}

const AdminAnalyticsScreen = ({ t }: AdminAnalyticsScreenProps) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <h1 className="text-3xl font-black tracking-tight">
        {tCommon(
          'admin.analyticsTitle',
          'Financial and service performance metrics',
        )}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'admin.analyticsDescription',
          'Review revenue charts and service request trends in one dashboard.',
        )}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: tCommon('admin.avgResponseTime', 'Average response time'),
            value: '18 min',
            detail: tCommon('admin.urgentRequests', 'Urgent requests'),
          },
          {
            label: tCommon('admin.avgOrderValue', 'Average order value'),
            value: '164 DT',
            detail: tCommon('admin.usedParts', 'Used parts'),
          },
          {
            label: tCommon('admin.openLeads', 'Open leads'),
            value: '27',
            detail: tCommon('admin.thisWeek', 'This week'),
          },
          {
            label: tCommon('admin.conversionRate', 'Conversion rate'),
            value: '31%',
            detail: tCommon('admin.whatsappToOrder', 'WhatsApp to order'),
          },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
          >
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
              {metric.label}
            </span>
            <strong className="mt-2 block text-2xl font-black text-slate-850 dark:text-white">
              {metric.value}
            </strong>
            <span className="mt-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {metric.detail}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider">
            {tCommon(
              'admin.monthlyRevenueChartTitle',
              'Monthly revenue evolution (TND)',
            )}
          </h3>
          <div className="space-y-4 pt-4">
            {[
              { month: 'Janvier', val: 3400, percent: '45%' },
              { month: 'Février', val: 4800, percent: '60%' },
              { month: 'Mars', val: 5100, percent: '65%' },
              { month: 'Avril', val: 6800, percent: '80%' },
              { month: 'Mai (Encours)', val: 8200, percent: '100%' },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>{row.month}</span>
                  <span className="font-black text-slate-800 dark:text-white">
                    {row.val.toFixed(3)} DT
                  </span>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-[#1E3A5F] rounded-lg transition-all duration-500"
                    style={{ width: row.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider">
            {tCommon(
              'admin.serviceDemandBreakdownTitle',
              'Service request allocation (%)',
            )}
          </h3>
          <div className="space-y-5 pt-4 text-xs font-bold text-slate-500">
            {[
              { name: t.plomberie_generale, share: 45, color: 'bg-blue-500' },
              { name: t.chauffage_central, share: 25, color: 'bg-amber-500' },
              { name: t.climatisation, share: 20, color: 'bg-emerald-500' },
              { name: t.installation_gaz, share: 10, color: 'bg-rose-500' },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                    <span>{row.name}</span>
                  </span>
                  <span>{row.share}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color}`}
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider">
            Performance par région
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { region: 'Grand Tunis', requests: 42, satisfaction: '98%' },
              { region: 'Sahel', requests: 26, satisfaction: '96%' },
              { region: 'Sfax', requests: 14, satisfaction: '94%' },
            ].map(row => (
              <div
                key={row.region}
                className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {row.region}
                </span>
                <div className="mt-3 text-xl font-black text-slate-850 dark:text-white">
                  {row.requests}
                </div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {row.satisfaction} satisfaction
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider">
            Alertes stock
          </h3>
          <div className="space-y-3 mt-6 text-xs font-semibold">
            {[
              'Robinetterie: 3 références à renouveler',
              'Chauffe-eau: forte demande cette semaine',
              'Vannes: marge moyenne +12%',
            ].map(item => (
              <div
                key={item}
                className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900 px-3 py-2 text-amber-700 dark:text-amber-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsScreen;
