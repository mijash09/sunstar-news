'use client';

import React, { useEffect, useState } from 'react';
import { getAllArticles } from '@/lib/data';
import { toNepaliRelativeTime } from '@/lib/nepaliDate';

export interface TimelineArticle {
  id: string;
  title: string;
  time?: string;
  source?: string;
  category?: string;
  image?: string;
  updated_at?: string;
  created_at?: string;
}

export default function TimelineFeed({
  items,
  onSelectArticle,
}: {
  items?: TimelineArticle[];
  onSelectArticle: (id: string) => void;
}) {
  const [, setTick] = useState(0);

  // Live ticker update every 30 seconds so relative timestamps update smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const fallbackArticles: TimelineArticle[] = (getAllArticles() || []).map((a) => ({
    id: a.id,
    title: a.title,
    time: a.time,
    source: a.source,
    category: a.category,
    image: a.image,
    updated_at: a.updated_at,
    created_at: a.created_at,
  }));

  const displayItems: TimelineArticle[] = (
    Array.isArray(items) && items.length > 0
      ? items
      : fallbackArticles
  ).slice(0, 5);

  const formatItemTime = (item: TimelineArticle) => {
    const timestamp = item.updated_at || item.created_at;
    if (timestamp) {
      return toNepaliRelativeTime(timestamp);
    }
    return item.time || 'भर्खरै';
  };

  return (
    <div className="timeline-card" style={{ marginBottom: '24px' }}>
      <div className="section-header" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="section-title" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ff4d4f', boxShadow: '0 0 8px #ff4d4f' }} />
          ⚡ ताजा समाचार
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-orange)', backgroundColor: 'rgba(250,140,22,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
          Live
        </span>
      </div>
      <ul className="timeline-list">
        {displayItems.map((item: TimelineArticle, index: number) => (
          <li
            key={item.id || index}
            className="timeline-item"
            onClick={() => onSelectArticle(item.id)}
          >
            <div className="timeline-dot" />
            <div className="timeline-time">
              {formatItemTime(item)} •{' '}
              <span style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>
                {item.source || 'SunstarNews.com'}
              </span>
            </div>
            <div className="timeline-title">{item.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
