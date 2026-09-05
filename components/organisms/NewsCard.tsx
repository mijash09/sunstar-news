'use client';

import React from 'react';
import Badge from '@/components/atoms/Badge';
import { Snippet } from '@/components/atoms/Typography';
import { Article } from '@/lib/data';

interface NewsCardProps {
  article: Article;
  onSelectArticle?: (id: string) => void;
}

export default function NewsCard({ article, onSelectArticle }: NewsCardProps) {
  return (
    <div
      className="standard-news-card"
      onClick={() => {
        if (onSelectArticle) onSelectArticle(article.id);
      }}
    >
      {article.image && (
        <div className="card-thumb">
          <Badge variant="source">🔴 {article.source || 'Sunstar News'}</Badge>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image} alt={article.title} />
        </div>
      )}
      <div className="card-body">
        {article.category && (
          <Badge
            variant="category"
            style={{
              position: 'static',
              display: 'inline-block',
              marginBottom: '8px',
            }}
          >
            {article.category}
          </Badge>
        )}
        <h3 className="card-title">{article.title}</h3>
        {article.summary && <Snippet>{article.summary}</Snippet>}
        <div className="article-meta" style={{ marginTop: 'auto' }}>
          <span>⏱️ {article.time}</span>
        </div>
      </div>
    </div>
  );
}
