import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          padding: '40px 30px',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--brand-orange)', marginBottom: '8px' }}>
          404
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-primary)' }}>
          पृष्ठ फेला परेन (Page Not Found)
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
          तपाईंले खोज्नुभएको समाचार वा लिङ्क फेला पर्न सकेन। कृपया मुख्य गृहपृष्ठमा फर्केर पुनः समाचार खोज्नुहोस्।
        </p>

        <Link
          href="/"
          className="shadcn-btn shadcn-btn-primary"
          style={{ padding: '12px 28px', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          🏠 मुख्य गृहपृष्ठमा जानुहोस् (Return to Home)
        </Link>
      </div>
    </div>
  );
}
