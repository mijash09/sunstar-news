'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check, Facebook, Twitter, MessageCircle, Download } from 'lucide-react';

interface SocialShareBarProps {
  title?: string;
  url?: string;
  compact?: boolean;
  articleId?: string;
  imageUrl?: string;
}

export default function SocialShareBar({
  title = 'सनस्टार न्युज मुख्य समाचार',
  url,
  compact = false,
  articleId,
  imageUrl,
}: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : 'https://sunstarnews.com');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const recordShare = async (platform: string) => {
    if (!articleId) return;
    try {
      await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, platform }),
      });
    } catch (err) {}
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = shareUrl;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
      setCopied(true);
      recordShare('copy');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };


  const downloadFilename = imageUrl ? imageUrl.split('/').pop() : '';
  const downloadLink = imageUrl && imageUrl.startsWith('/storage/uploads/')
    ? `/api/download/${downloadFilename}`
    : (imageUrl || '#');

  return (
    <div
      className="social-share-bar-shell"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: compact ? '10px 14px' : '14px 18px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: compact ? '16px' : '24px',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Title Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 85, 0, 0.1)',
            color: 'var(--brand-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Share2 size={15} />
        </div>
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.2px',
          }}
        >
          सेयर तथा डाउनलोड:
        </span>
      </div>

      {/* Share Actions Group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {/* Facebook Share Button */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => recordShare('facebook')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1877F2',
            color: '#ffffff',
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(24, 119, 242, 0.25)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            cursor: 'pointer',
          }}
          className="share-btn-hover"
          title="फेसबुकमा सेयर गर्नुहोस्"
        >
          <Facebook size={15} fill="#ffffff" />
          <span>Facebook</span>
        </a>

        {/* Twitter / X Share Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => recordShare('twitter')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0f1419',
            color: '#ffffff',
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(15, 20, 25, 0.25)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            cursor: 'pointer',
          }}
          className="share-btn-hover"
          title="ट्विटर (X) मा सेयर गर्नुहोस्"
        >
          <Twitter size={15} fill="#ffffff" />
          <span>Twitter/X</span>
        </a>

        {/* WhatsApp Share Button */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => recordShare('whatsapp')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#25D366',
            color: '#ffffff',
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            cursor: 'pointer',
          }}
          className="share-btn-hover"
          title="व्हाट्सएपमा सेयर गर्नुहोस्"
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: copied ? 'rgba(34, 197, 94, 0.12)' : 'var(--bg-alt)',
            color: copied ? '#16a34a' : 'var(--text-primary)',
            border: `1px solid ${copied ? '#22c55e' : 'var(--border-color)'}`,
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          className="share-btn-hover"
          title="लिङ्क कपी गर्नुहोस्"
        >
          {copied ? <Check size={15} color="#16a34a" /> : <Link2 size={15} />}
          <span>{copied ? 'लिङ्क कपी भयो!' : 'लिङ्क कपी'}</span>
        </button>

        {/* Image Download Button */}
        {imageUrl && (
          <a
            href={downloadLink}
            download={downloadFilename || 'sunstar-news-image.jpg'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 85, 0, 0.1)',
              color: 'var(--brand-orange)',
              border: '1px solid rgba(255, 85, 0, 0.25)',
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            className="share-btn-hover"
            title="तस्बिर डाउनलोड गर्नुहोस्"
          >
            <Download size={15} />
            <span>तस्बिर डाउनलोड</span>
          </a>
        )}
      </div>
    </div>
  );
}
