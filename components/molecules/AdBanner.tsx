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
    | 'top-leaderboard'
    | 'header-ad-space'
    | 'header-top'
    | 'hero-side'
    | 'home-hero-below'
    | 'mid-content-1'
    | 'mid-content-2'
    | 'sidebar-widget'
    | 'single-news-sidebar'
    | 'news-top'
    | 'news-under-image'
    | 'news-in-content'
    | 'news-bottom'
    | 'rashifal-top'
    | 'footer-top'
    | string;
  banners?: BannerAd[] | any[];
  showTag?: boolean;
  isDashboardPreview?: boolean;
  onAddClick?: (posKeyword: string) => void;
}

export const BANNER_POSITION_INFO: Record<string, { name: string; size: string; page: string }> = {
  // Global & Header Slots
  'top-leaderboard': { name: 'शीर्ष लिडरबोर्ड ब्यानर (Top Leaderboard)', size: '९७० x १०० / ७२८ x ९० px', page: 'सबै पाना / शीर्ष भाग' },
  'header-ad-space': { name: 'हेडर विज्ञापन स्थान (Header Ad Space)', size: '७२८ x ९० px', page: 'सबै पाना / लोगो दायाँ' },

  // Home Page Slots
  'header-top': { name: 'मुख्य माथिल्लो ब्यानर (Header Top)', size: '७२८ x ९० px', page: 'गृहपृष्ठ / सबै पाना' },
  'home-hero-below': { name: 'मुख्य समाचार मुनिको ब्यानर (Below Hero)', size: '९७० x ९० / ७२८ x ९० px', page: 'गृहपृष्ठ' },
  'mid-content-1': { name: 'राजनीति र अर्थ बीचको ब्यानर (Mid 1)', size: '७२८ x ९० px', page: 'गृहपृष्ठ' },
  'mid-content-2': { name: 'खेलकुद र प्रदेश बीचको ब्यानर (Mid 2)', size: '७२८ x ९० px', page: 'गृहपृष्ठ' },
  'sidebar-widget': { name: 'दायाँ स्टिकी ब्यानर (Sidebar Widget)', size: '३०० x २५० px', page: 'गृहपृष्ठ साइडबार' },
  'footer-top': { name: 'फुटर माथिल्लो ब्यानर (Above Footer)', size: '७२८ x ९० px', page: 'सबै पाना' },

  // Single News Page Slots
  'news-top': { name: 'समाचार शीर्षक माथिल्लो ब्यानर (Above Title)', size: '७२८ x ९० px', page: 'समाचार पाना' },
  'news-under-image': { name: 'मुख्य तस्बिर मुनिको ब्यानर (Under Photo)', size: '७२८ x ९० px', page: 'समाचार पाना' },
  'news-in-content': { name: 'समाचार सामग्री बीचको ब्यानर (In-Content)', size: '७२८ x ९० px', page: 'समाचार पाना' },
  'single-news-sidebar': { name: 'समाचार दायाँ साइडबार ब्यानर (Sticky Sidebar)', size: '३०० x २५० px', page: 'समाचार पाना' },
  'news-bottom': { name: 'प्रतिक्रिया मुनिको ब्यानर (Article Bottom)', size: '७२८ x ९० px', page: 'समाचार पाना' },
  'rashifal-top': { name: 'राशिफल माथिल्लो ब्यानर', size: '७२८ x ९० px', page: 'राशिफल पाना' },
};

