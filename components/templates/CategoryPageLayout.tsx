'use client';

import React, { useState } from 'react';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Tickers from '@/components/organisms/Tickers';
import Footer from '@/components/organisms/Footer';
import SearchModal from '@/components/organisms/SearchModal';
import ArticleModal from '@/components/organisms/ArticleModal';
import { getArticleById, Article } from '@/lib/data';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleSelectArticle = (id: string) => {
    const found = getArticleById(id);
    if (found) {
      setSelectedArticle(found);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    document.body.style.overflow = '';
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

      <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
      />
    </div>
  );
}
