import type { Metadata } from 'next';
import React from 'react';

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
    <div className="admin-cms-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {children}
    </div>
  );
}


