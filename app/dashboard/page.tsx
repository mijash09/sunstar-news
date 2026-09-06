'use client';

import React, { useState } from 'react';
import { createArticleAction, deleteArticleAction, createStaffUserAction, createBannerAction, deleteBannerAction } from '@/app/actions/dashboard';
import SUNSTAR_DATA, { getAllArticles, BannerAd } from '@/lib/data';
import AdBanner from '@/components/molecules/AdBanner';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'create' | 'banners' | 'users' | 'rashifal'>('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Banners State
  const [bannersList, setBannersList] = useState<BannerAd[]>(SUNSTAR_DATA.banners || []);
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('all');
  const [previewBanner, setPreviewBanner] = useState<Partial<BannerAd> | null>(null);

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
    <div className="admin-dashboard-container">
      {/* 1. Stat Cards Row */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">📰</div>
          <div>
            <span className="stat-value">{allArticles.length}</span>
            <span className="stat-label">कुल प्रकाशित समाचार</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">📢</div>
          <div>
            <span className="stat-value">{bannersList.length}</span>
            <span className="stat-label">विज्ञापन ब्यानरहरू (Active Ads)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">✍️</div>
          <div>
            <span className="stat-value">{SUNSTAR_DATA.opinions.length}</span>
            <span className="stat-label">विचार / विश्लेषण</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">🇳🇵</div>
          <div>
            <span className="stat-value">42</span>
            <span className="stat-label">प्रदेश समाचार</span>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div className={`admin-alert ${msg.type}`}>
          <span>{msg.type === 'success' ? '✅' : '⚠️'} {msg.text}</span>
        </div>
      )}

      {/* 2. Admin Action Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          📰 सबै समाचार व्यवस्थापन ({allArticles.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ➕ नयाँ समाचार थप्नुहोस्
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveTab('banners')}
        >
          📢 विज्ञापन र ब्यानर व्यवस्थापन ({bannersList.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 कर्मचारी व्यवस्थापन (Users)
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'rashifal' ? 'active' : ''}`}
          onClick={() => setActiveTab('rashifal')}
        >
          🔮 दैनिक राशिफल (12 Zodiacs)
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Article Management Table */}
      {activeTab === 'articles' && (
        <div className="admin-content-panel">
          <div className="table-filter-header">
            <h3 className="panel-title">प्रणालीमा उपलब्ध समाचारहरू</h3>
            <input
              type="text"
              placeholder="🔍 समाचार शीर्षक वा वर्ग खोज्नुहोस्..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-datatable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>शीर्षक (Title)</th>
                  <th>वर्ग (Category)</th>
                  <th>स्रोत / लेखक</th>
                  <th>स्थिति</th>
                  <th>कारबाही (Action)</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.slice(0, 15).map((art) => (
                  <tr key={art.id}>
                    <td className="art-id">{art.id}</td>
                    <td className="art-title">{art.title}</td>
                    <td>
                      <span className="art-category-badge">{art.category}</span>
                    </td>
                    <td className="art-author">{art.author || art.source || 'सनस्टार संवाददाता'}</td>
                    <td>
                      <span className="status-pill active">प्रकाशन भयो</span>
                    </td>
                    <td>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteArticle(art.id)}
                        title="समाचार हटाउनुहोस्"
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
      )}

      {/* TAB 2: Create Article Form */}
      {activeTab === 'create' && (
        <div className="admin-content-panel">
          <h3 className="panel-title">➕ नयाँ समाचार प्रकाशन फर्म (Add Article)</h3>

          <form onSubmit={handleCreateArticle} className="admin-form-grid">
            <div className="form-field full">
              <label>समाचार शीर्षक (Article Title) *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="उदा. पोखरामा नयाँ सडक पूर्वाधारको शुभारम्भ..."
                className="admin-input"
              />
            </div>

            <div className="form-field">
              <label>समाचार वर्ग (Category) *</label>
              <select name="category" required className="admin-input">
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

            <div className="form-field">
              <label>मुख्य तस्बिर URL (Image URL)</label>
              <input
                type="text"
                name="image"
                placeholder="https://images.unsplash.com/..."
                className="admin-input"
              />
            </div>

            <div className="form-field full">
              <label>समाचार सार / समरी (Short Summary)</label>
              <textarea
                name="summary"
                rows={3}
                placeholder="समाचारको मुख्य २-३ वाक्यको सार..."
                className="admin-input"
              />
            </div>

            <div className="form-field full">
              <label>पूरा समाचार विवरण (Full Content HTML)</label>
              <textarea
                name="content"
                rows={6}
                placeholder="<p>समाचारको विस्तृत विवरण यहाँ लेख्नुहोस्...</p>"
                className="admin-input"
              />
            </div>

            <div className="form-submit-row">
              <button type="submit" disabled={loading} className="admin-submit-btn">
                {loading ? 'प्रकाशन हुँदैछ...' : '🚀 समाचार प्रकाशित गर्नुहोस्'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Banner Ads Management with Live Preview */}
      {activeTab === 'banners' && (
        <div className="admin-content-panel">
          <div className="table-filter-header" style={{ marginBottom: '20px' }}>
            <div>
              <h3 className="panel-title">📢 डिजिटल विज्ञापन र ब्यानर व्यवस्थापन</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                साइटका ६ मुख्य स्थानहरू (Positions) मा विज्ञापन ब्यानर थप्नुहोस्, सम्पादन गर्नुहोस् र लाइभ प्रिभ्यु हेर्नुहोस्।
              </p>
            </div>

            {/* Position Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: selectedPositionFilter === pos.id ? '2px solid var(--brand-orange)' : '1px solid var(--border-color)',
                    backgroundColor: selectedPositionFilter === pos.id ? 'rgba(249, 115, 22, 0.12)' : 'var(--bg-card)',
                    color: selectedPositionFilter === pos.id ? 'var(--brand-orange)' : 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Banner Form & Live Preview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Form Box */}
            <div style={{ backgroundColor: 'var(--bg-alt)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
                ➕ नयाँ ब्यानर थप्नुहोस् (Create Banner)
              </h4>

              <form onSubmit={handleCreateBanner} className="admin-form-grid" style={{ gap: '14px' }}>
                <div className="form-field full">
                  <label>ब्यानर शीर्षक / विज्ञापनदाता (Title/Sponsor) *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="उदा. एनएमबी बैंक डिजिटल अफर..."
                    className="admin-input"
                  />
                </div>

                <div className="form-field full">
                  <label>राखिने स्थान (Banner Position) *</label>
                  <select name="position" required className="admin-input">
                    <option value="header-top">🖼️ Header Top Leaderboard (728x90)</option>
                    <option value="hero-side">📌 Hero Right Sidebar Square (300x250)</option>
                    <option value="mid-content-1">📰 Mid Content 1 (Exclusive After 970x90)</option>
                    <option value="mid-content-2">🗺️ Mid Content 2 (Pradesh After 970x90)</option>
                    <option value="sidebar-widget">📊 Right Sidebar Sticky (300x250)</option>
                    <option value="footer-top">⚓ Footer Top Leaderboard (728x90)</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label>तस्बिर URL (Banner Image URL) *</label>
                  <input
                    type="text"
                    name="imageUrl"
                    required
                    placeholder="https://assets-cdn.ekantipur.com/..."
                    className="admin-input"
                    onChange={(e) => {
                      setPreviewBanner({
                        imageUrl: e.target.value,
                        title: 'ब्यानर प्रिभ्यु (Live Preview)',
                      });
                    }}
                  />
                </div>

                <div className="form-field full">
                  <label>क्लिक गर्दा जाने लिङ्क (Destination Target URL)</label>
                  <input
                    type="text"
                    name="targetUrl"
                    placeholder="https://nmb.com.np"
                    className="admin-input"
                  />
                </div>

                <div className="form-submit-row" style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={loading} className="admin-submit-btn" style={{ flex: 1 }}>
                    {loading ? 'सुरक्षित हुँदैछ...' : '🚀 ब्यानर प्रकाशित गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>

            {/* Interactive Live Banner Preview Container */}
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--brand-orange)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
                  👁️ लाइभ ब्यानर प्रिभ्यु (Interactive Live Preview)
                </h4>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--brand-orange)', padding: '2px 8px', borderRadius: '12px' }}>
                  Realtime Mockup
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                तपाईंको ब्यानर वेबसाइटमा कस्तो देखिनेछ भन्ने प्रत्यक्ष नमुना preview:
              </p>

              <AdBanner
                imageUrl={previewBanner?.imageUrl || 'https://assets-cdn.ekantipur.com/uploads/source/ads/desktop-3082026051412.jpg'}
                altText={previewBanner?.title || 'सनस्टार न्युज डिजिटल ब्यानर नमुना'}
                maxHeight="160px"
              />

              <div style={{ marginTop: '16px', padding: '10px 14px', backgroundColor: 'var(--bg-alt)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                💡 <strong>टिप:</strong> ब्यानर तस्बिर High Resolution र ७२८x९० वा ३००x२५० पिक्सेलमा तयार गर्दा वेबसाइटमा सबैभन्दा आकर्षक देखिन्छ।
              </div>
            </div>
          </div>

          {/* Banners List Table */}
          <div className="admin-table-wrapper">
            <table className="admin-datatable">
              <thead>
                <tr>
                  <th>स्थान (Position)</th>
                  <th>शीर्षक / विज्ञापनदाता</th>
                  <th>ब्यानर तस्बिर</th>
                  <th>क्लिक संख्या</th>
                  <th>स्थिति (Status)</th>
                  <th>कारबाही (Action)</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="art-category-badge" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)' }}>
                        {b.position}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800 }}>{b.title}</td>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        style={{ height: '40px', width: '120px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--brand-orange)' }}>
                      🖱️ {b.clicksCount || 0} clicks
                    </td>
                    <td>
                      <button
                        onClick={() => toggleBannerActive(b.id)}
                        style={{
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: b.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: b.isActive ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {b.isActive ? '🟢 सक्रिय (Active)' : '🔴 निष्क्रिय (Off)'}
                      </button>
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setPreviewBanner(b)}
                        className="action-btn"
                        style={{ backgroundColor: 'var(--bg-alt)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        title="प्रिभ्यु हेर्नुहोस्"
                      >
                        👁️ प्रिभ्यु
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="action-btn delete-btn"
                        title="ब्यानर हटाउनुहोस्"
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
      )}

      {/* TAB 4: Staff User Management */}
      {activeTab === 'users' && (
        <div className="admin-content-panel">
          <h3 className="panel-title">👥 नयाँ सम्पादक / व्यवस्थापक दर्ता (Create Staff User)</h3>

          <form onSubmit={handleCreateUser} className="admin-form-grid" style={{ maxWidth: '600px' }}>
            <div className="form-field full">
              <label>कर्मचारीको पूरा नाम (Full Name) *</label>
              <input type="text" name="name" required placeholder="उदा. विष्णुहरि भुगाई" className="admin-input" />
            </div>

            <div className="form-field full">
              <label>इमेल ठेगाना (Email Address) *</label>
              <input type="email" name="email" required placeholder="editor@sunstarnews.com" className="admin-input" />
            </div>

            <div className="form-field full">
              <label>पासवर्ड (Password) *</label>
              <input type="password" name="password" required placeholder="••••••••••••" className="admin-input" />
            </div>

            <div className="form-field full">
              <label>भूमिका (Role) *</label>
              <select name="role" className="admin-input">
                <option value="EDITOR">✍️ EDITOR (सम्पादक)</option>
                <option value="ADMIN">👑 ADMIN (मुख्य व्यवस्थापक)</option>
              </select>
            </div>

            <div className="form-submit-row">
              <button type="submit" disabled={loading} className="admin-submit-btn">
                {loading ? 'दर्ता हुँदैछ...' : '👤 कर्मचारी दर्ता गर्नुहोस्'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: Rashifal Management */}
      {activeTab === 'rashifal' && (
        <div className="admin-content-panel">
          <h3 className="panel-title">🔮 दैनिक राशिफल व्यवस्थापन (12 Zodiac Signs)</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            सबै १२ राशिहरूको दैनिक भविष्यफल अपडेट गर्नुहोस्।
          </p>

          <div className="admin-table-wrapper">
            <table className="admin-datatable">
              <thead>
                <tr>
                  <th>चिन्ह</th>
                  <th>राशि (Sign)</th>
                  <th>English</th>
                  <th>शुभ रंग</th>
                  <th>शुभ अंक</th>
                  <th>भविष्यफल preview</th>
                </tr>
              </thead>
              <tbody>
                {SUNSTAR_DATA.rashifal.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontSize: '1.4rem' }}>{r.symbol}</td>
                    <td style={{ fontWeight: 800 }}>{r.sign}</td>
                    <td>{r.latinName}</td>
                    <td>{r.luckyColor}</td>
                    <td>{r.luckyNumber}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {r.prediction.substring(0, 45)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
