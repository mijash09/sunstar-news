'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'गृहपृष्ठ', href: '/' },
  { label: '👑 EXCLUSIVE', href: '/category/exclusive', highlight: true },
  { label: '🔥 भर्खरै', href: '/#hero' },
  { label: 'राजनीति', href: '/category/politics' },
  { label: 'अर्थ / वाणिज्य', href: '/category/business' },
  { label: 'विचार', href: '/category/opinion' },
  { label: 'खेलकुद', href: '/category/sports' },
  { label: 'मनोरञ्जन', href: '/category/entertainment' },
  { label: 'फिचर', href: '/category/feature' },
  { label: 'प्रविधि', href: '/category/technology' },
  { label: 'विश्व', href: '/category/world' },
];

export default function Navigation({
  activeHref = '/',
}: {
  activeHref?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="primary-nav">
      <div className="container">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-menu-list ${mobileOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.label} className="nav-item">
              <Link
                href={item.href}
                className={`nav-link ${
                  activeHref === item.href ? 'active' : ''
                } ${item.highlight ? 'highlight' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
