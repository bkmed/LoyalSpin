import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';

interface CouponMobileProps {
  t: any;
}

const getCoupons = (tCommon: any) => [
  {
    id: 'coupon-1',
    title: tCommon('web.coupons.items.1.title', '15% de réduction'),
    code: 'LOYAL15',
    expiry: '31/12/2026',
    description: tCommon(
      'web.coupons.items.1.description',
      'Réduction utilisable sur votre prochaine récompense LoyalSpin.',
    ),
    status: tCommon('web.coupons.items.1.status', 'Actif'),
  },
  {
    id: 'coupon-2',
    title: tCommon('web.coupons.items.2.title', 'Livraison offerte'),
    code: 'FREEDEL',
    expiry: '30/09/2026',
    description: tCommon(
      'web.coupons.items.2.description',
      'Livraison gratuite sur toute commande dans le catalogue.',
    ),
    status: tCommon('web.coupons.items.2.status', 'Actif'),
  },
  {
    id: 'coupon-3',
    title: tCommon('web.coupons.items.3.title', '10 DT offerts'),
    code: 'BONUS10',
    expiry: '15/07/2026',
    description: tCommon(
      'web.coupons.items.3.description',
      'Offre spéciale fidélité pour les 10 premiers clients du mois.',
    ),
    status: tCommon('web.coupons.items.3.status', 'Expiré'),
  },
];

const CouponMobile: React.FC<CouponMobileProps> = ({ t }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Tous' | 'Actif' | 'Expiré'>('Tous');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const filteredCoupons = useMemo(
    () =>
      getCoupons(tCommon).filter(coupon => {
        const matchesFilter =
          filter === 'Tous'
            ? true
            : coupon.status ===
              tCommon(`web.coupons.items.status.${filter}`, filter);
        const matchesSearch =
          coupon.title.toLowerCase().includes(search.toLowerCase()) ||
          coupon.code.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [filter, search, t],
  );

  const onCopyCode = (code: string) => {
    if (Platform.OS === 'web' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    Alert.alert(
      tCommon('web.coupons.copied', 'Code copié !'),
      `${code} ${tCommon(
        'web.coupons.copiedSuffix',
        'a été copié dans le presse-papiers.',
      )}`,
    );
  };

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

      <View className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={tCommon(
            'web.coupons.searchPlaceholder',
            'Chercher un coupon...',
          )}
          className="w-full sm:w-1/2 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-5 py-3 text-sm text-slate-900 dark:text-white focus:border-[#F97316]"
        />
        <View className="inline-flex rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-1">
          {['Tous', 'Actif', 'Expiré'].map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilter(status as any)}
              className={`rounded-3xl px-4 py-2 text-sm font-black transition ${
                filter === status
                  ? 'bg-[#F97316] text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {tCommon(`web.coupons.filter.${status}`, status)}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-8 grid gap-6 lg:grid-cols-2">
        {filteredCoupons.map(coupon => (
          <View
            key={coupon.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm"
          >
            <View className="flex items-center justify-between gap-4">
              <View>
                <Text className="text-sm font-black uppercase tracking-[0.24em] text-amber-500">
                  {coupon.title}
                </Text>
                <Text className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
                  {coupon.code}
                </Text>
              </View>
              <View className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-slate-700 dark:text-slate-300">
                {coupon.status}
              </View>
            </View>

            <Text className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {coupon.description}
            </Text>

            <View className="mt-6 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Text>
                {tCommon('web.coupons.expiry', 'Valide jusqu’au')}{' '}
                {coupon.expiry}
              </Text>
            </View>

            <View className="mt-6 grid gap-3 sm:grid-cols-2">
              <TouchableOpacity
                onPress={() =>
                  setSelectedId(coupon.id === selectedId ? null : coupon.id)
                }
                className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-black text-slate-900 dark:text-white hover:bg-[#F97316]/10 transition"
              >
                {tCommon('web.coupons.showQr', 'Voir le QR')}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onCopyCode(coupon.code)}
                className="rounded-3xl bg-[#1E3A5F] px-4 py-3 text-sm font-black text-white hover:bg-[#152a47] transition"
              >
                {tCommon('web.coupons.copyCode', 'Copier le code')}
              </TouchableOpacity>
            </View>

            {selectedId === coupon.id && (
              <View className="mt-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 text-center">
                <View className="mx-auto mb-4 h-36 w-36 rounded-3xl bg-slate-200 dark:bg-slate-800 grid place-items-center">
                  <Text className="text-sm font-black text-slate-600 dark:text-slate-300">
                    {tCommon('web.coupons.qrPlaceholder', 'QR Code')}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {tCommon(
                    'web.coupons.presentAtCheckout',
                    'Montrez ce QR à la caisse pour valider votre coupon.',
                  )}
                </Text>
              </View>
            )}
          </View>
        ))}

        {filteredCoupons.length === 0 && (
          <View className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-10 text-center">
            <Text className="text-sm font-black text-slate-900 dark:text-white">
              {tCommon('web.coupons.empty', 'Aucun coupon trouvé.')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CouponMobile;
