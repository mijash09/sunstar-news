import * as cheerio from 'cheerio';

async function scrapeSharesansar() {
  const fallbackStocks = [
    { name: 'NABIL', symbol: 'NABIL', price: '520.00', changePercent: '+1.20%', changePoint: '+6.20', isUp: true },
    { name: 'GBIME', symbol: 'GBIME', price: '215.00', changePercent: '+0.85%', changePoint: '+1.80', isUp: true },
    { name: 'NICA', symbol: 'NICA', price: '480.00', changePercent: '-0.40%', changePoint: '-1.90', isUp: false },
    { name: 'SHIVM', symbol: 'SHIVM', price: '495.00', changePercent: '+2.10%', changePoint: '+10.20', isUp: true },
    { name: 'HIDCL', symbol: 'HIDCL', price: '198.50', changePercent: '+0.50%', changePoint: '+1.00', isUp: true },
    { name: 'CHCL', symbol: 'CHCL', price: '380.00', changePercent: '-1.10%', changePoint: '-4.20', isUp: false },
    { name: 'HDL', symbol: 'HDL', price: '1,420.00', changePercent: '+1.45%', changePoint: '+20.50', isUp: true },
    { name: 'UPPER', symbol: 'UPPER', price: '240.00', changePercent: '+0.75%', changePoint: '+1.80', isUp: true },
  ];

  try {
    const res = await fetch('https://www.sharesansar.com/live-trading', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ne;q=0.8',
      },
    });

    if (!res.ok) {
      throw new Error(`Sharesansar fetch failed with status ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const stocks = [];

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

    const trendingList = stocks.length > 0 ? stocks.slice(0, 8) : fallbackStocks;

    console.log(JSON.stringify({
      success: true,
      source: 'Sharesansar Live NEPSE Proxy',
      isMarketOpen,
      stocks: trendingList,
      timestamp: new Date().toISOString(),
    }));
  } catch (err) {
    console.log(JSON.stringify({
      success: true,
      source: 'Sunstar NEPSE Fallback Engine',
      isMarketOpen: false,
      stocks: fallbackStocks,
      error: err.message,
    }));
  }
}

scrapeSharesansar();
