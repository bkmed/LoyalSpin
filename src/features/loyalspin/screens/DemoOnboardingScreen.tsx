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
  GestureResponderEvent,
  PanResponderGestureState,
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
  const { width } = useWindowDimensions();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const isWeb = Platform.OS === 'web';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const panResponder = useRef<any>(null);
  const lastOffsetRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<any>(null);

  // Slide data
  const slides: Slide[] = [
    {
      title: t('onboarding.slide1.title', {
        defaultValue: 'Engage your customers with LoyalSpin',
      }),
      description: t('onboarding.slide1.description', {
        defaultValue:
          'Create a gamified loyalty experience that boosts repeat visits and increases customer satisfaction.',
      }),
      badge: t('onboarding.slide1.badge', {
        defaultValue: 'Engage',
      }),
    },
    {
      title: t('onboarding.slide2.title', {
        defaultValue: 'Collect real-time insights',
      }),
      description: t('onboarding.slide2.description', {
        defaultValue:
          'Monitor rewards, campaigns and customer behavior to make smarter business choices.',
      }),
      badge: t('onboarding.slide2.badge', {
        defaultValue: 'Analyze',
      }),
    },
    {
      title: t('onboarding.slide3.title', {
        defaultValue: 'Grow loyalty with every spin',
      }),
      description: t('onboarding.slide3.description', {
        defaultValue:
          'Launch your interactive wheel and turn casual visits into lasting customer relationships.',
      }),
      badge: t('onboarding.slide3.badge', {
        defaultValue: 'Reward',
      }),
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
        else if (
          gestureState.dx < -threshold &&
          currentSlide < slides.length - 1
        ) {
          handleNextSlide();
        }
      },
    });

    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentSlide]);

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      setIsScrolling(true);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
      // Clear any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Set a timeout to mark scrolling as complete
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 600); // Adjust timing based on animation duration
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      setIsScrolling(true);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * width,
        animated: true,
      });
      // Clear any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Set a timeout to mark scrolling as complete
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 600); // Adjust timing based on animation duration
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
    // Only update slide index if not currently in an animated scroll
    if (!isScrolling) {
      const x = event.nativeEvent.contentOffset.x;
      // Calculate the closest slide index based on position
      // Use a more intelligent rounding that respects slide boundaries
      const slideIndex = Math.round(x / width);
      // Clamp to valid slide range
      const newSlide = Math.max(0, Math.min(slideIndex, slides.length - 1));
      if (newSlide !== currentSlide) {
        setCurrentSlide(newSlide);
        // Force scroll to correct position if it drifted
        scrollViewRef.current?.scrollTo({
          x: newSlide * width,
          animated: false,
        });
      }
    }
  };

  const handleScrollWeb = (delta: number) => {
    // Don't process scroll gestures if an animated scroll is in progress
    if (!isScrolling && Math.abs(delta) > 50) {
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
        snapToInterval={width}
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        {...(panResponder.current && panResponder.current.panHandlers)}
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={event => {
          const x = event.nativeEvent.contentOffset.x;
          if (isWeb) {
            handleScrollWeb(lastOffsetRef.current - x);
          }
          lastOffsetRef.current = x;
        }}
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
          skipLabel={t('onboarding.skip', { defaultValue: 'Skip' })}
          nextLabel={t('onboarding.next', { defaultValue: 'Next' })}
          finishLabel={t('onboarding.finish', { defaultValue: 'Finish' })}
        />
      </View>
    </View>
  );
};

export default DemoOnboardingScreen;
