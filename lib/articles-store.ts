import SUNSTAR_DATA, { Article } from '@/lib/data';
import { toNepaliRelativeTime } from '@/lib/nepaliDate';
import fs from 'fs';
import path from 'path';

const LARAVEL_API_BASE = process.env.LARAVEL_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://api.sunstarnews.com/api';

function getArticlesCacheFilePath() {
  return path.join(process.cwd(), 'articles-cache.json');
}

let inMemoryArticles: Article[] | null = null;

export async function getDbArticles(): Promise<Article[]> {
  // 1. Try fetching from Laravel Backend API
  try {
    const res = await fetch(`${LARAVEL_API_BASE}/articles?limit=100`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        const formatted: Article[] = json.data.map((art: any) => {
          const relativeTime = (art.updated_at || art.created_at)
            ? toNepaliRelativeTime(art.updated_at || art.created_at)
            : (art.time || 'भर्खरै');

          return {
            id: String(art.id),
            title: art.title || '',
            slug: art.slug,
            category: art.category || 'मुख्य समाचार',
            categories: Array.isArray(art.categories) ? art.categories : [art.category || 'मुख्य समाचार'],
            summary: art.summary || '',
            content: art.content || art.summary || art.title,
            image: art.image || '/assets/sunstar-logo.jpg',
            images: Array.isArray(art.images) && art.images.length > 0 ? art.images : [art.image || '/assets/sunstar-logo.jpg'],
            likesCount: typeof art.likes_count === 'number' ? art.likes_count : 12,
            sharesCount: typeof art.shares_count === 'number' ? art.shares_count : 0,
            commentsCount: typeof art.comments_count === 'number' ? art.comments_count : (Array.isArray(art.comments_list) ? art.comments_list.length : 0),
            commentsList: Array.isArray(art.comments_list) ? art.comments_list : [],
            author: art.author || 'सनस्टार संवाददाता',
            author_role: art.author_role,
            authorRole: art.author_role || art.authorRole,
            author_image: art.author_image,
            authorImage: art.author_image || art.authorImage,
            read_time: art.read_time,
            readTime: art.read_time || art.readTime,
            province: art.province || null,
            tags: art.tags || [],
            source: art.source || 'SunstarNews.com',
            time: relativeTime,
            updated_at: art.updated_at,
            created_at: art.created_at,
            views: art.views || '१.२ के',
          };
        });
        inMemoryArticles = formatted;
        return formatted;
      }
    }
  } catch (err: any) {
    // Backend offline or during build phase
  }

  // 2. Fallback to local memory or cache file
  if (inMemoryArticles && inMemoryArticles.length > 0) {
    return inMemoryArticles;
  }

  let localFileArticles: Article[] = [];
  try {
    const file = getArticlesCacheFilePath();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        localFileArticles = parsed;
      }
    }
  } catch (e) {}

  return localFileArticles;
}

export async function saveDbArticle(article: Article): Promise<boolean> {
  // Update in-memory
  if (!inMemoryArticles) inMemoryArticles = [];
  inMemoryArticles = inMemoryArticles.filter((a) => a.id !== article.id);
  inMemoryArticles.unshift(article);

  // 1. Post to Laravel Backend API
  try {
    await fetch(`${LARAVEL_API_BASE}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create-article',
        title: article.title,
        category: article.category,
        summary: article.summary,
        content: article.content,
        imageUrl: article.image,
        author: article.author,
      }),
    });
  } catch (e) {}

  // 2. Persist to local cache file
  try {
    const file = getArticlesCacheFilePath();
    let currentList: Article[] = [];
    if (fs.existsSync(file)) {
      try {
        currentList = JSON.parse(fs.readFileSync(file, 'utf-8')) || [];
      } catch (e) {}
    }
    const filteredList = currentList.filter((a) => a.id !== article.id);
    filteredList.unshift(article);
    fs.writeFileSync(file, JSON.stringify(filteredList, null, 2), 'utf-8');
  } catch (fileErr) {}

  return true;
}

export async function deleteDbArticle(articleId: string): Promise<boolean> {
  if (inMemoryArticles) {
    inMemoryArticles = inMemoryArticles.filter((a) => a.id !== articleId);
  }

  // 1. Delete on Laravel Backend
  try {
    await fetch(`${LARAVEL_API_BASE}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-article', id: articleId }),
    });
  } catch (e) {}

  // 2. Delete in local cache file
  try {
    const file = getArticlesCacheFilePath();
    if (fs.existsSync(file)) {
      const currentList: Article[] = JSON.parse(fs.readFileSync(file, 'utf-8')) || [];
      const filtered = currentList.filter((a) => a.id !== articleId);
      fs.writeFileSync(file, JSON.stringify(filtered, null, 2), 'utf-8');
    }
  } catch (e) {}

  return true;
}
