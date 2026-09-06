import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'व्यवस्थापक ड्यासबोर्ड (Admin CMS Dashboard) - सनस्टार न्युज',
  description: 'सनस्टार न्युज (Sunstar News) डिजिटल सम्पादन तथा सामग्री व्यवस्थापन प्रणाली।',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-cms-shell">
      {/* 1. Admin Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand Logo Header */}
        <div className="admin-brand-header">
          <div className="admin-logo-box">
            <span className="admin-logo-sun">☀️</span>
            <div>
              <h2 className="admin-brand-title">SUNSTAR</h2>
              <span className="admin-brand-subtitle">CMS Portal</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="admin-sidebar-nav">
          <div className="nav-group-title">सामग्री व्यवस्थापन</div>
          <Link href="/dashboard" className="admin-nav-item active">
            <span className="nav-icon">📊</span>
            <span>ड्यासबोर्ड मुख्य</span>
          </Link>
          <Link href="/dashboard#articles" className="admin-nav-item">
            <span className="nav-icon">📰</span>
            <span>समाचार सूची</span>
          </Link>
          <Link href="/dashboard#create" className="admin-nav-item">
            <span className="nav-icon">➕</span>
            <span>नयाँ समाचार थप्नुहोस्</span>
          </Link>
          <Link href="/dashboard#opinions" className="admin-nav-item">
            <span className="nav-icon">✍️</span>
            <span>विचार र विश्लेषण</span>
          </Link>
          <Link href="/dashboard#pradesh" className="admin-nav-item">
            <span className="nav-icon">🏔️</span>
            <span>प्रदेश समाचार</span>
          </Link>
          <Link href="/dashboard#rashifal" className="admin-nav-item">
            <span className="nav-icon">🔮</span>
            <span>दैनिक राशिफल</span>
          </Link>

          <div className="nav-group-title" style={{ marginTop: '20px' }}>प्रणाली र प्रयोगकर्ता</div>
          <Link href="/dashboard#users" className="admin-nav-item">
            <span className="nav-icon">👥</span>
            <span>व्यवस्थापक र स्टाफ</span>
          </Link>
          <Link href="/" target="_blank" className="admin-nav-item external-portal-link">
            <span className="nav-icon">🌐</span>
            <span>वेबसाइट हेर्नुहोस् ➔</span>
          </Link>
        </nav>

        {/* Logged in Admin Profile Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-profile-box">
            <div className="admin-user-avatar">S</div>
            <div className="admin-user-meta">
              <span className="admin-user-name">Sitaram</span>
              <span className="admin-user-role-badge">ADMIN</span>
            </div>
          </div>

          <form action={logoutAction} style={{ width: '100%', marginTop: '10px' }}>
            <button type="submit" className="admin-logout-btn">
              🚪 लगआउट (Sign Out)
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Main Admin Viewport */}
      <div className="admin-main-viewport">
        {/* Admin Top Header Bar */}
        <header className="admin-top-header">
          <div className="header-left-meta">
            <span className="admin-breadcrumb">ड्यासबोर्ड / मुख्य अवलोकन</span>
            <h1 className="admin-header-title">सनस्टार डिजिटल समाचार सम्पादन कक्ष</h1>
          </div>

          <div className="header-right-actions">
            <div className="db-status-pill">
              <span className="db-status-dot green"></span>
              <span>Neon DB Active</span>
            </div>
            
            <Link href="/" target="_blank" className="admin-preview-site-btn">
              👁️ साइट प्रिभ्यु
            </Link>
          </div>
        </header>

        {/* Page Inner Container */}
        <main className="admin-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
