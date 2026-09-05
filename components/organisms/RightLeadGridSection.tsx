'use client';

import React from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import Badge from '@/components/atoms/Badge';
import { Article } from '@/lib/data';

interface RightLeadGridSectionProps {
  title: string;
  categorySlug: string;
  articles: Article[];
  onSelectArticle?: (id: string) => void;
}

export default function RightLeadGridSection({
  title,
  categorySlug,
  articles,
  onSelectArticle,
}: RightLeadGridSectionProps) {
  if (!articles || articles.length === 0) return null;

  const lead = articles[0];
  const sub1 = articles[1] || articles[0];
  const sub2 = articles[2] || articles[0];
  const sub3 = articles[3] || articles[0];

  const handleClick = (id: string) => {
    if (onSelectArticle) {
      onSelectArticle(id);
    }
  };

  return (
    <section id={categorySlug} className="top-grid-section-block" style={{ marginBottom: '24px' }}>
      <SectionHeader title={title} viewAllHref={`/category/${categorySlug}`} />

      <div className="top-grid-parent">
        {/* div1: Big Lead Featured Article (Left Side - 3 columns) */}
        <div
          className="top-grid-div1 right-lead-feature-card"
          onClick={() => handleClick(lead.id)}
          style={{ cursor: 'pointer' }}
        >
          {lead.image && (
            <div className="right-lead-image-wrap" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                <Badge variant="category">{lead.category || 'सनस्टार समाचार'}</Badge>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lead.image} alt={lead.title} />
            </div>
          )}
          <div className="right-lead-body" style={{ padding: '20px' }}>
            <h2 className="right-lead-title" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '10px' }}>
              {lead.title}
            </h2>
            {lead.summary && (
              <p className="right-lead-summary" style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                {lead.summary}
              </p>
            )}
            <div className="right-lead-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 'auto' }}>
              <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>🔴 {lead.source || 'Sunstar News'}</span>
              <span>⏱️ {lead.time || 'ताजा समाचार'}</span>
            </div>
          </div>
        </div>

        {/* div6: Top Secondary Article (Right Side - 2 columns, top 3 rows) */}
        <div
          className="top-grid-div6 left-sub-card-large"
          onClick={() => handleClick(sub1.id)}
          style={{ cursor: 'pointer' }}
        >
          {sub1.image && (
            <div className="left-sub-thumb" style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
                <Badge variant="source">{sub1.category || 'ताजा'}</Badge>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sub1.image} alt={sub1.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="left-sub-body" style={{ marginTop: '8px' }}>
            <h3 className="left-sub-title" style={{ fontSize: '1.08rem', fontWeight: 800, lineHeight: 1.38 }}>
              {sub1.title}
            </h3>
            {sub1.summary && (
              <p className="left-sub-summary" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {sub1.summary}
              </p>
            )}
            <span className="sub-time" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
              ⏱️ {sub1.time || 'अघि'}
            </span>
          </div>
        </div>

        {/* div5: Middle Secondary Row Article (Right Side - Row 4) */}
        <div
          className="top-grid-div5 left-sub-card-row"
          onClick={() => handleClick(sub2.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className="left-sub-row-content" style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--brand-orange)', fontWeight: 700, marginBottom: '2px' }}>
              {sub2.category || 'विशेष'}
            </div>
            <h4 className="left-sub-row-title" style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.35 }}>
              {sub2.title}
            </h4>
            <span className="sub-time" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              ⏱️ {sub2.time || 'अघि'}
            </span>
          </div>
          {sub2.image && (
            <div className="left-sub-mini-thumb" style={{ width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sub2.image} alt={sub2.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* div7: Bottom Secondary Row Article (Right Side - Row 5) */}
        <div
          className="top-grid-div7 left-sub-card-row"
          onClick={() => handleClick(sub3.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className="left-sub-row-content" style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--brand-orange)', fontWeight: 700, marginBottom: '2px' }}>
              {sub3.category || 'ताजा'}
            </div>
            <h4 className="left-sub-row-title" style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.35 }}>
              {sub3.title}
            </h4>
            <span className="sub-time" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              ⏱️ {sub3.time || 'अघि'}
            </span>
          </div>
          {sub3.image && (
            <div className="left-sub-mini-thumb" style={{ width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sub3.image} alt={sub3.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
