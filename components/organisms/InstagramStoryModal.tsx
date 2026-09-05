'use client';

import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@/components/atoms/Avatar';
import { StoryItem } from '@/lib/data';

interface InstagramStoryModalProps {
  stories: StoryItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle?: (id: string) => void;
}

export default function InstagramStoryModal({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  onSelectArticle,
}: InstagramStoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Auto-progress bar timer (5 seconds per slide)
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // 50 steps = 5 seconds total duration
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, isPaused, stories.length, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen || !stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleReadFullArticle = () => {
    if (onSelectArticle && currentStory.articleId) {
      onSelectArticle(currentStory.articleId);
      onClose();
    }
  };

  return (
    <div className="ig-story-overlay" onClick={onClose}>
      <div
        className="ig-story-wrapper"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Progress Bars (1 bar per story slide) */}
        <div className="ig-story-progress-bar-container">
          {stories.map((_, idx) => (
            <div key={idx} className="ig-story-progress-track">
              <div
                className="ig-story-progress-fill"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="ig-story-header">
          <div className="ig-story-author-info">
            <div className="ig-story-avatar-border">
              <Avatar
                src={
                  currentStory.authorAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={currentStory.author}
                size={40}
              />
            </div>
            <div className="ig-story-meta-text">
              <span className="ig-story-author-name">{currentStory.author}</span>
              <span className="ig-story-time-badge">८ मिनेट अघि • {currentStory.category}</span>
            </div>
          </div>

          <div className="ig-story-header-actions">
            <span className="ig-story-live-pill">🔴 LIVE</span>
            <button className="ig-story-close-btn" onClick={onClose} aria-label="Close Story">
              ✕
            </button>
          </div>
        </div>

        {/* Story Slide Background Image */}
        <div
          className="ig-story-media"
          style={{ backgroundImage: `url(${currentStory.image})` }}
        >
          <div className="ig-story-media-overlay" />
        </div>

        {/* Tap Controls Overlay (Left 30% prev, Right 70% next) */}
        <div className="ig-story-tap-areas">
          <div className="ig-story-tap-left" onClick={handlePrev} />
          <div className="ig-story-tap-right" onClick={handleNext} />
        </div>

        {/* Desktop Side Navigation Buttons */}
        {currentIndex > 0 && (
          <button className="ig-story-nav-btn left" onClick={handlePrev} aria-label="Previous">
            ‹
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button className="ig-story-nav-btn right" onClick={handleNext} aria-label="Next">
            ›
          </button>
        )}

        {/* Story Content Captions & CTA Button */}
        <div className="ig-story-bottom-content">
          <span className="ig-story-views-tag">👁️ {currentStory.views || '३.२k हेराइ'}</span>
          <h2 className="ig-story-title">{currentStory.title}</h2>
          
          <button
            className="ig-story-cta-button"
            onClick={handleReadFullArticle}
          >
            📖 पूरा समाचार पढ्नुहोस् ➔
          </button>
        </div>
      </div>
    </div>
  );
}
