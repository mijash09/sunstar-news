import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import SUNSTAR_DATA, { RashifalItem } from '@/lib/data';
import { getTodayNepaliDate } from '@/lib/nepaliDate';

export const dynamic = 'force-dynamic';
export const revalidate = 900; // Cache response for 15 minutes to stay fresh daily

interface HamroPrediction {
  sunsign: string;
  prediction: string;
}

const TARGET_SIGNS = [
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

function isSyllableList(text: string): boolean {
  if (!text) return true;
  const commaCount = (text.match(/,/g) || []).length;
  if (commaCount >= 3 && text.length < 90) return true;
  if (
    text.includes('चु, चे, चो') ||
    text.includes('का, कि, कु') ||
    text.includes('हि, हु, हे') ||
    text.includes('मा, मि, मु') ||
    text.includes('तो, ना, नि')
  ) {
    return true;
  }
  return false;
}

function getPeriodFallbackPredictions(type: string): RashifalItem[] {
  const baseList = SUNSTAR_DATA.rashifal || [];

  return baseList.map((item) => {
    let customPrediction = item.prediction;

    if (type === 'weekly') {
      customPrediction = `साताको प्रारम्भमा ${item.sign} राशिका व्यक्तिहरूलाई व्यापार र रोजगारीमा सकारात्मक नतिजा मिल्नेछ। मध्य सातामा केही खर्च बढ्न सक्ने भएकाले सतर्क रहनुहोला। साताको अन्त्यमा परिवारजनसँग रमाइलो यात्रा र शुभ समाचार सुन्न पाइनेछ।`;
    } else if (type === 'monthly') {
      customPrediction = `यो महिना ${item.sign} राशि हुनेहरूका लागि आर्थिक लाभका नयाँ अवसरहरू खुल्नेछन्। रोकिएका पुराना कामहरू पुन: सुरु भई सम्पन्न हुनेछन्। स्वास्थ्यमा सामान्य ध्यान दिनुपर्नेछ तर पारिवारिक वातावरण सौहार्दपूर्ण रहनेछ।`;
    } else if (type === 'yearly') {
      customPrediction = `वर्ष २०८३ सालभरि ${item.sign} राशिका लागि वैदेशिक क्षेत्र, अध्ययन र नयाँ व्यवसायमा उल्लेख्य सफलता मिल्ने योग छ। वर्षको उत्तरार्धमा मान-सम्मान र पदोन्नति मिल्नेछ। धार्मिक तथा सामाजिक कार्यमा रुचि बढ्नेछ।`;
    }

    return {
      ...item,
      prediction: customPrediction,
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') || 'daily').toLowerCase();
  const todayInfo = getTodayNepaliDate();

  try {
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
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error(`Hamro Patro fetch failed with status: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract Live Date from Page Title or Header
    const pageTitle = $('title').text().trim();
    let liveDateString = todayInfo.rashifalTitleDate;

    if (pageTitle.includes('—')) {
      const parsedPart = pageTitle.split('—')[0].trim();
      if (parsedPart.length > 5) {
        liveDateString = parsedPart;
      }
    } else if (pageTitle.includes('Rashifal')) {
      const parsedPart = pageTitle.split('Rashifal')[0].trim();
      if (parsedPart.length > 5) {
        liveDateString = parsedPart;
      }
    }

    const scrapedList: HamroPrediction[] = [];

    // 1. Scrape Modern Tailwind Cards (.hp-card-surface, article, .rashifal-card, div[class*="card"])
    $('.hp-card-surface, article, .rashifal-card, div[class*="card"]').each((_, el) => {
      const cardObj = $(el);
      const cardText = cardObj.text().trim();

      TARGET_SIGNS.forEach((sign) => {
        const hasSignHeading =
          cardObj.find('h1, h2, h3, h4, span, div, strong').filter((_, child) => $(child).text().trim() === sign).length > 0;

        if (hasSignHeading || cardText.startsWith(sign)) {
          const candidates = cardObj
            .find('p, span, div')
            .map((_, child) => $(child).text().trim())
            .get();

          let bestPrediction = '';
          candidates.forEach((t) => {
            if (
              t.length > 30 &&
              !isSyllableList(t) &&
              !t.startsWith(sign) &&
              !t.includes('शुभ अंक') &&
              !t.includes('शुभ रंग') &&
              t.length > bestPrediction.length
            ) {
              bestPrediction = t;
            }
          });

          if (!bestPrediction) {
            const raw = cardText.replace(sign, '').trim();
            if (raw.length > 30 && !isSyllableList(raw)) {
              bestPrediction = raw;
            }
          }

          if (bestPrediction && !scrapedList.some((s) => s.sunsign === sign)) {
            scrapedList.push({ sunsign: sign, prediction: bestPrediction });
          }
        }
      });
    });

    // 2. Fallback Selector Matching if any signs missed
    if (scrapedList.length < 12) {
      TARGET_SIGNS.forEach((sign) => {
        if (!scrapedList.some((s) => s.sunsign === sign)) {
          let signNode: any = null;
          $('*').each((_: any, el: any) => {
            if ($(el).children().length === 0 && $(el).text().trim() === sign) {
              signNode = $(el);
            }
          });

          if (signNode) {
            let parentBox = signNode.parent();
            for (let i = 0; i < 5; i++) {
              if (parentBox.find('p').length > 0) break;
              parentBox = parentBox.parent();
            }

            const pText = parentBox
              .find('p')
              .filter((_: any, p: any) => {
                const txt = $(p).text().trim();
                return txt.length > 30 && !isSyllableList(txt);
              })
              .first()
              .text()
              .trim();

            if (pText) {
              scrapedList.push({ sunsign: sign, prediction: pText });
            }
          }
        }
      });
    }

    // 3. Map predictions into full RashifalItem list
    const fallbackList = getPeriodFallbackPredictions(type);
    const mergedRashifal: RashifalItem[] = fallbackList.map((item) => {
      const match = scrapedList.find(
        (p) => p.sunsign === item.sign || item.sign.includes(p.sunsign)
      );

      return {
        ...item,
        prediction: match && match.prediction.length > 25 ? match.prediction : item.prediction,
      };
    });

    return NextResponse.json({
      success: true,
      type,
      source: 'Hamro Patro Live API',
      date: liveDateString,
      formattedBsDate: todayInfo.formattedBsDate,
      fullDate: todayInfo.formattedFullDate,
      timestamp: new Date().toISOString(),
      predictions: mergedRashifal,
    });
  } catch (err: any) {
    console.warn('Hamro Patro API fallback to local dataset:', err.message);

    return NextResponse.json({
      success: true,
      type,
      source: 'Sunstar Astrology Engine',
      date: todayInfo.rashifalTitleDate,
      formattedBsDate: todayInfo.formattedBsDate,
      fullDate: todayInfo.formattedFullDate,
      predictions: getPeriodFallbackPredictions(type),
      error: err.message,
    });
  }
}
