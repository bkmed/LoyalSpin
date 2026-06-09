import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import { lightTheme, darkTheme } from '../theme';

interface OnboardingFooterProps {
  onSkip: () => void;
  onNext: () => void;
  onFinish: () => void;
  currentSlide: number;
  totalSlides: number;
  isDarkMode: boolean;
  skipLabel: string;
  nextLabel: string;
  finishLabel: string;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  onSkip,
  onNext,
  onFinish,
  currentSlide,
  totalSlides,
  isDarkMode,
  skipLabel,
  nextLabel,
  finishLabel,
}) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  const isWeb = Platform.OS === 'web';
  const isLastSlide = currentSlide === totalSlides - 1;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: isWeb ? 24 : 16,
      paddingVertical: isWeb ? 24 : 16,
      gap: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
    },
    skipButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    skipButtonText: {
      color: theme.colors.subText,
      fontSize: 15,
      fontWeight: '600',
    },
    actionButton: {
      flex: isLastSlide ? 1 : 2,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    actionButtonText: {
      color: theme.textVariants.button.color,
      fontSize: 15,
      fontWeight: '600',
    },
    footerText: {
      textAlign: 'center',
      color: theme.colors.subText,
      fontSize: 12,
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>{skipLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={isLastSlide ? onFinish : onNext}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>
            {isLastSlide ? finishLabel : nextLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
