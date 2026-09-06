'use client';

import React, { useState, useEffect } from 'react';
import SUNSTAR_DATA from '@/lib/data';
import SectionHeader from '@/components/molecules/SectionHeader';

export default function RashifalSection() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [rashifalList, setRashifalList] = useState(SUNSTAR_DATA.rashifal || []);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('/api/rashifal')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.predictions) && data.predictions.length > 0) {
          setRashifalList(data.predictions);
          setIsLive(true);
        }
      })
      .catch((err) => console.warn('Live rashifal fallback:', err));
  }, []);

  return (
    <div id="rashifal" className="rashifal-section-block" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <SectionHeader title="🔮 दैनिक राशिफल (Daily Horoscope)" viewAllHref="/rashifal" viewAllText="सबै राशिफल (दैनिक, साप्ताहिक, मासिक, वार्षिक) ➔" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px',
        }}
      >
        {rashifalList.map((item: any) => (
          <div
            key={item.id}
            onClick={() => setSelectedSign(item)}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 14px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.25s ease',
            }}
            className="rashifal-card-item"
          >
            <div
              style={{
                fontSize: '2rem',
                lineHeight: 1,
                marginBottom: '8px',
                color: 'var(--brand-orange)',
              }}
            >
              {item.symbol}
            </div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '2px',
              }}
            >
              {item.sign}
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              {item.latinName}
            </span>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(255, 85, 0, 0.1)',
                  color: 'var(--brand-orange)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                रंग: {item.luckyColor}
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(11, 34, 64, 0.08)',
                  color: 'var(--brand-blue)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                अंक: {item.luckyNumber}
              </span>
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
                height: '2.9em',
                overflow: 'hidden',
              }}
            >
              {item.prediction}
            </p>

            <span
              style={{
                display: 'inline-block',
                marginTop: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--brand-blue)',
              }}
            >
              विस्तृत पढ्नुहोस् ➔
            </span>
          </div>
        ))}
      </div>

      {selectedSign && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedSign(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2.5rem', color: 'var(--brand-orange)' }}>
                  {(selectedSign as any).symbol}
                </span>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {(selectedSign as any).sign} ({(selectedSign as any).latinName})
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(selectedSign as any).dateRange}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSign(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-alt)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                🎨 शुभ रंग: <strong>{(selectedSign as any).luckyColor}</strong>
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                🔢 शुभ अंक: <strong>{(selectedSign as any).luckyNumber}</strong>
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-blue)', marginBottom: '6px' }}>
                आजको दैनिक राशिफल
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {(selectedSign as any).prediction}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedSign(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'var(--brand-blue)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
