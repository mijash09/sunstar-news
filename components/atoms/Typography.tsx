import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

export function Title({ children, level = 2, className = '', style }: TitleProps) {
  if (level === 1) {
    return <h1 className={`hero-title ${className}`} style={style}>{children}</h1>;
  }
  if (level === 3) {
    return <h3 className={`card-title ${className}`} style={style}>{children}</h3>;
  }
  return <h2 className={`section-title ${className}`} style={style}>{children}</h2>;
}

export function Snippet({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`card-snippet ${className}`}>{children}</p>;
}
