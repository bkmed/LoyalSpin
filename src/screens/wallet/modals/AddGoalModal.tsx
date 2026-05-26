import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const AddGoalModal = () => {
  const navigation = useNavigation<any>();
  return (
    <View className="flex-1 items-center justify-center bg-background px-5">
      <View className="w-full max-w-[420px] rounded-3xl bg-surface-container-lowest p-6 shadow-editorial">
        <Text className="font-headline text-xl font-extrabold text-on-surface">
          Add Goal
        </Text>
        <Text className="mt-2 font-body text-sm text-on-surface-variant">
          Goal creation is ready for the wallet flow.
        </Text>
        <TouchableOpacity
          className="mt-6 rounded-xl bg-primary py-4"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-center font-label text-xs font-extrabold uppercase text-white">
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
