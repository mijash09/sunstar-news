import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import SUNSTAR_DATA, { RashifalItem } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache response for 1 hour

interface HamroPrediction {
  sunsign: string;
  prediction: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'daily').toLowerCase();

    let targetUrl = 'https://www.hamropatro.com/rashifal';
    if (type === 'weekly') {
      targetUrl = 'https://www.hamropatro.com/rashifal/weekly';
    } else if (type === 'monthly') {
      targetUrl = 'https://www.hamropatro.com/rashifal/monthly';
    } else if (type === 'yearly') {
      targetUrl = 'https://www.hamropatro.com/rashifal/yearly';
    }

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ne-NP,ne;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Hamro Patro fetch failed with status: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const scrapedList: HamroPrediction[] = [];
    const targetSigns = [
      'मेष',
      'वृष',
      'मिथुन',
      'कर्कट',
      'सिंह',
      'कन्या',
      'तुला',
      'वृश्चिक',
      'धनु',
      'मकर',
      'कुम्भ',
      'मीन',
    ];

    // 1. Try DOM Traversal matching exact target signs
    targetSigns.forEach((sign) => {
      let signNode: any = null;
      $('*').each((_: any, el: any) => {
        if ($(el).children().length === 0 && $(el).text().trim() === sign) {
          signNode = $(el);
        }
      });

      if (signNode) {
        let parentBox = signNode.parent();
        for (let i = 0; i < 5; i++) {
          if (
            parentBox.find('p, span').filter((_: any, p: any) => $(p).text().trim().length > 30).length > 0
          ) {
            break;
          }
          parentBox = parentBox.parent();
        }

        const predictionText = parentBox
          .find('p, span, div')
          .filter((_: any, el: any) => {
            const txt = $(el).text().trim();
            return (
              txt.length > 30 &&
              !txt.startsWith(sign) &&
              !txt.includes('चु, चे') &&
              !txt.includes('इ, उ, ए')
            );
          })
          .first()
          .text()
          .trim();

        if (predictionText) {
          scrapedList.push({
            sunsign: sign,
            prediction: predictionText,
          });
        }
      }
    });

    // 2. Fallback to Legacy Selectors (e.g. h3 & .desc) if scrape array incomplete
    if (scrapedList.length < 12) {
      for (let i = 0; i < 12; i++) {
        const sign = $('h3').eq(i).text().trim();
        const rawDesc = $('.desc').find('p').eq(i).text().trim();
        const cleanDesc = rawDesc.includes(')') ? rawDesc.split(')')[1].trim() : rawDesc;

        if (sign && cleanDesc && !scrapedList.some((item) => item.sunsign === sign)) {
          scrapedList.push({
            sunsign: sign,
            prediction: cleanDesc,
          });
        }
      }
    }

    // 3. Map predictions into full RashifalItem list
    const defaultList: RashifalItem[] = SUNSTAR_DATA.rashifal || [];
    const mergedRashifal: RashifalItem[] = defaultList.map((item) => {
      const match = scrapedList.find(
        (p) => p.sunsign === item.sign || item.sign.includes(p.sunsign)
      );

      return {
        ...item,
        prediction: match?.prediction || item.prediction,
      };
    });

    return NextResponse.json({
      success: true,
      type,
      source: 'Hamro Patro',
      timestamp: new Date().toISOString(),
      predictions: mergedRashifal,
    });
  } catch (err: any) {
    console.warn('Hamro Patro API fallback to local dataset:', err);

    return NextResponse.json({
      success: false,
      source: 'Sunstar Dataset Fallback',
      predictions: SUNSTAR_DATA.rashifal,
      error: err.message,
    });
  }
}
