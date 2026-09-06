import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'कर्मचारी लगइन (Staff Login) - सनस्टार न्युज',
  description: 'सनस्टार न्युज (Sunstar News) सम्पादक तथा व्यवस्थापक पोर्टल लगइन पृष्ठ।',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-layout-wrapper">
      {children}
    </div>
  );
}
