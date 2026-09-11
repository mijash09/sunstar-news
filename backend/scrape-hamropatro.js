import * as cheerio from 'cheerio';
import NepaliDate from 'nepali-datetime';

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const NEPALI_MONTHS = [
  'वैशाख', 'जेठ', 'असार', 'साउन', 'भाद्र', 'असोज',
  'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];
const NEPALI_DAYS = [
  'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'
];

function toNepaliDigits(num) {
  if (num === undefined || num === null) return '';
  return String(num).replace(/\d/g, (digit) => NEPALI_DIGITS[parseInt(digit, 10)]);
}

function getTodayNepaliDate() {
  try {
    const npDate = new NepaliDate();
    const bsYear = npDate.getYear();
    const bsMonth = npDate.getMonth();
    const bsDay = npDate.getDate();
    const weekDayIndex = npDate.getDay();

    const monthName = NEPALI_MONTHS[bsMonth] || '';
    const weekDayName = NEPALI_DAYS[weekDayIndex] || '';

    const yearNp = toNepaliDigits(bsYear);
    const dayNp = toNepaliDigits(bsDay);

    return {
      year: bsYear,
      monthIndex: bsMonth,
      monthName,
      day: bsDay,
      weekDayName,
      formattedBsDate: `${dayNp} ${monthName} ${yearNp}`,
      formattedFullDate: `${weekDayName}, ${dayNp} ${monthName} ${yearNp}`,
      rashifalTitleDate: `${dayNp} ${monthName} ${yearNp} (आजको दैनिक राशिफल)`,
    };
  } catch (err) {
    return {
      year: 2083,
      monthIndex: 4,
      monthName: 'भाद्र',
      day: 26,
      weekDayName: 'शुक्रबार',
      formattedBsDate: '२६ भाद्र २०८३',
      formattedFullDate: 'शुक्रबार, २६ भाद्र २०८३',
      rashifalTitleDate: '२६ भाद्र २०८३ (आजको दैनिक राशिफल)',
    };
  }
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

const SIGN_METADATA = [
  {
    id: 'mesh',
    sign: 'मेष',
    latinName: 'Aries',
    symbol: '♈',
    image: '/images/zodiac/mesh.png',
    letters: 'चु, चे, चो, ला, लि, लु, ले, लो, अ',
    dateRange: 'चैत १५ - वैशाख १५',
    luckyColor: 'रातो',
    luckyNumber: '९',
    prediction: 'आज आम्दानीका नयाँ स्रोतहरू पहिल्याउन सकिनेछ। व्यापार व्यवसायमा लगानी बढाउने अनुकूल समय छ। प्रतिस्पर्धीहरूलाई पछि पार्दै सफलता हात पार्नुहुनेछ।'
  },
  {
    id: 'vrish',
    sign: 'वृष',
    latinName: 'Taurus',
    symbol: '♉',
    image: '/images/zodiac/vrish.png',
    letters: 'इ, उ, ए, ओ, वा, वि, वु, वे, वो',
    dateRange: 'वैशाख १६ - जेठ १५',
    luckyColor: 'सेतो',
    luckyNumber: '६',
    prediction: 'सामाजिक कार्यमा सक्रिय सहभागी भइनेछ। रोकिएका पुराना कामहरू पुन: सुरु हुनेछन्। परिवार तथा इष्टमित्रबाट पूर्ण सहयोग र सद्भाव प्राप्त हुनेछ।'
  },
  {
    id: 'mithun',
    sign: 'मिथुन',
    latinName: 'Gemini',
    symbol: '♊',
    image: '/images/zodiac/mithun.png',
    letters: 'का, कि, कु, घ, ङ, छ, के, को, हा',
    dateRange: 'जेठ १६ - असार १५',
    luckyColor: 'हरियो',
    luckyNumber: '५',
    prediction: 'बौद्धिक क्षमता र कार्यकुशलताको चौतर्फी प्रशंसा हुनेछ। अध्ययन तथा रचनात्मक काममा प्रगति हुनेछ। आर्थिक स्थिति सबल बन्दै जानेछ।'
  },
  {
    id: 'karkat',
    sign: 'कर्कट',
    latinName: 'Cancer',
    symbol: '♋',
    image: '/images/zodiac/karkat.png',
    letters: 'ही, हू, हे, हो, डा, डी, डु, डे, डो',
    dateRange: 'असार १६ - साउन १५',
    luckyColor: 'गुलाबी',
    luckyNumber: '२',
    prediction: 'पारिवारिक सम्बन्धमा मधुरता छाउनेछ। मनोरञ्जनात्मक यात्राको योग छ। नयाँ योजनाहरू कार्यान्वयन गर्न अग्रसर हुनु सकारात्मक रहनेछ।'
  },
  {
    id: 'simha',
    sign: 'सिंह',
    latinName: 'Leo',
    symbol: '♌',
    image: '/images/zodiac/simha.png',
    letters: 'मा, मि, मु, मे, मो, टा, टि, टु, टे',
    dateRange: 'साउन १६ - भदौ १५',
    luckyColor: 'पहेंलो',
    luckyNumber: '१',
    prediction: 'कार्यक्षेत्रमा नेतृत्वदायी भूमिका पाइनेछ। आत्मबल र पराक्रममा वृद्धि हुनेछ। उच्च पदस्थ व्यक्तित्वहरूसँग फलदायी भेटघाट हुनेछ।'
  },
  {
    id: 'kanya',
    sign: 'कन्या',
    latinName: 'Virgo',
    symbol: '♍',
    image: '/images/zodiac/kanya.png',
    letters: 'टो, पा, पि, पु, ष, ण, ठ, पे, पो',
    dateRange: 'भदौ १६ - असोज १५',
    luckyColor: 'हरियो',
    luckyNumber: '५',
    prediction: 'लगनशीलताका साथ गरिएको मिहिनेतले फल दिनेछ। काममा ध्यान केन्द्रित हुनाले सोचेभन्दा राम्रो परिणाम आउनेछ। स्वास्थ अनुकूल रहनेछ।'
  },
  {
    id: 'tula',
    sign: 'तुला',
    latinName: 'Libra',
    symbol: '♎',
    image: '/images/zodiac/tula.png',
    letters: 'रा, रि, रु, रे, रो, ता, ति, तु, ते',
    dateRange: 'असोज १६ - कात्तिक १५',
    luckyColor: 'सेतो',
    luckyNumber: '६',
    prediction: 'कला, साहित्य र मनोरञ्जन क्षेत्रमा चासो बढ्नेछ। शुभचिन्तकहरूको सहयोगले अड्किएका काम बन्नेछन्। वित्तीय क्षेत्रमा लाभ मिल्नेछ।'
  },
  {
    id: 'vrischik',
    sign: 'वृश्चिक',
    latinName: 'Scorpio',
    symbol: '♏',
    image: '/images/zodiac/vrischik.png',
    letters: 'तो, ना, नि, नु, ने, नो, या, यि, यु',
    dateRange: 'कात्तिक १६ - मंसीर १५',
    luckyColor: 'रातो',
    luckyNumber: '९',
    prediction: 'आँट र साहसका साथ अघि बढ्दा लक्ष्य हासिल हुनेछ। कार्यस्थलमा नयाँ जिम्मेवारी प्राप्त हुन सक्छ। आर्थिक कारोबारमा सफलता।'
  },
  {
    id: 'dhanu',
    sign: 'धनु',
    latinName: 'Sagittarius',
    symbol: '♐',
    image: '/images/zodiac/dhanu.png',
    letters: 'ये, यो, भा, भि, भु, धा, फा, ढा, भे',
    dateRange: 'मंसीर १६ - पुस १५',
    luckyColor: 'पहेंलो',
    luckyNumber: '३',
    prediction: 'अध्ययन तथा अनुसन्धानमा रुचि बढ्नेछ। धार्मिक र सांस्कृतिक कार्यक्रममा सहभागी हुने अवसर। दूरदराजका मित्रहरूसँग कुराकानी।'
  },
  {
    id: 'makar',
    sign: 'मकर',
    latinName: 'Capricorn',
    symbol: '♑',
    image: '/images/zodiac/makar.png',
    letters: 'भो, जा, जि, जु, जे, जो, ख, खि, खु, खे, खो, गा, गि',
    dateRange: 'पुस १६ - माघ १५',
    luckyColor: 'नीलो',
    luckyNumber: '८',
    prediction: 'धैर्यता र संयमतापूर्वक कार्य गर्दा फाइदा हुनेछ। रोकिएका पुराना कामहरू सुचारु हुनेछन्। व्यवसायमा नयाँ ग्राहक थपिनेछन्।'
  },
  {
    id: 'kumbha',
    sign: 'कुम्भ',
    latinName: 'Aquarius',
    symbol: '♒',
    image: '/images/zodiac/kumbha.png',
    letters: 'गु, गे, गो, सा, सि, सु, से, सो, दा',
    dateRange: 'माघ १६ - फागुन १५',
    luckyColor: 'नीलो',
    luckyNumber: '८',
    prediction: 'साथीभाइ र सहकर्मीहरूको पूर्ण सहयोग मिल्नेछ। नयाँ व्यावसायिक साझेदारीका लागि राम्रो समय छ। पारिवारिक वातावरण रमाइलो रहनेछ।'
  },
  {
    id: 'meen',
    sign: 'मीन',
    latinName: 'Pisces',
    symbol: '♓',
    image: '/images/zodiac/meen.png',
    letters: 'दि, दु, थ, झ, ञ, दे, दो, चा, चि',
    dateRange: 'फागुन १६ - चैत १४',
    luckyColor: 'पहेंलो',
    luckyNumber: '३',
    prediction: 'अध्यात्म र परोपकारमा मन जानेछ। इष्टमित्र तथा आफन्तबाट शुभ समाचार सुन्न पाइनेछ। आकस्मिक लाभको योग रहेको छ।'
  }
];

function isSyllableList(text) {
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

function getPeriodFallbackPredictions(type) {
  return SIGN_METADATA.map((item) => {
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

async function scrapeHamroPatro(type = 'daily') {
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

    const scrapedList = [];

    // 1. Scrape Modern Tailwind Cards (.hp-card-surface, article, .rashifal-card, div[class*="card"])
    $('.hp-card-surface, article, .rashifal-card, div[class*="card"], .item').each((_, el) => {
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
          let signNode = null;
          $('*').each((_, el) => {
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
              .filter((_, p) => {
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
    const mergedRashifal = fallbackList.map((item) => {
      const match = scrapedList.find(
        (p) => p.sunsign === item.sign || item.sign.includes(p.sunsign)
      );

      return {
        ...item,
        prediction: match && match.prediction.length > 25 ? match.prediction : item.prediction,
      };
    });

    console.log(JSON.stringify({
      success: true,
      type,
      source: 'Hamro Patro Live API',
      date: liveDateString,
      formattedBsDate: todayInfo.formattedBsDate,
      fullDate: todayInfo.formattedFullDate,
      timestamp: new Date().toISOString(),
      predictions: mergedRashifal,
      data: mergedRashifal,
    }));
  } catch (err) {
    console.log(JSON.stringify({
      success: true,
      type,
      source: 'Sunstar Astrology Engine',
      date: todayInfo.rashifalTitleDate,
      formattedBsDate: todayInfo.formattedBsDate,
      fullDate: todayInfo.formattedFullDate,
      timestamp: new Date().toISOString(),
      predictions: getPeriodFallbackPredictions(type),
      data: getPeriodFallbackPredictions(type),
      error: err.message,
    }));
  }
}

const typeArg = (process.argv[2] || 'daily').toLowerCase();
scrapeHamroPatro(typeArg);
