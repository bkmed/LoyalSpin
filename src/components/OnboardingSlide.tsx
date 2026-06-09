import React from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { lightTheme, darkTheme } from '../theme';

interface OnboardingSlideProp {
  title: string;
  description: string;
  badge: string;
  isDarkMode: boolean;
}

export const OnboardingSlide: React.FC<OnboardingSlideProp> = ({
  title,
  description,
  badge,
  isDarkMode,
}) => {
  const { width, height } = useWindowDimensions();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const isWeb = Platform.OS === 'web';

  // Responsive sizing
  const titleSize = isWeb ? (width > 1024 ? 32 : width > 640 ? 28 : 24) : 28;
  const descSize = isWeb ? (width > 1024 ? 16 : width > 640 ? 15 : 14) : 15;
  const badgePadding = isWeb ? (width > 1024 ? 12 : 10) : 10;

  const styles = StyleSheet.create({
    container: {
      width: width > 640 ? width * 0.8 : width,
      minHeight: height,
      paddingHorizontal: isWeb ? (width > 1024 ? 40 : 24) : 20,
      paddingVertical: isWeb ? 60 : 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      width: '100%',
      maxWidth: 500,
      alignItems: 'center',
    },
    illustrationContainer: {
      width: isWeb ? 300 : 280,
      height: isWeb ? 300 : 280,
      borderRadius: 20,
      marginBottom: 40,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      ...(Platform.OS === 'web' && {
        boxShadow: `0px 8px 16px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      }),
    },
    badge: {
      paddingHorizontal: badgePadding,
      paddingVertical: 6,
      backgroundColor: theme.colors.accent,
      borderRadius: 20,
      marginBottom: 16,
      alignSelf: 'center',
    },
    badgeText: {
      color: theme.colors.white,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    title: {
      fontSize: titleSize,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: titleSize * 1.3,
    },
    description: {
      fontSize: descSize,
      color: theme.colors.subText,
      textAlign: 'center',
      lineHeight: descSize * 1.6,
      letterSpacing: -0.2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.illustrationContainer}>
          <Text style={{ fontSize: 80, textAlign: 'center' }}>📱</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};
