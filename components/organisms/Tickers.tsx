'use client';

import React, { useState, useEffect, useRef } from 'react';
import SUNSTAR_DATA from '@/lib/data';
import PulseDot from '@/components/atoms/PulseDot';
import Link from 'next/link';

export default function Tickers({ initialBreakingNews }: { initialBreakingNews?: string[] }) {
  const [stocks, setStocks] = useState<any[]>(SUNSTAR_DATA.trendingStocks || []);
  const [breakingNews, setBreakingNews] = useState<string[]>(initialBreakingNews || SUNSTAR_DATA.breakingNews || []);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const tickerRef = useRef<HTMLDivElement>(null);
  const [animDuration, setAnimDuration] = useState<number>(35);

  const stockTrackRef = useRef<HTMLDivElement>(null);
  const [stockAnimDuration, setStockAnimDuration] = useState<number>(145);

  useEffect(() => {
    let active = true;
    fetch('/api/landing-data')
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.breakingNews) && data.breakingNews.length > 0) {
          setBreakingNews(data.breakingNews);
        }
      })
      .catch(() => {});

    fetch('/api/nepse')
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.stocks) && data.stocks.length > 0) {
          setStocks(data.stocks);
          setIsMarketOpen(!!data.isMarketOpen);
        }
      })
      .catch((err) => {
        console.warn('Live NEPSE Ticker Fetch Error:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Ensure breaking news fills the line and repeats for 100% seamless marquee loop
  let displayNews = [...breakingNews];
  if (displayNews.length > 0) {
    while (displayNews.length < 8) {
      displayNews = displayNews.concat(breakingNews);
    }
  }
  const seamlessNews = displayNews.concat(displayNews);

  // Measure content width and enforce uniform constant velocity (~60px / sec) for any text length
  useEffect(() => {
    if (tickerRef.current) {
      const totalWidth = tickerRef.current.scrollWidth;
      const halfWidth = totalWidth / 2; // Width of one set
      const SPEED_PX_PER_SEC = 60; // Constant pixel speed across all screen sizes
      const calculatedDuration = Math.max(10, Math.round(halfWidth / SPEED_PX_PER_SEC));
      setAnimDuration(calculatedDuration);
    }
  }, [breakingNews, displayNews.length]);

  // Ensure stocks fill the line and repeat for 100% seamless marquee loop
  let displayStocks = [...stocks];
  if (displayStocks.length > 0) {
    while (displayStocks.length < 12) {
      displayStocks = displayStocks.concat(stocks);
    }
  }
  const seamlessStocks = displayStocks.concat(displayStocks);

  // Measure stock track width and enforce smooth uniform constant velocity (~50px / sec)
  useEffect(() => {
    if (stockTrackRef.current) {
      const totalWidth = stockTrackRef.current.scrollWidth;
      const halfWidth = totalWidth / 2; // Width of one set
      const SPEED_PX_PER_SEC = 50; // Constant pixel speed
      const calculatedDuration = Math.max(15, Math.round(halfWidth / SPEED_PX_PER_SEC));
      setStockAnimDuration(calculatedDuration);
    }
  }, [stocks, displayStocks.length]);

  return (
    <div className="top-tickers-wrapper">
      {/* 1. Top Trending Live Stock Ticker Bar */}
      <div className="stock-ticker-bar">
        <div className="container">
          {/* Blue Trending Badge */}
          <div className="trending-blue-badge">
            NEPSE Live..
          </div>

          {/* Stock Ticker Items Row (Seamless Auto-Scrolling) */}
          <div className="stock-ticker-list">
            <div
              className="stock-ticker-track"
              ref={stockTrackRef}
              style={{
                animationDuration: `${stockAnimDuration}s`,
              }}
            >
              {seamlessStocks.map((stock, idx) => (
                <div key={stock.symbol ? `${stock.symbol}-${idx}` : idx} className="stock-ticker-item">
                  <div className="stock-company-name" title={stock.name}>
                    {stock.name}
                  </div>
                  <div className="stock-main-row">
                    <span className="stock-symbol">{stock.symbol}</span>
                    <span className="stock-price">{stock.price}</span>
                  </div>
                  <div
                    className={`stock-change-row ${
                      stock.isUp ? 'stock-change-up' : 'stock-change-down'
                    }`}
                  >
                    <span>{stock.changePercent}</span>
                    <span>{stock.changePoint}</span>
                    <span>{stock.isUp ? '↗' : '↘'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View Stock Live Button Box */}
          <Link href="/category/business" className="view-stock-live-card">
            <span className="stock-live-title">View NEPSE Live</span>
            <span className="stock-market-status">
              <span style={{ fontSize: '0.65rem' }}>{isMarketOpen ? '🟢' : '🔴'}</span>{' '}
              {isMarketOpen ? 'Market Open' : 'Market Closed'}
            </span>
          </Link>
        </div>
      </div>

      {/* 2. Breaking News Marquee */}
      <div className="ticker-bar">
        <div className="container">
          <div className="ticker-badge">
            <PulseDot /> भर्खरै
          </div>
          <div className="ticker-content">
            <div
              className="ticker-text"
              ref={tickerRef}
              style={{
                animationDuration: `${animDuration}s`,
              }}
            >
              {seamlessNews.map((item, idx) => (
                <span key={idx} className="ticker-item">
                  🔥 {item} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


