'use client';

import React from 'react';
import Badge from '@/components/atoms/Badge';

interface PradeshCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    source: string;
    time: string;
  };
  onSelectArticle?: (id: string) => void;
}

export default function PradeshCard({ item, onSelectArticle }: PradeshCardProps) {
  return (
    <div
      className="pradesh-item-card"
      onClick={() => {
        if (onSelectArticle) onSelectArticle(item.id);
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Badge variant="pradesh">📍 {item.location}</Badge>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--brand-orange)',
            fontWeight: 600,
          }}
        >
          {item.source || 'सनस्टार न्युज'}
        </span>
      </div>
      <h3
        className="card-title"
        style={{ fontSize: '1.05rem', marginTop: '6px' }}
      >
        {item.title}
      </h3>
      <div
        className="article-meta"
        style={{ border: 'none', padding: 0, marginTop: '10px' }}
      >
        <span>⏱️ {item.time}</span>
      </div>
    </div>
  );
}
