import React from 'react';
import { Platform, View, Image, Text, TouchableOpacity } from 'react-native';

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return onImageSelected(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleNativePress = () => {
    // Native image picker is not configured in this repo yet.
    // This placeholder keeps the file cross-platform and allows future integration.
    alert("Sélection d'image non disponible sur mobile pour le moment.");
  };

  if (Platform.OS === 'web') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <input type="file" accept={accept} onChange={handleFileChange} />
        {imageUri ? (
          <img
            src={imageUri}
            alt="preview"
            style={{
              width: 64,
              height: 64,
              objectFit: 'cover',
              borderRadius: 8,
              marginLeft: 12,
            }}
          />
        ) : (
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              marginLeft: 12,
            }}
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handleNativePress}
        style={{
          padding: 12,
          backgroundColor: '#e5e7eb',
          borderRadius: 12,
          marginRight: 12,
        }}
      >
        <Text>Choisir une image</Text>
      </TouchableOpacity>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
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
