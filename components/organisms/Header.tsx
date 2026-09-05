'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SUNSTAR_DATA from '@/lib/data';
import WeatherWidget from '@/components/molecules/WeatherWidget';
import LiveDateBadge from '@/components/molecules/LiveDateBadge';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

export default function Header({
  onOpenSearch,
}: {
  onOpenSearch?: () => void;
}) {
  const [theme, setTheme] = useState<string>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('sunstar_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('sunstar_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <>
      {/* Top Leaderboard Banner above header */}
      <div className="container" style={{ paddingTop: '10px' }}>
        <Link href="/login" style={{ display: 'block', overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets-cdn.ekantipur.com/uploads/source/ads/desktop-3082026051412.jpg"
            alt="Top Header Ad Banner"
            style={{ width: '100%', maxHeight: '110px', objectFit: 'cover', display: 'block' }}
          />
        </Link>
      </div>

      <header className="top-utility-bar">
        <div className="container">
          <div className="utility-left">
            <LiveDateBadge text="१५ भाद्र २०८३, सोमबार" />
            <WeatherWidget
              city={SUNSTAR_DATA.weather.city}
              temp={SUNSTAR_DATA.weather.temp}
              aqi={SUNSTAR_DATA.weather.aqi}
            />
            <div className="trending-pills">
              <span className="trending-label">🔥 ट्रेन्डिङ:</span>
              <a href="#hero" className="pill-item">
                #सनस्टार_न्युज_शुभारम्भ
              </a>
              <a href="#hero" className="pill-item">
                #पोखरा_डिजिटल_पत्रकारिता
              </a>
              <a href="#business" className="pill-item">
                #गण्डकी_प्रदेश
              </a>
            </div>
          </div>
          <div className="utility-right">
            <Button
              variant="icon"
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
              }}
              aria-label="Search news"
            >
              🔍 समाचार खोज्नुहोस्
            </Button>
            <Button variant="icon" onClick={toggleTheme} aria-label="Toggle Theme">
              {mounted && theme === 'dark' ? '☀️ दिन' : '🌙 रात'}
            </Button>
          </div>
        </div>
      </header>

      <div className="main-header">
        <div className="container">
          <div className="brand-wrapper">
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/sunstar-logo.jpg"
                alt="Sunstar News Logo"
                className="brand-logo-img"
              />
              <div className="brand-text-block">
                <span className="brand-name">SUNSTAR NEWS</span>
                <span className="brand-tagline">
                  {SUNSTAR_DATA.sourceInfo.tagline}
                </span>
              </div>
            </Link>
          </div>

          <div className="header-ad-space" style={{ overflow: 'hidden', padding: 0 }}>
            <Link href="/login" style={{ display: 'block', width: '100%', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://assets-cdn.ekantipur.com/uploads/source/ads/desktop-3082026051412.jpg"
                alt="Header Ad Space"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
