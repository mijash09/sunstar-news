'use client';

import React, { useState } from 'react';
import NewsCard from '@/components/organisms/NewsCard';
import { Article } from '@/lib/data';
import Link from 'next/link';

interface CategoryLoadMoreProps {
  initialArticles: Article[];
  allArticles: Article[];
  categoryTitle: string;
}

export default function CategoryLoadMore({
  initialArticles,
  allArticles,
  categoryTitle,
}: CategoryLoadMoreProps) {
  const [displayedCount, setDisplayedCount] = useState(initialArticles.length || 6);

  const articlesToRender = allArticles.slice(0, displayedCount);
  const hasMore = displayedCount < allArticles.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 6);
  };

  return (
    <div style={{ marginTop: '36px' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)' }}>
        थप {categoryTitle} समाचार
      </h2>

      <div className="news-grid-3">
        {articlesToRender.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`}>
            <NewsCard article={item} />
          </Link>
        ))}
      </div>

      {hasMore ? (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            type="button"
            onClick={handleLoadMore}
            style={{
              backgroundColor: 'var(--brand-orange)',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
            }}
          >
            👇 थप समाचार लोड गर्नुहोस् (Load More {categoryTitle}) ➔
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '28px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          ✅ यस वर्गका सम्पूर्ण समाचारहरू प्रदर्शित भइसकेका छन्।
        </div>
      )}
    </div>
  );
}
