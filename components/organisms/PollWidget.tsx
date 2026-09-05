'use client';

import React, { useState } from 'react';
import SUNSTAR_DATA, { PollOption } from '@/lib/data';
import Button from '@/components/atoms/Button';

function toNepaliDigits(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const str = num.toLocaleString('en-US');
  return str.replace(/\d/g, (d) => nepaliDigits[parseInt(d, 10)]);
}

export default function PollWidget() {
  const [hasVoted, setHasVoted] = useState(false);
  const [poll, setPoll] = useState(SUNSTAR_DATA.poll);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleVote = (optId: string) => {
    if (hasVoted) return;

    const newTotal = poll.totalVotes + 1;
    const newOptions: PollOption[] = poll.options.map((opt) => {
      const newCount = opt.id === optId ? opt.count + 1 : opt.count;
      const newPercent = Math.round((newCount / newTotal) * 100);
      return {
        ...opt,
        count: newCount,
        percent: newPercent,
      };
    });

    setHasVoted(true);
    setSelectedId(optId);
    setPoll({
      ...poll,
      totalVotes: newTotal,
      options: newOptions,
    });
  };

  return (
    <div className="poll-box" style={{ marginBottom: '24px' }}>
      <div className="poll-question">{poll.question}</div>
      <div className="poll-options">
        {poll.options.map((opt) => (
          <div key={opt.id} style={{ marginBottom: '8px' }}>
            <Button
              variant="poll"
              active={selectedId === opt.id}
              onClick={() => handleVote(opt.id)}
            >
              <span>{opt.label}</span>
              {hasVoted && (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: selectedId === opt.id ? '#FFF' : 'var(--brand-orange)',
                  }}
                >
                  {opt.percent}%
                </span>
              )}
            </Button>
            {hasVoted && (
              <div className="poll-bar-container">
                <div
                  className="poll-bar-fill"
                  style={{ width: `${opt.percent}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textAlign: 'right',
        }}
      >
        कुल मत: {toNepaliDigits(poll.totalVotes)}
      </div>
    </div>
  );
}

