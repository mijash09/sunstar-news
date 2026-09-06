'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          padding: '36px',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '12px', color: 'var(--brand-orange)' }}>
          केही प्राविधिक समस्या आयो (Something Went Wrong)
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          पृष्ठ लोड गर्दा अप्रत्याशित समस्या देखियो। कृपया केही समय पछि पुनः प्रयास गर्नुहोस् वा गृहपृष्ठमा फर्कनुहोस्।
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            className="shadcn-btn shadcn-btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            🔄 पुनः प्रयास गर्नुहोस् (Try Again)
          </button>

          <Link
            href="/"
            className="shadcn-btn shadcn-btn-outline"
            style={{ padding: '10px 20px', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            🏠 गृहपृष्ठ (Go Home)
          </Link>
        </div>
      </div>
    </div>
  );
}
