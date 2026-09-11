import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60s cache

export async function GET() {
  try {
    const res = await fetch('https://markets.onlinekhabar.com/smtm/home/trending', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`OnlineKhabar trending API failed with status ${res.status}`);
    }

    const data = await res.json();
    const rawItems = Array.isArray(data?.response) ? data.response : [];

    const stocks = rawItems.map((item: any) => {
      const pts = Number(item.points_change || 0);
      const pct = Number(item.percentage_change || 0);
      const isUp = pts >= 0;

      const changePoint = (pts > 0 ? '+' : '') + pts.toFixed(2);
      const changePercent = (pct > 0 ? '+' : '') + pct.toFixed(2) + '%';

      return {
        name: item.ticker_name || item.ticker,
        symbol: item.ticker || '',
        price: String(item.latest_price || '0'),
        changePercent,
        changePoint,
        isUp,
        tradedOfMktCap: item.traded_of_mkt_cap ?? null,
      };
    });

    // Check market opening hours in Nepal (NPT UTC+5:45, Sun-Thu 11:00-15:00)
    const now = new Date();
    const nptTime = new Date(now.getTime() + 5.75 * 3600 * 1000);
    const day = nptTime.getUTCDay(); // 0 is Sunday, 4 is Thursday
    const hour = nptTime.getUTCHours();
    const isMarketOpen = day >= 0 && day <= 4 && hour >= 11 && hour < 15;

    return NextResponse.json({
      success: true,
      source: 'OnlineKhabar Market Trending API',
      isMarketOpen,
      stocks,
      response: rawItems,
      data: stocks,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      source: 'Sunstar NEPSE Fallback Engine',
      isMarketOpen: false,
      stocks: [],
      response: [],
    }, { status: 500 });
  }
}
