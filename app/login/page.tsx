'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('Sitaram');
  const [password, setPassword] = useState('Sitaram@123');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(null, formData);

    if (res && res.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-badge">
            <span className="logo-sun-symbol">☀️</span>
            <span className="logo-text-main">SUNSTAR</span>
            <span className="logo-badge-tag">ADMIN</span>
          </div>
          <h1 className="login-portal-title">सनस्टार न्युज CMS लगइन</h1>
          <p className="login-portal-subtitle">
            सम्पादक तथा व्यवस्थापक डिजिटल पहुँच कक्ष
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="form-group-item">
            <label className="form-label">
              👤 प्रयोगकर्ता नाम वा इमेल (Username / Email)
            </label>
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Sitaram"
              className="login-input-field"
            />
          </div>

          <div className="form-group-item">
            <label className="form-label">
              🔒 पासवर्ड (Password)
            </label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="login-input-field"
            />
          </div>

          {/* Quick Demo Login Credentials Filler */}
          <div className="quick-credentials-box">
            <span className="quick-fill-label">⚡ द्रुत लगइन छनोट (Quick Fill):</span>
            <div className="quick-fill-buttons">
              <button
                type="button"
                className="quick-btn admin-btn"
                onClick={() => fillCredentials('Sitaram', 'Sitaram@123')}
              >
                👑 Sitaram (मुख्य सम्पादक)
              </button>
              <button
                type="button"
                className="quick-btn backup-btn"
                onClick={() => fillCredentials('admin', 'Sitaram@123')}
              >
                🛠️ Admin (व्यवस्थापक)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-button"
          >
            {loading ? 'लगइन हुँदैछ...' : '🔐 लगइन गर्नुहोस् (Sign In to CMS)'}
          </button>
        </form>

        {/* Back Link */}
        <div className="login-footer-link">
          <Link href="/" className="back-to-home-link">
            ← सनस्टार न्युज मुख्य पृष्ठमा फर्कनुहोस् (Back to Portal)
          </Link>
        </div>
      </div>
    </div>
  );
}
