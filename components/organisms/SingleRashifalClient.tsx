'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import SearchModal from '@/components/organisms/SearchModal';
import { useRouter } from 'next/navigation';
import { RashifalItem, getArticleById } from '@/lib/data';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

interface Props {
  initialItem: RashifalItem;
  allSigns: RashifalItem[];
}

const TAB_LIST = [
  { id: 'daily', label: '📅 दैनिक (Daily)' },
  { id: 'weekly', label: '🗓️ साप्ताहिक (Weekly)' },
  { id: 'monthly', label: '📆 मासिक (Monthly)' },
  { id: 'yearly', label: '🎆 वार्षिक (Yearly २०८३)' },
];

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  default: [
    {
      id: 'c1',
      name: 'रमेश ढकाल',
      avatar: '👨',
      time: '३० मिनेट अघि',
      text: 'आजको राशिफल एकदमै सही र उत्साहजनक लाग्यो! दैनिक बिहानै सनस्टार न्युजको राशिफल हेर्ने बानी बसेको छ।',
      likes: 12,
    },
    {
      id: 'c2',
      name: 'सविता पौडेल',
      avatar: '👩',
      time: '१ घण्टा अघि',
      text: 'हाम्रो पात्रो र सनस्टार न्युजको यो भविष्यफल पोर्टल उत्कृष्ट छ। शुभ रंग र अंक पनि धेरै उपयोगी छ।',
      likes: 8,
    },
    {
      id: 'c3',
      name: 'विष्णुहरि शर्मा (ज्योतिष अनुरागी)',
      avatar: '👨‍💼',
      time: '२ घण्टा अघि',
      text: 'ग्रह गोचरको स्थिति हेर्दा आजको विश्लेषण एकदमै सन्तुलित छ। धन्यवाद सनस्टार टिम।',
      likes: 19,
    },
  ],
};

