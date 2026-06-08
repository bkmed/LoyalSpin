import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import {
  selectOverdueBills,
  selectWalletSettings,
  updateSettings,
} from '../store/slices/walletSlice';

const getInitials = (name?: string) =>
  (name || 'Plombier User')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const TopAppBar = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const settings = useSelector(selectWalletSettings);
  const overdue = useSelector(selectOverdueBills);

  return (
    <View
      className="z-50 flex-row items-center justify-between border-b border-outline-variant/40 bg-background/90 px-5 py-3"
      style={
        Platform.OS === 'web'
          ? ({
              position: 'sticky',
              top: 0,
              backdropFilter: 'blur(24px)',
            } as any)
          : undefined
      }
    >
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Text className="font-headline text-sm font-extrabold text-primary">
            {getInitials(user?.name)}
          </Text>
        </View>
        <Text className="font-headline text-[22px] font-black text-primary-container">
          Plombier
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low"
          onPress={() =>
            dispatch(updateSettings({ hideBalances: !settings.hideBalances }))
          }
        >
          <MaterialIcons
            name={settings.hideBalances ? 'visibility-off' : 'visibility'}
            size={21}
            color="#005994"
          />
        </TouchableOpacity>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="notifications" size={21} color="#005994" />
          {overdue.length > 0 ? (
            <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-secondary" />
          ) : null}
        </View>
      </View>
    </View>
  );
};