export default function AdBanner({
  imageUrl,
  altText = 'सनस्टार डिजिटल विज्ञापन (Sunstar Digital Ad Network)',
  targetUrl = '#',
  margin = '16px 0',
  maxHeight = '150px',
  position,
  banners,
  showTag = true,
  isDashboardPreview = false,
  onAddClick,
}: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fetchedBanners, setFetchedBanners] = useState<any[]>([]);

  // Automatically fetch banners from API if banners prop is not explicitly passed
  useEffect(() => {
    if (banners === undefined) {
      fetch('/api/banners')
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.data)) {
            setFetchedBanners(data.data);
          }
        })
        .catch(() => {});
    }
  }, [banners]);

  // Strictly use real banners only - NEVER use dummy/mock data!
  const sourceBanners: any[] = Array.isArray(banners) ? banners : fetchedBanners;

  // Find all active banners for this position (with alias matching)
  const activeBanners: any[] = position
    ? sourceBanners.filter((b) => {
        const bPos = String(b.position || '').toLowerCase().trim();
        const targetPos = String(position).toLowerCase().trim();
        const active = b.isActive !== undefined ? b.isActive : b.is_active;
        const isTrue = active === true || active === 1 || active === '1' || active === 'true';
        if (!isTrue) return false;

        if (bPos === targetPos) return true;
        // Aliases
        if (targetPos === 'top-leaderboard' && (bPos === 'top-header-banner' || bPos === 'top-leaderboard')) return true;
        if (targetPos === 'header-ad-space' && (bPos === 'header-logo-side' || bPos === 'header-ad-space' || bPos === 'hero-side')) return true;
        return false;
      })
    : [];

  // Fallback to direct props if no position matching banner array
  if (activeBanners.length === 0 && imageUrl) {
    activeBanners.push({
      id: 'prop-ad',
      title: altText,
      imageUrl,
      image_url: imageUrl,
      targetUrl,
      target_url: targetUrl,
      position: position || 'header-top',
      isActive: true,
      clicksCount: 0,
    });
  }

  // Automatic timed carousel switching every 4 seconds if multiple banners in same position
  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

  // Reset index if activeBanners length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeBanners.length, position]);

  // PUBLIC SITE: If no active banner exists for this position, hide completely
  if (!isDashboardPreview && activeBanners.length === 0) {
    return null;
  }

  // DASHBOARD PREVIEW: If no active banner uploaded yet, show an interactive placeholder mockup
  if (isDashboardPreview && activeBanners.length === 0 && position) {
    const info = BANNER_POSITION_INFO[position] || { name: position, size: 'अनुपात साइज', page: '' };

    return (
      <div
        className="ad-banner-preview-empty"
        style={{
          margin,
          padding: '18px 16px',
          borderRadius: 'var(--radius-md)',
          border: '2px dashed #cbd5e1',
          backgroundColor: 'rgba(241, 245, 249, 0.65)',
          textAlign: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.74rem',
              fontWeight: 800,
              backgroundColor: '#e2e8f0',
              color: '#334155',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {position}
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
            ({info.size})
          </span>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          📢 {info.name}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          (हाल कुनै विज्ञापन ब्यानर सक्रिय छैन - सार्वजनिक वेबसाइटमा यो भाग स्वतः लुक्नेछ)
        </div>
        {onAddClick && (
          <button
            type="button"
            onClick={() => onAddClick(position)}
            className="shadcn-btn shadcn-btn-primary"
            style={{
              fontSize: '0.78rem',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e88e5',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <Plus size={15} /> + यस स्थानमा ब्यानर थप्नुहोस्
          </button>
        )}
      </div>
    );
  }

  const currentBanner = activeBanners[currentIndex % activeBanners.length] || activeBanners[0];
  const activeImage = currentBanner?.imageUrl || currentBanner?.image_url || imageUrl;
  const activeTarget = currentBanner?.targetUrl || currentBanner?.target_url || targetUrl;
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

  const isMultiple = activeBanners.length > 1;

  return (
    <div
      className="ad-banner-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        margin,
        textAlign: 'center',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card, #ffffff)',
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
            backgroundColor: 'var(--bg-main, #f8fafc)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Carousel Multi-banner counter */}
            {isMultiple && (
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: 'rgba(30, 136, 229, 0.12)',
                  color: '#1e88e5',
                  padding: '1px 8px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                🔄 स्लाइडर ({(currentIndex % activeBanners.length) + 1}/{activeBanners.length})
              </span>
            )}

            {isDashboardPreview && position && (
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#15803d',
                  padding: '1px 8px',
                  borderRadius: '4px',
                  fontWeight: 800,
                }}
              >
                🟢 सक्रिय: {activeBanners.length} वटा ब्यानर
              </span>
            )}

            {isDashboardPreview && position && onAddClick && (
              <button
                type="button"
                onClick={() => onAddClick(position)}
                className="shadcn-btn"
                style={{
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  backgroundColor: 'var(--brand-orange, #f97316)',
                  color: '#FFF',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                title="यसमा थप विज्ञापन ब्यानर जोड्नुहोस्"
              >
                + थप्नुहोस्
              </button>
            )}
          </div>
        </div>
      )}

      {/* Banner Media & Link Container - Never cuts or crops images! */}
      <div style={{ position: 'relative', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
        <a
          href={activeTarget}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            width: '100%',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeImage}
            src={activeImage}
            alt={activeTitle}
            style={{
              width: '100%',
              maxHeight,
              height: 'auto',
              objectFit: 'contain', // Never crops or cuts image details/contact info
              display: 'block',
              margin: '0 auto',
              transition: 'opacity 0.35s ease',
            }}
          />
        </a>

        {/* Carousel Next/Prev Controls if multiple active banners */}
        {isMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(3px)',
                zIndex: 3,
                transition: 'background-color 0.2s',
              }}
              title="अघिल्लो ब्यानर"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(3px)',
                zIndex: 3,
                transition: 'background-color 0.2s',
              }}
              title="पछिल्लो ब्यानर"
            >
              <ChevronRight size={18} />
            </button>

            {/* Carousel Indicator Dots */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '5px',
                zIndex: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                padding: '2px 6px',
                borderRadius: '10px',
                backdropFilter: 'blur(2px)',
              }}
            >
              {activeBanners.map((_, idx) => (
                <span
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  style={{
                    width: idx === (currentIndex % activeBanners.length) ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: idx === (currentIndex % activeBanners.length) ? 'var(--brand-orange, #f97316)' : '#ffffff',
                    opacity: idx === (currentIndex % activeBanners.length) ? 1 : 0.65,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const TopLevelBanner = AdBanner;

