'use client';

import React from 'react';
import SUNSTAR_DATA from '@/lib/data';
import PulseDot from '@/components/atoms/PulseDot';
import Link from 'next/link';

export default function Tickers() {
  const nepseData = SUNSTAR_DATA.nepseTicker;
  const stocks = SUNSTAR_DATA.trendingStocks;

  return (
    <div className="top-tickers-wrapper">
      {/* 1. Top Trending Live Stock Ticker Bar (Exact match to requested UI) */}
      <div className="stock-ticker-bar">
        <div className="container">
          {/* Blue Trending Badge */}
          <div className="trending-blue-badge">
            Trending..
          </div>

          {/* Stock Ticker Items Row */}
          <div className="stock-ticker-list">
            {stocks.map((stock, idx) => (
              <div key={idx} className="stock-ticker-item">
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
            <span className="stock-live-title">View Stock Live</span>
            <span className="stock-market-status">
              <span style={{ fontSize: '0.65rem' }}>🔴</span> Market Closed
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

