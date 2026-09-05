# 🗄️ SUNSTAR NEWS - Unified Database Architecture & Integration Plan

This document details the normalized relational database design, unified schema architecture, SQL DDL specifications, TypeScript data mappers, and Neon Serverless PostgreSQL migration strategy for **Sunstar News (सनस्टार न्युज)**.

---

## 📐 1. Architecture Overview

```
 ┌───────────────────────────────────────────────────────────┐
 │                   Next.js 14 App Router                   │
 │           (Server Components & Server Actions)            │
 └─────────────────────────────┬─────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌────────────────────┐          ┌────────────────────┐
    │  Neon Serverless   │          │  Fallback Memory   │
    │   PostgreSQL DB    │          │  Layer (data.ts)   │
    └────────────────────┘          └────────────────────┘
```

### Key Architectural Decision: Unified News Engine
Rather than splitting news into fragmented tables (`db_articles`, `db_pradesh_news`), **all news items live inside a single high-performance `articles` table**. Category filtering, Province/State filtering, and District/County filtering are handled via foreign keys (`category_id`, `province_id`, `district_id`) and relational indexes.

---

## 📊 2. Relational Database Schema (PostgreSQL DDL)

### 2.1 Users & Authors (`users`)
Stores platform administrators, editors, and journalists.

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar TEXT,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('ADMIN', 'EDITOR', 'REPORTER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.2 Categories Table (`categories`)
Defines news categories (e.g. Exclusive, Politics, Business, Sports, Entertainment, Feature, Technology, World).

```sql
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name_ne VARCHAR(100) NOT NULL,    -- e.g. राजनीति
    name_en VARCHAR(100) NOT NULL,    -- e.g. Politics
    slug VARCHAR(100) UNIQUE NOT NULL,-- e.g. politics
    icon VARCHAR(20),                -- e.g. 🗳️
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.3 Provinces / States Table (`provinces`)
Defines Nepal's 7 Federal Provinces for regional news filtering.

```sql
CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    name_ne VARCHAR(100) NOT NULL,    -- e.g. गण्डकी
    name_en VARCHAR(100) NOT NULL,    -- e.g. Gandaki
    slug VARCHAR(50) UNIQUE NOT NULL, -- e.g. gandaki
    capital VARCHAR(100),            -- e.g. पोखरा
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.4 Districts / Counties Table (`districts`)
Stores local administrative districts/counties linked to provinces for granular local news filtering.

```sql
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    province_id INT REFERENCES provinces(id) ON DELETE CASCADE,
    name_ne VARCHAR(100) NOT NULL,    -- e.g. कास्की
    name_en VARCHAR(100) NOT NULL,    -- e.g. Kaski
    slug VARCHAR(50) UNIQUE NOT NULL, -- e.g. kaski
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_districts_province ON districts(province_id);
```

---

### 2.5 Unified News Articles Table (`articles`)
The core news engine containing **all national, category, and regional/Pradesh news** with state/county filtering.

```sql
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(100) PRIMARY KEY,
    title TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    
    -- Relational Metadata & Filtering Fields
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    category_slug VARCHAR(100) NOT NULL,
    province_id INT REFERENCES provinces(id) ON DELETE SET NULL, -- State filter (NULL for national)
    district_id INT REFERENCES districts(id) ON DELETE SET NULL, -- County/Local filter
    location VARCHAR(100),                                      -- e.g. पोखरा, त्रिशूली
    
    -- Author & Source
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) DEFAULT 'सनस्टार संवाददाता',
    source VARCHAR(100) DEFAULT 'सनस्टार न्युज',
    
    -- Flags & Counters
    is_exclusive BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    time_ago VARCHAR(50) DEFAULT 'ताजा समाचार',
    
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_province ON articles(province_id);
CREATE INDEX IF NOT EXISTS idx_articles_district ON articles(district_id);
CREATE INDEX IF NOT EXISTS idx_articles_flags ON articles(is_exclusive, is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
```

---

### 2.6 Opinions & Analysis Table (`opinions`)
Stores columnists, guest writers, and editorial analysis articles.

```sql
CREATE TABLE IF NOT EXISTS opinions (
    id VARCHAR(100) PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(150) DEFAULT 'विचारक / विश्लेषक',
    author_avatar TEXT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT,
    reading_time VARCHAR(50) DEFAULT '५ मिनेट अध्ययन',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.7 Daily Rashifal / Horoscope (`rashifal`)
Stores daily predictions for all 12 Zodiac signs.

```sql
CREATE TABLE IF NOT EXISTS rashifal (
    id VARCHAR(50) PRIMARY KEY,
    sign VARCHAR(50) NOT NULL,        -- e.g. मेष
    latin_name VARCHAR(50) NOT NULL,  -- e.g. Aries
    symbol VARCHAR(10) NOT NULL,      -- e.g. ♈
    date_range VARCHAR(100),          -- e.g. चैत १५ - वैशाख १५
    lucky_color VARCHAR(50),
    lucky_number VARCHAR(20),
    prediction TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.8 Reader Engagement Polls (`polls` & `poll_options`)
Stores interactive daily public opinion polls and voting statistics.

```sql
CREATE TABLE IF NOT EXISTS polls (
    id VARCHAR(100) PRIMARY KEY,
    question TEXT NOT NULL,
    total_votes INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poll_options (
    id VARCHAR(100) PRIMARY KEY,
    poll_id VARCHAR(100) REFERENCES polls(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    count INT DEFAULT 0,
    percent INT DEFAULT 0
);
```

---

## 🛠️ 3. TypeScript Interfaces & Data Mapping

All TypeScript interfaces in [lib/data.ts](file:///Users/lionheart/Imstara/sunstar-news/lib/data.ts) mirror the unified schema:

```typescript
export interface Article {
  id: string;
  title: string;
  category: string;
  categorySlug?: string;
  provinceId?: number;     // State / Province Filter ID
  provinceSlug?: string;   // e.g. gandaki, koshi
  districtId?: number;     // County / District Filter ID
  location?: string;       // e.g. पोखरा, कास्की
  time?: string;
  source?: string;
  image?: string;
  summary?: string;
  content?: string;
  author?: string;
  isExclusive?: boolean;
  isFeatured?: boolean;
  views?: number;
}

export interface Category {
  id: number;
  nameNe: string;
  nameEn: string;
  slug: string;
  icon?: string;
}

export interface Province {
  id: number;
  nameNe: string;
  nameEn: string;
  slug: string;
  capital?: string;
}

export interface Opinion {
  id: string;
  author: string;
  role?: string;
  avatar?: string;
  title: string;
  summary: string;
  time?: string;
}

export interface RashifalItem {
  id: string;
  sign: string;
  latinName: string;
  symbol: string;
  dateRange?: string;
  luckyColor?: string;
  luckyNumber?: string;
  prediction: string;
}
```

---

## 🔍 4. Common Filtering Queries (SQL Examples)

### 4.1 Fetch News by Category (e.g. Politics)
```sql
SELECT * FROM articles 
WHERE category_slug = 'politics' AND is_published = TRUE 
ORDER BY published_at DESC 
LIMIT 10;
```

### 4.2 Fetch Regional News by State/Province (e.g. Gandaki)
```sql
SELECT a.*, p.name_ne as province_name 
FROM articles a
JOIN provinces p ON a.province_id = p.id
WHERE p.slug = 'gandaki' AND a.is_published = TRUE
ORDER BY a.published_at DESC;
```

### 4.3 Fetch Regional News by County/District (e.g. Kaski)
```sql
SELECT a.*, d.name_ne as district_name 
FROM articles a
JOIN districts d ON a.district_id = d.id
WHERE d.slug = 'kaski' AND a.is_published = TRUE
ORDER BY a.published_at DESC;
```

---

## 🔑 5. Environment Variables (`.env.local`)

```env
# Neon PostgreSQL Database Connection
DATABASE_URL="postgresql://neondb_owner:npg_OenEuUSta3M9@ep-fragrant-sunset-a59f6sfk-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret Key for Admin Authentication
JWT_SECRET="sunstar-news-secure-jwt-secret-key-2026-pokhara"
```

---

## 🚀 6. Auto Database Seeding Routine

The initialization routine in [lib/init-db.ts](file:///Users/lionheart/Imstara/sunstar-news/lib/init-db.ts) automatically creates tables, seeds initial provinces, categories, and administrator credentials (`Sitaram` / `Sitaram@123`).

---
*Created for Sunstar News Project Team.*
