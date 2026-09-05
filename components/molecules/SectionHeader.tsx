import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  title,
  viewAllHref,
  viewAllText = 'सबै हेर्नुहोस् ➔',
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {viewAllHref && (
        <Link href={viewAllHref} className="view-all-link">
          {viewAllText}
        </Link>
      )}
    </div>
  );
}
