'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '20px' }}>
      {/* shadcn Card Container */}
      <div className="shadcn-card" style={{ maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-md)' }}>
        {/* Card Header */}
        <div className="shadcn-card-header" style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>☀️</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--brand-blue)', letterSpacing: '-0.02em' }}>
              सनस्टार न्युज
            </span>
          </div>
          <h1 className="shadcn-card-title" style={{ fontSize: '1.4rem' }}>
            कर्मचारी लगइन (CMS Admin Portal)
          </h1>
          <p className="shadcn-card-description">
            डिजिटल समाचार सम्पादन प्रणालीमा पहुँच प्राप्त गर्न आफ्नो विवरण भर्नुहोस्।
          </p>
        </div>

        {/* Card Content */}
        <div className="shadcn-card-content" style={{ paddingTop: '1.5rem' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#dc2626', padding: '10px 14px', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 700, marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="username" className="shadcn-label">
                प्रयोगकर्ता नाम वा इमेल (Username / Email)
              </label>
              <input
                id="username"
                type="text"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or email"
                className="shadcn-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="shadcn-label">
                पासवर्ड (Password)
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="shadcn-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="shadcn-btn shadcn-btn-primary"
              style={{ width: '100%', marginTop: '8px', height: '2.75rem', fontSize: '0.95rem' }}
            >
              {loading ? 'लगइन हुँदैछ...' : '🔒 लगइन गर्नुहोस् (Sign In)'}
            </button>
          </form>
        </div>

        {/* Card Footer */}
        <div className="shadcn-card-footer" style={{ flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <button
            type="button"
            className="shadcn-btn shadcn-btn-outline"
            style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-blue)' }}
            onClick={() => {
              setUsername('Sitaram');
              setPassword('Sitaram@123');
            }}
          >
            ⚡ Sitaram खाता स्वतः भर्नुहोस् (Auto-fill Sitaram)
          </button>

          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ← मुख्य समाचार पृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    </div>
  );
}
