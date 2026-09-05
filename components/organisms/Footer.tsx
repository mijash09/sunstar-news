'use client';

import React from 'react';
import Link from 'next/link';
import SUNSTAR_DATA from '@/lib/data';

export default function Footer({ onOpenSearch }: { onOpenSearch?: () => void }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/sunstar-logo.jpg"
                alt="Sunstar News Logo"
                className="footer-logo"
              />
            </div>
            <span className="footer-tagline">
              {SUNSTAR_DATA.sourceInfo.tagline}
            </span>
            <p
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#CBD5E1',
              }}
            >
              सनस्टार न्युज (Sunstar News) नेपालको आधिकारिक र निष्पक्ष अनलाइन
              समाचार पोर्टल हो। हामी राष्ट्रिय, अन्तर्राष्ट्रिय, राजनीति, अर्थ,
              प्रविधि, खेलकुद र समाजका विविध क्षेत्रका सत्यतथ्य समाचार सम्प्रेषण
              गर्छौँ।
            </p>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#94A3B8',
                marginTop: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span>
                📋 सूचना तथा प्रसारण विभाग दर्ता नं. :{' '}
                <strong>४२१८/२०८०-८१</strong>
              </span>
              <span>
                🛡️ प्रेस काउन्सिल सूचीकरण दर्ता नं. :{' '}
                <strong>३९५२/२०८०</strong>
              </span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">मुख्य वर्गहरू</h4>
            <ul className="footer-links">
              <li>
                <Link href="#hero">मुख्य समाचार</Link>
              </li>
              <li>
                <Link href="/category/politics">राजनीति</Link>
              </li>
              <li>
                <Link href="/category/business">अर्थ / वाणिज्य</Link>
              </li>
              <li>
                <Link href="/category/opinion">विचार / विश्लेषण</Link>
              </li>
              <li>
                <Link href="#pradesh">प्रदेश समाचार</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">अन्य सेवाहरू</h4>
            <ul className="footer-links">
              <li>
                <Link href="#videos">भिडियो फिचर</Link>
              </li>
              <li>
                <a href="#" onClick={() => alert('ई-पेपर')}>
                  आजको ई-पेपर
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenSearch) onOpenSearch();
                  }}
                >
                  समाचार खोज
                </a>
              </li>
              <li>
                <a href="#" onClick={() => alert('राशिफल सुविधा चाँडै')}>
                  आजको राशिफल
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">हाम्रोबारे & सम्पर्क</h4>
            <ul className="footer-links" style={{ fontSize: '0.9rem' }}>
              <li>
                <strong>सनस्टार न्युज डटकम (Sunstar News.com)</strong>
              </li>
              <li>📍 कार्यालय: पोखरा ५, कास्की, नेपाल</li>
              <li>📞 सम्पर्क: +९७७-६१-५४३२१० / ९८५६०१२३४५</li>
              <li>✉️ इमेल: info@sunstarnews.com</li>
              <li>
                📘 फेसबुक:{' '}
                <a
                  href="https://www.facebook.com/profile.php?id=61593841685666"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--brand-gold)',
                    textDecoration: 'underline',
                  }}
                >
                  fb.com/SunstarNews.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © २०८३ Sunstar News (सनस्टार न्युज). सर्वाधिकार सुरक्षित।
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="#">गोपनीयता नीति</Link>
            <Link href="#">उपयोगका शर्तहरू</Link>
            <Link href="#">सम्पर्क</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
