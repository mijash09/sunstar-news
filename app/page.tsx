'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Tickers from '@/components/organisms/Tickers';
import HeroCard from '@/components/organisms/HeroCard';
import NewsCard from '@/components/organisms/NewsCard';
import OpinionCard from '@/components/organisms/OpinionCard';
import PradeshTabs from '@/components/organisms/PradeshTabs';
import RashifalSection from '@/components/organisms/RashifalSection';
import TimelineFeed from '@/components/organisms/TimelineFeed';
import PollWidget from '@/components/organisms/PollWidget';
import Footer from '@/components/organisms/Footer';
import ArticleModal from '@/components/organisms/ArticleModal';
import SearchModal from '@/components/organisms/SearchModal';
import SectionHeader from '@/components/molecules/SectionHeader';
import MainNewsLayout from '@/components/templates/MainNewsLayout';
import NewsSectionEkantipur from '@/components/organisms/NewsSectionEkantipur';
import OpinionGridSection from '@/components/organisms/OpinionGridSection';
import StorySection from '@/components/organisms/StorySection';
import RightLeadGridSection from '@/components/organisms/RightLeadGridSection';
import AdBanner from '@/components/molecules/AdBanner';
import SUNSTAR_DATA, { getArticleById, Article } from '@/lib/data';

export default function HomePage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const LoadMoreButton = ({ label, href }: { label: string; href: string }) => (
    <div style={{ textAlign: 'center', marginTop: '-8px', marginBottom: '20px' }}>
      <Link
        href={href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FFFFFF',
          color: 'var(--brand-orange)',
          border: '1.5px solid var(--brand-orange)',
          padding: '8px 20px',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.88rem',
          textDecoration: 'none',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        👇 थप {label} समाचार लोड गर्नुहोस् (Load More) ➔
      </Link>
    </div>
  );

  return (
    <div>
      {/* 1. Header (Logo, Weather, Date, Search, Theme Toggle) */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Primary Header Navigation Categories */}
      <Navigation activeHref="/" />

      {/* 3. Stock Market & Breaking News Tickers Below Header */}
      <Tickers />

      <main className="main-content-layout container">
        {/* 5. Main Content Layout with 70% Left Main Content & 30% Right Sidebar */}
        <MainNewsLayout
          mainContent={
            <HeroCard
              lead={SUNSTAR_DATA.featuredLead}
              secondaryLeads={SUNSTAR_DATA.topSecondaryLeads}
              onSelectArticle={handleSelectArticle}
            />
          }
          sidebarContent={
            <>
              <TimelineFeed onSelectArticle={handleSelectArticle} />
              <PollWidget />
            </>
          }
        />

        {/* Digital Ad Banner Block */}
        <AdBanner />

        {/* ==========================================================================
           FULL WIDTH SECTIONS (Spanning 100% full container width)
           ========================================================================== */}

        {/* 2. 👑 EXCLUSIVE (विशेष समाचार) - Full Width 5-Column Grid System */}
        <RightLeadGridSection
          title="👑 EXCLUSIVE (विशेष समाचार)"
          categorySlug="exclusive"
          articles={SUNSTAR_DATA.exclusiveNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="EXCLUSIVE" href="/category/exclusive" />
        <AdBanner />

        {/* 3. 🗳️ राजनीति (Politics) - Full Width Signature 3-Column Ekantipur Block */}
        <NewsSectionEkantipur
          title="🗳️ राजनीति (Politics)"
          categorySlug="politics"
          leadArticle={SUNSTAR_DATA.politicsNews[0]}
          subArticles={SUNSTAR_DATA.politicsNews.slice(1)}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="राजनीति" href="/category/politics" />
        <AdBanner />

        {/* 4. 📈 अर्थ / वाणिज्य (Business & Economy) - Full Width Grid System */}
        <RightLeadGridSection
          title="📈 अर्थ / वाणिज्य (Business & Economy)"
          categorySlug="business"
          articles={SUNSTAR_DATA.businessNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="अर्थ / वाणिज्य" href="/category/business" />
        <AdBanner />

        {/* 5. ✍️ विचार / विश्लेषण (Opinions Carousel Slider) */}
        <OpinionGridSection
          title="✍️ विचार / विश्लेषण (Opinions & Analysis)"
          opinions={SUNSTAR_DATA.opinions}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="विचार" href="/category/opinion" />
        <AdBanner />

        {/* 5.5 📸 सनस्टार स्टोरी (Visual Web Stories Section) */}
        <StorySection
          title="📸 सनस्टार स्टोरी (Visual Web Stories)"
          stories={SUNSTAR_DATA.stories}
          onSelectArticle={handleSelectArticle}
        />
        <AdBanner />

        {/* 6. ⚽ खेलकुद (Sports) - Full Width Grid System */}
        <RightLeadGridSection
          title="⚽ खेलकुद (Sports)"
          categorySlug="sports"
          articles={SUNSTAR_DATA.sportsNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="खेलकुद" href="/category/sports" />
        <AdBanner />

        {/* 7. 🎬 मनोरञ्जन (Entertainment) - Full Width Grid System */}
        <RightLeadGridSection
          title="🎬 मनोरञ्जन (Entertainment)"
          categorySlug="entertainment"
          articles={SUNSTAR_DATA.entertainmentNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="मनोरञ्जन" href="/category/entertainment" />
        <AdBanner />

        {/* 8. 📰 फिचर (Feature) - Full Width Grid System */}
        <RightLeadGridSection
          title="📰 फिचर समाचार (Feature Story)"
          categorySlug="feature"
          articles={SUNSTAR_DATA.featureNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="फिचर" href="/category/feature" />
        <AdBanner />

        {/* 10. 🔬 प्रविधि (Technology) - Full Width Grid System */}
        <RightLeadGridSection
          title="🔬 प्रविधि समाचार (Science & Tech)"
          categorySlug="technology"
          articles={SUNSTAR_DATA.technologyNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="प्रविधि" href="/category/technology" />
        <AdBanner />

        {/* 11. 🌍 विश्व समाचार (World News) - Full Width Grid System */}
        <RightLeadGridSection
          title="🌍 विश्व समाचार (World News)"
          categorySlug="world"
          articles={SUNSTAR_DATA.worldNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="विश्व" href="/category/world" />
        {/* 12. Pradesh Tabs Section (प्रदेश समाचार) - Full Width */}
        <PradeshTabs onSelectArticle={handleSelectArticle} />
        <AdBanner />

        {/* 13. Rashifal Section (राशिफल) - Daily Horoscope */}
        <RashifalSection />
        <AdBanner />
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

