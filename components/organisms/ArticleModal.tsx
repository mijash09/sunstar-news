'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '@/components/atoms/Badge';
import ArticleMeta from '@/components/molecules/ArticleMeta';
import SourcePill from '@/components/atoms/SourcePill';
import { Article } from '@/lib/data';

export default function ArticleModal({
  article,
  onClose,
}: {
  article: Article | null;
  onClose: () => void;
}) {
  if (!article) return null;

  return (
    <div
      className={`modal-overlay ${article ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div id="articleModalBody">
          <div className="reader-header">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <Badge variant="category">📌 {article.category || 'समाचार'}</Badge>
              <div className="source-credit-banner">
                📰 स्रोत: <SourcePill>{article.source || 'SunstarNews.com'}</SourcePill>
              </div>
            </div>
            <h1 className="reader-title">{article.title}</h1>
            <ArticleMeta
              author={article.author}
              authorImage={article.authorImage}
              date={article.date}
              time={article.time}
            />
            <Link
              href={`/news/${article.id}`}
              style={{
                display: 'inline-block',
                marginTop: '10px',
                color: 'var(--brand-orange)',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
              onClick={onClose}
            >
              पूर्ण पृष्ठमा हेर्नुहोस् 🔗
            </Link>
          </div>

          {article.image && (
            <div style={{ padding: '0 30px', marginTop: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image}
                style={{
                  width: '100%',
                  maxHeight: 450,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                }}
                alt={article.title}
              />
              {article.caption && (
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                    marginTop: 6,
                    textAlign: 'center',
                  }}
                >
                  {article.caption}
                </div>
              )}
            </div>
          )}

          <div
            className="reader-body"
            dangerouslySetInnerHTML={{
              __html: article.content || `<p>${article.summary || ''}</p>`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
