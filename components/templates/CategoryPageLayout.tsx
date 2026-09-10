'use client';

import React, { useState } from 'react';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Tickers from '@/components/organisms/Tickers';
import Footer from '@/components/organisms/Footer';
import SearchModal from '@/components/organisms/SearchModal';
import { useRouter } from 'next/navigation';

interface CategoryPageLayoutProps {
  title: string;
  activeHref: string;
  children: React.ReactNode;
}

export default function CategoryPageLayout({
  title,
  activeHref,
  children,
}: CategoryPageLayoutProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSelectArticle = (id: string) => {
    router.push(`/news/${id}`);
  };

  return (
    <div>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <Navigation activeHref={activeHref} />
      <Tickers />

      <main
        className="container"
        style={{ paddingTop: '30px', paddingBottom: '60px' }}
      >
        <div className="section-header" style={{ marginBottom: '30px' }}>
          <h1 className="section-title" style={{ fontSize: '1.8rem' }}>
            {title}
          </h1>
        </div>
        {children}
      </main>

      <Footer onOpenSearch={() => setIsSearchOpen(true)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
      />
    </div>
  );
}
