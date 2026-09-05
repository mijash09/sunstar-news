'use client';

import React from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import Link from 'next/link';
import { Article } from '@/lib/data';

interface NewsSectionEkantipurProps {
  title: string;
  categorySlug: string;
  leadArticle: Article;
  subArticles: Article[];
  onSelectArticle?: (id: string) => void;
}

export default function NewsSectionEkantipur({
  title,
  categorySlug,
  leadArticle,
  subArticles,
  onSelectArticle,
}: NewsSectionEkantipurProps) {
  if (!leadArticle) return null;

  const handleClick = (id: string) => {
    if (onSelectArticle) {
      onSelectArticle(id);
    }
  };

  return (
    <section id={categorySlug} className="ekantipur-section-block" style={{ marginBottom: '20px' }}>
      <SectionHeader title={title} viewAllHref={`/category/${categorySlug}`} />

      <div className="ekantipur-section-grid">
        {/* 1. Left Text Column */}
        {onSelectArticle ? (
          <div
            className="ekantipur-left-text"
            onClick={() => handleClick(leadArticle.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--brand-orange)',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {leadArticle.category || 'राजनीति'}
              </span>
            </div>
            <h2 className="ekantipur-main-headline" style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '10px' }}>
              {leadArticle.title}
            </h2>
            <p className="ekantipur-main-summary" style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {leadArticle.summary}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>🔴 {leadArticle.source || 'Sunstar News'}</span>
              <span>⏱️ {leadArticle.time || '८ मिनेट अघि'}</span>
            </div>
          </div>
        ) : (
          <Link href={`/news/${leadArticle.id}`} className="ekantipur-left-text">
            <div style={{ marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--brand-orange)',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {leadArticle.category || 'राजनीति'}
              </span>
            </div>
            <h2 className="ekantipur-main-headline">{leadArticle.title}</h2>
            <p className="ekantipur-main-summary">{leadArticle.summary}</p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>🔴 {leadArticle.source || 'Sunstar News'}</span>
              <span>⏱️ {leadArticle.time || '८ मिनेट अघि'}</span>
            </div>
          </Link>
        )}

        {/* 2. Center Big Photo Column */}
        {onSelectArticle ? (
          <div
            className="ekantipur-center-photo"
            onClick={() => handleClick(leadArticle.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadArticle.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80'}
              alt={leadArticle.title}
            />
          </div>
        ) : (
          <Link href={`/news/${leadArticle.id}`} className="ekantipur-center-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadArticle.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80'}
              alt={leadArticle.title}
            />
          </Link>
        )}

        {/* 3. Right Sub-Articles Column with Right Thumbnails */}
        <div className="ekantipur-right-sublist">
          {subArticles.slice(0, 4).map((item) =>
            onSelectArticle ? (
              <div
                key={item.id}
                className="ekantipur-sub-row"
                onClick={() => handleClick(item.id)}
              >
                <h3 className="ekantipur-sub-title">{item.title}</h3>
                {item.image && (
                  <div className="ekantipur-sub-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.id} href={`/news/${item.id}`} className="ekantipur-sub-row">
                <h3 className="ekantipur-sub-title">{item.title}</h3>
                {item.image && (
                  <div className="ekantipur-sub-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
