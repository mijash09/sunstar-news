'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <html lang="ne">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', color: '#0f172a' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '32px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e11d48', marginBottom: '12px' }}>
              मुख्य प्राविधिक त्रुटि भयो (Global Application Error)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
              एप लोड गर्दा गम्भीर समस्या देखियो। कृपया सर्भर रिफ्रेस गर्नुहोस् वा गृहपृष्ठमा जानुहोस्।
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔄 पुनः लोड गर्नुहोस् (Reset Application)
              </button>

              <a
                href="/"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                }}
              >
                🏠 गृहपृष्ठ (Go Home)
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
