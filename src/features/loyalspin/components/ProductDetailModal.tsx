import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { ProductVisual } from './ProductSVGs';

interface ProductDetailModalProps {
  selectedProduct: any | null;
  supportWhatsAppDigits: string;
  t: any;
  setSelectedProduct: (prod: any | null) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  selectedProduct,
  supportWhatsAppDigits,
  t,
  setSelectedProduct,
}) => {
  if (!selectedProduct) return null;
  const tCommon = (key: string, options?: any) =>
    t(key, { defaultValue: key, ...options });

  const handleCallPress = () => {
    const url = supportWhatsAppDigits
      ? `tel:${supportWhatsAppDigits}`
      : 'tel:+21622456789';
    Linking.openURL(url).catch(err =>
      console.error('Error opening tel link:', err),
    );
  };

  const handleWhatsAppPress = () => {
    const url = `https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
      tCommon('web.buy_piece_msg', {
        title: selectedProduct.title,
        price: selectedProduct.price,
      }),
    )}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening whatsapp link:', err),
    );
  };

  return (
    <View className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
      <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-xl w-full shadow-2xl overflow-hidden relative">
        <TouchableOpacity
          onPress={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center font-bold shadow transition"
        >
          <Text className="text-slate-500 dark:text-slate-200">✕</Text>
        </TouchableOpacity>

        <View className="grid grid-cols-1 sm:grid-cols-2">
          <View className="bg-slate-50 dark:bg-slate-900 py-14 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
            <ProductVisual
              image={selectedProduct.image}
              className="w-24 h-24"
            />
          </View>

          <View className="p-6 sm:p-8 flex flex-col justify-between">
            <View className="space-y-4">
              <View>
                <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">
                  {selectedProduct.category}
                </Text>
                <Text className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {selectedProduct.title}
                </Text>
                <Text className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold dark:text-slate-400">
                  {selectedProduct.subtitle}
                </Text>
              </View>

              <Text className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed font-medium">
                {selectedProduct.description}
              </Text>

              <View className="text-xl font-black text-[#F97316] flex-row items-center">
                <Text className="text-xl font-black text-[#F97316]">
                  {selectedProduct.price}{' '}
                </Text>
                <Text className="text-sm font-bold text-[#F97316]">
                  {tCommon('web.tndSymbol')}
                </Text>
              </View>
            </View>

            {/* Direct Action links */}
            <View className="grid grid-cols-2 gap-3 mt-6">
              <TouchableOpacity
                onPress={handleCallPress}
                className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3 rounded-xl transition text-center shadow flex items-center justify-center gap-1.5"
              >
                <Text className="text-white text-xs font-black">
                  {tCommon('call')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleWhatsAppPress}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl transition text-center shadow flex items-center justify-center gap-1.5"
              >
                <Text className="text-white text-xs font-black">
                  {tCommon('whatsapp')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ProductDetailModal;
