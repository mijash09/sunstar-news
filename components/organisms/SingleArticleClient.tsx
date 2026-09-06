'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import SearchModal from '@/components/organisms/SearchModal';
import AdBanner from '@/components/molecules/AdBanner';
import RashifalSection from '@/components/organisms/RashifalSection';
import SUNSTAR_DATA, { Article } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

interface Props {
  article: Article;
  relatedArticles: Article[];
  trendingArticles: Article[];
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    name: 'रामकृष्ण शर्मा',
    avatar: '👨‍💼',
    time: '४५ मिनेट अघि',
    text: 'यो समाचार एकदमै महत्त्वपूर्ण र सान्दर्भिक लाग्यो। सनस्टार न्युजले निष्पक्ष पत्रकारिता गरिरहेकोमा बधाई!',
    likes: 14,
  },
  {
    id: 'c2',
    name: 'सरिता गुरुङ',
    avatar: '👩',
    time: '१ घण्टा अघि',
    text: 'जनताको आवाज र यथार्थ परिस्थिति उजागर गर्नुभएकोमा धन्यवाद।',
    likes: 9,
  },
];

export default function SingleArticleClient({ article, relatedArticles, trendingArticles }: Props) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(48);
  const [userLiked, setUserLiked] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Comments State
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentNotice, setCommentNotice] = useState<string | null>(null);

  // Poll state
  const [pollVoted, setPollVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  function handleLikeToggle() {
    if (userLiked) {
      setLikesCount(likesCount - 1);
      setUserLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setUserLiked(true);
    }
  }

  function handleCopyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) {
      setCommentNotice('⚠️ कृपया आफ्नो नाम र प्रतिक्रिया लेख्नुहोस्।');
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      name: authorName.trim(),
      avatar: '👤',
      time: 'भर्खरै',
      text: commentText.trim(),
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentNotice('✅ तपाईंको प्रतिक्रिया सफलताका साथ प्रकाशित भयो!');
    setTimeout(() => setCommentNotice(null), 4000);
  }

  return (
    <div className="single-article-view-shell" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <Navigation />

      <main className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
        {/* Breadcrumb Navigation Bar */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>गृहपृष्ठ</Link>
          &nbsp;›&nbsp;
          <Link href={`/category/${article.categorySlug || 'politics'}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            {article.category || 'समाचार'}
          </Link>
          &nbsp;›&nbsp;
          <strong style={{ color: 'var(--brand-orange)' }}>{article.title}</strong>
        </div>

        {/* 2-Column Responsive Layout: Left Article (70%), Right Sidebar (30%) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: '32px',
            alignItems: 'start',
          }}
          className="article-detail-grid-container"
        >
          {/* LEFT MAIN COLUMN: ARTICLE CONTENT */}
          <article
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              padding: '32px',
            }}
          >
            {/* Header & Meta Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <span className="shadcn-badge shadcn-badge-orange" style={{ fontSize: '0.82rem' }}>
                📌 {article.category || 'मुख्य समाचार'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                📰 स्रोत: {article.source || 'SunstarNews.com'}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1.25,
                marginBottom: '20px',
              }}
            >
              {article.title}
            </h1>

            {/* Author Info & Date Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: 'var(--bg-alt)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.authorImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={article.author || 'Author'}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {article.author || 'सनस्टार समाचार डेस्क'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {article.authorRole || 'वरिष्ठ संवाददाता'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                🗓️ {article.time || article.date || 'आज भाद्र १५, २०८३'} &nbsp;|&nbsp; 👁️ {article.views || '१२०'} पठन
              </div>
            </div>

            {/* Social Share Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px dashed var(--border-color)',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)' }}>सेयर गर्नुहोस्:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://sunstarnews.com/news/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shadcn-btn"
                style={{ backgroundColor: '#1877F2', color: '#ffffff', padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
              >
                📘 Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://sunstarnews.com/news/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shadcn-btn"
                style={{ backgroundColor: '#000000', color: '#ffffff', padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
              >
                🐦 Twitter/X
              </a>
              <button
                onClick={handleCopyLink}
                className="shadcn-btn shadcn-btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                {copySuccess ? '✅ लिङ्क कपी भयो!' : '🔗 लिङ्क कपी गर्नुहोस्'}
              </button>
            </div>

            {/* Cover Image & Caption */}
            {article.image && (
              <div style={{ marginBottom: '28px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                {article.caption && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '8px' }}>
                    📷 {article.caption}
                  </div>
                )}
              </div>
            )}

            {/* Summary Box */}
            {article.summary && (
              <div
                style={{
                  backgroundColor: 'rgba(249, 115, 22, 0.08)',
                  borderLeft: '4px solid var(--brand-orange)',
                  padding: '16px 20px',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '28px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                }}
              >
                {article.summary}
              </div>
            )}

            {/* Full Body Article Text */}
            <div
              className="single-article-content single-article-content-body"
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                marginBottom: '36px',
              }}
              dangerouslySetInnerHTML={{
                __html: article.content || `<p>${article.summary || article.title}</p>`,
              }}
            />

            {/* Like & Reaction Bar */}
            <div
              style={{
                padding: '20px',
                backgroundColor: 'var(--bg-alt)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleLikeToggle}
                  className={`shadcn-btn ${userLiked ? 'shadcn-btn-primary' : 'shadcn-btn-outline'}`}
                  style={{ padding: '8px 20px', fontWeight: 800 }}
                >
                  {userLiked ? '❤️ मनपर्यो (Liked)' : '👍 मनपर्यो (Like)'} ({likesCount})
                </button>
              </div>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                पाठक प्रतिक्रिया र विचारहरू
              </span>
            </div>

            {/* INTERACTIVE COMMENTS SECTION */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '18px' }}>
                💬 पाठकको प्रतिक्रिया ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="shadcn-card" style={{ padding: '20px', marginBottom: '24px' }}>
                {commentNotice && (
                  <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', marginBottom: '14px' }}>
                    {commentNotice}
                  </div>
                )}
                <div style={{ display: 'grid', gap: '14px' }}>
                  <input
                    type="text"
                    placeholder="तपाईंको नाम (Your Full Name)..."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="shadcn-input"
                    required
                  />
                  <textarea
                    rows={3}
                    placeholder="यस समाचारमा तपाईंको विचार वा प्रतिक्रिया लेख्नुहोस्..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="shadcn-textarea"
                    required
                  />
                  <div style={{ textAlign: 'right' }}>
                    <button type="submit" className="shadcn-btn shadcn-btn-primary" style={{ padding: '8px 24px' }}>
                      🚀 प्रतिक्रिया पोस्ट गर्नुहोस्
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {comments.map((c) => (
                  <div key={c.id} className="shadcn-card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {c.avatar} {c.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED ARTICLES GRID */}
            {relatedArticles.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '18px', borderLeft: '4px solid var(--brand-orange)', paddingLeft: '10px' }}>
                  📰 सम्बन्धित समाचारहरू (Related Articles)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {relatedArticles.map((rel) => (
                    <Link key={rel.id} href={`/news/${rel.id}`} style={{ textDecoration: 'none' }}>
                      <div className="shadcn-card" style={{ overflow: 'hidden', height: '100%' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rel.image} alt={rel.title} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                        <div style={{ padding: '12px' }}>
                          <span className="shadcn-badge shadcn-badge-outline" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                            {rel.category}
                          </span>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35, margin: 0 }}>
                            {rel.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* RIGHT SIDEBAR COLUMN (30% Width / Sticky) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'sticky', top: '80px' }}>
            {/* Widget 1: Sticky Ad Banner */}
            <div className="shadcn-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                विज्ञापन (Advertisement)
              </span>
              <AdBanner position="sidebar-widget" margin="0" maxHeight="250px" />
            </div>

            {/* Widget 2: Trending Hot News List */}
            <div className="shadcn-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--brand-orange)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 ताजा तथा लोकप्रिय समाचार
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {trendingArticles.map((item, index) => (
                  <Link key={item.id} href={`/news/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--brand-orange)', width: '20px' }}>
                      {index + 1}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35, margin: 0 }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.time || item.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 3: Today's Rashifal Widget */}
            <div className="shadcn-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  🔮 आजको दैनिक राशिफल
                </h3>
                <Link href="/rashifal" style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 800, textDecoration: 'none' }}>
                  सबै हेर्नुहोस् ➔
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {SUNSTAR_DATA.rashifal.slice(0, 8).map((r) => (
                  <Link key={r.id} href={`/rashifal/${r.id}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
                    <div style={{ width: '44px', height: '44px', margin: '0 auto 4px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image || `/images/zodiac/${r.id}.png`} alt={r.sign} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                      {r.sign}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 4: Public Opinion Poll */}
            <div className="shadcn-card" style={{ padding: '20px' }}>
              <span className="shadcn-badge shadcn-badge-orange" style={{ marginBottom: '8px' }}>🗳️ जनमत संग्रह (Poll)</span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: '14px' }}>
                {SUNSTAR_DATA.poll.question}
              </h4>

              {pollVoted ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', fontWeight: 800, padding: '10px', backgroundColor: 'var(--bg-alt)', borderRadius: '6px', textAlign: 'center' }}>
                  ✅ धन्यवाद! तपाईंको मत दर्ता भयो। (कुल मत: २,८९०)
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SUNSTAR_DATA.poll.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedOption(opt.id);
                        setPollVoted(true);
                      }}
                      className="shadcn-btn shadcn-btn-outline"
                      style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.82rem', textAlign: 'left' }}
                    >
                      ⚪ {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={(id) => router.push(`/news/${id}`)}
      />
    </div>
  );
}
