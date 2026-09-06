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
    <div className="simple-login-container">
      <div className="simple-login-box">
        {/* Logo & Header */}
        <div className="simple-login-header">
          <div className="simple-brand-logo">
            <span className="sun-icon">☀️</span>
            <span className="brand-name">सनस्टार न्युज</span>
          </div>
          <h1 className="simple-login-title">कर्मचारी लगइन</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="simple-error-msg">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="simple-login-form">
          <div className="simple-form-group">
            <label htmlFor="username">प्रयोगकर्ता नाम वा इमेल</label>
            <input
              id="username"
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or Email"
              className="simple-input"
            />
          </div>

          <div className="simple-form-group">
            <label htmlFor="password">पासवर्ड</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="simple-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="simple-submit-btn"
          >
            {loading ? 'लगइन हुँदैछ...' : 'लगइन गर्नुहोस्'}
          </button>
        </form>

        {/* Footer & Quick Fill */}
        <div className="simple-login-footer">
          <button
            type="button"
            className="simple-autofill-btn"
            onClick={() => {
              setUsername('Sitaram');
              setPassword('Sitaram@123');
            }}
          >
            🔑 Sitaram खाता स्वतः भर्नुहोस्
          </button>

          <Link href="/" className="simple-back-link">
            ← मुख्य पृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    </div>
  );
}
