import { Dimensions, Platform, useWindowDimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const responsive = {
  // Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
  },

  // Check platform
  isWeb: Platform.OS === 'web',
  isMobile: Platform.OS === 'ios' || Platform.OS === 'android',

  // Responsive helpers
  isMobileWidth: width < 768,
  isTabletWidth: width >= 768 && width < 1024,
  isDesktopWidth: width >= 1024,

  // Get columns for responsive grid
  getColumns: (currentWidth = width) => {
    if (currentWidth >= 1440) return 4;
    if (currentWidth >= 1024) return 3;
    if (currentWidth >= 768) return 2;
    return 1;
  },

  // Get container max width
  getContainerWidth: (currentWidth = width) => {
    if (currentWidth >= 1440) return 1400;
    if (currentWidth >= 1024) return 960;
    if (currentWidth >= 768) return 720;
    return currentWidth - 32;
  },

  // Responsive padding
  getPadding: (currentWidth = width) => {
    if (currentWidth >= 1024) return 24;
    if (currentWidth >= 768) return 20;
    return 16;
  },
};

// Hook for responsive updates
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    columns: responsive.getColumns(width),
  };
};
