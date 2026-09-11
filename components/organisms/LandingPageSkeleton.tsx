'use client';

import React from 'react';
import { Skeleton } from 'antd';

export default function LandingPageSkeleton() {
  return (
    <div className="landing-skeleton-wrapper" style={{ animation: 'skeletonFadeIn 0.3s ease' }}>
      {/* Tickers skeleton */}
      <div className="container" style={{ padding: '8px 16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Skeleton.Button active style={{ width: 100, height: 32, borderRadius: 6 }} />
          <Skeleton.Input active style={{ flex: 1, height: 32, borderRadius: 6 }} />
        </div>
      </div>

      {/* Top Banner Skeleton */}
      <div className="container" style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div
          style={{
            height: 90,
            background: 'linear-gradient(90deg, #f0f2f5 25%, #e6e8eb 37%, #f0f2f5 63%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton.Button active style={{ width: 220, height: 28 }} />
        </div>
      </div>

      {/* Hero Section + Right Sidebar Layout */}
      <main className="main-content-layout container">
        <div className="two-col-layout">
          {/* Main 70% column */}
          <div className="left-main-column">
            {/* Hero Main Card Skeleton */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div>
                  <Skeleton.Button active style={{ width: 120, height: 24, marginBottom: 16, borderRadius: 4 }} />
                  <Skeleton active paragraph={{ rows: 3 }} title={{ width: '90%' }} />
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      height: 280,
                      background: '#f1f5f9',
                      borderRadius: 10,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Skeleton.Image active style={{ width: '100%', height: 280 }} />
                  </div>
                </div>
              </div>

              {/* Sub-leads grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ padding: '8px' }}>
                    <div style={{ height: 110, background: '#f1f5f9', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
                      <Skeleton.Image active style={{ width: '100%', height: 110 }} />
                    </div>
                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '85%' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mid Banner Skeleton */}
            <div style={{ height: 90, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skeleton.Button active style={{ width: 200, height: 24 }} />
            </div>

            {/* Section 1 Skeleton (Exclusive) */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Skeleton.Button active style={{ width: 180, height: 32, borderRadius: 6 }} />
                <Skeleton.Button active style={{ width: 90, height: 28, borderRadius: 14 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
                    <div style={{ height: 150, background: '#f1f5f9', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                      <Skeleton.Image active style={{ width: '100%', height: 150 }} />
                    </div>
                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '90%' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 Skeleton (Politics) */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Skeleton.Button active style={{ width: 180, height: 32, borderRadius: 6 }} />
                <Skeleton.Button active style={{ width: 90, height: 28, borderRadius: 14 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
                    <div style={{ height: 150, background: '#f1f5f9', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                      <Skeleton.Image active style={{ width: '100%', height: 150 }} />
                    </div>
                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '90%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar 30% column */}
          <aside className="right-sidebar">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Skeleton.Avatar active shape="circle" size="small" />
                <Skeleton.Button active style={{ width: 140, height: 26, borderRadius: 4 }} />
              </div>

              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '14px 0',
                    borderBottom: i < 6 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <Skeleton.Avatar active shape="square" size={54} style={{ borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton active paragraph={{ rows: 1 }} title={{ width: '95%' }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <style jsx global>{`
        @keyframes skeletonFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .landing-skeleton-wrapper .ant-skeleton-image {
          width: 100% !important;
          height: 100% !important;
          min-width: 100% !important;
        }
      `}</style>
    </div>
  );
}
