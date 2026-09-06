'use client';

import React from 'react';
import SUNSTAR_DATA from '@/lib/data';

interface AdBannerProps {
  imageUrl?: string;
  altText?: string;
  targetUrl?: string;
  margin?: string;
  maxHeight?: string;
  position?: 'header-top' | 'hero-side' | 'mid-content-1' | 'mid-content-2' | 'sidebar-widget' | 'footer-top';
}

export default function AdBanner({
  imageUrl,
  altText = 'सनस्टार डिजिटल विज्ञापन (Sunstar Digital Ad Network)',
  targetUrl = '#',
  margin = '20px 0',
  maxHeight = '140px',
  position,
}: AdBannerProps) {
  let activeImage = imageUrl || 'https://assets-cdn.ekantipur.com/uploads/source/ads/desktop-3082026051412.jpg';
  let activeTarget = targetUrl;
  let activeTitle = altText;

  if (position && Array.isArray(SUNSTAR_DATA.banners)) {
    const found = SUNSTAR_DATA.banners.find((b) => b.position === position && b.isActive);
    if (found) {
      activeImage = found.imageUrl || activeImage;
      activeTarget = found.targetUrl || activeTarget;
      activeTitle = found.title || activeTitle;
    }
  }

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

      <a href={activeTarget} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt={activeTitle}
          style={{
            width: '100%',
            maxHeight,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </a>
    </div>
  );
}
