'use client';

import React, { useState } from 'react';
import SUNSTAR_DATA from '@/lib/data';
import SectionHeader from '@/components/molecules/SectionHeader';

export default function RashifalSection() {
  const [selectedSign, setSelectedSign] = useState<any>(null);

  const rashifalList = SUNSTAR_DATA.rashifal || [];

  return (
    <section id="rashifal" className="rashifal-section-block" style={{ marginBottom: '24px' }}>
      <SectionHeader title="🔮 दैनिक राशिफल (Daily Horoscope)" viewAllHref="#rashifal" viewAllText="आजको राशिफल ➔" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px',
          marginTop: '16px',
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
              position: 'relative',
              overflow: 'hidden',
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
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
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
                fontWeight: 700,
                color: 'var(--brand-orange)',
              }}
            >
              विस्तृत पढ्नुहोस् ➔
            </span>
          </div>
        ))}
      </div>

      {/* Rashifal Detail Modal */}
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
            padding: '16px',
          }}
          onClick={() => setSelectedSign(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSign(null)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '3rem', color: 'var(--brand-orange)' }}>{selectedSign.symbol}</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {selectedSign.sign} ({selectedSign.latinName})
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{SUNSTAR_DATA.rashifalDate}</p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                margin: '14px 0',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <span style={{ backgroundColor: 'rgba(255, 85, 0, 0.1)', color: 'var(--brand-orange)', padding: '4px 12px', borderRadius: '6px' }}>
                🎨 शुभ रंग: {selectedSign.luckyColor}
              </span>
              <span style={{ backgroundColor: 'rgba(11, 34, 64, 0.08)', color: 'var(--brand-blue)', padding: '4px 12px', borderRadius: '6px' }}>
                🔢 शुभ अंक: {selectedSign.luckyNumber}
              </span>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', margin: '16px 0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-blue)', marginBottom: '6px' }}>
                📖 दैनिक फल (Daily Prediction):
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{selectedSign.prediction}</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                onClick={() => setSelectedSign(null)}
                style={{
                  backgroundColor: 'var(--brand-orange)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                बन्द गर्नुहोस् ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
