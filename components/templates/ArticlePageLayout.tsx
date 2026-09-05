import React from 'react';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';

interface ArticlePageLayoutProps {
  children: React.ReactNode;
}

export default function ArticlePageLayout({ children }: ArticlePageLayoutProps) {
  return (
    <div>
      <Header />
      <Navigation />
      <main
        className="container"
        style={{ paddingTop: '30px', paddingBottom: '60px' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
