const API_URL = "http://127.0.0.1:8000/api";
import SUNSTAR_DATA, { Article, Opinion, StoryItem, BannerAd, getAllArticles } from '@/lib/data';
import { getBreakingNews } from '@/lib/settings-store';
import { getDbArticles } from '@/lib/articles-store';

/**
 * Helper to supplement real API/DB data with static dummy data if the data length is insufficient.
 */
export function supplementWithDummy<T>(
  realData: T[] | undefined,
  dummyData: T[],
  requiredCount: number,
  getId: (item: T) => string = (item: any) => item.id || String(item)
): T[] {
  const list = realData ? [...realData] : [];
  if (list.length >= requiredCount) {
    return list.slice(0, requiredCount);
  }

  const existingIds = new Set(list.map(getId));
  for (const item of dummyData) {
    if (list.length >= requiredCount) break;
    const id = getId(item);
    if (!existingIds.has(id)) {
      list.push(item);
      existingIds.add(id);
    }
  }

  return list;
}

export async function getDbBanners(): Promise<BannerAd[]> {
  try {
    const res = await fetch(`${API_URL}/banners`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        return json.data.map((b: any) => ({
          id: String(b.id),
          title: b.title || 'ब्यानर विज्ञापन',
          imageUrl: b.image_url || '',
          targetUrl: b.target_url || '#',
          position: b.position || 'header-top',
          isActive: b.is_active === true || b.is_active === 1 || b.is_active === '1',
          clicksCount: b.clicks_count || 0,
        }));
      }
    }
  } catch (err) {
    console.warn('Failed to fetch real banners from API:', err);
  }
  return [];
}

export async function getLandingData() {
  try {
    let formattedDbArticles: Article[] = [];
    let dbBanners: BannerAd[] = [];

    // Fetch articles safely with fallback
    try {
      formattedDbArticles = await getDbArticles();
    } catch (err) {
      formattedDbArticles = [];
    }

    // Fetch real banners safely without dummy data
    try {
      dbBanners = await getDbBanners();
    } catch (err) {
      dbBanners = [];
    }

    // Map DB articles into categories
    const filterDbByCategory = (categoryKeywords: string[]): Article[] => {
      return formattedDbArticles.filter((art) => {
        const cat = (art.category || '').toLowerCase();
        return categoryKeywords.some((kw) => cat.includes(kw.toLowerCase()));
      });
    };

    // 1. Hero Featured Lead & Secondary Leads
    const featuredLead: Article =
      formattedDbArticles[0] || SUNSTAR_DATA.featuredLead;

    const realSecondary = formattedDbArticles.slice(1, 5);
    const topSecondaryLeads: Article[] = supplementWithDummy(
      realSecondary,
      SUNSTAR_DATA.topSecondaryLeads,
      4
    );

    // 2. Exclusive (विशेष)
    const dbExclusive = filterDbByCategory(['exclusive', 'विशेष']);
    const exclusiveNews: Article[] = supplementWithDummy(
      dbExclusive,
      SUNSTAR_DATA.exclusiveNews,
      5
    );

    // 3. Politics (राजनीति)
    const dbPolitics = filterDbByCategory(['politics', 'राजनीति']);
    const politicsNews: Article[] = supplementWithDummy(
      dbPolitics,
      SUNSTAR_DATA.politicsNews,
      4
    );

    // 4. Business & Economy (अर्थ / वाणिज्य)
    const dbBusiness = filterDbByCategory(['business', 'अर्थ', 'वाणिज्य']);
    const businessNews: Article[] = supplementWithDummy(
      dbBusiness,
      SUNSTAR_DATA.businessNews,
      5
    );

    // 5. Opinions (विचार / विश्लेषण)
    const dbOpinions = filterDbByCategory(['opinion', 'विचार', 'विश्लेषण']);
    const formattedOpinions: Opinion[] = dbOpinions.map((art) => ({
      id: art.id,
      title: art.title,
      author: art.author || 'सनस्टार स्तम्भकार',
      role: art.author_role || art.authorRole || 'विशेष स्तम्भकार (सनस्टार विचार)',
      avatar: art.author_image || art.authorImage || art.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      time: art.read_time || art.readTime || art.time || '६ मिनेट पाठ',
      source: art.source || 'Sunstar Opinion',
      summary: art.summary || art.title,
    }));
    const opinions: Opinion[] = supplementWithDummy(
      formattedOpinions,
      SUNSTAR_DATA.opinions,
      4
    );

    // 6. Visual Web Stories
    const stories: StoryItem[] = SUNSTAR_DATA.stories;

    // 7. Sports (खेलकुद)
    const dbSports = filterDbByCategory(['sports', 'खेलकुद']);
    const sportsNews: Article[] = supplementWithDummy(
      dbSports,
      SUNSTAR_DATA.sportsNews,
      5
    );

    // 8. Entertainment (मनोरञ्जन)
    const dbEntertainment = filterDbByCategory(['entertainment', 'मनोरञ्जन']);
    const entertainmentNews: Article[] = supplementWithDummy(
      dbEntertainment,
      SUNSTAR_DATA.entertainmentNews,
      5
    );

    // 9. Feature (फिचर)
    const dbFeature = filterDbByCategory(['feature', 'फिचर']);
    const featureNews: Article[] = supplementWithDummy(
      dbFeature,
      SUNSTAR_DATA.featureNews,
      5
    );

    // 10. Tech (प्रविधि)
    const dbTech = filterDbByCategory(['technology', 'tech', 'प्रविधि']);
    const technologyNews: Article[] = supplementWithDummy(
      dbTech,
      SUNSTAR_DATA.technologyNews,
      5
    );

    // 11. World (विश्व)
    const dbWorld = filterDbByCategory(['world', 'विश्व']);
    const worldNews: Article[] = supplementWithDummy(
      dbWorld,
      SUNSTAR_DATA.worldNews,
      5
    );

    // 12. Timeline Feed (Extract latest 5 news - strictly articles)
    const timelineFeed = supplementWithDummy(
      formattedDbArticles,
      getAllArticles(),
      5
    );

    // 13. Banners - strictly real database banners, NEVER dummy data!
    const banners: BannerAd[] = dbBanners;

    const breakingNews = await getBreakingNews();

    return {
      sourceInfo: SUNSTAR_DATA.sourceInfo,
      trendingStocks: SUNSTAR_DATA.trendingStocks,
      breakingNews,
      nepseTicker: SUNSTAR_DATA.nepseTicker,
      weather: SUNSTAR_DATA.weather,
      featuredLead,
      topSecondaryLeads,
      exclusiveNews,
      politicsNews,
      businessNews,
      opinions,
      stories,
      sportsNews,
      entertainmentNews,
      featureNews,
      technologyNews,
      worldNews,
      pradeshNews: SUNSTAR_DATA.pradeshNews,
      timelineFeed,
      latestTimeline: timelineFeed,
      tajaSamachar: timelineFeed,
      banners,
    };
  } catch (error) {
    console.error('Error in getLandingData:', error);
    return SUNSTAR_DATA;
  }
}
