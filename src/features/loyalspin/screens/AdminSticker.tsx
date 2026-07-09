import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { StickerConfig } from '../../../database/schema';
import {
  fetchStickerConfig,
  saveStickerConfig,
  setLocalStickerConfig,
} from '../../../store/slices/stickerConfigSlice';

// ─── Platform-aware image picker ─────────────────────────────────────────────
async function pickImageWeb(): Promise<string | null> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

async function pickImageNative(): Promise<string | null> {
  try {
    const ImagePicker = require('react-native-image-picker');
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    });
    if (result.didCancel || result.errorCode || !result.assets) return null;
    return result.assets[0].uri ?? null;
  } catch (err) {
    console.warn('Image picker error:', err);
  }
  return null;
}

// ─── Simple QR placeholder SVG ───────────────────────────────────────────────
const QR_PLACEHOLDER = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props {
  t?: any;
  projectId?: string | null;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminSticker({ t, projectId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const configs = useSelector((state: RootState) => state.stickerConfig?.configs || {});
  const saving = useSelector((state: RootState) => state.stickerConfig?.saving ?? false);
  const loading = useSelector((state: RootState) => state.stickerConfig?.loading ?? false);

  const resolvedProjectId = projectId ?? Object.keys(configs)[0] ?? 'default';
  const existingConfig = configs[resolvedProjectId] as StickerConfig | undefined;

  // ── Form State ──────────────────────────────────────────────────────────
  const [shape, setShape] = useState<'round' | 'square' | 'rectangle'>(existingConfig?.shape || 'round');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>(
    (existingConfig?.size as any) || 'medium',
  );
  const [primaryColor, setPrimaryColor] = useState(existingConfig?.primaryColor || '#1E3A5F');
  const [secondaryColor, setSecondaryColor] = useState(existingConfig?.secondaryColor || '#F97316');
  const [title, setTitle] = useState(existingConfig?.title || 'Scannez & Tournez !');
  const [subtitle, setSubtitle] = useState(existingConfig?.subtitle || 'Votre récompense vous attend');
  const [qrUrl, setQrUrl] = useState(existingConfig?.qrCodeUrl || '');
  const [backgroundImageUri, setBackgroundImageUri] = useState<string | undefined>(
    existingConfig?.backgroundImageUri,
  );
  const [logoUri, setLogoUri] = useState<string | undefined>(existingConfig?.logoUri);

  const [saved, setSaved] = useState(false);
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');

  // Load from Firebase on mount
  useEffect(() => {
    if (resolvedProjectId && resolvedProjectId !== 'default') {
      dispatch(fetchStickerConfig(resolvedProjectId));
    }
  }, [resolvedProjectId, dispatch]);

  // Sync form when config loads
  useEffect(() => {
    if (existingConfig) {
      setShape(existingConfig.shape);
      setSize((existingConfig.size as any) || 'medium');
      setPrimaryColor(existingConfig.primaryColor);
      setSecondaryColor(existingConfig.secondaryColor || '#F97316');
      setTitle(existingConfig.title);
      setSubtitle(existingConfig.subtitle || '');
      setQrUrl(existingConfig.qrCodeUrl);
      setBackgroundImageUri(existingConfig.backgroundImageUri);
      setLogoUri(existingConfig.logoUri);
    }
  }, [existingConfig?.id]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePickBackground = async () => {
    const uri = Platform.OS === 'web' ? await pickImageWeb() : await pickImageNative();
    if (uri) setBackgroundImageUri(uri);
  };

  const handlePickLogo = async () => {
    const uri = Platform.OS === 'web' ? await pickImageWeb() : await pickImageNative();
    if (uri) setLogoUri(uri);
  };

  const handleGenerateQR = () => {
    const base = qrUrl.trim() || `https://loyalspin.app/spin/${resolvedProjectId}`;
    setQrPreviewUrl(`${QR_PLACEHOLDER}${encodeURIComponent(base)}&color=${primaryColor.replace('#', '')}`);
    if (!qrUrl.trim()) setQrUrl(`https://loyalspin.app/spin/${resolvedProjectId}`);
  };

  const handleOpenDashboard = () => {
    const dashboardUrl = `https://loyalspin.app/dashboard/${resolvedProjectId}`;
    if (Platform.OS === 'web') {
      window.open(dashboardUrl, '_blank');
    }
  };

  const handleSave = async () => {
    const config: StickerConfig = {
      id: existingConfig?.id || `sticker_${resolvedProjectId}`,
      projectId: resolvedProjectId,
      isActive: true,
      shape,
      size,
      primaryColor,
      secondaryColor,
      title,
      subtitle,
      logoUri,
      backgroundImageUri,
      qrCodeUrl: qrUrl || `https://loyalspin.app/spin/${resolvedProjectId}`,
      createdAt: existingConfig?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic Redux update
    dispatch(setLocalStickerConfig(config));

    // Firebase save
    try {
      await dispatch(saveStickerConfig(config)).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Sticker save error:', err);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────
  const previewSize = { small: 140, medium: 180, large: 220 }[size];
  const previewWidth = shape === 'rectangle' ? previewSize * 1.4 : previewSize;
  const borderRadius =
    shape === 'round' ? previewSize / 2 : shape === 'square' ? 16 : 12;

  const activeQrUrl =
    qrPreviewUrl ||
    (qrUrl ? `${QR_PLACEHOLDER}${encodeURIComponent(qrUrl)}` : '');

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <ScrollView>
      <View className="max-w-5xl">
        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-1">
          Design des Stickers
        </Text>
        <Text className="text-slate-500 mb-8">
          Personnalisez l&apos;apparence du sticker QR qui sera scanné par vos clients.
        </Text>

        {loading && (
          <View className="mb-4 flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#1E3A5F" />
            <Text className="text-slate-500 text-sm">Chargement…</Text>
          </View>
        )}

        <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ─── LEFT: Configuration ─────────────────────────────────── */}
          <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
            <Text className="text-xl font-bold dark:text-white">Configuration</Text>

            {/* Titre / Sous-titre */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
                placeholder="Titre du sticker"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Sous-titre</Text>
              <TextInput
                value={subtitle}
                onChangeText={setSubtitle}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
                placeholder="Sous-titre (optionnel)"
              />
            </View>

            {/* Forme */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Forme</Text>
              <View className="flex-row space-x-2">
                {(['round', 'square', 'rectangle'] as const).map(s => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setShape(s)}
                    className={`px-4 py-2 rounded-lg border ${
                      shape === s
                        ? 'bg-blue-100 border-blue-500 dark:bg-blue-900'
                        : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700'
                    }`}
                  >
                    <Text className={`capitalize ${shape === s ? 'text-blue-700 dark:text-blue-300 font-bold' : 'dark:text-white'}`}>
                      {s === 'round' ? 'Rond' : s === 'square' ? 'Carré' : 'Rectangle'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Taille */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Taille</Text>
              <View className="flex-row space-x-2">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg border ${
                      size === s
                        ? 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900'
                        : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700'
                    }`}
                  >
                    <Text className={`capitalize ${size === s ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'dark:text-white'}`}>
                      {s === 'small' ? 'Petit' : s === 'medium' ? 'Moyen' : 'Grand'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Couleurs */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Couleur principale</Text>
                <View className="flex-row items-center space-x-2">
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: primaryColor, borderWidth: 1, borderColor: '#ccc' }} />
                  <TextInput
                    value={primaryColor}
                    onChangeText={setPrimaryColor}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 dark:text-white"
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Couleur secondaire</Text>
                <View className="flex-row items-center space-x-2">
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: secondaryColor, borderWidth: 1, borderColor: '#ccc' }} />
                  <TextInput
                    value={secondaryColor}
                    onChangeText={setSecondaryColor}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 dark:text-white"
                  />
                </View>
              </View>
            </View>

            {/* Image de fond */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Image de fond</Text>
              {backgroundImageUri ? (
                <View className="mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height: 80 }}>
                  <Image source={{ uri: backgroundImageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
              ) : null}
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handlePickBackground}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 border border-dashed border-slate-400 dark:border-slate-500 rounded-xl py-3 items-center justify-center"
                >
                  <Text className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
                    📁 {backgroundImageUri ? 'Changer l\'image' : 'Upload image'}
                  </Text>
                </TouchableOpacity>
                {backgroundImageUri && (
                  <TouchableOpacity
                    onPress={() => setBackgroundImageUri(undefined)}
                    className="bg-red-100 dark:bg-red-900 px-4 rounded-xl items-center justify-center"
                  >
                    <Text className="text-red-600 dark:text-red-300 font-bold">✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Logo */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Logo du commerce</Text>
              {logoUri ? (
                <View className="mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height: 64, width: 64 }}>
                  <Image source={{ uri: logoUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              ) : null}
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handlePickLogo}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 border border-dashed border-slate-400 dark:border-slate-500 rounded-xl py-3 items-center justify-center"
                >
                  <Text className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
                    🖼️ {logoUri ? 'Changer le logo' : 'Upload logo'}
                  </Text>
                </TouchableOpacity>
                {logoUri && (
                  <TouchableOpacity
                    onPress={() => setLogoUri(undefined)}
                    className="bg-red-100 dark:bg-red-900 px-4 rounded-xl items-center justify-center"
                  >
                    <Text className="text-red-600 dark:text-red-300 font-bold">✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* QR Code URL */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL du QR Code</Text>
              <TextInput
                value={qrUrl}
                onChangeText={setQrUrl}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
                placeholder={`https://loyalspin.app/spin/${resolvedProjectId}`}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            {/* Bouton générer QR */}
            <TouchableOpacity
               onPress={handleGenerateQR}
               className="bg-indigo-600 py-3 rounded-xl items-center flex-row justify-center space-x-2"
             >
               <Text className="text-white font-bold">🔲 Générer le QR Code</Text>
             </TouchableOpacity>

             {/* Bouton dashboard fidélité */}
             <TouchableOpacity
               onPress={handleOpenDashboard}
               className="border-2 border-[#1E3A5F] dark:border-blue-400 py-3 rounded-xl items-center flex-row justify-center space-x-2"
             >
               <Text className="text-[#1E3A5F] dark:text-blue-400 font-bold">🔗 Ouvrir la page de fidélité</Text>
             </TouchableOpacity>
           </View>

           {/* ─── RIGHT: Preview ──────────────────────────────────────── */}
           <View className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 items-center justify-center space-y-4">
             <Text className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">Aperçu en direct</Text>

             {/* Sticker preview */}
             <View
               style={Object.assign(
                 {
                   width: previewWidth,
                   height: previewSize,
                   borderRadius,
                   borderColor: primaryColor,
                   borderWidth: 4,
                   overflow: 'hidden',
                   position: 'relative' as const,
                   backgroundColor: '#fff',
                   elevation: 8,
                 },
                 Platform.select({
                   web: { boxShadow: `0px 4px 12px ${primaryColor}4D` } as any,
                   default: {
                     shadowColor: primaryColor,
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.3,
                     shadowRadius: 12,
                   }
                 })
               )}
             >
               {/* Background image */}
               {backgroundImageUri ? (
                 <Image
                   source={{ uri: backgroundImageUri }}
                   style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                   resizeMode="cover"
                 />
               ) : (
                 <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: secondaryColor + '22' }} />
               )}

               {/* Overlay content */}
               <View style={{ flex: 1, alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: 8 }}>
                 {logoUri && (
                   <Image
                     source={{ uri: logoUri }}
                     style={{ width: 32, height: 32, marginBottom: 4, borderRadius: 4 }}
                     resizeMode="contain"
                   />
                 )}
                 <Text style={{ fontSize: 10, fontWeight: '900', color: primaryColor, textAlign: 'center', marginBottom: 4 }} numberOfLines={1}>
                   {title}
                 </Text>
                 {/* QR Code */}
                 {activeQrUrl ? (
                   <Image
                     source={{ uri: activeQrUrl }}
                     style={{ width: 70, height: 70 }}
                     resizeMode="contain"
                   />
                 ) : (
                   <View style={{ width: 70, height: 70, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                     <Text style={{ fontSize: 9, color: '#999', textAlign: 'center' }}>QR Code</Text>
                   </View>
                 )}
                 {subtitle ? (
                   <Text style={{ fontSize: 8, color: primaryColor + 'cc', textAlign: 'center', marginTop: 4 }} numberOfLines={1}>
                     {subtitle}
                   </Text>
                 ) : null}
               </View>
             </View>

             {/* Info taille */}
             <Text className="text-xs text-slate-400 dark:text-slate-500">
               {size === 'small' ? '5×5 cm' : size === 'medium' ? '7×7 cm' : '10×10 cm'} — {shape}
             </Text>
           </View>
         </View>

         {/* ─── SAVE BUTTON ─────────────────────────────────────────────── */}
         <View className="mt-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
           <TouchableOpacity
             onPress={handleSave}
             disabled={saving}
             className={`py-4 rounded-xl shadow-md items-center flex-row justify-center space-x-2 ${
               saved
                 ? 'bg-emerald-600'
                 : saving
                 ? 'bg-slate-400'
                 : 'bg-[#1E3A5F]'
             }`}
           >
             {saving ? (
               <ActivityIndicator color="#fff" size="small" />
             ) : (
               <Text className="text-white font-bold text-base">
                 {saved ? '✅ Modifications enregistrées !' : '💾 Enregistrer les modifications'}
               </Text>
             )}
           </TouchableOpacity>
           <Text className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
             Sauvegarde dans Redux et Firebase Firestore
           </Text>
         </View>
       </View>
     </ScrollView>
   );
 }
