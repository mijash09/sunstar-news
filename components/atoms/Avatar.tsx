import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  src,
  alt,
  size = 28,
  className = '',
}: AvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`author-avatar ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
