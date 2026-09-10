import { sql } from '@/lib/db';
import SUNSTAR_DATA from '@/lib/data';
import fs from 'fs';
import path from 'path';

function getCacheFilePath() {
  return path.join(process.cwd(), 'breaking-news-cache.json');
}

// Memory cache
let inMemoryBreakingNews: string[] | null = null;

export async function getBreakingNews(): Promise<string[]> {
  // 1. Try DB first safely
  try {
    const rows = await sql`SELECT value_text FROM settings WHERE key_name = 'breaking_news' LIMIT 1`;
    if (rows && rows.length > 0 && rows[0].value_text) {
      const parsed = JSON.parse(rows[0].value_text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryBreakingNews = parsed;
        SUNSTAR_DATA.breakingNews = parsed;
        return parsed;
      }
    }
  } catch (dbErr) {
    // Database query failed or table missing - swallow error cleanly
  }

  // 2. Try persistent file cache safely
  if (!inMemoryBreakingNews) {
    try {
      const cacheFile = getCacheFilePath();
      if (fs.existsSync(cacheFile)) {
        const content = fs.readFileSync(cacheFile, 'utf-8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryBreakingNews = parsed;
          SUNSTAR_DATA.breakingNews = parsed;
          return parsed;
        }
      }
    } catch (fileErr) {}
  }

  // 3. Return memory cache or static data
  if (inMemoryBreakingNews && inMemoryBreakingNews.length > 0) {
    return inMemoryBreakingNews;
  }

  return SUNSTAR_DATA.breakingNews || [];
}

export async function saveBreakingNews(items: string[]): Promise<boolean> {
  if (!Array.isArray(items)) return false;

  // Update memory state
  inMemoryBreakingNews = items;
  SUNSTAR_DATA.breakingNews = items;

  // Save to DB safely
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key_name VARCHAR(100) PRIMARY KEY,
        value_text LONGTEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    const jsonString = JSON.stringify(items);
    await sql`
      INSERT INTO settings (key_name, value_text)
      VALUES ('breaking_news', ${jsonString})
      ON DUPLICATE KEY UPDATE value_text = ${jsonString}
    `;
  } catch (dbErr) {
    console.warn('DB Save Settings Warning:', (dbErr as any)?.message || dbErr);
  }

  // Save to local file cache as persistent fallback
  try {
    const cacheFile = getCacheFilePath();
    fs.writeFileSync(cacheFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (fileErr) {
    console.warn('File Save Settings Warning:', (fileErr as any)?.message || fileErr);
  }

  return true;
}
