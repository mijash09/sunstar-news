import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import SUNSTAR_DATA from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60 seconds caching

interface StockItem {
  name: string;
  symbol: string;
  price: string;
  changePercent: string;
  changePoint: string;
  isUp: boolean;
}

let cachedPayload: { isMarketOpen: boolean; stocks: StockItem[]; timestamp: number } | null = null;
const CACHE_DURATION_MS = 60 * 1000;

export async function GET(request: NextRequest) {
  const now = Date.now();

  // Return cached payload if less than 60 seconds old
  if (cachedPayload && now - cachedPayload.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json({
      success: true,
      source: 'Cache (60s)',
      ...cachedPayload,
    });
  }

  try {
    const res = await fetch('https://www.sharesansar.com/live-trading', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ne;q=0.8',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Sharesansar fetch failed with status ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const stocks: StockItem[] = [];

    // Scrape live trading table rows
    $('table tbody tr').each((_, element) => {
      const tds = $(element).find('td');
      if (tds.length >= 5) {
        const symbol = $(tds[1]).text().trim();
        const priceNum = parseFloat($(tds[2]).text().trim().replace(/,/g, ''));
        const pointChangeNum = parseFloat($(tds[3]).text().trim().replace(/,/g, ''));
        const percentChangeNum = parseFloat($(tds[4]).text().trim().replace(/,/g, ''));

        if (symbol && !isNaN(priceNum)) {
          const isUp = (pointChangeNum || percentChangeNum || 0) >= 0;
          const formattedPercent = isNaN(percentChangeNum)
            ? '0.00%'
            : `${isUp ? '+' : ''}${percentChangeNum.toFixed(2)}%`;
          const formattedPoint = isNaN(pointChangeNum)
            ? '0.00'
            : `${isUp ? '+' : ''}${pointChangeNum.toFixed(2)}`;

          stocks.push({
            name: symbol,
            symbol: symbol,
            price: priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            changePercent: formattedPercent,
            changePoint: formattedPoint,
            isUp: isUp,
          });
        }
      }
    });

    // Check market status text on Sharesansar
    const marketStatusText = $('.market-status, .market-info, h5, span').text().toLowerCase();
    const isMarketOpen = marketStatusText.includes('open') && !marketStatusText.includes('closed');

    // Filter top active trending stocks
    const trendingList =
      stocks.length > 0
        ? stocks.slice(0, 8)
        : (SUNSTAR_DATA.trendingStocks as StockItem[]);

    cachedPayload = {
      isMarketOpen: isMarketOpen,
      stocks: trendingList,
      timestamp: now,
    };

    return NextResponse.json({
      success: true,
      source: 'Sharesansar Live NEPSE Proxy',
      isMarketOpen: isMarketOpen,
      stocks: trendingList,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.warn('NEPSE Scraper Fallback:', err.message);

    // Fallback to cached payload or static SUNSTAR_DATA
    const fallbackStocks = cachedPayload?.stocks || SUNSTAR_DATA.trendingStocks;

    return NextResponse.json({
      success: true,
      source: 'Sunstar NEPSE Fallback Engine',
      isMarketOpen: false,
      stocks: fallbackStocks,
      error: err.message,
    });
  }
}
