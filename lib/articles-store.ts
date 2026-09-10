import { sql } from '@/lib/db';
import SUNSTAR_DATA, { Article } from '@/lib/data';
import fs from 'fs';
import path from 'path';

function getArticlesCacheFilePath() {
  return path.join(process.cwd(), 'articles-cache.json');
}

let inMemoryArticles: Article[] | null = null;

export async function getDbArticles(): Promise<Article[]> {
  let dbRows: any[] = [];
  try {
    dbRows = await sql`
      SELECT id, title, category, summary, content, image, images, interactions_json, comments_json, likes_count, author, source, published, created_at
      FROM db_articles
      ORDER BY created_at DESC
    `;
  } catch (err) {
    try {
      dbRows = await sql`
        SELECT id, title, category, summary, content, image, images, author, source, published, created_at
        FROM db_articles
        ORDER BY created_at DESC
      `;
    } catch (e2) {
      dbRows = [];
    }
  }

  const formattedDb: Article[] = (dbRows || []).map((row: any) => {
    let imagesArr: string[] = [];
    if (Array.isArray(row.images)) {
      imagesArr = row.images;
    } else if (typeof row.images === 'string' && row.images.trim().startsWith('[')) {
      try {
        imagesArr = JSON.parse(row.images);
      } catch (e) {
        imagesArr = [row.image || '/assets/sunstar-logo.jpg'];
      }
    } else {
      imagesArr = [row.image || '/assets/sunstar-logo.jpg'];
    }

    let interactions: any = {};
    if (typeof row.interactions_json === 'string' && row.interactions_json.trim().startsWith('{')) {
      try {
        interactions = JSON.parse(row.interactions_json);
      } catch (e) {}
    }

    let commentsList: any[] = [];
    if (Array.isArray(interactions.comments)) {
      commentsList = interactions.comments;
    } else if (Array.isArray(row.comments_json)) {
      commentsList = row.comments_json;
    } else if (typeof row.comments_json === 'string' && row.comments_json.trim().startsWith('[')) {
      try {
        commentsList = JSON.parse(row.comments_json);
      } catch (e) {}
    }

    const likesCount = typeof interactions.likes === 'number'
      ? interactions.likes
      : (typeof row.likes_count === 'number' && !isNaN(row.likes_count) ? Number(row.likes_count) : 12);

    return {
      id: String(row.id),
      title: row.title || '',
      category: row.category || 'मुख्य समाचार',
      categories: [row.category || 'मुख्य समाचार', 'ताजा खबर'],
      summary: row.summary || '',
      content: row.content || '',
      image: row.image || (imagesArr[0] || '/assets/sunstar-logo.jpg'),
      images: imagesArr,
      likesCount,
      commentsCount: commentsList.length,
      commentsList,
      author: row.author || 'सनस्टार संवाददाता',
      source: row.source || 'सनस्टार न्युज',
      time: 'भर्खरै',
      views: interactions.views || '१.२ के',
    };
  });

  // Read local file fallback articles
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

  // Merge DB articles and local file cached articles without duplicates (preserving newest order at top)
  const existingIds = new Set(formattedDb.map((a) => a.id));
  const newFromLocal: Article[] = [];
  for (const localArt of localFileArticles) {
    if (!existingIds.has(localArt.id)) {
      newFromLocal.push(localArt);
      existingIds.add(localArt.id);
    }
  }

  const combined = [...newFromLocal, ...formattedDb];
  inMemoryArticles = combined;
  return combined;
}

export async function saveDbArticle(article: Article): Promise<boolean> {
  if (!inMemoryArticles) {
    inMemoryArticles = [];
  }
  const filtered = inMemoryArticles.filter((a) => a.id !== article.id);
  filtered.unshift(article);
  inMemoryArticles = filtered;

  const imagesJson = JSON.stringify(article.images && article.images.length > 0 ? article.images.slice(0, 10) : [article.image || '/assets/sunstar-logo.jpg']);
  const commentsList = article.commentsList || [];
  const likesCount = typeof article.likesCount === 'number' ? article.likesCount : 12;
  const commentsJson = JSON.stringify(commentsList);
  
  const interactionsObj = {
    likes: likesCount,
    comments: commentsList,
    views: article.views || '१.२ के',
  };
  const interactionsJson = JSON.stringify(interactionsObj);

  // 1. Save to DB safely
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS db_articles (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        summary TEXT,
        content LONGTEXT,
        image VARCHAR(500),
        images TEXT,
        interactions_json LONGTEXT,
        comments_json LONGTEXT,
        likes_count INT DEFAULT 0,
        author VARCHAR(100),
        source VARCHAR(100),
        published BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    try { await sql`ALTER TABLE db_articles ADD COLUMN images TEXT`; } catch (e) {}
    try { await sql`ALTER TABLE db_articles ADD COLUMN interactions_json LONGTEXT`; } catch (e) {}
    try { await sql`ALTER TABLE db_articles ADD COLUMN comments_json LONGTEXT`; } catch (e) {}
    try { await sql`ALTER TABLE db_articles ADD COLUMN likes_count INT DEFAULT 0`; } catch (e) {}

    await sql`
      INSERT INTO db_articles (id, title, category, summary, content, image, images, interactions_json, comments_json, likes_count, author, source, published)
      VALUES (${article.id}, ${article.title}, ${article.category}, ${article.summary || ''}, ${article.content || ''}, ${article.image || ''}, ${imagesJson}, ${interactionsJson}, ${commentsJson}, ${likesCount}, ${article.author || 'सनस्टार संवाददाता'}, ${article.source || 'SunstarNews.com'}, TRUE)
      ON DUPLICATE KEY UPDATE title=${article.title}, category=${article.category}, summary=${article.summary}, content=${article.content}, image=${article.image}, images=${imagesJson}, interactions_json=${interactionsJson}, comments_json=${commentsJson}, likes_count=${likesCount}
    `;
  } catch (dbErr) {
    console.warn('DB Save Article Warning:', (dbErr as any)?.message || dbErr);
  }

  // 2. Save to persistent file fallback
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
  } catch (fileErr) {
    console.warn('File Save Article Warning:', (fileErr as any)?.message || fileErr);
  }

  return true;
}

export async function deleteDbArticle(articleId: string): Promise<boolean> {
  if (inMemoryArticles) {
    inMemoryArticles = inMemoryArticles.filter((a) => a.id !== articleId);
  }

  // 1. Delete from DB
  try {
    await sql`DELETE FROM db_articles WHERE id = ${articleId}`;
  } catch (e) {}

  // 2. Delete from local file
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
