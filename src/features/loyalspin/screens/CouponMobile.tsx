import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CouponMobileProps {
  t: any;
}

const coupons = [
  {
    id: 'coupon-1',
    title: '15% de réduction',
    code: 'LOYAL15',
    expiry: '31/12/2026',
    description: 'Réduction utilisable sur votre prochain service plomberie.',
    status: 'Actif',
  },
  {
    id: 'coupon-2',
    title: 'Livraison offerte',
    code: 'FREEDEL',
    expiry: '30/09/2026',
    description: 'Livraison gratuite sur toute commande dans le catalogue.',
    status: 'Actif',
  },
  {
    id: 'coupon-3',
    title: '10 DT offerts',
    code: 'BONUS10',
    expiry: '15/07/2026',
    description:
      'Offre spéciale fidélité pour les 10 premiers clients du mois.',
    status: 'Bientôt',
  },
];

const CouponMobile: React.FC<CouponMobileProps> = ({ t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black text-slate-900 dark:text-white">
        {tCommon('web.coupons.title', 'Mes coupons fidélité')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl">
        {tCommon(
          'web.coupons.subtitle',
          'Utilisez vos bons exclusifs pour économiser sur vos prochaines interventions.',
        )}
      </Text>

      <View className="mt-10 grid gap-6 lg:grid-cols-3">
        {coupons.map(coupon => (
          <View
            key={coupon.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm"
          >
            <Text className="text-sm font-black uppercase tracking-[0.24em] text-amber-500">
              {coupon.title}
            </Text>
            <Text className="mt-5 text-3xl font-black text-slate-900 dark:text-white">
              {coupon.code}
            </Text>
            <Text className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {coupon.description}
            </Text>
            <View className="mt-6 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Text>
                {tCommon('web.coupons.expiry', 'Valide jusqu’au')}{' '}
                {coupon.expiry}
              </Text>
              <Text>
                {tCommon('web.coupons.status', 'Statut')} : {coupon.status}
              </Text>
            </View>
            <TouchableOpacity className="mt-6 inline-flex items-center justify-center rounded-3xl bg-[#1E3A5F] px-5 py-3 text-sm font-black text-white hover:bg-[#152a47] transition">
              {tCommon('web.coupons.useNow', 'Utiliser maintenant')}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CouponMobile;
