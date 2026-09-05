'use client';

import React from 'react';
import Avatar from '@/components/atoms/Avatar';
import { Opinion } from '@/lib/data';

interface OpinionCardProps {
  opinion: Opinion;
  onSelectArticle?: (id: string) => void;
}

export default function OpinionCard({ opinion, onSelectArticle }: OpinionCardProps) {
  return (
    <div
      className="opinion-card-ekantipur"
      onClick={() => {
        if (onSelectArticle) onSelectArticle(opinion.id);
      }}
    >
      <div className="opinion-card-content">
        <span className="opinion-author-name">{opinion.author}</span>
        <h3 className="opinion-title">{opinion.title}</h3>
        <div className="read-time-badge">6 MINS READ</div>
      </div>
      <div className="opinion-avatar-box">
        <Avatar src={opinion.avatar} alt={opinion.author} size={64} />
      </div>
    </div>
  );
}
