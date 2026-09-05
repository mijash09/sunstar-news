'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
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
    <div>
      <Header />
      <Navigation activeHref="/login" />

      <main
        className="container"
        style={{
          paddingTop: '60px',
          paddingBottom: '80px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'var(--bg-card)',
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--brand-blue)',
              }}
            >
              🔐 कर्मचारी लगइन (Staff Login)
            </h1>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginTop: '6px',
              }}
            >
              सनस्टार न्युज सम्पादक तथा व्यवस्थापक पोर्टल
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--brand-red-light)',
                color: 'var(--brand-red)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                प्रयोगकर्ता नाम वा इमेल (Username / Email)
              </label>
              <input
                type="text"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Sitaram"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sitaram@123"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--brand-orange)',
                color: '#FFF',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '10px',
                border: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'लगइन हुँदैछ...' : 'लगइन गर्नुहोस् ➔'}
            </button>
          </form>

          {/* Preset Demo Credentials Box */}
          <div
            style={{
              marginTop: '30px',
              padding: '18px',
              backgroundColor: '#EFF6FF',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              border: '1.5px dashed #3B82F6',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: '10px', color: '#1E40AF', fontSize: '0.95rem' }}>
              💡 मुख्य लगइन खाता (Official Demo Credentials):
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                backgroundColor: '#FFFFFF',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #DBEAFE',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4B5563', fontWeight: 600 }}>Username:</span>
                <strong style={{ color: '#1E293B', fontFamily: 'monospace', fontSize: '1rem' }}>Sitaram</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4B5563', fontWeight: 600 }}>Password:</span>
                <strong style={{ color: '#059669', fontFamily: 'monospace', fontSize: '1rem' }}>Sitaram@123</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fillCredentials('Sitaram', 'Sitaram@123')}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              ✨ यो खाता स्वत: भर्नुहोस् (Auto-fill Sitaram)
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/" style={{ fontSize: '0.88rem', color: 'var(--brand-orange)', fontWeight: 600 }}>
              ⬅ गृहपृष्ठमा फर्कनुहोस्
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
