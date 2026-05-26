import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../theme';

export const LoadingScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: '900',
            color: '#A80000',
            letterSpacing: -1,
          }}
        >
          ST★UCHI
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#005994',
            marginTop: -16,
            marginLeft: 2,
          }}
        >
          *
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
    logo: {
      width: 120,
      height: 120,
      marginBottom: theme.spacing.l,
    },
    spinner: {
      marginTop: theme.spacing.m,
    },
  });
