import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  Notification,
  selectAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../../store/slices/notificationsSlice';

interface NotificationsScreenProps {
  t: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ t }) => {
  const notifications = useSelector((state: RootState) =>
    selectAllNotifications(state),
  );
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'info' | 'success' | 'warning' | 'error'
  >('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const categories = useMemo(
    () => [
      { key: 'all', label: tCommon('web.notifications.all', 'All') },
      { key: 'info', label: tCommon('web.notifications.info', 'Info') },
      {
        key: 'success',
        label: tCommon('web.notifications.success', 'Success'),
      },
      {
        key: 'warning',
        label: tCommon('web.notifications.warning', 'Warning'),
      },
      { key: 'error', label: tCommon('web.notifications.error', 'Error') },
    ],
    [t],
  );

  const categoryCounts = useMemo(
    () =>
      notifications.reduce(
        (acc, notification) => {
          acc[notification.type] = (acc[notification.type] ?? 0) + 1;
          acc.all = (acc.all ?? 0) + 1;
          return acc;
        },
        { all: 0 } as Record<string, number>,
      ),
    [notifications],
  );

  const filteredNotifications = useMemo(
    () =>
      activeCategory === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeCategory),
    [activeCategory, notifications],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const openNotification = (notification: Notification) => {
    dispatch(markAsRead(notification.id));
    setSelectedNotification(notification);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            {tCommon('web.notifications.title', 'Notifications')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl">
            {tCommon(
              'web.notifications.subtitle',
              'Gardez un œil sur vos alertes et annonces importantes.',
            )}
          </Text>
        </View>

        <View className="flex flex-col sm:flex-row sm:items-center gap-3">
          <TouchableOpacity
            onPress={() => dispatch(markAllAsRead())}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-black text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {tCommon('web.notifications.markAll', 'Tout marquer lu')}
          </TouchableOpacity>
          <Text className="text-sm font-black text-slate-500 dark:text-slate-400">
            {unreadCount} {tCommon('web.notifications.unread', 'non lus')}
          </Text>
        </View>
      </View>

      <View className="mt-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <TouchableOpacity
            key={category.key}
            onPress={() => setActiveCategory(category.key as any)}
            className={`rounded-full border px-4 py-2 text-sm font-black transition ${
              activeCategory === category.key
                ? 'border-[#F97316] bg-[#FFF7ED] text-[#92400e] dark:bg-[#4b2f1d] dark:text-[#f9dcb4]'
                : 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
            }`}
          >
            {category.label} ({categoryCounts[category.key] ?? 0})
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-10 space-y-4">
        {filteredNotifications.map(notification => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => openNotification(notification)}
            className={`rounded-3xl border p-5 shadow-sm transition ${
              notification.isRead
                ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'
                : 'border-[#F97316] bg-[#FFF7ED] dark:bg-[#362b1f]'
            }`}
          >
            <View className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <View>
                <Text className="text-sm font-black text-slate-900 dark:text-white">
                  {tCommon(
                    `web.notifications.items.${notification.id}.title`,
                    notification.title,
                  )}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {notification.createdAt}
                </Text>
              </View>
              <Text className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {tCommon(
                  `web.notifications.${notification.type}`,
                  notification.type,
                )}
              </Text>
            </View>
            <Text className="mt-4 text-sm text-slate-700 dark:text-slate-200">
              {tCommon(
                `web.notifications.items.${notification.id}.message`,
                notification.message,
              )}
            </Text>
            <View className="mt-4 flex flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => dispatch(markAsRead(notification.id))}
                className="rounded-3xl bg-[#1E3A5F] px-4 py-2 text-xs font-black text-white hover:bg-[#152a47] transition"
              >
                {tCommon('web.notifications.markRead', 'Marquer lu')}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => dispatch(deleteNotification(notification.id))}
                className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-black text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {tCommon('web.notifications.delete', 'Supprimer')}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredNotifications.length === 0 && (
          <View className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-10 text-center">
            <Text className="text-sm font-black text-slate-900 dark:text-white">
              {tCommon(
                'web.notifications.empty',
                'Aucune notification pour le moment.',
              )}
            </Text>
          </View>
        )}
      </View>

      <Modal visible={!!selectedNotification} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4 py-8">
          <View className="rounded-3xl bg-white dark:bg-slate-950 p-6">
            <Text className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {tCommon(
                'web.notifications.detailsTitle',
                'Notification details',
              )}
            </Text>
            <Text className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {tCommon('web.notifications.category', 'Category')}:{' '}
              {selectedNotification?.type}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedNotification?.createdAt}
            </Text>
            <Text className="mt-4 text-sm text-slate-700 dark:text-slate-200">
              {selectedNotification &&
                tCommon(
                  `web.notifications.items.${selectedNotification.id}.message`,
                  selectedNotification.message,
                )}
            </Text>
            <View className="mt-6 flex flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setSelectedNotification(null)}
                className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-black text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {tCommon('web.notifications.close', 'Close')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default NotificationsScreen;
