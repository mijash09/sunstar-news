import SUNSTAR_DATA from '@/lib/data';

const LARAVEL_API_BASE = process.env.LARAVEL_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://api.sunstarnews.com/api';

// Memory cache
let inMemoryBreakingNews: string[] | null = null;

export async function getBreakingNews(): Promise<string[]> {
  if (inMemoryBreakingNews && inMemoryBreakingNews.length > 0) {
    return inMemoryBreakingNews;
  }
  return SUNSTAR_DATA.breakingNews || [];
}

export async function saveBreakingNews(items: string[]): Promise<boolean> {
  if (!Array.isArray(items)) return false;

  inMemoryBreakingNews = items;
  SUNSTAR_DATA.breakingNews = items;

  try {
    await fetch(`${LARAVEL_API_BASE}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save-breaking-news',
        breaking_news: items,
      }),
    });
  } catch (err) {
    // Silently ignore if backend offline
  }

  return true;
}

