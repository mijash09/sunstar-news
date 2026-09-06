'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { createArticleAction, deleteArticleAction, createStaffUserAction, createBannerAction, deleteBannerAction } from '@/app/actions/dashboard';
import SUNSTAR_DATA, { getAllArticles, BannerAd } from '@/lib/data';
import AdBanner from '@/components/molecules/AdBanner';

type TabType = 'overview' | 'articles' | 'create' | 'banners' | 'users' | 'rashifal';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get('tab') as TabType) || 'overview';
  const [activeTab, setActiveTab] = useState<TabType>(tabParam);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Banners State
  const [bannersList, setBannersList] = useState<BannerAd[]>(SUNSTAR_DATA.banners || []);
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('all');
  const [previewBanner, setPreviewBanner] = useState<Partial<BannerAd> | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const currentTab = searchParams.get('tab') as TabType;
    if (currentTab && ['overview', 'articles', 'create', 'banners', 'users', 'rashifal'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  }

  const allArticles = getAllArticles();
  const filteredArticles = allArticles.filter((art) =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBanners = bannersList.filter((b) =>
    selectedPositionFilter === 'all' ? true : b.position === selectedPositionFilter
  );

  async function handleCreateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createArticleAction(formData);

    setLoading(false);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else if (res && res.success) {
      setMsg({ type: 'success', text: res.success });
      (e.target as HTMLFormElement).reset();
    }
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm('के तपाईं यो समाचार हटाउन निश्चित हुनुहुन्छ? (Are you sure you want to delete this article?)')) {
      return;
    }

    const res = await deleteArticleAction(id);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else if (res && res.success) {
      setMsg({ type: 'success', text: res.success });
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createStaffUserAction(formData);

    setLoading(false);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else if (res && res.success) {
      setMsg({ type: 'success', text: 'नयाँ कर्मचारी प्रयोगकर्ता सिर्जना गरियो!' });
      (e.target as HTMLFormElement).reset();
    }
  }

  async function handleCreateBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const targetUrl = (formData.get('targetUrl') as string) || '#';
    const position = formData.get('position') as any;

    const res = await createBannerAction(formData);
    setLoading(false);

    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      const newBanner: BannerAd = {
        id: `banner-${Date.now()}`,
        title,
        imageUrl,
        targetUrl,
        position,
        isActive: true,
        clicksCount: 0,
      };
      setBannersList([newBanner, ...bannersList]);
      SUNSTAR_DATA.banners.unshift(newBanner);
      setMsg({ type: 'success', text: 'नयाँ विज्ञापन ब्यानर सफलताका साथ थपियो!' });
      (e.target as HTMLFormElement).reset();
      setPreviewBanner(null);
    }
  }

  async function handleDeleteBanner(id: string) {
    if (!confirm('के तपाईं यो विज्ञापन ब्यानर हटाउन चाहनुहुन्छ?')) return;
    await deleteBannerAction(id);
    setBannersList(bannersList.filter((b) => b.id !== id));
    setMsg({ type: 'success', text: 'ब्यानर हटाइयो (Banner removed)' });
  }

  function toggleBannerActive(id: string) {
    setBannersList(
      bannersList.map((b) => {
        if (b.id === id) {
          const updated = { ...b, isActive: !b.isActive };
          const item = SUNSTAR_DATA.banners.find((x) => x.id === id);
          if (item) item.isActive = updated.isActive;
          return updated;
        }
        return b;
      })
    );
    setMsg({ type: 'success', text: 'ब्यानरको स्थिति परिवर्तन भयो (Status updated)' });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* 1. Sidebar Navigation */}
      <aside
        style={{
          width: '270px',
          backgroundColor: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          display: mobileMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 16px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
        }}
        className="admin-sidebar-responsive"
      >
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 18px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>☀️</span>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--brand-blue)', letterSpacing: '-0.02em', margin: 0 }}>
                  SUNSTAR
                </h2>
                <span className="shadcn-badge shadcn-badge-orange" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  CMS Admin v2.0
                </span>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="shadcn-btn shadcn-btn-ghost"
              style={{ display: 'none', padding: '4px 8px' }}
              id="mobile-sidebar-close"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 10px 4px 10px' }}>
              सामग्री व्यवस्थापन (Content)
            </span>

            <button
              onClick={() => switchTab('overview')}
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📊</span>
                <span>ड्यासबोर्ड मुख्य</span>
              </div>
              <span className="shadcn-badge shadcn-badge-outline" style={{ fontSize: '0.65rem' }}>Main</span>
            </button>

            <button
              onClick={() => switchTab('articles')}
              className={`admin-nav-item ${activeTab === 'articles' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📰</span>
                <span>समाचार सूची</span>
              </div>
              <span className="shadcn-badge shadcn-badge-blue" style={{ fontSize: '0.65rem' }}>{allArticles.length}</span>
            </button>

            <button
              onClick={() => switchTab('create')}
              className={`admin-nav-item ${activeTab === 'create' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>➕</span>
                <span>नयाँ समाचार थप्नुहोस्</span>
              </div>
            </button>

            <button
              onClick={() => switchTab('banners')}
              className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📢</span>
                <span>विज्ञापन र ब्यानर</span>
              </div>
              <span className="shadcn-badge shadcn-badge-orange" style={{ fontSize: '0.65rem' }}>{bannersList.length}</span>
            </button>

            <button
              onClick={() => switchTab('rashifal')}
              className={`admin-nav-item ${activeTab === 'rashifal' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🔮</span>
                <span>दैनिक राशिफल</span>
              </div>
              <span className="shadcn-badge shadcn-badge-outline" style={{ fontSize: '0.65rem' }}>12</span>
            </button>

            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '16px 10px 4px 10px' }}>
              प्रणाली र प्रयोगकर्ता (System)
            </span>

            <button
              onClick={() => switchTab('users')}
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>👥</span>
                <span>कर्मचारी व्यवस्थापन</span>
              </div>
            </button>

            <Link
              href="/"
              target="_blank"
              className="admin-nav-item"
              style={{ color: 'var(--brand-orange)', marginTop: '4px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🌐</span>
                <span>वेबसाइट हेर्नुहोस् ➔</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Sidebar Admin Profile Footer */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', backgroundColor: 'var(--bg-alt)', borderRadius: '0.5rem', marginBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--brand-blue)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
              S
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                Sitaram
              </span>
              <span className="shadcn-badge shadcn-badge-success" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                SUPER ADMIN
              </span>
            </div>
          </div>

          <form action={logoutAction} style={{ width: '100%' }}>
            <button type="submit" className="shadcn-btn shadcn-btn-outline" style={{ width: '100%', fontSize: '0.82rem', height: '2.2rem', gap: '6px' }}>
              🚪 लगआउट (Sign Out)
            </button>
          </form>
        </div>
      </aside>

      {/* CSS rule for desktop view sidebar display */}
      <style jsx global>{`
        @media (min-width: 769px) {
          .admin-sidebar-responsive {
            display: flex !important;
            position: sticky !important;
          }
          #mobile-menu-toggle {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .admin-sidebar-responsive {
            width: 100% !important;
            max-width: 280px;
          }
          #mobile-sidebar-close {
            display: inline-flex !important;
          }
        }
      `}</style>

      {/* 2. Main Content Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="shadcn-btn shadcn-btn-outline"
              style={{ padding: '6px 12px', fontSize: '1rem' }}
            >
              ☰
            </button>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                ड्यासबोर्ड / {activeTab.toUpperCase()}
              </span>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                सनस्टार डिजिटल समाचार सम्पादन कक्ष
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="shadcn-badge shadcn-badge-success" style={{ gap: '6px', padding: '4px 10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              Neon DB Sync Active
            </span>

            <Link href="/" target="_blank" className="shadcn-btn shadcn-btn-outline" style={{ height: '2.1rem', fontSize: '0.82rem', gap: '6px' }}>
              👁️ साइट प्रिभ्यु
            </Link>
          </div>
        </header>

        {/* Viewport Content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Global Notification Toast */}
            {msg && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: msg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  color: msg.type === 'success' ? '#15803d' : '#dc2626',
                  border: `1px solid ${msg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                <span>{msg.type === 'success' ? '✅' : '⚠️'}</span>
                <span>{msg.text}</span>
              </div>
            )}

            {/* TAB 0: OVERVIEW (📊 ड्यासबोर्ड मुख्य) */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Metric Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div className="shadcn-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      📰
                    </div>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>
                        {allArticles.length}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        प्रकाशित समाचारहरू
                      </span>
                    </div>
                  </div>

                  <div className="shadcn-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--brand-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      📢
                    </div>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>
                        {bannersList.length}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        सक्रिय विज्ञापन ब्यानरहरू
                      </span>
                    </div>
                  </div>

                  <div className="shadcn-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      🔮
                    </div>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>
                        12
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        राशिफल भविष्यफल सूची
                      </span>
                    </div>
                  </div>

                  <div className="shadcn-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      👥
                    </div>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>
                        1
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        सुपर एडमिन प्रयोगकर्ता
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div className="shadcn-card" style={{ padding: '20px', borderLeft: '4px solid var(--brand-blue)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                      ✍️ समाचार सम्पादन तथा प्रकाशन
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      नयाँ मुख्य खबर, राजनीति, अर्थ तथा प्रदेश समाचारहरू तुरुन्तै प्रकाशित गर्नुहोस्।
                    </p>
                    <button
                      onClick={() => switchTab('create')}
                      className="shadcn-btn shadcn-btn-primary"
                      style={{ fontSize: '0.82rem', height: '2.2rem' }}
                    >
                      ➕ नयाँ समाचार थप्नुहोस्
                    </button>
                  </div>

                  <div className="shadcn-card" style={{ padding: '20px', borderLeft: '4px solid var(--brand-orange)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                      📢 ब्यानर तथा विज्ञापन व्यवस्थापन
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      हेडर, हिरो र मिड-कन्टेन्टका ६ स्थानहरूमा नयाँ ब्यानर राखी लाइभ प्रिभ्यु हेर्नुहोस्।
                    </p>
                    <button
                      onClick={() => switchTab('banners')}
                      className="shadcn-btn shadcn-btn-primary"
                      style={{ backgroundColor: 'var(--brand-orange)', fontSize: '0.82rem', height: '2.2rem' }}
                    >
                      📢 विज्ञापन व्यवस्थापन ➔
                    </button>
                  </div>
                </div>

                {/* Recent Articles Table Preview */}
                <div className="shadcn-card">
                  <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 className="shadcn-card-title">हालैका प्रकाशित मुख्य समाचारहरू</h3>
                      <p className="shadcn-card-description">अन्तिम प्रकाशित ५ समाचारहरूको सूची</p>
                    </div>
                    <button
                      onClick={() => switchTab('articles')}
                      className="shadcn-btn shadcn-btn-outline"
                      style={{ fontSize: '0.82rem', height: '2rem' }}
                    >
                      सबै हेर्नुहोस् ({allArticles.length}) ➔
                    </button>
                  </div>

                  <div className="shadcn-card-content" style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>शीर्षक (Title)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>वर्ग (Category)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>मिति</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allArticles.slice(0, 5).map((art) => (
                          <tr key={art.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {art.title}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="shadcn-badge shadcn-badge-outline">{art.category}</span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {art.date || 'आज'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: ARTICLES (📰 समाचार सूची) */}
            {activeTab === 'articles' && (
              <div className="shadcn-card">
                <div className="shadcn-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 className="shadcn-card-title">📰 प्रणालीमा उपलब्ध समाचारहरू ({allArticles.length})</h3>
                    <p className="shadcn-card-description">सनस्टार डिजिटल न्युजका प्रकाशित सामग्रीहरू खोज्नुहोस् र हटाउनुहोस्</p>
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 समाचार शीर्षक वा वर्ग खोज्नुहोस्..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadcn-input"
                    style={{ width: '280px' }}
                  />
                </div>

                <div className="shadcn-card-content" style={{ padding: 0 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>ID</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>शीर्षक (Title)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>वर्ग (Category)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>लेखक / स्रोत</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>स्थिति</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>कारबाही</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.map((art) => (
                          <tr key={art.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {art.id}
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '380px' }}>
                              {art.title}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="shadcn-badge shadcn-badge-outline">
                                {art.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                              {art.author || art.source || 'सनस्टार संवाददाता'}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="shadcn-badge shadcn-badge-success">
                                प्रकाशित
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                className="shadcn-btn shadcn-btn-destructive"
                                style={{ height: '2rem', fontSize: '0.78rem', padding: '0 10px' }}
                                onClick={() => handleDeleteArticle(art.id)}
                              >
                                🗑️ हटाउनुहोस्
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CREATE ARTICLE (➕ नयाँ समाचार थप्नुहोस्) */}
            {activeTab === 'create' && (
              <div className="shadcn-card">
                <div className="shadcn-card-header">
                  <h3 className="shadcn-card-title">➕ नयाँ समाचार प्रकाशन फर्म (Add Article)</h3>
                  <p className="shadcn-card-description">मुख्य पृष्ठ तथा श्रेणीका लागि नयाँ खबर प्रकाशित गर्नुहोस्</p>
                </div>

                <div className="shadcn-card-content">
                  <form onSubmit={handleCreateArticle} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="shadcn-label">समाचार शीर्षक (Article Title) *</label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="उदा. पोखरामा नयाँ सडक पूर्वाधारको शुभारम्भ..."
                        className="shadcn-input"
                      />
                    </div>

                    <div>
                      <label className="shadcn-label">समाचार वर्ग (Category) *</label>
                      <select name="category" required className="shadcn-input">
                        <option value="राजनीति">🗳️ राजनीति (Politics)</option>
                        <option value="अर्थ / वाणिज्य">📈 अर्थ / वाणिज्य (Business)</option>
                        <option value="विशेष समाचार">👑 EXCLUSIVE (विशेष)</option>
                        <option value="खेलकुद">⚽ खेलकुद (Sports)</option>
                        <option value="मनोरञ्जन">🎬 मनोरञ्जन (Entertainment)</option>
                        <option value="फिचर">📰 फिचर समाचार (Feature)</option>
                        <option value="प्रविधि">🔬 प्रविधि (Technology)</option>
                        <option value="विश्व">🌍 विश्व (World)</option>
                        <option value="गण्डकी प्रदेश">🏔️ गण्डकी प्रदेश</option>
                      </select>
                    </div>

                    <div>
                      <label className="shadcn-label">मुख्य तस्बिर URL (Image URL)</label>
                      <input
                        type="text"
                        name="image"
                        placeholder="https://images.unsplash.com/..."
                        className="shadcn-input"
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="shadcn-label">समाचार सार / समरी (Short Summary)</label>
                      <textarea
                        name="summary"
                        rows={3}
                        placeholder="समाचारको मुख्य २-३ वाक्यको सार..."
                        className="shadcn-textarea"
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="shadcn-label">पूरा समाचार विवरण (Full Content HTML)</label>
                      <textarea
                        name="content"
                        rows={6}
                        placeholder="<p>समाचारको विस्तृत विवरण यहाँ लेख्नुहोस्...</p>"
                        className="shadcn-textarea"
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
                      <button type="submit" disabled={loading} className="shadcn-btn shadcn-btn-primary" style={{ padding: '0 24px', height: '2.6rem' }}>
                        {loading ? 'प्रकाशन हुँदैछ...' : '🚀 समाचार प्रकाशित गर्नुहोस्'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: BANNERS (📢 विज्ञापन र ब्यानर) */}
            {activeTab === 'banners' && (
              <div className="shadcn-card">
                <div className="shadcn-card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 className="shadcn-card-title">📢 डिजिटल विज्ञापन र ब्यानर व्यवस्थापन</h3>
                      <p className="shadcn-card-description">
                        साइटका ६ मुख्य स्थानहरू (Positions) मा ब्यानर थप्नुहोस् र लाइभ प्रिभ्यु हेर्नुहोस्।
                      </p>
                    </div>

                    {/* Position Filter */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'all', label: 'सबै स्थान' },
                        { id: 'header-top', label: '🖼️ Header Top' },
                        { id: 'hero-side', label: '📌 Hero Sidebar' },
                        { id: 'mid-content-1', label: '📰 Mid Section 1' },
                        { id: 'mid-content-2', label: '🗺️ Mid Section 2' },
                        { id: 'sidebar-widget', label: '📊 Sidebar Sticky' },
                        { id: 'footer-top', label: '⚓ Footer Top' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setSelectedPositionFilter(pos.id)}
                          className={`shadcn-badge ${selectedPositionFilter === pos.id ? 'shadcn-badge-orange' : 'shadcn-badge-outline'}`}
                          style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shadcn-card-content" style={{ paddingTop: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                    {/* Form Box */}
                    <div style={{ backgroundColor: 'var(--bg-alt)', padding: '20px', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        ➕ नयाँ ब्यानर थप्नुहोस् (Create Banner)
                      </h4>

                      <form onSubmit={handleCreateBanner} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label className="shadcn-label">ब्यानर शीर्षक / विज्ञापनदाता *</label>
                          <input
                            type="text"
                            name="title"
                            required
                            placeholder="उदा. एनएमबी बैंक डिजिटल अफर..."
                            className="shadcn-input"
                          />
                        </div>

                        <div>
                          <label className="shadcn-label">राखिने स्थान (Banner Position) *</label>
                          <select name="position" required className="shadcn-input">
                            <option value="header-top">🖼️ Header Top Leaderboard (728x90)</option>
                            <option value="hero-side">📌 Hero Right Sidebar Square (300x250)</option>
                            <option value="mid-content-1">📰 Mid Content 1 (Exclusive After 970x90)</option>
                            <option value="mid-content-2">🗺️ Mid Content 2 (Pradesh After 970x90)</option>
                            <option value="sidebar-widget">📊 Right Sidebar Sticky (300x250)</option>
                            <option value="footer-top">⚓ Footer Top Leaderboard (728x90)</option>
                          </select>
                        </div>

                        <div>
                          <label className="shadcn-label">तस्बिर URL (Banner Image URL) *</label>
                          <input
                            type="text"
                            name="imageUrl"
                            required
                            placeholder="https://assets-cdn.ekantipur.com/..."
                            className="shadcn-input"
                            onChange={(e) => {
                              setPreviewBanner({
                                imageUrl: e.target.value,
                                title: 'ब्यानर प्रिभ्यु (Live Preview)',
                              });
                            }}
                          />
                        </div>

                        <div>
                          <label className="shadcn-label">क्लिक गर्दा जाने लिङ्क (Target URL)</label>
                          <input
                            type="text"
                            name="targetUrl"
                            placeholder="https://nmb.com.np"
                            className="shadcn-input"
                          />
                        </div>

                        <button type="submit" disabled={loading} className="shadcn-btn shadcn-btn-primary" style={{ marginTop: '6px' }}>
                          {loading ? 'सुरक्षित हुँदैछ...' : '🚀 ब्यानर प्रकाशित गर्नुहोस्'}
                        </button>
                      </form>
                    </div>

                    {/* Interactive Live Banner Preview Container */}
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '0.5rem', border: '1px dashed var(--brand-orange)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
                          👁️ लाइभ ब्यानर प्रिभ्यु (Interactive Preview)
                        </h4>
                        <span className="shadcn-badge shadcn-badge-orange">
                          Realtime Mockup
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        वेबसाइटमा ब्यानर कस्तो देखिनेछ भन्ने प्रत्यक्ष नमुना:
                      </p>

                      <AdBanner
                        imageUrl={previewBanner?.imageUrl || 'https://assets-cdn.ekantipur.com/uploads/source/ads/desktop-3082026051412.jpg'}
                        altText={previewBanner?.title || 'सनस्टार न्युज डिजिटल ब्यानर नमुना'}
                        maxHeight="160px"
                      />

                      <div style={{ marginTop: '14px', padding: '10px 12px', backgroundColor: 'var(--bg-alt)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        💡 <strong>टिप:</strong> ब्यानर ७२८x९० वा ३००x२५० पिक्सेलमा तयार गर्दा वेबसाइटमा उत्कृष्ट देखिन्छ।
                      </div>
                    </div>
                  </div>

                  {/* Banners List Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>स्थान (Position)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>शीर्षक / विज्ञापनदाता</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>ब्यानर तस्बिर</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>क्लिक संख्या</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>स्थिति</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>कारबाही</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBanners.map((b) => (
                          <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="shadcn-badge shadcn-badge-outline" style={{ fontFamily: 'monospace' }}>
                                {b.position}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {b.title}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={b.imageUrl}
                                alt={b.title}
                                style={{ height: '36px', width: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                              />
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--brand-orange)' }}>
                              🖱️ {b.clicksCount || 0}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <button
                                onClick={() => toggleBannerActive(b.id)}
                                className={`shadcn-badge ${b.isActive ? 'shadcn-badge-success' : 'shadcn-badge-outline'}`}
                                style={{ cursor: 'pointer', border: 'none' }}
                              >
                                {b.isActive ? '🟢 सक्रिय (Active)' : '🔴 निष्क्रिय (Off)'}
                              </button>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  onClick={() => setPreviewBanner(b)}
                                  className="shadcn-btn shadcn-btn-secondary"
                                  style={{ height: '1.9rem', fontSize: '0.78rem', padding: '0 8px' }}
                                >
                                  👁️ प्रिभ्यु
                                </button>
                                <button
                                  onClick={() => handleDeleteBanner(b.id)}
                                  className="shadcn-btn shadcn-btn-destructive"
                                  style={{ height: '1.9rem', fontSize: '0.78rem', padding: '0 8px' }}
                                >
                                  🗑️ हटाउनुहोस्
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: USERS (👥 कर्मचारी व्यवस्थापन) */}
            {activeTab === 'users' && (
              <div className="shadcn-card">
                <div className="shadcn-card-header">
                  <h3 className="shadcn-card-title">👥 नयाँ सम्पादक / व्यवस्थापक दर्ता (Create Staff User)</h3>
                  <p className="shadcn-card-description">डिजिटल समाचार प्रणाली प्रयोगकर्ता दर्ता गर्नुहोस्</p>
                </div>

                <div className="shadcn-card-content">
                  <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '540px' }}>
                    <div>
                      <label className="shadcn-label">कर्मचारीको पूरा नाम (Full Name) *</label>
                      <input type="text" name="name" required placeholder="उदा. विष्णुहरि भुगाई" className="shadcn-input" />
                    </div>

                    <div>
                      <label className="shadcn-label">इमेल ठेगाना (Email Address) *</label>
                      <input type="email" name="email" required placeholder="editor@sunstarnews.com" className="shadcn-input" />
                    </div>

                    <div>
                      <label className="shadcn-label">पासवर्ड (Password) *</label>
                      <input type="password" name="password" required placeholder="••••••••••••" className="shadcn-input" />
                    </div>

                    <div>
                      <label className="shadcn-label">भूमिका (Role) *</label>
                      <select name="role" className="shadcn-input">
                        <option value="EDITOR">✍️ EDITOR (सम्पादक)</option>
                        <option value="ADMIN">👑 ADMIN (मुख्य व्यवस्थापक)</option>
                      </select>
                    </div>

                    <button type="submit" disabled={loading} className="shadcn-btn shadcn-btn-primary" style={{ height: '2.6rem', marginTop: '6px' }}>
                      {loading ? 'दर्ता हुँदैछ...' : '👤 कर्मचारी दर्ता गर्नुहोस्'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 5: RASHIFAL (🔮 दैनिक राशिफल) */}
            {activeTab === 'rashifal' && (
              <div className="shadcn-card">
                <div className="shadcn-card-header">
                  <h3 className="shadcn-card-title">🔮 दैनिक राशिफल व्यवस्थापन (12 Zodiac Signs)</h3>
                  <p className="shadcn-card-description">सबै १२ राशिहरूको दैनिक भविष्यफल तालिका सम्पादन गर्नुहोस्</p>
                </div>

                <div className="shadcn-card-content" style={{ padding: 0 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>चिन्ह</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>राशि (Sign)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>English</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>शुभ रंग</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>शुभ अंक</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left' }}>भविष्यफल Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SUNSTAR_DATA.rashifal.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 16px', fontSize: '1.4rem' }}>{r.symbol}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 800 }}>{r.sign}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{r.latinName}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="shadcn-badge shadcn-badge-orange">{r.luckyColor}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="shadcn-badge shadcn-badge-outline">{r.luckyNumber}</span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {r.prediction.substring(0, 50)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '40px', textAlign: 'center', fontWeight: 800, color: 'var(--brand-blue)' }}>
        लोडिदैछ (Loading Admin Dashboard...)...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
