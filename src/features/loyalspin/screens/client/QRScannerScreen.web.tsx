import React, { useEffect, useRef, useState } from 'react';

// html5-qrcode is web-only — imported dynamically to avoid native bundling issues
let Html5Qrcode: any = null;
if (typeof window !== 'undefined') {
  try {
    Html5Qrcode = require('html5-qrcode').Html5Qrcode;
  } catch (e) {
    console.warn('html5-qrcode not available', e);
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanStatus =
  | 'idle'
  | 'requesting'
  | 'scanning'
  | 'denied'
  | 'error'
  | 'success';

// ─── parseProjectId ───────────────────────────────────────────────────────────

function parseProjectId(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol === 'loyalspin:') {
      const parts = url.pathname.replace(/^\/\//, '').split('/');
      if (parts[0] === 'project' && parts[1]) return parts[1];
    }
  } catch {
    // not a URL — use raw value
  }
  return value.trim() || 'default';
}

// ─── Component ────────────────────────────────────────────────────────────────

const SCANNER_ID = 'loyalspin-qr-reader';

export default function QRScannerScreen({ navigation }: any) {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [error, setError] = useState('');
  const scannerRef = useRef<any>(null);

  // ── Start scanner ────────────────────────────────────────────────────────
  const startScanner = async () => {
    if (!Html5Qrcode) {
      setError("Le scanner QR n'est pas disponible sur cette plateforme.");
      setStatus('error');
      return;
    }

    setStatus('requesting');
    setError('');

    try {
      // Request camera permission via browser API
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (e: any) {
      if (
        e?.name === 'NotAllowedError' ||
        e?.name === 'PermissionDeniedError'
      ) {
        setStatus('denied');
      } else {
        setError("Impossible d'accéder à la caméra.");
        setStatus('error');
      }
      return;
    }

    try {
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // prefer rear camera
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          setStatus('success');
          scanner.stop().catch(() => {});
          const projectId = parseProjectId(decodedText);
          navigation.replace('ClientSpin', { projectId });
        },
        () => {
          // scan failure — ignore (happens on every frame without QR)
        },
      );

      setStatus('scanning');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du démarrage du scanner.');
      setStatus('error');
    }
  };

  // ── Stop scanner on unmount ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div style={webStyles.page}>
      {/* Header */}
      <div style={webStyles.header}>
        <button
          onClick={() => navigation.goBack()}
          style={webStyles.backBtn}
        >
          ← Retour
        </button>
        <h1 style={webStyles.title}>Scanner un QR Code</h1>
      </div>

      {/* Main content */}
      <div style={webStyles.content}>
        {/* Camera container — always rendered so html5-qrcode can mount the video */}
        <div
          style={{
            ...webStyles.videoWrapper,
            display: status === 'scanning' || status === 'success' ? 'block' : 'none',
          }}
        >
          <div id={SCANNER_ID} style={webStyles.videoBox} />

          {/* Overlay viewfinder */}
          {status === 'scanning' && (
            <div style={webStyles.finderOverlay}>
              <div style={webStyles.finder}>
                {/* Animated scan line */}
                <div style={webStyles.scanLine} />
                {/* Corner brackets */}
                {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
                  <div key={pos} style={{ ...webStyles.corner, ...webStyles[pos] }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* States */}
        {status === 'idle' && (
          <div style={webStyles.stateBox}>
            <span style={webStyles.stateIcon}>📷</span>
            <p style={webStyles.stateText}>
              Cliquez pour activer la caméra et scanner le QR code de votre commerce.
            </p>
            <button onClick={startScanner} style={webStyles.primaryBtn}>
              Activer la caméra
            </button>
          </div>
        )}

        {status === 'requesting' && (
          <div style={webStyles.stateBox}>
            <span style={webStyles.stateIcon}>⏳</span>
            <p style={webStyles.stateText}>
              En attente de l'autorisation caméra…
            </p>
          </div>
        )}

        {status === 'denied' && (
          <div style={webStyles.stateBox}>
            <span style={webStyles.stateIcon}>🚫</span>
            <p style={webStyles.stateText}>
              Accès à la caméra refusé. Autorisez la caméra dans la barre
              d'adresse de votre navigateur, puis réessayez.
            </p>
            <button onClick={startScanner} style={webStyles.primaryBtn}>
              Réessayer
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={webStyles.stateBox}>
            <span style={webStyles.stateIcon}>⚠️</span>
            <p style={webStyles.stateText}>{error || 'Une erreur est survenue.'}</p>
            <button onClick={startScanner} style={webStyles.primaryBtn}>
              Réessayer
            </button>
          </div>
        )}

        {status === 'success' && (
          <div style={webStyles.stateBox}>
            <span style={webStyles.stateIcon}>✅</span>
            <p style={webStyles.stateText}>QR Code détecté ! Redirection…</p>
          </div>
        )}

        {status === 'scanning' && (
          <p style={webStyles.hint}>
            Pointez la caméra vers le QR code en magasin
          </p>
        )}
      </div>

      {/* Animated scan line keyframes */}
      <style>{`
        @keyframes scanMove {
          0%   { top: 10px;  opacity: 1; }
          50%  { top: 225px; opacity: 0.6; }
          100% { top: 10px;  opacity: 1; }
        }
        @keyframes scanLinePulse {
          0%   { box-shadow: 0 0 6px 2px #10b981; }
          50%  { box-shadow: 0 0 14px 4px #10b981; }
          100% { box-shadow: 0 0 6px 2px #10b981; }
        }
        #${SCANNER_ID} video {
          border-radius: 16px;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }
        #${SCANNER_ID} img { display: none !important; }
      `}</style>
    </div>
  );
}

// ─── Web Styles (plain CSS-in-JS objects) ─────────────────────────────────────

const CORNER_COLOR = '#10b981';
const CORNER_W = 4;
const CORNER_SZ = 28;

const webStyles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '20px 24px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#e2e8f0',
    fontWeight: 700,
    fontSize: 14,
    padding: '8px 16px',
    borderRadius: 20,
    cursor: 'pointer',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 900,
    margin: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    gap: 20,
  },

  // Video
  videoWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 480,
  },
  videoBox: {
    width: '100%',
    maxWidth: 480,
    height: 360,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    border: '2px solid rgba(255,255,255,0.1)',
  },

  // Finder overlay
  finderOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  finder: {
    position: 'relative',
    width: 250,
    height: 250,
  },

  // Scan line
  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: CORNER_COLOR,
    top: 10,
    animation: 'scanMove 2s ease-in-out infinite, scanLinePulse 2s ease-in-out infinite',
  },

  // Corner brackets
  corner: {
    position: 'absolute',
    width: CORNER_SZ,
    height: CORNER_SZ,
    borderColor: CORNER_COLOR,
    borderStyle: 'solid',
  },
  tl: {
    top: 0,
    left: 0,
    borderWidth: `${CORNER_W}px 0 0 ${CORNER_W}px`,
    borderRadius: '6px 0 0 0',
  },
  tr: {
    top: 0,
    right: 0,
    borderWidth: `${CORNER_W}px ${CORNER_W}px 0 0`,
    borderRadius: '0 6px 0 0',
  },
  bl: {
    bottom: 0,
    left: 0,
    borderWidth: `0 0 ${CORNER_W}px ${CORNER_W}px`,
    borderRadius: '0 0 0 6px',
  },
  br: {
    bottom: 0,
    right: 0,
    borderWidth: `0 ${CORNER_W}px ${CORNER_W}px 0`,
    borderRadius: '0 0 6px 0',
  },

  // State box
  stateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    maxWidth: 360,
    textAlign: 'center',
  },
  stateIcon: {
    fontSize: 64,
  },
  stateText: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: '22px',
    margin: 0,
  },
  primaryBtn: {
    backgroundColor: '#10b981',
    border: 'none',
    color: '#fff',
    fontWeight: 800,
    fontSize: 15,
    padding: '14px 32px',
    borderRadius: 16,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
    marginTop: 4,
  },

  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
    margin: 0,
  },
};
