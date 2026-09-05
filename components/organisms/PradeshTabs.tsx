'use client';

import React, { useState } from 'react';
import SUNSTAR_DATA from '@/lib/data';
import Link from 'next/link';

const provinces = [
  { key: 'gandaki', label: 'गण्डकी' },
  { key: 'koshi', label: 'कोशी' },
  { key: 'madhesh', label: 'मधेश' },
  { key: 'bagmati', label: 'बाग्मती' },
  { key: 'lumbini', label: 'लुम्बिनी' },
  { key: 'karnali', label: 'कर्णाली' },
  { key: 'sudurpaschim', label: 'सुदूरपश्चिम' },
];

const provinceImages: Record<string, string> = {
  gandaki: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
  koshi: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80',
  madhesh: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80',
  bagmati: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
  lumbini: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  karnali: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80',
  sudurpaschim: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
};

export default function PradeshTabs({
  onSelectArticle,
}: {
  onSelectArticle: (id: string) => void;
}) {
  const [activeProvince, setActiveProvince] = useState('gandaki');

  const rawItems = (SUNSTAR_DATA.pradeshNews[activeProvince] || []) as any[];

  const items = rawItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: `प्रदेश (${item.location || 'नेपाल'})`,
    time: item.time || 'ताजा',
    location: item.location || 'नेपाल',
    source: item.source || 'सनस्टार न्युज',
    image: item.image || provinceImages[activeProvince] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
    summary: item.summary || `${item.location ? item.location + ': ' : ''}${item.title}`,
  }));

  const leadItem = items[0];
  const subItems = items.slice(1, 5);

  return (
    <section id="pradesh" className="pradesh-section-ekantipur" style={{ marginBottom: '24px' }}>
      <div className="pradesh-header-bar">
        <h2 className="pradesh-title-heading">🏔️ प्रदेश समाचार (Province News)</h2>
        <div className="pradesh-tabs-bar">
          {provinces.map((prov) => (
            <button
              key={prov.key}
              type="button"
              className={`pradesh-tab-btn ${activeProvince === prov.key ? 'active' : ''}`}
              onClick={() => setActiveProvince(prov.key)}
            >
              {prov.label}
            </button>
          ))}
        </div>
      </div>

      {leadItem && (
        <div className="pradesh-content-grid">
          <div className="pradesh-lead-card" onClick={() => onSelectArticle(leadItem.id)}>
            {leadItem.image && (
              <div className="pradesh-lead-img-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={leadItem.image} alt={leadItem.title} />
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--brand-orange)',
                  backgroundColor: 'rgba(255, 85, 0, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginRight: '8px',
                }}
              >
                📍 {leadItem.location}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ⏱️ {leadItem.time}
              </span>
            </div>
            <h3 className="pradesh-lead-title" style={{ marginTop: '6px' }}>
              {leadItem.title}
            </h3>
            {leadItem.summary && <p className="pradesh-lead-summary">{leadItem.summary}</p>}
          </div>

          <div className="pradesh-sub-list">
            {subItems.map((item) => (
              <div
                key={item.id}
                className="pradesh-sub-item"
                onClick={() => onSelectArticle(item.id)}
                style={{ cursor: 'pointer', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-orange)', fontWeight: 600, marginBottom: '2px' }}>
                  📍 {item.location} • {item.time}
                </div>
                <h4 className="pradesh-sub-title" style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: '1.4' }}>
                  {item.title}
                </h4>
              </div>
            ))}

            <div style={{ marginTop: '16px' }}>
              <Link href={`/category/${activeProvince}`} className="view-all-link" style={{ fontWeight: 800 }}>
                सबै हेर्नुहोस् &gt;&gt;
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
