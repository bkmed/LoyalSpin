import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../theme';
import { store } from '../store';
import { LogoSVG } from '../features/loyalspin/components/LogoSVG';

export const LoadingScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [businessName, setBusinessName] = useState(() => {
    return store.getState()?.appSettings?.businessName || 'LoyalSpin';
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const currentBusinessName = state?.appSettings?.businessName || 'LoyalSpin';
      if (currentBusinessName !== businessName) {
        setBusinessName(currentBusinessName);
      }
    });
    return unsubscribe;
  }, [businessName]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoSVG size={120} />
        <Text style={styles.businessName}>
          {businessName}
        </Text>
      </View>
      <ActivityIndicator size="large" color="#005994" style={styles.spinner} />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },

    businessName: {
      ...theme.textVariants.header,
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    spinner: {
      marginTop: theme.spacing.m,
    },
  });
