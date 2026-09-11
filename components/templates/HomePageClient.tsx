'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Tickers from '@/components/organisms/Tickers';
import HeroCard from '@/components/organisms/HeroCard';
import TimelineFeed from '@/components/organisms/TimelineFeed';
import Footer from '@/components/organisms/Footer';
import SearchModal from '@/components/organisms/SearchModal';
import MainNewsLayout from '@/components/templates/MainNewsLayout';
import NewsSectionEkantipur from '@/components/organisms/NewsSectionEkantipur';
import RightLeadGridSection from '@/components/organisms/RightLeadGridSection';
import PradeshTabs from '@/components/organisms/PradeshTabs';
import RashifalSection from '@/components/organisms/RashifalSection';
import AdBanner from '@/components/molecules/AdBanner';
import SUNSTAR_DATA from '@/lib/data';

function supplementWithDummy<T>(
  realData: T[] | undefined,
  dummyData: T[],
  requiredCount: number,
  getId: (item: T) => string = (item: any) => item.id || String(item)
): T[] {
  const list = Array.isArray(realData) ? [...realData] : [];
  if (list.length >= requiredCount) {
    return list;
  }

  const existingIds = new Set(list.map(getId));
  for (const item of (dummyData || [])) {
    if (list.length >= requiredCount) break;
    const id = getId(item);
    if (!existingIds.has(id)) {
      list.push(item);
      existingIds.add(id);
    }
  }

  return list;
}

import { getApiBaseUrl } from '@/lib/api-config';

