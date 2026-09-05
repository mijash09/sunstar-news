'use client';

import React from 'react';
import Link from 'next/link';

interface AdBannerProps {
  imageUrl?: string;
  altText?: string;
  margin?: string;
  maxHeight?: string;
}

export default function AdBanner({
  imageUrl = 'https://assets-cdn.ekantipur.com/uploads/source/ads/desktop-3082026051412.jpg',
  altText = 'सनस्टार डिजिटल विज्ञापन (Sunstar Digital Ad Network)',
  margin = '20px 0',
  maxHeight = '140px',
}: AdBannerProps) {
  return (
    <div
      className="ad-banner-block"
      style={{
        margin,
        textAlign: 'center',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          color: '#FFFFFF',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '4px',
          letterSpacing: '0.5px',
          zIndex: 2,
        }}
      >
        विज्ञापन / AD
      </div>

      <Link href="/login" style={{ display: 'block', textDecoration: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={altText}
          style={{
            width: '100%',
            maxHeight,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Link>
    </div>
  );
}
