import React from 'react';
import { View, Text } from 'react-native';

interface PurchaseHistoryProps {
  t: any;
}

const orders = [
  {
    id: 'order-1172',
    date: '05/06/2026',
    total: '42 DT',
    status: 'Livré',
    items: ['Remplacement de joint', 'Visite technique'],
  },
  {
    id: 'order-1159',
    date: '24/05/2026',
    total: '85 DT',
    status: 'En cours',
    items: ['Dépannage chauffe-eau', 'Contrôle pression'],
  },
  {
    id: 'order-1080',
    date: '12/04/2026',
    total: '26 DT',
    status: 'Réglé',
    items: ['Remplacement robinet'],
  },
];

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black text-slate-900 dark:text-white">
        {tCommon('web.history.title', 'Historique de vos achats')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl">
        {tCommon(
          'web.history.subtitle',
          'Retrouvez les interventions, paiements et détails de chaque commande.',
        )}
      </Text>

      <View className="mt-10 space-y-4">
        {orders.map(order => (
          <View
            key={order.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm"
          >
            <View className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <View>
                <Text className="text-sm font-black text-slate-900 dark:text-white">
                  {tCommon('web.history.order', 'Commande')} #{order.id}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {order.date} • {order.items.length}{' '}
                  {tCommon('web.history.items', 'articles')}
                </Text>
              </View>
              <View className="text-right">
                <Text className="text-xl font-black text-[#F97316]">
                  {order.total}
                </Text>
                <Text className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {order.status}
                </Text>
              </View>
            </View>
            <View className="mt-4 grid gap-2">
              {order.items.map(item => (
                <View
                  key={item}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 text-sm text-slate-700 dark:text-slate-200"
                >
                  {item}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PurchaseHistory;
