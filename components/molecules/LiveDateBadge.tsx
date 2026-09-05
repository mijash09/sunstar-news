import React from 'react';

export default function LiveDateBadge({ text }: { text: string }) {
  return <div className="live-date-badge">📅 {text}</div>;
}
