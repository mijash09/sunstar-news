'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('mijash');
  const [password, setPassword] = useState('Mijash@123');
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'EDITOR'>('ADMIN');

  const executeDummyLogin = (loginUser: string, role: 'ADMIN' | 'EDITOR') => {
    setError(null);
    setLoading(true);

    if (!loginUser.trim()) {
      setError('कृपया प्रयोगकर्ता नाम राख्नुहोस् (Please enter a username)');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // 1. Create client-side session cookie (no API call required)
      const mockUser = {
        id: role === 'ADMIN' ? 1 : 2,
        name: loginUser.trim(),
        username: loginUser.trim().toLowerCase(),
        email: `${loginUser.trim().toLowerCase()}@sunstarnews.com`,
        role: role,
        loginTime: new Date().toISOString(),
      };

      // Set cookie directly on client
      document.cookie = `sunstar_session=dummy_session_token_${Date.now()}; path=/; max-age=604800; SameSite=Lax`;
      
      // Store user session in localStorage for client components
      try {
        localStorage.setItem('sunstar_user', JSON.stringify(mockUser));
        localStorage.setItem('sunstar_authenticated', 'true');
      } catch (e) {
        console.warn('localStorage error:', e);
      }

      setSuccess(`✅ लगइन सफल भयो! ड्यासबोर्डमा प्रविष्टि हुँदैछ... (${role} Role)`);
      setLoading(false);

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeDummyLogin(username || 'mijash', selectedRole);
  };

  const handleQuickLogin = (demoName: string, role: 'ADMIN' | 'EDITOR', demoPass: string) => {
    setUsername(demoName);
    setPassword(demoPass);
    setSelectedRole(role);
    executeDummyLogin(demoName, role);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '20px' }}>
      {/* Container Card */}
      <div className="shadcn-card" style={{ maxWidth: '440px', width: '100%', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        
        {/* Card Header */}
        <div className="shadcn-card-header" style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 1.25rem 1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>☀️</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--brand-blue)', letterSpacing: '-0.02em' }}>
              सनस्टार न्युज
            </span>
          </div>
          <h1 className="shadcn-card-title" style={{ fontSize: '1.3rem', fontWeight: 800, margin: '6px 0 4px' }}>
            कर्मचारी लगइन (CMS Portal)
          </h1>
          <p className="shadcn-card-description" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            डिजिटल समाचार सम्पादन प्रणालीमा पहुँच प्राप्त गर्नुहोस्।
          </p>

          {/* Dummy Mode Notice Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginTop: '10px' }}>
            <span>⚡ डमी लगइन सक्रिया (No API / DB Required)</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="shadcn-card-content" style={{ padding: '1.25rem' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#15803d', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label htmlFor="username" className="shadcn-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>
                प्रयोगकर्ता नाम (Username / Email)
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
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="shadcn-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>
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
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label className="shadcn-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                भूमिका छनोट (Select Role)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: selectedRole === 'ADMIN' ? '2px solid var(--brand-blue)' : '1px solid var(--border-color)',
                    backgroundColor: selectedRole === 'ADMIN' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    color: selectedRole === 'ADMIN' ? 'var(--brand-blue)' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  👑 ADMIN (व्यवस्थापक)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('EDITOR')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: selectedRole === 'EDITOR' ? '2px solid var(--brand-blue)' : '1px solid var(--border-color)',
                    backgroundColor: selectedRole === 'EDITOR' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    color: selectedRole === 'EDITOR' ? 'var(--brand-blue)' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  📝 EDITOR (सम्पादक)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="shadcn-btn shadcn-btn-primary"
              style={{ width: '100%', marginTop: '6px', height: '2.6rem', fontSize: '0.92rem', fontWeight: 800, backgroundColor: 'var(--brand-blue)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
            >
              {loading ? 'लगइन हुँदैछ...' : '🔒 डमी लगइन गर्नुहोस् (Instant Access)'}
            </button>
          </form>

          {/* Quick Demo Login Shortcuts */}
          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed var(--border-color)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>
              🚀 १-क्लिक क्विक लगइन (Quick Demo Access):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="shadcn-btn"
                style={{ width: '100%', fontSize: '0.82rem', fontWeight: 700, padding: '7px 10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => handleQuickLogin('mijash', 'ADMIN', 'Mijash@123')}
              >
                ⚡ mijash (Admin) खाताबाट लगइन गर्नुहोस्
              </button>
              <button
                type="button"
                className="shadcn-btn"
                style={{ width: '100%', fontSize: '0.82rem', fontWeight: 700, padding: '7px 10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => handleQuickLogin('EditorUser', 'EDITOR', 'Editor@123')}
              >
                ⚡ Editor (सम्पादक) खाताबाट लगइन गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="shadcn-card-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '1rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <Link href="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none' }}>
            ← मुख्य समाचार पृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    </div>
  );
}

