import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface PurchaseHistoryProps {
  t: any;
}

const orders = [
  {
    id: 'order-1172',
    date: '05/06/2026',
    total: 42,
    status: 'Livré',
    items: ['Remplacement de joint', 'Visite technique'],
  },
  {
    id: 'order-1159',
    date: '24/05/2026',
    total: 85,
    status: 'En cours',
    items: ['Dépannage chauffe-eau', 'Contrôle pression'],
  },
  {
    id: 'order-1080',
    date: '12/04/2026',
    total: 26,
    status: 'Réglé',
    items: ['Remplacement robinet'],
  },
];

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ t }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tous' | 'Livré' | 'En cours' | 'Réglé'>('Tous');

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const filteredOrders = useMemo(
    () =>
      orders.filter(order => {
        const matchesQuery =
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.items.some(item =>
            item.toLowerCase().includes(query.toLowerCase()),
          );
        const matchesStatus =
          statusFilter === 'Tous' ? true : order.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [query, statusFilter],
  );

  const totalSpent = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.total, 0),
    [filteredOrders],
  );

  const deliveredCount = useMemo(
    () => filteredOrders.filter(order => order.status === 'Livré').length,
    [filteredOrders],
  );

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <Text className="text-3xl font-black text-slate-900 dark:text-white">
        {tCommon('web.history.title', 'Historique des commandes')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl">
        {tCommon(
          'web.history.subtitle',
          'Retrouvez vos interventions, montants et statuts en un seul endroit.',
        )}
      </Text>

      <View className="mt-8 grid gap-4 lg:grid-cols-3">
        <View className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <Text className="text-xs font-black uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            {tCommon('web.history.totalOrders', 'Commandes')} 
          </Text>
          <Text className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
            {filteredOrders.length}
          </Text>
        </View>
        <View className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <Text className="text-xs font-black uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            {tCommon('web.history.totalSpent', 'Total dépensé')}
          </Text>
          <Text className="mt-4 text-4xl font-black text-[#F97316] dark:text-amber-300">
            {totalSpent} DT
          </Text>
        </View>
        <View className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <Text className="text-xs font-black uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            {tCommon('web.history.deliveredOrders', 'Livrées')}
          </Text>
          <Text className="mt-4 text-4xl font-black text-emerald-600 dark:text-emerald-300">
            {deliveredCount}
          </Text>
        </View>
      </View>

      <View className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={tCommon('web.history.search', 'Rechercher')}
          className="w-full sm:w-1/2 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-5 py-3 text-sm text-slate-900 dark:text-white"
        />
        <View className="inline-flex rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-1">
          {['Tous', 'Livré', 'En cours', 'Réglé'].map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status as any)}
              className={`rounded-3xl px-4 py-2 text-sm font-black transition ${
                statusFilter === status
                  ? 'bg-[#F97316] text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {tCommon(`web.history.filter.${status}`, status)}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-10 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <Text className="text-sm font-black uppercase tracking-[0.24em] text-slate-900 dark:text-white">
          {tCommon('web.history.monthlySummary', 'Résumé mensuel')}
        </Text>
        <View className="mt-4 grid gap-3 sm:grid-cols-3">
          <View className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
            <Text className="text-xs uppercase text-slate-500 dark:text-slate-400">
              {tCommon('web.history.monthlySummaryOrders', 'Commandes ce mois')}
            </Text>
            <Text className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {orders.length}
            </Text>
          </View>
          <View className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
            <Text className="text-xs uppercase text-slate-500 dark:text-slate-400">
              {tCommon('web.history.monthlySummaryRevenue', 'Revenu estimé')}
            </Text>
            <Text className="mt-3 text-2xl font-black text-[#F97316] dark:text-amber-300">
              {orders.reduce((sum, order) => sum + order.total, 0)} DT
            </Text>
          </View>
          <View className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
            <Text className="text-xs uppercase text-slate-500 dark:text-slate-400">
              {tCommon('web.history.monthlySummaryPending', 'En attente')}
            </Text>
            <Text className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {orders.filter(order => order.status === 'En cours').length}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-10 space-y-4">
        {filteredOrders.map(order => (
          <View
            key={order.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm"
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
                <Text className="text-xl font-black text-[#F97316] dark:text-amber-300">
                  {order.total} DT
                </Text>
                <Text className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {order.status}
                </Text>
              </View>
            </View>
            <View className="mt-4 grid gap-2">
              {order.items.map(item => (
                <View
                  key={item}
                  className="rounded-2xl bg-white dark:bg-slate-950 p-3 text-sm text-slate-700 dark:text-slate-200"
                >
                  {item}
                </View>
              ))}
            </View>
          </View>
        ))}

        {filteredOrders.length === 0 && (
          <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 text-center">
            <Text className="text-sm font-black text-slate-900 dark:text-white">
              {tCommon('web.history.empty', 'Aucun historique correspondant.')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PurchaseHistory;
