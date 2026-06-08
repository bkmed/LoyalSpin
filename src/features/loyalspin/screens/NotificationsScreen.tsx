import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
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
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
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

      <View className="mt-10 space-y-4">
        {notifications.map(notification => (
          <View
            key={notification.id}
            className={`rounded-3xl border p-5 shadow-sm transition ${
              notification.isRead
                ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'
                : 'border-[#F97316] bg-[#FFF7ED] dark:bg-[#362b1f]'
            }`}
          >
            <View className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <View>
                <Text className="text-sm font-black text-slate-900 dark:text-white">
                  {notification.title}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {notification.createdAt}
                </Text>
              </View>
              <Text className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {notification.type}
              </Text>
            </View>
            <Text className="mt-4 text-sm text-slate-700 dark:text-slate-200">
              {notification.message}
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
          </View>
        ))}
        {notifications.length === 0 && (
          <View className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-10 text-center">
            <Text className="text-sm font-black text-slate-900 dark:text-white">
              {tCommon('web.notifications.empty', 'Aucune notification pour le moment.')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationsScreen;
