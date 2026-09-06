import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import SUNSTAR_DATA, { RashifalItem } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache response for 1 hour

interface HamroPrediction {
  sunsign: string;
  prediction: string;
}

const PERIOD_PREFIXES: Record<string, string> = {
  daily: 'आजको ग्रहगोचर र नक्षत्र प्रभाव:',
  weekly: 'यो साताको ग्रहगोचर र साप्ताहिक विश्लेषण:',
  monthly: 'यो महिनाको ग्रहगोचर र व्यापार/स्वास्थ्य विश्लेषण:',
  yearly: 'वर्ष २०८३ सालभरिको वृहत ग्रहगोचर र वार्षिक भविष्यफल:',
};

// Rich fallback dataset generator for periods
function getPeriodFallbackPredictions(type: string): RashifalItem[] {
  const baseList = SUNSTAR_DATA.rashifal || [];
  const prefix = PERIOD_PREFIXES[type] || PERIOD_PREFIXES.daily;

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

    // Helper: Verify if text is a genuine prediction paragraph (not a syllable list)
    const isRealPrediction = (txt: string): boolean => {
      if (!txt || txt.length < 45) return false;
      // Syllables usually contain 4+ commas separating 1-2 character letters
      const commaCount = (txt.match(/,/g) || []).length;
      if (commaCount >= 4 && txt.length < 70) return false;
      return true;
    };

    // 1. DOM Traversal matching exact target signs
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
            parentBox.find('p, span, div').filter((_: any, p: any) => {
              const txt = $(p).text().trim();
              return isRealPrediction(txt);
            }).length > 0
          ) {
            break;
          }
          parentBox = parentBox.parent();
        }

        const predictionText = parentBox
          .find('p, span, div')
          .filter((_: any, el: any) => {
            const txt = $(el).text().trim();
            return isRealPrediction(txt) && !txt.startsWith(sign);
          })
          .first()
          .text()
          .trim();

        if (predictionText && isRealPrediction(predictionText)) {
          scrapedList.push({
            sunsign: sign,
            prediction: predictionText,
          });
        }
      }
    });

    // 2. Legacy fallback selectors (h3 & .desc) if scrape array incomplete
    if (scrapedList.length < 12) {
      for (let i = 0; i < 12; i++) {
        const sign = $('h3').eq(i).text().trim();
        const rawDesc = $('.desc').find('p').eq(i).text().trim();
        const cleanDesc = rawDesc.includes(')') ? rawDesc.split(')')[1].trim() : rawDesc;

        if (
          sign &&
          cleanDesc &&
          isRealPrediction(cleanDesc) &&
          !scrapedList.some((item) => item.sunsign === sign)
        ) {
          scrapedList.push({
            sunsign: sign,
            prediction: cleanDesc,
          });
        }
      }
    }

    // 3. Map predictions into full RashifalItem list with robust fallback
    const fallbackList = getPeriodFallbackPredictions(type);
    const mergedRashifal: RashifalItem[] = fallbackList.map((item) => {
      const match = scrapedList.find(
        (p) => p.sunsign === item.sign || item.sign.includes(p.sunsign)
      );

      return {
        ...item,
        prediction: match && isRealPrediction(match.prediction) ? match.prediction : item.prediction,
      };
    });

    return NextResponse.json({
      success: true,
      type,
      source: 'Hamro Patro Live',
      timestamp: new Date().toISOString(),
      predictions: mergedRashifal,
    });
  } catch (err: any) {
    console.warn('Hamro Patro API fallback to local dataset:', err.message);

    return NextResponse.json({
      success: true,
      type,
      source: 'Sunstar Astrology Engine',
      predictions: getPeriodFallbackPredictions(type),
      error: err.message,
    });
  }
}

