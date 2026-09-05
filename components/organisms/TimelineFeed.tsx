'use client';

import React from 'react';
import SUNSTAR_DATA from '@/lib/data';

export default function TimelineFeed({
  onSelectArticle,
}: {
  onSelectArticle: (id: string) => void;
}) {
  return (
    <div className="timeline-card" style={{ marginBottom: '24px' }}>
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <h3 className="section-title" style={{ fontSize: '1.2rem' }}>
          ⚡ ताजा समाचार (Timeline)
        </h3>
      </div>
      <ul className="timeline-list">
        {SUNSTAR_DATA.latestTimeline.map((item) => (
          <li
            key={item.id}
            className="timeline-item"
            onClick={() => onSelectArticle(item.id)}
          >
            <div className="timeline-dot" />
            <div className="timeline-time">
              {item.time} •{' '}
              <span style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>
                {item.source || 'सनस्टार न्युज'}
              </span>
            </div>
            <div className="timeline-title">{item.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