export default function SingleRashifalClient({ initialItem, allSigns }: Props) {
  const [activePeriod, setActivePeriod] = useState('daily');
  const [predictionText, setPredictionText] = useState(initialItem.prediction);
  const [loading, setLoading] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS.default);
  const [authorName, setAuthorName] = useState('');
  const [avatarSymbol, setAvatarSymbol] = useState('👨');
  const [commentInput, setCommentInput] = useState('');
  const [commentNotice, setCommentNotice] = useState<string | null>(null);

  // Search Modal & Router
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch('/api/rashifal?type=' + activePeriod)
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.predictions)) {
          const found = data.predictions.find(
            (p: RashifalItem) =>
              p.id === initialItem.id || p.sign === initialItem.sign
          );
          if (found && found.prediction) {
            setPredictionText(found.prediction);
          }
        }
      })
      .catch((err) => console.error('Rashifal single page fetch error:', err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activePeriod, initialItem.id, initialItem.sign]);

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentInput.trim() || !authorName.trim()) {
      setCommentNotice('⚠️ कृपया नाम र प्रतिक्रिया विवरण भर्नुहोस्।');
      return;
    }

    const newC: Comment = {
      id: `comment-${Date.now()}`,
      name: authorName.trim(),
      avatar: avatarSymbol,
      time: 'भर्खरै',
      text: commentInput.trim(),
      likes: 0,
    };

    setComments([newC, ...comments]);
    setCommentInput('');
    setCommentNotice('✅ तपाईंको प्रतिक्रिया सफलताका साथ प्रकाशित भयो!');
    setTimeout(() => setCommentNotice(null), 4000);
  }

  function handleLikeComment(id: string) {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  }

  const otherSigns = allSigns.filter((s) => s.id !== initialItem.id);

  return (
    <div className="single-rashifal-shell" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <Navigation activeHref="/rashifal" />

      <main className="container" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link href="/">गृहपृष्ठ</Link> &nbsp;›&nbsp; <Link href="/rashifal">दैनिक राशिफल</Link> &nbsp;›&nbsp;{' '}
          <strong style={{ color: 'var(--brand-orange)' }}>{initialItem.sign} राशि ({initialItem.latinName})</strong>
        </div>

        {/* Single Rashifal Header Card */}
        <div
          className="shadcn-card"
          style={{
            padding: '32px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-alt) 100%)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(249, 115, 22, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.15)',
                  padding: '8px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={initialItem.image || `/images/zodiac/${initialItem.id}.png`}
                  alt={initialItem.sign}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div>
                <span className="shadcn-badge shadcn-badge-orange" style={{ marginBottom: '6px', fontSize: '0.78rem' }}>
                  🔮 सनस्टार ज्योतिष भविष्यफल
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, lineHeight: 1.15 }}>
                  {initialItem.sign} राशि ({initialItem.latinName})
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                  🗓️ जन्म समयावधि: <strong>{initialItem.dateRange || 'राशि नक्षत्र'}</strong>
                </p>
              </div>
            </div>

            {/* Zodiac Meta Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                  🎨 शुभ रंग
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--brand-orange)' }}>
                  {initialItem.luckyColor || 'रातो'}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                  🔢 शुभ अंक
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--brand-blue)' }}>
                  {initialItem.luckyNumber || '९'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {TAB_LIST.map((tab) => {
            const isActive = activePeriod === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePeriod(tab.id)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: isActive ? '2px solid var(--brand-orange)' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--brand-orange)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Prediction Content Card */}
        <div className="shadcn-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--brand-blue)', marginBottom: '14px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
            📜 {initialItem.sign} राशिको भविष्यफल विवरण ({activePeriod.toUpperCase()})
          </h2>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🔮</span>
              <p style={{ fontWeight: 700 }}>भविष्यफल लोड हुँदैछ, कृपया पर्खनुहोस्...</p>
            </div>
          ) : (
            <div style={{ fontSize: '1.08rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
              <p style={{ marginBottom: '16px' }}>{predictionText}</p>

              <div style={{ backgroundColor: 'var(--bg-alt)', padding: '16px 20px', borderRadius: '10px', marginTop: '24px', borderLeft: '4px solid var(--brand-orange)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                💡 <strong>ज्योतिषीय सल्लाह:</strong> दैनिक कार्य प्रारम्भ गर्नुअघि सकारात्मक सोच र मिहिनेतका साथ पाइला चाल्नुहोला। शुभ रंग र अंकको प्रयोगले सकारात्मक ऊर्जा वृद्धि गर्दछ।
              </div>
            </div>
          )}
        </div>

        {/* 💬 INTERACTIVE COMMENTS SECTION */}
        <div className="shadcn-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              💬 पाठक प्रतिक्रिया तथा टिप्पणी ({comments.length})
            </h3>
            <span className="shadcn-badge shadcn-badge-outline" style={{ fontSize: '0.8rem' }}>
              नि:शुल्क टिप्पणी
            </span>
          </div>

          {/* Comment Notice Alert */}
          {commentNotice && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 700, backgroundColor: commentNotice.startsWith('✅') ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: commentNotice.startsWith('✅') ? '#15803d' : '#dc2626' }}>
              {commentNotice}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', backgroundColor: 'var(--bg-alt)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              ✍️ {initialItem.sign} राशिको भविष्यफलबारे आफ्नो प्रतिक्रिया दिनुहोस्
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label className="shadcn-label">तपाईंको पूरा नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रामबहादुर थापा"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="shadcn-input"
                />
              </div>

              <div>
                <label className="shadcn-label">अवतार / चिह्न छान्नुहोस्</label>
                <select
                  value={avatarSymbol}
                  onChange={(e) => setAvatarSymbol(e.target.value)}
                  className="shadcn-input"
                >
                  <option value="👨">👨 पुरुष (Male)</option>
                  <option value="👩">👩 महिला (Female)</option>
                  <option value="👨‍💼">👨‍💼 व्यवसायी (Business)</option>
                  <option value="🎓">🎓 विद्यार्थी (Student)</option>
                  <option value="🔮">🔮 ज्योतिष प्रेमी (Astrology)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="shadcn-label">प्रतिक्रिया / विचार *</label>
              <textarea
                required
                rows={3}
                placeholder="तपाईंलाई आजको राशिफल कस्तो लाग्यो? आफ्नो अनुभव र विचार यहाँ लेख्नुहोस्..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="shadcn-textarea"
              />
            </div>

            <div>
              <button type="submit" className="shadcn-btn shadcn-btn-primary" style={{ padding: '0 20px', height: '2.4rem' }}>
                💬 प्रतिक्रिया प्रकाशित गर्नुहोस्
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-alt)',
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {c.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.time}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                    {c.text}
                  </p>

                  <button
                    onClick={() => handleLikeComment(c.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--brand-blue)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                    }}
                  >
                    👍 मनपर्यो ({c.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔮 OTHER 11 ZODIAC SIGNS CAROUSEL GRID */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
            🔮 अन्य राशिहरू (Browse Other Zodiac Signs)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {otherSigns.map((s) => (
              <Link
                key={s.id}
                href={`/rashifal/${s.id}`}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                className="other-sign-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image || `/images/zodiac/${s.id}.png`}
                  alt={s.sign}
                  style={{ width: '42px', height: '42px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {s.sign} ({s.latinName})
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    हेर्नुहोस् ➔
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer onOpenSearch={() => setIsSearchOpen(true)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={(id) => {
          router.push(`/news/${id}`);
        }}
      />
    </div>
  );
}
