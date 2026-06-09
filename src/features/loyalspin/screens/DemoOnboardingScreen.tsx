import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StyleSheet,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { OnboardingSlide } from '../../../components/OnboardingSlide';
import { OnboardingPagination } from '../../../components/OnboardingPagination';
import { OnboardingFooter } from '../../../components/OnboardingFooter';
import { lightTheme, darkTheme } from '../../../theme';

interface Slide {
  title: string;
  description: string;
  badge: string;
}

export const DemoOnboardingScreen: React.FC<{
  isDarkMode?: boolean;
  onFinish?: () => void;
}> = ({ isDarkMode = false, onFinish }) => {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const isWeb = Platform.OS === 'web';

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const panResponder = useRef<any>(null);
  const lastOffsetRef = useRef<number>(0);

  // Slide data
  const slides: Slide[] = [
    {
      title: t('onboarding.slide1.title'),
      description: t('onboarding.slide1.description'),
      badge: t('onboarding.slide1.badge'),
    },
    {
      title: t('onboarding.slide2.title'),
      description: t('onboarding.slide2.description'),
      badge: t('onboarding.slide2.badge'),
    },
    {
      title: t('onboarding.slide3.title'),
      description: t('onboarding.slide3.description'),
      badge: t('onboarding.slide3.badge'),
    },
  ];

  // PanResponder for swipe gestures on mobile/web
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const threshold = 50;
        // Swipe right
        if (gestureState.dx > threshold && currentSlide > 0) {
          handlePrevSlide();
        }
        // Swipe left
        else if (gestureState.dx < -threshold && currentSlide < slides.length - 1) {
          handleNextSlide();
        }
      },
    });
  }, [currentSlide]);

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentSlide + 1) * width,
        animated: true,
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      scrollViewRef.current?.scrollTo({
        x: (currentSlide - 1) * width,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const newSlide = Math.round(x / width);
    if (newSlide !== currentSlide) {
      setCurrentSlide(newSlide);
    }
  };

  const handleScrollWeb = (delta: number) => {
    if (Math.abs(delta) > 50) {
      if (delta > 0 && currentSlide > 0) {
        handlePrevSlide();
      } else if (delta < 0 && currentSlide < slides.length - 1) {
        handleNextSlide();
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isWeb ? 24 : 16,
      paddingVertical: isWeb ? 16 : 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    logo: {
      fontSize: isWeb ? 20 : 18,
      fontWeight: '700',
      color: theme.colors.primary,
      letterSpacing: 1,
    },
    closeButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    closeButtonText: {
      fontSize: 24,
      color: theme.colors.text,
    },
    scrollContainer: {
      flex: 1,
    },
    slidesContainer: {
      flexDirection: 'row',
      height: '100%',
    },
    pagination: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: isWeb ? 24 : 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    footer: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: theme.colors.primary,
              }}
            />
            <Text style={styles.logo}>LOYALSPIN</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        {...(panResponder.current && panResponder.current.panHandlers)}
        scrollEnabled={!isWeb}
        onScroll={
          isWeb
            ? (event) => {
                const x = event.nativeEvent.contentOffset.x;
                handleScrollWeb(lastOffsetRef.current - x);
                lastOffsetRef.current = x;
              }
            : undefined
        }
        style={styles.scrollContainer}
      >
        {slides.map((slide, index) => (
          <View key={index} style={{ width }}>
            <OnboardingSlide
              title={slide.title}
              description={slide.description}
              badge={slide.badge}
              isDarkMode={isDarkMode}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        <OnboardingPagination
          totalSlides={slides.length}
          currentSlide={currentSlide}
          isDarkMode={isDarkMode}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <OnboardingFooter
          onSkip={handleSkip}
          onNext={handleNextSlide}
          onFinish={handleFinish}
          currentSlide={currentSlide}
          totalSlides={slides.length}
          isDarkMode={isDarkMode}
          skipLabel={t('onboarding.skip')}
          nextLabel={t('onboarding.next')}
          finishLabel={t('onboarding.finish')}
        />
      </View>
    </View>
  );
};

export default DemoOnboardingScreen;
