import { sql } from '@/lib/db';
import SUNSTAR_DATA, { Article, getAllArticles, getArticleById } from '@/lib/data';
import { supplementWithDummy } from '@/lib/landing-data';
import { getDbArticles } from '@/lib/articles-store';
import { toNepaliRelativeTime } from '@/lib/nepaliDate';

export function getDummyFallbackArticle(id: string): Article {
  const cleanId = id.replace(/-/g, ' ');
  const formattedTitle = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);

  return {
    id: id || 'news-fallback-demo',
    title: `सनस्टार विशेष समाचार: ${formattedTitle.length > 5 ? formattedTitle : 'नेपालको चौतर्फी विकास र सूचना प्रविधिको नयाँ युग'}`,
    category: 'मुख्य समाचार',
    categories: ['मुख्य समाचार', 'विशेष', 'राजनीति'],
    time: '१० मिनेट अगाडि',
    date: '२०८१ भदौ २१ गते, शनिबार',
    views: '४,५२० पटक पढिएको',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    caption: 'नेपालमा प्रविधि तथा डिजिटल सञ्चारको द्रुत विकास र सम्भावनाहरू।',
    summary: 'सूचना प्रविधिको द्रुत विकाससँगै नेपालमा डिजिटल मिडिया र अनलाइन सञ्चार माध्यमको पहुँच अभूतपूर्व रूपमा विस्तार भइरहेको छ।',
    content: `काठमाडौँ — नेपालमा डिजिटल प्रविधि र सञ्चार माध्यमको विकासले नयाँ उचाइ हासिल गरिरहेको छ। मुलुकभर इन्टरनेटको पहुँच तीव्र रूपमा विस्तार भएसँगै नागरिकहरूलाई सर्वसुलभ, सत्य र निष्पक्ष समाचार पहुँच पुर्‍याउन अनलाइन मिडियाको भूमिका महत्त्वपूर्ण बन्दै गएको छ।\n\nविशेषज्ञहरूका अनुसार आगामी दिनहरूमा नेपालमा सूचना प्रविधिका पूर्वाधारहरू थप सुदृढ भई प्रत्येक स्थानीय तहसम्म डिजिटल सेवा पुग्ने अपेक्षा गरिएको छ। सनस्टार न्युजले पाठकहरूलाई सधैं गुणस्तरीय र आधिकारिक सूचना प्रदान गर्न प्रतिबद्धता व्यक्त गर्दछ।`,
    author: 'सनस्टार सम्पादकीय टोली',
    authorRole: 'वरिष्ठ समाचार सम्पादक',
    authorImage: '👨‍💼',
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/**
 * Fetch a single article by ID with complete SSR support.
 * Tries the single GET API (/api/articles/{id}) first, then DB/file store, static dataset, and fallback.
 */
export async function getArticleByIdAsync(id: string): Promise<Article> {
  if (!id) return getDummyFallbackArticle('unknown');

  const cleanId = id.trim();

  // 1. Single GET API call (/api/articles/{id})
  try {
    const res = await fetch(`${API_URL}/articles/${encodeURIComponent(cleanId)}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        const d = json.data;
        return {
          id: d.id,
          title: d.title,
          slug: d.slug,
          category: d.category || 'मुख्य समाचार',
          categories: d.categories || [d.category || 'मुख्य समाचार'],
          summary: d.summary || d.title,
          content: d.content || d.summary || d.title,
          image: d.image || '/assets/sunstar-logo.jpg',
          images: Array.isArray(d.images) && d.images.length > 0 ? d.images : [d.image || '/assets/sunstar-logo.jpg'],
          author: d.author || 'सनस्टार संवाददाता',
          author_role: d.author_role,
          authorRole: d.author_role || d.authorRole || 'वरिष्ठ संवाददाता',
          author_image: d.author_image,
          authorImage: d.author_image || d.authorImage || d.image,
          read_time: d.read_time,
          readTime: d.read_time || d.readTime,
          source: d.source || 'SunstarNews.com',
          time: (d.updated_at || d.created_at) ? toNepaliRelativeTime(d.updated_at || d.created_at) : (d.time || 'भर्खरै'),
          updated_at: d.updated_at,
          created_at: d.created_at,
          views: d.views || '१.२ के',
          viewsCount: d.viewsCount ?? d.views_count ?? 0,
          likesCount: d.likesCount ?? d.likes_count ?? 12,
          sharesCount: d.sharesCount ?? d.shares_count ?? 0,
          commentsCount: d.commentsCount ?? d.comments_count ?? (Array.isArray(d.commentsList || d.comments_list) ? (d.commentsList || d.comments_list).length : 0),
          commentsList: d.commentsList ?? d.comments_list ?? [],
          isPublished: d.is_published ?? true,
          isFeatured: d.is_featured ?? false,
          isExclusive: d.is_exclusive ?? false,
          province: d.province ?? null,
          tags: d.tags ?? [],
        };
      }
    }
  } catch (err) {
    console.warn(`Single GET API fetch error for article ${id}:`, (err as any)?.message || err);
  }

  // 2. Try DB & persistent file store fetch
  try {
    const allDbArticles = await getDbArticles();
    const found = allDbArticles.find(
      (art) =>
        art.id.toLowerCase() === cleanId.toLowerCase() ||
        (art as any).uuid?.toLowerCase() === cleanId.toLowerCase() ||
        art.title.toLowerCase().includes(cleanId.toLowerCase())
    );
    if (found) {
      return found;
    }
  } catch (err) {
    // fallback
  }

  // 3. Try static data lookup
  const staticFound = getArticleById(id);
  if (staticFound) {
    return staticFound;
  }

  // 4. Fallback dummy article
  return getDummyFallbackArticle(id);
}

/**
 * Fetch articles for a specific category with complete SSR support.
 */
export async function getCategoryArticlesAsync(slug: string): Promise<{
  articles: Article[];
  lead: Article;
  rest: Article[];
  allCategoryArticles: Article[];
}> {
  let formattedDbArticles: Article[] = [];
  try {
    formattedDbArticles = await getDbArticles();
  } catch (e) {}

  const filterDbByCategory = (keywords: string[]): Article[] => {
    return formattedDbArticles.filter((art) => {
      const cat = (art.category || '').toLowerCase();
      return keywords.some((kw) => cat.includes(kw.toLowerCase()));
    });
  };

  let articles: Article[] = [];
  if (slug === 'politics') articles = supplementWithDummy(filterDbByCategory(['politics', 'राजनीति']), SUNSTAR_DATA.politicsNews, 6);
  else if (slug === 'business') articles = supplementWithDummy(filterDbByCategory(['business', 'अर्थ', 'वाणिज्य']), SUNSTAR_DATA.businessNews, 6);
  else if (slug === 'sports') articles = supplementWithDummy(filterDbByCategory(['sports', 'खेलकुद']), SUNSTAR_DATA.sportsNews, 6);
  else if (slug === 'entertainment') articles = supplementWithDummy(filterDbByCategory(['entertainment', 'मनोरञ्जन']), SUNSTAR_DATA.entertainmentNews, 6);
  else if (slug === 'world') articles = supplementWithDummy(filterDbByCategory(['world', 'विश्व']), SUNSTAR_DATA.worldNews, 6);
  else if (slug === 'exclusive') articles = supplementWithDummy(filterDbByCategory(['exclusive', 'विशेष']), SUNSTAR_DATA.exclusiveNews, 6);
  else if (slug === 'interview') articles = supplementWithDummy(filterDbByCategory(['interview', 'अन्तर्वार्ता']), SUNSTAR_DATA.interviewNews || [], 6);
  else if (slug === 'feature') articles = supplementWithDummy(filterDbByCategory(['feature', 'फिचर']), SUNSTAR_DATA.featureNews, 6);
  else if (slug === 'technology') articles = supplementWithDummy(filterDbByCategory(['technology', 'tech', 'प्रविधि']), SUNSTAR_DATA.technologyNews, 6);
  else if (slug === 'opinion') {
    const dbOp = filterDbByCategory(['opinion', 'विचार', 'विश्लेषण']);
    const formattedOp: Article[] = dbOp.map((art) => ({
      id: art.id,
      title: art.title,
      category: 'विचार / विश्लेषण',
      author: art.author,
      time: art.time,
      summary: art.summary,
      image: art.image,
    }));
    const staticOp: Article[] = SUNSTAR_DATA.opinions.map((op) => ({
      id: op.id,
      title: op.title,
      category: 'विचार / विश्लेषण',
      author: op.author,
      time: op.time,
      summary: op.summary,
      image: op.avatar,
    }));
    articles = supplementWithDummy(formattedOp, staticOp, 6);
  } else if (SUNSTAR_DATA.pradeshNews[slug]) {
    const pradeshStatic: Article[] = (SUNSTAR_DATA.pradeshNews[slug] || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      category: `प्रदेश (${item.location || 'नेपाल'})`,
      time: item.time,
      source: item.source || 'सनस्टार न्युज',
      image: item.image || '/assets/sunstar-logo.jpg',
      summary: item.summary || item.title,
    }));
    articles = supplementWithDummy(filterDbByCategory([slug]), pradeshStatic, 6);
  } else {
    const allStatic = getAllArticles();
    const dbFiltered = filterDbByCategory([slug]);
    const staticFiltered = allStatic.filter(
      (a) => a.category.toLowerCase().includes(slug.toLowerCase()) || (a.categorySlug && a.categorySlug === slug)
    );
    articles = supplementWithDummy(dbFiltered, staticFiltered.length > 0 ? staticFiltered : allStatic.slice(0, 6), 6);
  }

  const allCategoryArticles = [...articles, ...getAllArticles().filter((a) => a.categorySlug !== slug)];
  const lead = articles[0] || getDummyFallbackArticle(slug);
  const rest = articles.slice(1);

  return {
    articles,
    lead,
    rest,
    allCategoryArticles,
  };
}
