'use client';

import React, { useState, useEffect } from 'react';
import SUNSTAR_DATA, { BannerAd } from '@/lib/data';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

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
  showTag?: boolean;
  isDashboardPreview?: boolean;
  onAddClick?: (posKeyword: string) => void;
}

const POSITION_INFO: Record<string, { name: string; size: string }> = {
  'header-top': { name: 'मुख्य माथिल्लो ब्यानर', size: '७२८ x ९० px' },
  'hero-side': { name: 'मुख्य समाचार दायाँ ब्यानर', size: '३०० x २५० px' },
  'mid-content-1': { name: 'मुख्य सामग्री बीचको ब्यानर', size: '७२८ x ९० px' },
  'mid-content-2': { name: 'प्रदेश समाचार बीचको ब्यानर', size: '७२८ x ९० px' },
  'sidebar-widget': { name: 'दायाँ स्टिकी ब्यानर (Sidebar Widget)', size: '३०० x २५० px' },
  'single-news-sidebar': { name: 'समाचार पाना दायाँ ब्यानर', size: '३०० x २५० px' },
  'rashifal-top': { name: 'राशिफल माथिल्लो ब्यानर', size: '७२८ x ९० px' },
  'footer-top': { name: 'फुटर माथिल्लो ब्यानर', size: '७२८ x ९० px' },
};

export default function AdBanner({
  imageUrl,
  altText = 'सनस्टार डिजिटल विज्ञापन (Sunstar Digital Ad Network)',
  targetUrl = '#',
  margin = '16px 0',
  maxHeight = '140px',
  position,
  showTag = true,
  isDashboardPreview = false,
  onAddClick,
}: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Find all active banners for this position
  const activeBanners: BannerAd[] =
    position && Array.isArray(SUNSTAR_DATA.banners)
      ? SUNSTAR_DATA.banners.filter((b) => b.position === position && b.isActive)
      : [];

  // Fallback to direct props if no position matching banner array
  if (activeBanners.length === 0 && imageUrl) {
    activeBanners.push({
      id: 'prop-ad',
      title: altText,
      imageUrl,
      targetUrl,
      position: position || 'header-top',
      isActive: true,
      clicksCount: 0,
    });
  }

  // Automatic timed carousel switching every 4 seconds if multiple banners in same position
  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  // PUBLIC SITE: If no active banner exists for this position, hide completely
  if (!isDashboardPreview && activeBanners.length === 0) {
    return null;
  }

  // DASHBOARD PREVIEW: If no active banner uploaded yet, show an interactive placeholder mockup
  if (isDashboardPreview && activeBanners.length === 0 && position) {
    const info = POSITION_INFO[position] || { name: position, size: 'अनुपात साइज' };

    return (
      <div
        className="ad-banner-preview-empty"
        style={{
          margin,
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '2px dashed #cbd5e1',
          backgroundColor: 'rgba(241, 245, 249, 0.6)',
          textAlign: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              fontWeight: 800,
              backgroundColor: '#e2e8f0',
              color: '#475569',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {position}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
            ({info.size})
          </span>
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          📢 {info.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          (हाल कुनै विज्ञापन ब्यानर सक्रिय छैन - सार्वजनिक पानामा यो भाग स्वतः लुक्नेछ)
        </div>
        {onAddClick && (
          <button
            type="button"
            onClick={() => onAddClick(position)}
            className="shadcn-btn shadcn-btn-primary"
            style={{ fontSize: '0.75rem', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={14} /> यहाँ विज्ञापन थप्नुहोस्
          </button>
        )}
      </div>
    );
  }

  const currentBanner = activeBanners[currentIndex % activeBanners.length] || activeBanners[0];
  const activeImage = currentBanner?.imageUrl || imageUrl;
  const activeTarget = currentBanner?.targetUrl || targetUrl;
  const activeTitle = currentBanner?.title || altText;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

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
      {showTag && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '3px 12px',
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '0.3px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            📢 विज्ञापन (Advertisement)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Carousel Multi-banner counter */}
            {activeBanners.length > 1 && (
              <span
                style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  color: 'var(--brand-blue)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                🔄 स्लाइडर ({(currentIndex % activeBanners.length) + 1}/{activeBanners.length})
              </span>
            )}

            {isDashboardPreview && position && (
              <span
                style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#15803d',
                  padding: '1px 8px',
                  borderRadius: '4px',
                  fontWeight: 800,
                }}
              >
                🟢 सक्रिय: {position} ({activeBanners.length} वटा)
              </span>
            )}

            {isDashboardPreview && position && onAddClick && (
              <button
                type="button"
                onClick={() => onAddClick(position)}
                className="shadcn-btn"
                style={{ padding: '1px 6px', fontSize: '0.65rem', backgroundColor: 'var(--brand-orange)', color: '#FFF' }}
                title="यसमा थप विज्ञापन ब्यानर जोड्नुहोस्"
              >
                + ब्यानर थप्नुहोस्
              </button>
            )}
          </div>
        </div>
      )}

      {/* Banner Media & Link Container */}
      <div style={{ position: 'relative' }}>
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
              transition: 'opacity 0.4s ease',
            }}
          />
        </a>

        {/* Carousel Next/Prev Controls if multiple active banners */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(2px)',
                zIndex: 2,
              }}
              title="अघिल्लो ब्यानर"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(2px)',
                zIndex: 2,
              }}
              title="पछिल्लो ब्यानर"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
