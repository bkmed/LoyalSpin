import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function QRScannerScreen({ navigation }: any) {
  // In a real app, you would use expo-camera or a web qr scanner library
  const simulateScan = () => {
    // Navigate to spin screen simulating a scan of project "default"
    navigation.navigate('ClientSpin', { projectId: 'default' });
  };

  return (
    <View className="flex-1 bg-black items-center justify-center p-8">
      <Text className="text-white text-2xl font-bold mb-8">Scanner un QR Code</Text>
      
      <View className="w-64 h-64 border-2 border-emerald-500 rounded-2xl items-center justify-center mb-12">
        <View className="w-full h-[2px] bg-emerald-500 absolute top-1/2" />
        <Text className="text-emerald-500/50">Camera View Here</Text>
      </View>

      <TouchableOpacity 
        onPress={simulateScan}
        className="bg-emerald-600 px-8 py-4 rounded-xl"
      >
        <Text className="text-white font-bold text-lg">Simuler un Scan Réussi</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="mt-6 px-8 py-4"
      >
        <Text className="text-slate-400 font-bold">Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}
