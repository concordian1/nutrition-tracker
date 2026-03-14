import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser';

export default function BarcodeScanner({ onDetected, onClose }) {
  const videoRef  = useRef(null);
  const readerRef = useRef(null);
  const [error, setError]   = useState('');
  const [ready, setReady]   = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    async function start() {
      try {
        // Prefer rear camera on mobile
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const rear = devices.find(d =>
          d.label.toLowerCase().includes('back') ||
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('environment')
        );
        const deviceId = rear?.deviceId || devices[0]?.deviceId;

        await reader.decodeFromVideoDevice(
          deviceId || undefined,
          videoRef.current,
          (result, err) => {
            if (result && !paused) {
              setPaused(true);
              onDetected(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
              // Ignore not-found errors (normal during scanning)
            }
          }
        );
        setReady(true);
      } catch (e) {
        if (e.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera in your browser settings.');
        } else if (e.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError(`Camera error: ${e.message}`);
        }
      }
    }

    start();

    return () => {
      try { reader.reset(); } catch (_) {}
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 8px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        background: 'rgba(0,0,0,0.8)',
        zIndex: 10,
      }}>
        <span style={{ color: '#fff', fontSize: 17, fontWeight: 600 }}>Scan Barcode</span>
        <button onClick={onClose} style={{
          color: '#fff', fontSize: 28, lineHeight: 1,
          background: 'none', border: 'none', padding: '0 4px',
        }}>×</button>
      </div>

      {/* Viewfinder */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          autoPlay muted playsInline
        />

        {/* Aiming overlay */}
        {ready && !error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 260, height: 120,
              border: '2px solid rgba(255,255,255,0.8)',
              borderRadius: 8,
              boxShadow: '0 0 0 2000px rgba(0,0,0,0.45)',
              position: 'relative',
            }}>
              {/* Corner brackets */}
              {[
                { top: -2, left: -2, borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '4px 0 0 0' },
                { top: -2, right: -2, borderTop: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 4px 0 0' },
                { bottom: -2, left: -2, borderBottom: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '0 0 0 4px' },
                { bottom: -2, right: -2, borderBottom: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 0 4px 0' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
              ))}
              {/* Scan line animation */}
              <div style={{
                position: 'absolute', left: 4, right: 4, height: 2,
                background: 'rgba(50,200,100,0.8)',
                animation: 'scan 1.8s ease-in-out infinite',
              }} />
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.85)', borderRadius: 12,
              padding: '20px 24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📷</div>
              <p style={{ color: '#fff', fontSize: 15, lineHeight: 1.5 }}>{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {!ready && !error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ color: '#fff', fontSize: 15 }}>Starting camera…</p>
          </div>
        )}

        {/* Detected flash */}
        {paused && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(50,200,100,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.8)', borderRadius: 12,
              padding: '16px 24px',
            }}>
              <p style={{ color: '#5dcc88', fontSize: 16, fontWeight: 600 }}>✓ Barcode detected</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        background: 'rgba(0,0,0,0.8)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          Point camera at barcode — detects automatically
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0%   { top: 8px; }
          50%  { top: calc(100% - 10px); }
          100% { top: 8px; }
        }
      `}</style>
    </div>
  );
}
