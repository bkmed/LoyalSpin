import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  trackPageView,
  trackShare,
} from '../../../store/slices/analyticsSlice';
import {
  selectGalleryItems,
  GalleryItem,
} from '../../../store/slices/gallerySlice';

const GalleryScreen = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const items = useSelector(selectGalleryItems) as GalleryItem[];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(trackPageView('Gallery'));
  }, [dispatch]);

  /** Return the translated field for the current language, otherwise fall back to the default */
  const getLocalized = (
    item: GalleryItem,
    field: 'title' | 'subtitle' | 'description',
  ): string | undefined => {
    return item.translations?.[lang]?.[field] || (item as any)[field];
  };

  const handleShare = (
    item: GalleryItem,
    platform: 'facebook' | 'whatsapp',
  ) => {
    dispatch(trackShare({ platform, item: item.title }));

    const localTitle = getLocalized(item, 'title') || item.title;
    const localSubtitle = getLocalized(item, 'subtitle') || '';

    const pageUrl =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? (window as any).location?.href || 'https://plombier.example.com/gallery'
        : 'https://plombier.example.com/gallery';
    const url = encodeURIComponent(pageUrl);

    const shareLabel = t('web.share_text', {
      defaultValue: `${localTitle}${localSubtitle ? ` - ${localSubtitle}` : ''}`,
      title: localTitle,
      subtitle: localSubtitle,
    });
    const text = encodeURIComponent(shareLabel);

    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else {
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
    }

    Linking.openURL(shareUrl);
  };

  return (
    <View className="p-4 sm:p-6 lg:p-8">
      <View className="max-w-4xl mx-auto mb-10 text-center">
        <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
          {t('web.gallery_realizations')}
        </Text>
        <Text className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100">
          {t('web.gallery_photos_real')}
        </Text>
        <Text className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          {t('web.gallery_desc')}
        </Text>
      </View>

      {items.length === 0 ? (
        <Text className="max-w-2xl mx-auto rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-900 p-10 text-center text-slate-500 dark:text-slate-400">
          {t('web.gallery_empty')}
        </Text>
      ) : (
        <View className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: GalleryItem) => {
            const localTitle = getLocalized(item, 'title');
            const localSubtitle = getLocalized(item, 'subtitle');
            const localDescription = getLocalized(item, 'description');

            return (
              <View
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <View className="h-56 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.imageUri}
                    alt={localTitle}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </View>
                <View className="p-5">
                  <Text className="font-black text-lg text-slate-900 dark:text-slate-100">
                    {localTitle}
                  </Text>
                  {localSubtitle && (
                    <Text className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {localSubtitle}
                    </Text>
                  )}
                  {localDescription && (
                    <Text className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {localDescription}
                    </Text>
                  )}

                  {/* Share Buttons */}
                  <View className="mt-6 flex flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <TouchableOpacity
                      onPress={() => handleShare(item, 'facebook')}
                      className="flex-1 bg-[#1877F2] text-white rounded-xl py-2 flex items-center justify-center transition hover:bg-[#166FE5]"
                    >
                      <Text className="text-white text-xs font-black">
                        Facebook
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleShare(item, 'whatsapp')}
                      className="flex-1 bg-[#25D366] text-white rounded-xl py-2 flex items-center justify-center transition hover:bg-[#20BD5A]"
                    >
                      <Text className="text-white text-xs font-black">
                        WhatsApp
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default GalleryScreen;
