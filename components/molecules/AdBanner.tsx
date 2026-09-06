'use client';

import React from 'react';
import SUNSTAR_DATA from '@/lib/data';

interface AdBannerProps {
  imageUrl?: string;
  altText?: string;
  targetUrl?: string;
  margin?: string;
  maxHeight?: string;
  position?:
    | 'header-top'
    | 'hero-side'
    | 'mid-content-1'
    | 'mid-content-2'
    | 'sidebar-widget'
    | 'single-news-sidebar'
    | 'rashifal-top'
    | 'footer-top';
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
      {/* Top Advertisement Tag Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 12px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: 'var(--text-muted)',
          letterSpacing: '0.3px',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          📢 विज्ञापन
        </span>
        {position && (
          <span
            style={{
              fontSize: '0.65rem',
              backgroundColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700,
            }}
          >
            {position}
          </span>
        )}
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
