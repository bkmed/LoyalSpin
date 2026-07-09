import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface AdminStickerProps {
  t: any;
  projectId?: string | null;
}

const AdminSticker: React.FC<AdminStickerProps> = ({ t, projectId }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });

  const stickers = ['Rond', 'Carré', 'Rectangle'];
  const colors = ['#4A90D9', '#F59E0B', '#111827', '#10B981', '#475569'];

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Text className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-8">
        {tCommon('adminSticker.title', 'Mon Sticker QR Code')}
      </Text>

      <View className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <View className="bg-slate-950/90 dark:bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <Text className="text-sm text-slate-400 mb-6">
            {tCommon(
              'adminSticker.subtitle',
              'Personnalisez le sticker de votre établissement.',
            )}
          </Text>

          <View className="space-y-6">
            <View>
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {tCommon(
                  'adminSticker.pageLink',
                  'Lien de votre page fidélité',
                )}
              </Text>
              <TextInput
                value="loyalspin.app/the-daily-grind"
                onChangeText={() => {}}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white"
              />
            </View>

            <View className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                {tCommon('adminSticker.previewLabel', 'Aperçu du code généré')}
              </Text>
              <View className="h-40 rounded-3xl bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-400">
                {tCommon(
                  'adminSticker.qrExample',
                  'Aperçu rapide du code généré dynamiquement.',
                )}
              </View>
            </View>

            <View>
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {tCommon(
                  'adminSticker.stickerName',
                  'Nom affiché sur le sticker',
                )}
              </Text>
              <TextInput
                value="The Daily Grind Café"
                onChangeText={() => {}}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white"
              />
            </View>

            <View>
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                {tCommon('adminSticker.shapeLabel', 'Forme du sticker')}
              </Text>
              <View className="flex-row gap-3">
                {stickers.map(shape => (
                  <TouchableOpacity
                    key={shape}
                    className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm text-slate-100"
                  >
                    <Text>{shape}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                {tCommon('adminSticker.colorLabel', 'Couleur du sticker')}
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={{ backgroundColor: color } as any}
                    className="h-10 w-10 rounded-full border border-slate-700"
                  />
                ))}
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-3">
              <View className="rounded-3xl border border-slate-800 bg-slate-900 p-4 flex-1">
                <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {tCommon('adminSticker.sizeLabel', 'Taille du sticker')}
                </Text>
                <Text className="text-sm text-slate-100">
                  {tCommon('adminSticker.sizeMedium', 'Moyen (8cm)')}
                </Text>
              </View>
              <View className="rounded-3xl border border-slate-800 bg-slate-900 p-4 flex-1">
                <Text className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {tCommon('adminSticker.printLabel', 'Impression')}
                </Text>
                <Text className="text-sm text-slate-100">
                  {tCommon(
                    'adminSticker.printAdvice',
                    'Imprimez et plastifiez votre sticker',
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <View className="flex flex-col items-center gap-6">
            <View className="rounded-full bg-slate-900 p-6">
              <View className="h-64 w-64 rounded-full bg-slate-100 flex items-center justify-center">
                <Text className="text-slate-900 font-bold">QR</Text>
              </View>
            </View>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              {tCommon('adminSticker.stickerTitle', 'THE DAILY GRIND CAFÉ')}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 text-center">
              {tCommon(
                'adminSticker.scanLabel',
                'Scannez & gagnez des cadeaux 🎁',
              )}
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900">
                PNG
              </TouchableOpacity>
              <TouchableOpacity className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-900">
                PDF
              </TouchableOpacity>
              <TouchableOpacity className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">
                {tCommon('adminSticker.printButton', 'Imprimer')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminSticker;