async function fetchClientLandingData() {
  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/landing-data`);
  if (!res.ok) {
    throw new Error('Failed to fetch landing data');
  }
  return res.json();
}

import LandingPageSkeleton from '@/components/organisms/LandingPageSkeleton';

export default function HomePageClient() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // React Query hook: consumes live API data with automatic caching
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['landing-data'],
    queryFn: fetchClientLandingData,
    staleTime: 60 * 1000,
  });

  // Seamlessly merge API data with rich fallback data so sections never appear empty
  const pageData = React.useMemo(() => {
    const src = rawData || {};
    return {
      ...SUNSTAR_DATA,
      ...src,
      featuredLead: src.featuredLead || SUNSTAR_DATA.featuredLead,
      topSecondaryLeads: supplementWithDummy(src.topSecondaryLeads, SUNSTAR_DATA.topSecondaryLeads, 4),
      timelineFeed: supplementWithDummy(
        src.timelineFeed || src.latestTimeline || src.tajaSamachar,
        SUNSTAR_DATA.latestTimeline,
        6
      ),
      exclusiveNews: supplementWithDummy(src.exclusiveNews, SUNSTAR_DATA.exclusiveNews, 5),
      politicsNews: supplementWithDummy(src.politicsNews, SUNSTAR_DATA.politicsNews, 4),
      businessNews: supplementWithDummy(src.businessNews, SUNSTAR_DATA.businessNews, 5),
      sportsNews: supplementWithDummy(src.sportsNews, SUNSTAR_DATA.sportsNews, 5),
      entertainmentNews: supplementWithDummy(src.entertainmentNews, SUNSTAR_DATA.entertainmentNews, 5),
      featureNews: supplementWithDummy(src.featureNews, SUNSTAR_DATA.featureNews, 5),
      technologyNews: supplementWithDummy(src.technologyNews, SUNSTAR_DATA.technologyNews, 5),
      worldNews: supplementWithDummy(src.worldNews, SUNSTAR_DATA.worldNews, 5),
      opinions: supplementWithDummy(src.opinions, SUNSTAR_DATA.opinions, 4),
      breakingNews:
        Array.isArray(src.breakingNews) && src.breakingNews.length > 0
          ? src.breakingNews
          : SUNSTAR_DATA.breakingNews,
      // Banners: strictly real database banners, NEVER dummy data per user specification!
      banners: Array.isArray(src.banners) ? src.banners : [],
    };
  }, [rawData]);

  const handleSelectArticle = (id: string) => {
    router.push(`/news/${id}`);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header (Logo, Weather, Date, Search, Theme Toggle) */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} banners={pageData.banners || []} />

      {/* 2. Primary Header Navigation Categories */}
      <Navigation activeHref="/" />

      {/* Loading Skeleton with Ant Design & Smooth Fade Transition */}
      {isLoading && !rawData ? (
        <LandingPageSkeleton />
      ) : (
        <div style={{ animation: 'landingContentFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {/* 3. Stock Market & Breaking News Tickers Below Header */}
          <Tickers />

          {/* Top Header Banner Slot */}
          <div className="container" style={{ padding: '4px 16px' }}>
            <AdBanner position="header-top" banners={pageData.banners || []} />
          </div>

      <main className="main-content-layout container">
        {/* 5. Main Content Layout with 70% Left Main Content & 30% Right Sidebar */}
        <MainNewsLayout
          mainContent={
            <HeroCard
              lead={pageData.featuredLead || SUNSTAR_DATA.featuredLead}
              secondaryLeads={pageData.topSecondaryLeads || SUNSTAR_DATA.topSecondaryLeads}
              onSelectArticle={handleSelectArticle}
            />
          }
          sidebarContent={
            <TimelineFeed
              items={pageData.timelineFeed || (pageData as any).latestTimeline || (pageData as any).tajaSamachar}
              onSelectArticle={handleSelectArticle}
            />
          }
        />

        {/* Hero Below Banner */}
        <AdBanner position="home-hero-below" banners={pageData.banners || []} />

        {/* 2. EXCLUSIVE (विशेष समाचार) */}
        <RightLeadGridSection
          title="👑 EXCLUSIVE (विशेष समाचार)"
          categorySlug="exclusive"
          articles={pageData.exclusiveNews || SUNSTAR_DATA.exclusiveNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="EXCLUSIVE" href="/category/exclusive" />

        {/* 3. राजनीति (Politics) */}
        <NewsSectionEkantipur
          title="🗳️ राजनीति (Politics)"
          categorySlug="politics"
          leadArticle={(pageData.politicsNews || SUNSTAR_DATA.politicsNews)[0]}
          subArticles={(pageData.politicsNews || SUNSTAR_DATA.politicsNews).slice(1)}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="राजनीति" href="/category/politics" />

        {/* Mid Content 1 Banner */}
        <AdBanner position="mid-content-1" banners={pageData.banners || []} />

        {/* 4. अर्थ / वाणिज्य (Business & Economy) */}
        <RightLeadGridSection
          title="📈 अर्थ / वाणिज्य (Business & Economy)"
          categorySlug="business"
          articles={pageData.businessNews || SUNSTAR_DATA.businessNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="अर्थ / वाणिज्य" href="/category/business" />

        {/* 6. खेलकुद (Sports) */}
        <RightLeadGridSection
          title="⚽ खेलकुद (Sports)"
          categorySlug="sports"
          articles={pageData.sportsNews || SUNSTAR_DATA.sportsNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="खेलकुद" href="/category/sports" />

        {/* Mid Content 2 Banner */}
        <AdBanner position="mid-content-2" banners={pageData.banners || []} />

        {/* 7. मनोरञ्जन (Entertainment) */}
        <RightLeadGridSection
          title="🎬 मनोरञ्जन (Entertainment)"
          categorySlug="entertainment"
          articles={pageData.entertainmentNews || SUNSTAR_DATA.entertainmentNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="मनोरञ्जन" href="/category/entertainment" />

        {/* 8. फिचर समाचार (Feature Story) */}
        <RightLeadGridSection
          title="📰 फिचर समाचार (Feature Story)"
          categorySlug="feature"
          articles={pageData.featureNews || SUNSTAR_DATA.featureNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="फिचर" href="/category/feature" />

        {/* 10. प्रविधि समाचार (Science & Tech) */}
        <RightLeadGridSection
          title="🔬 प्रविधि समाचार (Science & Tech)"
          categorySlug="technology"
          articles={pageData.technologyNews || SUNSTAR_DATA.technologyNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="प्रविधि" href="/category/technology" />

        {/* 11. विश्व समाचार (World News) */}
        <RightLeadGridSection
          title="🌍 विश्व समाचार (World News)"
          categorySlug="world"
          articles={pageData.worldNews || SUNSTAR_DATA.worldNews}
          onSelectArticle={handleSelectArticle}
        />
        <LoadMoreButton label="विश्व" href="/category/world" />

        {/* 12. Pradesh Tabs Section (प्रदेश समाचार) */}
        <PradeshTabs onSelectArticle={handleSelectArticle} />

        {/* 13. Rashifal Section (राशिफल) */}
        <RashifalSection />

        {/* Footer Top Banner */}
        <AdBanner position="footer-top" banners={pageData.banners || []} />
      </main>
      </div>
      )}

      <Footer onOpenSearch={() => setIsSearchOpen(true)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
      />

      <style jsx global>{`
        @keyframes landingContentFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
