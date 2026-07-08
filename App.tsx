import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { setLoading as setReduxLoading } from './src/store/slices/authSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { ModalProvider } from './src/context/ModalContext';
import { OfflineIndicator } from './src/components/OfflineIndicator';
import { WebThemeHandler } from './src/components/WebThemeHandler';
import './src/i18n';

import { LoadingScreen } from './src/components/LoadingScreen';

// ── Error Boundary ─────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24, fontFamily: 'monospace', background: '#1a1a2e',
          color: '#e94560', minHeight: '100vh', boxSizing: 'border-box' as any,
        }}>
          <h2 style={{ color: '#e94560' }}>⚠️ App Crash — ErrorBoundary</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#fff', fontSize: 13 }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { authService } = await import('./src/services/authService');
        const { sessionService } = await import('./src/services/sessionService');

        const currentUser = await authService.getCurrentUser();
        await sessionService.initSession(currentUser);

        if (typeof window !== 'undefined') {
          const handleSessionExpiry = () => {
            console.log('Session expired - redirecting to login');
          };
          (window as any).addEventListener('session_expired', handleSessionExpiry);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      }
    };

    const initialize = async () => {
      try {
        await initializeSession();
        if (Platform.OS !== 'web') {
          console.log('App initialized successfully on native');
        } else {
          console.log('Running on web - Google Analytics auto-initialized');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
        store.dispatch(setReduxLoading(false));
      }
    };

    initialize();
  }, []);

  if (loading) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <LoadingScreen />
        </ThemeProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AuthProvider>
            <ToastProvider>
              <ModalProvider>
                <SafeAreaProvider style={{ flex: 1 }}>
                  <WebThemeHandler />
                  <OfflineIndicator />
                  <AppNavigator />
                </SafeAreaProvider>
              </ModalProvider>
            </ToastProvider>
          </AuthProvider>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
};

const AppWithBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithBoundary;
