'use client';

import React, { useState } from 'react';
import { getAllArticles, Article } from '@/lib/data';
import Badge from '@/components/atoms/Badge';

export default function SearchModal({
  isOpen,
  onClose,
  onSelectArticle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (id: string) => void;
}) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const allArticles = getAllArticles();
  const filtered = query.trim()
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          (a.summary && a.summary.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content"
        style={{ maxWidth: '650px', padding: '24px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            🔍 समाचार खोज्नुहोस् (Search News)
          </h2>
          <button
            onClick={onClose}
            style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="शीर्षक वा विषयवस्तु टाइप गर्नुहोस्..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '1rem',
            border: '2px solid var(--brand-orange)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}
        />

        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {query.trim() === '' ? (
            <div
              style={{
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              खोज्नका लागि शब्द टाइप गर्नुहोस्...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              कुनै समाचार भेटिएन।
            </div>
          ) : (
            filtered.map((item: Article) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectArticle(item.id);
                  onClose();
                }}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-card)',
                  transition: 'var(--transition)',
                }}
              >
                <Badge variant="category">{item.category}</Badge>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginTop: '4px',
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
