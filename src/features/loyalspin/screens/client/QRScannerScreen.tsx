import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  Platform,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// ─── Permission helper ────────────────────────────────────────────────────────

type PermStatus = 'unknown' | 'denied' | 'blocked' | 'granted' | 'checking';

const CAMERA_PERMISSION =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

// ─── QR Scanner Screen (Native) ───────────────────────────────────────────────

export default function QRScannerScreen({ navigation }: any) {
  const [permStatus, setPermStatus] = useState<PermStatus>('checking');
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const appState = useRef(AppState.currentState);

  const device = useCameraDevice('back');

  // ── Check / request camera permission ─────────────────────────────────────
  useEffect(() => {
    checkAndRequestPermission();
  }, []);

  // Re-check when app comes back to foreground (user may have changed settings)
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        checkAndRequestPermission();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, []);

  const checkAndRequestPermission = async () => {
    const result = await check(CAMERA_PERMISSION);
    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      setPermStatus('granted');
    } else if (result === RESULTS.DENIED) {
      const req = await request(CAMERA_PERMISSION);
      setPermStatus(
        req === RESULTS.GRANTED || req === RESULTS.LIMITED
          ? 'granted'
          : 'denied',
      );
    } else if (result === RESULTS.BLOCKED) {
      setPermStatus('blocked');
    } else {
      setPermStatus('denied');
    }
  };

  // ── QR Code scanner ───────────────────────────────────────────────────────
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8'],
    onCodeScanned: codes => {
      if (scanned) return;
      const value = codes[0]?.value;
      if (!value) return;
      setScanned(true);

      // Extract projectId from QR value.
      // Expected format: loyalspin://project/<projectId>  OR just a raw projectId string
      let projectId = 'default';
      try {
        const url = new URL(value);
        if (url.protocol === 'loyalspin:') {
          const parts = url.pathname.replace(/^\/\//, '').split('/');
          if (parts[0] === 'project' && parts[1]) projectId = parts[1];
        } else {
          projectId = value.trim() || 'default';
        }
      } catch {
        projectId = value.trim() || 'default';
      }

      navigation.replace('ClientSpin', { projectId });
    },
  });

  // ── UI states ─────────────────────────────────────────────────────────────

  if (permStatus === 'checking') {
    return <StatusScreen message="Vérification de la caméra…" />;
  }

  if (permStatus === 'denied') {
    return (
      <StatusScreen
        message="La caméra est nécessaire pour scanner le QR code."
        action="Autoriser la caméra"
        onAction={checkAndRequestPermission}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (permStatus === 'blocked') {
    return (
      <StatusScreen
        message={
          Platform.OS === 'ios'
            ? 'Accès caméra bloqué. Allez dans Réglages → LoyalSpin → Caméra.'
            : 'Accès caméra bloqué. Allez dans Paramètres → Applications → LoyalSpin → Autorisations.'
        }
        action="Ouvrir les Réglages"
        onAction={() => {
          const { openSettings } = require('react-native-permissions');
          openSettings();
        }}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (!device) {
    return (
      <StatusScreen
        message="Aucune caméra arrière trouvée sur cet appareil."
        onBack={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanned}
        codeScanner={codeScanner}
        torch={torchOn ? 'on' : 'off'}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backText}>✕ Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Scanner le QR Code</Text>
          <TouchableOpacity
            onPress={() => setTorchOn(t => !t)}
            style={styles.torchButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.torchIcon}>{torchOn ? '🔦' : '💡'}</Text>
          </TouchableOpacity>
        </View>

        {/* Viewfinder cutout */}
        <View style={styles.viewfinderWrap}>
          <View style={styles.viewfinder}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Scanning line animation */}
            <View style={styles.scanLine} />
          </View>
        </View>

        {/* Bottom hint */}
        <View style={styles.bottomBar}>
          <Text style={styles.hintText}>
            Pointez la caméra vers le QR code en magasin
          </Text>
          {scanned && (
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✅ QR Code détecté !</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Status Screen ────────────────────────────────────────────────────────────

function StatusScreen({
  message,
  action,
  onAction,
  onBack,
}: {
  message: string;
  action?: string;
  onAction?: () => void;
  onBack?: () => void;
}) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusIcon}>📷</Text>
      <Text style={styles.statusMessage}>{message}</Text>
      {action && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{action}</Text>
        </TouchableOpacity>
      )}
      {onBack && (
        <TouchableOpacity style={styles.backButtonStatus} onPress={onBack}>
          <Text style={styles.backButtonStatusText}>← Retour</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const FINDER_SIZE = 260;
const CORNER_SIZE = 28;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  backText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  topTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  torchButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  torchIcon: {
    fontSize: 18,
  },

  // Viewfinder
  viewfinderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  viewfinder: {
    width: FINDER_SIZE,
    height: FINDER_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Corner brackets
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#10b981',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: 6,
  },

  // Scan line
  scanLine: {
    position: 'absolute',
    width: FINDER_SIZE - 20,
    height: 2,
    backgroundColor: '#10b981',
    opacity: 0.85,
    top: '50%',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },

  // Bottom bar
  bottomBar: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    gap: 14,
  },
  hintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  successBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  successText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

  // Status screen
  statusContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  statusIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  statusMessage: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  backButtonStatus: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonStatusText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
});
