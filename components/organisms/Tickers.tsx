'use client';

import React, { useState, useEffect } from 'react';
import SUNSTAR_DATA from '@/lib/data';
import PulseDot from '@/components/atoms/PulseDot';
import Link from 'next/link';

export default function Tickers() {
  const [stocks, setStocks] = useState<any[]>(SUNSTAR_DATA.trendingStocks || []);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
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

  return (
    <div className="top-tickers-wrapper">
      {/* 1. Top Trending Live Stock Ticker Bar */}
      <div className="stock-ticker-bar">
        <div className="container">
          {/* Blue Trending Badge */}
          <div className="trending-blue-badge">
            NEPSE Live..
          </div>

          {/* Stock Ticker Items Row */}
          <div className="stock-ticker-list">
            {stocks.map((stock, idx) => (
              <div key={stock.symbol || idx} className="stock-ticker-item">
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
            <div className="ticker-text">
              {SUNSTAR_DATA.breakingNews.map((item, idx) => (
                <span key={idx}>
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


