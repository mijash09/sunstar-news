import NepaliDate from 'nepali-datetime';

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const NEPALI_MONTHS = [
  'वैशाख', 'जेठ', 'असार', 'साउन', 'भाद्र', 'असोज',
  'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];

export const NEPALI_DAYS = [
  'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'
];

/**
 * Converts any ASCII number or string to Nepali Unicode digits (०-९).
 */
export function toNepaliDigits(num: number | string): string {
  if (num === undefined || num === null) return '';
  return String(num).replace(/\d/g, (digit) => NEPALI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Convert any Date (or UTC date string / timestamp) to NPT-aware Nepali BS Date object and strings.
 */
export function getNepaliDate(dateInput: Date | string | number = new Date()) {
  try {
    let jsDate: Date;
    if (dateInput instanceof Date) {
      jsDate = dateInput;
    } else if (typeof dateInput === 'number') {
      jsDate = new Date(dateInput);
    } else {
      jsDate = new Date(String(dateInput));
    }

    const validDate = isNaN(jsDate.getTime()) ? new Date() : jsDate;

    // nepali-datetime constructor accepts JS Date object directly
    const npDate = new NepaliDate(validDate);
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
    console.error('Error converting to Nepali date:', err);
    return getTodayNepaliDateFallback();
  }
}

/**
 * Get current Nepali Date (BS) for today.
 */
export function getTodayNepaliDate() {
  return getNepaliDate(new Date());
}

/**
 * Convert AD date into a formatted Nepali BS date string (e.g. "२४ भाद्र २०८३" or "बुधबार, २४ भाद्र २०८३").
 */
export function toNepaliDateString(dateInput?: Date | string | number, showDayOfWeek = false): string {
  const np = getNepaliDate(dateInput);
  return showDayOfWeek ? np.formattedFullDate : np.formattedBsDate;
}

/**
 * Convert publication timestamp / AD date into Nepali relative time (e.g., "५ मिनेट अघि", "२ घण्टा अघि", "१ दिन अघि").
 */
export function toNepaliRelativeTime(publishedAt: Date | string | number): string {
  if (!publishedAt) return 'ताजा समाचार';
  try {
    const pub = publishedAt instanceof Date ? publishedAt : new Date(publishedAt);
    if (isNaN(pub.getTime())) return String(publishedAt);

    const now = new Date();
    const diffMs = now.getTime() - pub.getTime();
    if (diffMs < 0) return 'भर्खरै';

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return 'भर्खरै';
    if (diffMinutes < 60) return `${toNepaliDigits(diffMinutes)} मिनेट अघि`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${toNepaliDigits(diffHours)} घण्टा अघि`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${toNepaliDigits(diffDays)} दिन अघि`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${toNepaliDigits(diffMonths)} महिना अघि`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${toNepaliDigits(diffYears)} वर्ष अघि`;
  } catch {
    return String(publishedAt);
  }
}

function getTodayNepaliDateFallback() {
  return {
    year: 2083,
    monthIndex: 4,
    monthName: 'भाद्र',
    day: 24,
    weekDayName: 'बुधबार',
    formattedBsDate: '२४ भाद्र २०८३',
    formattedFullDate: 'बुधबार, २४ भाद्र २०८३',
    rashifalTitleDate: '२४ भाद्र २०८३ (आजको दैनिक राशिफल)',
  };
}
