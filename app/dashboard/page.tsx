'use client';

import React, { useState } from 'react';
import { createArticleAction, deleteArticleAction, createStaffUserAction } from '@/app/actions/dashboard';
import SUNSTAR_DATA, { getAllArticles } from '@/lib/data';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'create' | 'users' | 'rashifal'>('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const allArticles = getAllArticles();
  const filteredArticles = allArticles.filter((art) =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="stat-icon-wrapper orange">👁️</div>
          <div>
            <span className="stat-value">248.5K</span>
            <span className="stat-label">पाठक हेराइ (Total Views)</span>
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

      {/* TAB 3: Staff User Management */}
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

      {/* TAB 4: Rashifal Management */}
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
