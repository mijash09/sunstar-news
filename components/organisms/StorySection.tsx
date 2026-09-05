'use client';

import React, { useRef, useState } from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import Avatar from '@/components/atoms/Avatar';
import InstagramStoryModal from '@/components/organisms/InstagramStoryModal';
import { StoryItem } from '@/lib/data';

interface StorySectionProps {
  title?: string;
  stories: StoryItem[];
  onSelectArticle?: (id: string) => void;
}

export default function StorySection({
  title = '📸 सनस्टार स्टोरी (Instagram Web Stories)',
  stories,
  onSelectArticle,
}: StorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!stories || stories.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.7;
    container.scrollTo({
      left:
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  const openStoryViewer = (index: number) => {
    setActiveStoryIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeStoryViewer = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <section id="stories" className="story-section-block" style={{ marginBottom: '28px' }}>
      <div className="story-section-header">
        <SectionHeader title={title} viewAllHref="/category/exclusive" />
        <div className="carousel-nav-controls">
          <button
            className="carousel-arrow-btn"
            onClick={() => handleScroll('left')}
            aria-label="Previous Story"
          >
            ‹
          </button>
          <button
            className="carousel-arrow-btn"
            onClick={() => handleScroll('right')}
            aria-label="Next Story"
          >
            ›
          </button>
        </div>
      </div>

      {/* 1. Instagram-Style Story Circles Bar */}
      <div className="ig-circles-bar">
        {stories.map((story, idx) => (
          <div
            key={`circle-${story.id}`}
            className="ig-circle-item"
            onClick={() => openStoryViewer(idx)}
          >
            <div className="ig-circle-ring">
              <Avatar
                src={
                  story.authorAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={story.author}
                size={58}
              />
              <span className="ig-live-badge">न्यू</span>
            </div>
            <span className="ig-circle-label">
              {story.author.split(' ')[0] || story.category}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Horizontal Visual Story Card Slider */}
      <div className="story-carousel-container" ref={scrollRef}>
        {stories.map((story, idx) => (
          <div
            key={story.id}
            className="story-card"
            onClick={() => openStoryViewer(idx)}
          >
            {/* Background Story Image */}
            <div
              className="story-card-bg"
              style={{ backgroundImage: `url(${story.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className="story-card-overlay" />

            {/* Top Author & Category Badge */}
            <div className="story-card-top">
              <div className="story-avatar-ring">
                <Avatar
                  src={
                    story.authorAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={story.author}
                  size={36}
                />
              </div>
              <span className="story-category-tag">{story.category}</span>
            </div>

            {/* Center Instagram Play Badge */}
            <div className="story-play-icon">
              <span>▶</span>
            </div>

            {/* Bottom Content Metadata */}
            <div className="story-card-bottom">
              <span className="story-author-name">✍️ {story.author}</span>
              <h3 className="story-title">{story.title}</h3>
              <div className="story-meta-row">
                <span className="story-views">👁️ {story.views || '३.२k'}</span>
                <span className="story-duration">⏱️ {story.duration || '१ मिनेट'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Full Instagram Story Modal Viewer */}
      <InstagramStoryModal
        stories={stories}
        initialIndex={activeStoryIndex}
        isOpen={isModalOpen}
        onClose={closeStoryViewer}
        onSelectArticle={onSelectArticle}
      />
    </section>
  );
}
