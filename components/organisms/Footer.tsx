'use client';

import React from 'react';
import Link from 'next/link';
import SUNSTAR_DATA from '@/lib/data';

export default function Footer({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#081628',
        color: '#E2E8F0',
        borderTop: '4px solid var(--brand-orange)',
        paddingTop: '40px',
        paddingBottom: '24px',
        fontSize: '0.92rem',
      }}
    >
      <div className="container">
        {/* Top Header Strip inside Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '24px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid var(--brand-orange)',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/sunstar-logo.jpg" alt="Sunstar Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.1 }}>
                सनस्टार न्युज (Sunstar News)
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--brand-gold)', fontWeight: 700 }}>
                {SUNSTAR_DATA.sourceInfo.tagline}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/rashifal"
              style={{
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                color: 'var(--brand-orange)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              🔮 आजको राशिफल
            </Link>
            <Link
              href="/category/politics"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                color: '#60A5FA',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              ⚖️ राजनीति
            </Link>
            <Link
              href="/category/business"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              📈 अर्थ / वाणिज्य
            </Link>
          </div>
        </div>

        {/* 4 Column Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            marginBottom: '36px',
          }}
        >
          {/* Col 1: About & Registration */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px', borderLeft: '3px solid var(--brand-orange)', paddingLeft: '8px' }}>
              सनस्टार डिजिटल मिडिया
            </h4>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#94A3B8', marginBottom: '14px' }}>
              सनस्टार न्युज नेपालको आधिकारिक निष्पक्ष अनलाइन समाचार पोर्टल हो। हामी राष्ट्रिय, अन्तर्राष्ट्रिय, राजनीति, अर्थ, प्रविधि, खेलकुद र समाजका विविध क्षेत्रका सत्यतथ्य समाचार सम्प्रेषण गर्छौँ।
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#CBD5E1', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span>📋 सूचना विभाग दर्ता नं: <strong>४२१८/२०८०-८१</strong></span>
              <span>🛡️ प्रेस काउन्सिल दर्ता नं: <strong>३९५२/२०८०</strong></span>
              <span>👨‍💼 अध्यक्ष / MD: <strong>हरिप्रसाद ढकाल</strong></span>
              <span>✍️ प्रधान सम्पादक: <strong>सीताराम कोइराला</strong></span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px', borderLeft: '3px solid var(--brand-orange)', paddingLeft: '8px' }}>
              मुख्य समाचार विधाहरू
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.88rem' }}>
              <li><Link href="/" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>मुख्य समाचार</Link></li>
              <li><Link href="/category/politics" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>राजनीति</Link></li>
              <li><Link href="/category/business" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>अर्थ / वाणिज्य</Link></li>
              <li><Link href="/category/exclusive" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>विशेष एक्सक्लुसिभ</Link></li>
              <li><Link href="/category/pradesh" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>प्रदेश समाचार</Link></li>
              <li><Link href="/category/opinion" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>विचार / ब्लग</Link></li>
              <li><Link href="/category/entertainment" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>मनोरञ्जन</Link></li>
              <li><Link href="/category/sports" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>खेलकुद</Link></li>
              <li><Link href="/category/technology" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>प्रविधि</Link></li>
              <li><Link href="/category/world" className="footer-nav-link" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s ease' }}>विश्व समाचार</Link></li>
            </ul>
          </div>

          {/* Col 3: Digital Services & Portals */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px', borderLeft: '3px solid var(--brand-orange)', paddingLeft: '8px' }}>
              डिजिटल सेवा र पोर्टल
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <Link href="/rashifal" style={{ color: 'var(--brand-gold)', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🔮 १२ राशीको दैनिक राशिफल ➔
                </Link>
              </li>
              <li>
                <Link href="/#nepse" style={{ color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease' }}>
                  📈 नेप्से सेयर बजार लाइभ (NEPSE)
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => alert('सनस्टार ई-पेपर संस्करण शीघ्र उपलब्ध हुँदैछ!')}
                  style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  📰 डिजिटल ई-पेपर संस्करण
                </button>
              </li>
              <li>
                <Link href="/dashboard" style={{ color: '#60A5FA', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📊 सम्पादकीय ड्यासबोर्ड (CMS) ➔
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social Media */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px', borderLeft: '3px solid var(--brand-orange)', paddingLeft: '8px' }}>
              सम्पर्क तथा सोसल मिडिया
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#CBD5E1', marginBottom: '16px' }}>
              <span>📍 <strong>कार्यालय:</strong> पोखरा ५, कास्की (शाखा: अनामनगर, काठमाडौँ)</span>
              <span>📞 <strong>फोन:</strong> +९७७-६१-५४३२१० / ९८५६०१२३४५</span>
              <span>✉️ <strong>इमेल:</strong> info@sunstarnews.com</span>
            </div>

            {/* Social Media Badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="https://www.facebook.com/profile.php?id=61593841685666"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#1877F2',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                📘 Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                🐦 Twitter/X
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#FF0000',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                ▶ YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#94A3B8',
          }}
        >
          <div>
            © २०८३ <strong>Sunstar News (सनस्टार न्युज मिडिया प्रा.लि.)</strong>. सर्वाधिकार सुरक्षित।
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/privacy" className="footer-nav-link" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}>गोपनीयता नीति</Link>
            <Link href="/terms" className="footer-nav-link" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}>उपयोगका शर्तहरू</Link>
            <button
              onClick={scrollToTop}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '14px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.78rem',
              }}
            >
              माथि जानुहोस् ⬆
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
