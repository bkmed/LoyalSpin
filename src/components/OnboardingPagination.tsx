import React from 'react';
import { View, StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

interface OnboardingPaginationProps {
  totalSlides: number;
  currentSlide: number;
  isDarkMode: boolean;
}

export const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({
  totalSlides,
  currentSlide,
  isDarkMode,
}) => {
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      transition: 'all 0.3s ease',
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    inactiveDot: {
      backgroundColor: theme.colors.border,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentSlide ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};
