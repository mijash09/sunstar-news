'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import SearchModal from '@/components/organisms/SearchModal';
import AdBanner from '@/components/molecules/AdBanner';
import SocialShareBar from '@/components/molecules/SocialShareBar';
import SUNSTAR_DATA, { Article, BannerAd } from '@/lib/data';
import { toNepaliRelativeTime } from '@/lib/nepaliDate';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  name: string;
  avatar?: string;
  time: string;
  text: string;
  likes?: number;
}

interface Props {
  article: Article;
  relatedArticles: Article[];
  trendingArticles: Article[];
  banners?: BannerAd[] | any[];
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

export default function SingleArticleClient({ article, relatedArticles, trendingArticles, banners }: Props) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likesCount ?? (article as any).likes_count ?? 12);
  const [userLiked, setUserLiked] = useState(false);

  // Comments State
  const initialArticleComments: Comment[] = (
    Array.isArray(article.commentsList) && article.commentsList.length > 0
      ? article.commentsList
      : (Array.isArray((article as any).comments_list) && (article as any).comments_list.length > 0
          ? (article as any).comments_list
          : INITIAL_COMMENTS)
  );
  const [comments, setComments] = useState<Comment[]>(initialArticleComments);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentNotice, setCommentNotice] = useState<string | null>(null);


  // Multi Image Gallery State
  const displayImages: string[] = Array.isArray(article.images) && article.images.length > 0
    ? article.images
    : (article.image ? [article.image] : []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Live single GET API refetch on mount and on window focus
  useEffect(() => {
    let active = true;

    async function fetchLatestArticle() {
      try {
        const res = await fetch(`/api/articles/${article.id}`);
        if (res.ok) {
          const json = await res.json();
          if (active && json && json.success && json.data) {
            const d = json.data;
            if (d.likesCount !== undefined || d.likes_count !== undefined) {
              setLikesCount(d.likesCount ?? d.likes_count);
            }
            const incomingComments = d.commentsList ?? d.comments_list;
            if (Array.isArray(incomingComments) && incomingComments.length > 0) {
              setComments(incomingComments);
            }
          }
        }
      } catch (err) {
        // quiet
      }
    }

    fetchLatestArticle();

    const handleWindowFocus = () => {
      fetchLatestArticle();
    };
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      active = false;
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [article.id]);

  const [liveBanners, setLiveBanners] = useState<any[]>(banners || []);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setLiveBanners(data.data);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLikeToggle() {
    const nextLiked = !userLiked;
    setUserLiked(nextLiked);
    setLikesCount((prev: number) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    try {
      await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-like', articleId: article.id, increment: nextLiked }),
      });
    } catch (e) {}
  }

  async function handleAddComment(e: React.FormEvent) {
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
    const textToSend = commentText.trim();
    const nameToSend = authorName.trim();
    setCommentText('');
    setCommentNotice('✅ तपाईंको प्रतिक्रिया सफलताका साथ प्रकाशित भयो!');
    setTimeout(() => setCommentNotice(null), 4000);

    try {
      await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-comment',
          articleId: article.id,
          name: nameToSend,
          text: textToSend,
        }),
      });

      // Sync latest comments from single GET API
      const refetchRes = await fetch(`/api/articles/${article.id}`);
      if (refetchRes.ok) {
        const json = await refetchRes.json();
        const incomingComments = json?.data?.commentsList ?? json?.data?.comments_list;
        if (Array.isArray(incomingComments)) {
          setComments(incomingComments);
        }
      }
    } catch (e) {}
  }

  return (
    <div className="single-article-view-shell" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Header onOpenSearch={() => setIsSearchOpen(true)} banners={liveBanners} />
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

            {/* News Top Ad Banner */}
            <AdBanner position="news-top" banners={liveBanners} margin="0 0 16px 0" />

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
                🗓️ {(article.updated_at || article.created_at) ? toNepaliRelativeTime((article.updated_at || article.created_at)!) : (article.time || article.date || 'भर्खरै')} &nbsp;|&nbsp; 👁️ {article.views || '१२०'} पठन
              </div>
            </div>

            {/* Executive Social Share Bar */}
            <SocialShareBar
              title={article.title}
              url={`https://sunstarnews.com/news/${article.id}`}
              articleId={article.id}
              imageUrl={displayImages[0] || article.image}
            />

            {/* Sliding Cover Image Carousel */}
            {displayImages.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#050505',
                  }}
                >
                  {/* Sliding Track */}
                  <div
                    style={{
                      display: 'flex',
                      transform: `translateX(-${selectedImageIndex * 100}%)`,
                      transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                      width: '100%',
                    }}
                  >
                    {displayImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: '0 0 100%',
                          minWidth: '100%',
                          maxHeight: '520px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#0a0a0a',
                          overflow: 'hidden',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl || '/assets/sunstar-logo.jpg'}
                          alt={`${article.title} - Slide ${idx + 1}`}
                          style={{
                            width: '100%',
                            maxHeight: '520px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/sunstar-logo.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {displayImages.length > 1 && (
                    <>
                      {/* Left Navigation Arrow */}
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          fontSize: '1.4rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(6px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          zIndex: 3,
                          transition: 'all 0.2s ease',
                        }}
                        title="अघिल्लो तस्बिर"
                      >
                        ❮
                      </button>

                      {/* Right Navigation Arrow */}
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          fontSize: '1.4rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(6px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          zIndex: 3,
                          transition: 'all 0.2s ease',
                        }}
                        title="पछिल्लो तस्बिर"
                      >
                        ❯
                      </button>

                      {/* Slide Counter Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '14px',
                          right: '14px',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          color: '#fff',
                          padding: '4px 14px',
                          borderRadius: '20px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(6px)',
                          zIndex: 3,
                        }}
                      >
                        📷 {selectedImageIndex + 1} / {displayImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Dot Pagination Indicators */}
                {displayImages.length > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: selectedImageIndex === idx ? '28px' : '10px',
                          height: '10px',
                          borderRadius: '5px',
                          backgroundColor: selectedImageIndex === idx ? 'var(--brand-orange)' : 'var(--border-color)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                        }}
                        title={`तस्बिर ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                {article.caption && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '8px' }}>
                    📷 {article.caption}
                  </div>
                )}
              </div>
            )}

            {/* Ad Banner: Under Photo */}
            <AdBanner position="news-under-image" banners={liveBanners} margin="20px 0" />

            {/* Lead Summary Callout */}
            {article.summary && (
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  lineHeight: 1.75,
                  color: 'var(--text-primary)',
                  borderLeft: '4px solid var(--brand-orange)',
                  paddingLeft: '16px',
                  margin: '24px 0',
                  fontStyle: 'italic',
                  backgroundColor: 'rgba(249, 115, 22, 0.05)',
                  padding: '14px 18px',
                  borderRadius: '0 8px 8px 0',
                }}
              >
                {article.summary}
              </div>
            )}

            {/* Article Main Text Content */}
            <div
              style={{
                fontSize: '1.12rem',
                lineHeight: 1.9,
                color: 'var(--text-secondary)',
                margin: '28px 0 32px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              {(article.content || article.summary || article.title)
                .split('\n\n')
                .filter((p) => p.trim().length > 0)
                .map((para, idx) => (
                  <p key={idx} style={{ margin: 0 }}>
                    {para}
                  </p>
                ))}
            </div>

            {/* Ad Banner: In-Content */}
            <AdBanner position="news-in-content" banners={liveBanners} margin="24px 0" />

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

            {/* Ad Banner: News Bottom */}
            <AdBanner position="news-bottom" banners={liveBanners} margin="28px 0" />

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
            {/* Widget 1: Sticky Ad Banner (Completely hidden if no advertisement added) */}
            {liveBanners.some((b) => (b.position === 'single-news-sidebar' || b.position === 'sidebar-widget') && (b.isActive === true || b.is_active === true || b.isActive === 1 || b.is_active === 1)) && (
              <div className="shadcn-card" style={{ padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                  विज्ञापन (Advertisement)
                </span>
                <AdBanner
                  position={liveBanners.some((b) => b.position === 'single-news-sidebar') ? 'single-news-sidebar' : 'sidebar-widget'}
                  banners={liveBanners}
                  margin="0"
                  maxHeight="250px"
                />
              </div>
            )}

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
