'use client';

import React, { useRef, useState, useEffect } from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import Avatar from '@/components/atoms/Avatar';
import { Opinion } from '@/lib/data';

interface OpinionGridSectionProps {
  title?: string;
  opinions: Opinion[];
  onSelectArticle?: (id: string) => void;
}

export default function OpinionGridSection({
  title = '✍️ विचार / विश्लेषण (Opinions & Analysis)',
  opinions,
  onSelectArticle,
}: OpinionGridSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!opinions || opinions.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const updateActiveIndex = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.clientWidth / (window.innerWidth > 768 ? 3 : 1);
    const index = Math.round(container.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, opinions.length - 1));
  };

  const handleClick = (id: string) => {
    if (onSelectArticle) {
      onSelectArticle(id);
    }
  };

  return (
    <section id="opinion" className="opinion-carousel-section-block" style={{ marginBottom: '28px' }}>
      <div className="opinion-carousel-header">
        <SectionHeader title={title} viewAllHref="/category/opinion" />
        <div className="carousel-nav-controls">
          <button
            className="carousel-arrow-btn"
            onClick={() => handleScroll('left')}
            aria-label="Previous Opinion"
            title="अघिल्लो विचार"
          >
            ‹
          </button>
          <button
            className="carousel-arrow-btn"
            onClick={() => handleScroll('right')}
            aria-label="Next Opinion"
            title="पछिल्लो विचार"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="opinion-carousel-container"
        ref={scrollRef}
        onScroll={updateActiveIndex}
      >
        {opinions.map((op, idx) => (
          <div
            key={op.id || idx}
            className={`opinion-carousel-card ${idx === 0 ? 'lead-opinion-highlight' : ''}`}
            onClick={() => handleClick(op.id)}
          >
            <div className="opinion-card-top">
              <div className="avatar-ring-wrapper">
                <Avatar src={op.avatar} alt={op.author} size={64} />
              </div>
              <div className="opinion-author-meta">
                <h4 className="opinion-author-name">{op.author}</h4>
                <p className="opinion-author-role">{op.role || 'जलवायु राजनीति विज्ञ (सनस्टार विचार)'}</p>
              </div>
            </div>

            <h3 className="opinion-card-title">{op.title}</h3>
            
            {op.summary && (
              <p className="opinion-card-summary">{op.summary}</p>
            )}

            <div className="opinion-card-footer">
              <span className="read-time-pill">⏱️ {op.time || '६ मिनेट पाठ'}</span>
              <span className="opinion-badge-tag">✍️ Sunstar Opinion</span>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dot Indicators */}
      <div className="carousel-dots-wrapper">
        {opinions.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => {
              if (scrollRef.current) {
                const cardWidth = scrollRef.current.clientWidth;
                scrollRef.current.scrollTo({
                  left: i * cardWidth * 0.6,
                  behavior: 'smooth',
                });
              }
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
