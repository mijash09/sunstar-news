'use client';

import React from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import Badge from '@/components/atoms/Badge';
import { Article } from '@/lib/data';

interface InterviewGridSectionProps {
  title?: string;
  articles: Article[];
  onSelectArticle?: (id: string) => void;
}

export default function InterviewGridSection({
  title = '🎙️ अन्तर्वार्ता (Interview)',
  articles,
  onSelectArticle,
}: InterviewGridSectionProps) {
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
    <section id="interview" className="interview-grid-section-block" style={{ marginBottom: '20px' }}>
      <SectionHeader title={title} viewAllHref="/category/interview" />

      <div className="top-grid-parent">
        {/* div1: Main Big Featured Interview on the RIGHT Side */}
        <div
          className="top-grid-div1 right-lead-feature-card interview-lead-style"
          onClick={() => handleClick(lead.id)}
        >
          {lead.image && (
            <div className="right-lead-image-wrap">
              <span className="interview-mic-tag">🎙️ Sunstar Interview</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lead.image} alt={lead.title} />
            </div>
          )}
          <div className="right-lead-body">
            <h2 className="right-lead-title">{lead.title}</h2>
            {lead.summary && <p className="right-lead-summary">{lead.summary}</p>}
            <div className="right-lead-meta">
              <span>🔴 Sunstar Interview</span>
              <span>⏱️ {lead.time || '१ घण्टा अघि'}</span>
            </div>
          </div>
        </div>

        {/* div6: Top Sub-Interview on LEFT Side */}
        <div
          className="top-grid-div6 left-sub-card-large interview-sub-style"
          onClick={() => handleClick(sub1.id)}
        >
          {sub1.image && (
            <div className="left-sub-thumb">
              <span className="interview-mic-tag">🎙️ Interview</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sub1.image} alt={sub1.title} />
            </div>
          )}
          <div className="left-sub-body">
            <h3 className="left-sub-title">{sub1.title}</h3>
            {sub1.summary && <p className="left-sub-summary">{sub1.summary}</p>}
            <span className="sub-time">⏱️ {sub1.time || '२ घण्टा अघि'}</span>
          </div>
        </div>

        {/* div5: Middle Sub-Interview on LEFT Side */}
        <div
          className="top-grid-div5 left-sub-card-row interview-sub-style"
          onClick={() => handleClick(sub2.id)}
        >
          <div className="left-sub-row-content">
            <h4 className="left-sub-row-title">{sub2.title}</h4>
            <span className="sub-time">⏱️ {sub2.time || '३ घण्टा अघि'}</span>
          </div>
          {sub2.image && (
            <div className="left-sub-mini-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sub2.image} alt={sub2.title} />
            </div>
          )}
        </div>

        {/* div7: Bottom Sub-Interview on LEFT Side */}
        <div
          className="top-grid-div7 left-sub-card-row interview-sub-style"
          onClick={() => handleClick(sub3.id)}
        >
          <div className="left-sub-row-content">
            <h4 className="left-sub-row-title">{sub3.title}</h4>
            <span className="sub-time">⏱️ {sub3.time || '४ घण्टा अघि'}</span>
          </div>
          {sub3.image && (
            <div className="left-sub-mini-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sub3.image} alt={sub3.title} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
