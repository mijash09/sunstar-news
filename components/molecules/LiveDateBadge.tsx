'use client';

import React, { useEffect, useState } from 'react';
import { getTodayNepaliDate } from '@/lib/nepaliDate';

export default function LiveDateBadge({ text }: { text?: string }) {
  const [dateStr, setDateStr] = useState<string>(text || '२४ भाद्र २०८३, बुधबार');

  useEffect(() => {
    const today = getTodayNepaliDate();
    setDateStr(today.formattedFullDate);
  }, []);

  return <div className="live-date-badge">📅 {dateStr}</div>;
}
