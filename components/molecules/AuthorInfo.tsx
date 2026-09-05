import React from 'react';
import Avatar from '@/components/atoms/Avatar';

interface AuthorInfoProps {
  name?: string;
  avatarSrc?: string;
  role?: string;
}

export default function AuthorInfo({
  name = 'सनस्टार डेस्क',
  avatarSrc = '/assets/sunstar-logo.jpg',
  role,
}: AuthorInfoProps) {
  return (
    <div className="author-info">
      <Avatar src={avatarSrc} alt={name} />
      <span>{name}</span>
      {role && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({role})</span>}
    </div>
  );
}
