'use client';

import React from 'react';
import Badge from '@/components/atoms/Badge';
import { VideoNews } from '@/lib/data';

interface VideoCardProps {
  video: VideoNews;
  onPlay?: (title: string) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <div
      className="video-card"
      onClick={() => {
        if (onPlay) onPlay(video.title);
        else alert(`▶️ भिडियो प्लेयर: "${video.title}"`);
      }}
    >
      <div className="video-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={video.thumbnail} alt={video.title} />
        <div className="play-icon-overlay">▶</div>
        <Badge variant="duration">{video.duration}</Badge>
        <Badge
          variant="source"
          style={{ left: '10px', right: 'auto' }}
        >
          🔴 {video.source || 'Sunstar News'}
        </Badge>
      </div>
      <h3 className="video-title">{video.title}</h3>
    </div>
  );
}
