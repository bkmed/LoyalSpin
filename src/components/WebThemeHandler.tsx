import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

declare const document: any;

export const WebThemeHandler = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Update body background
      document.body.style.backgroundColor = theme.colors.background;

      // Update app root background if it exists
      const appRoot = document.getElementById('app-root');
      if (appRoot) {
        appRoot.style.backgroundColor = theme.colors.background;
      }
      
      // Toggle Tailwind dark mode class on HTML tag
      if (theme.dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme.dark, theme.colors.background]);

  return null;
};
