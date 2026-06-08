import React from 'react';
import { Platform, View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  imageUri?: string | null;
  onImageSelected: (uri: string | null) => void;
  accept?: string;
}

const CategoryImageInput = ({
  imageUri,
  onImageSelected,
  accept = 'image/*',
}: Props) => {
  const { t } = useTranslation();
  const tCommon = (key: string) => t(key, { defaultValue: key });

  const handleNativePress = () => {
    // Native image picker is not configured in this repo yet.
    // This placeholder keeps the file cross-platform and allows future integration.
    alert(tCommon('categoryImageInput.unavailableMobile'));
  };

  const handleWebPick = () => {
    // Create file input programmatically to avoid JSX HTML tags
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = accept;
    inputEl.onchange = (ev: any) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) {
        onImageSelected(null);
        document.body.removeChild(inputEl);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onImageSelected(result);
        document.body.removeChild(inputEl);
      };
      reader.readAsDataURL(file);
    };
    inputEl.style.display = 'none';
    document.body.appendChild(inputEl);
    inputEl.click();
  };

  const handlePick = () => {
    if (Platform.OS === 'web') {
      handleWebPick();
    } else {
      handleNativePress();
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handlePick}
        style={{
          padding: 12,
          backgroundColor: '#e5e7eb',
          borderRadius: 12,
          marginRight: 12,
        }}
      >
        <Text className="text-slate-900 dark:text-slate-100">
          {tCommon('categoryImageInput.chooseImage')}
        </Text>
      </TouchableOpacity>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          accessibilityLabel={tCommon('categoryImageInput.previewAlt')}
          style={{ width: 64, height: 64, borderRadius: 8 }}
        />
      ) : (
        <View
          style={{
            width: 64,
            height: 64,
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
          }}
        />
      )}
    </View>
  );
};

export default CategoryImageInput;
