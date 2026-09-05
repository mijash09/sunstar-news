import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'source' | 'ad' | 'pradesh' | 'duration';
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({
  children,
  variant = 'category',
  className = '',
  style,
}: BadgeProps) {
  let baseClass = 'category-tag';

  if (variant === 'source') baseClass = 'source-badge';
  else if (variant === 'ad') baseClass = 'ad-badge';
  else if (variant === 'pradesh') baseClass = 'pradesh-badge';
  else if (variant === 'duration') baseClass = 'video-duration';

  return (
    <span className={`${baseClass} ${className}`} style={style}>
      {children}
    </span>
  );
}
