import { sql } from './db';
import bcrypt from 'bcryptjs';

let initialized = false;

export async function initDatabase() {
  if (initialized) return;

  try {
    // 1. Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('ADMIN', 'EDITOR', 'REPORTER')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;`;

    // 2. Create Categories Table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name_ne TEXT NOT NULL,
        name_en TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT,
        sort_order INT DEFAULT 0
      );
    `;

    // 3. Create Provinces (State) Table
    await sql`
      CREATE TABLE IF NOT EXISTS provinces (
        id SERIAL PRIMARY KEY,
        name_ne TEXT NOT NULL,
        name_en TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        capital TEXT
      );
    `;

    // 4. Create Districts (County/Local) Table
    await sql`
      CREATE TABLE IF NOT EXISTS districts (
        id SERIAL PRIMARY KEY,
        province_id INT REFERENCES provinces(id) ON DELETE CASCADE,
        name_ne TEXT NOT NULL,
        name_en TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL
      );
    `;

    // 5. Create Unified Articles Table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        category_id INT REFERENCES categories(id) ON DELETE SET NULL,
        category_slug TEXT NOT NULL,
        province_id INT REFERENCES provinces(id) ON DELETE SET NULL,
        district_id INT REFERENCES districts(id) ON DELETE SET NULL,
        location TEXT,
        author_id INT REFERENCES users(id) ON DELETE SET NULL,
        author_name TEXT DEFAULT 'सनस्टार संवाददाता',
        source TEXT DEFAULT 'सनस्टार न्युज',
        is_exclusive BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        views_count INT DEFAULT 0,
        time_ago TEXT DEFAULT 'ताजा समाचार',
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Seed Default Sitaram Admin User
    const sitaramPass = await bcrypt.hash('Sitaram@123', 10);
    await sql`
      INSERT INTO users (username, email, name, password_hash, role)
      VALUES ('Sitaram', 'sitaram@sunstarnews.com', 'Sitaram', ${sitaramPass}, 'ADMIN')
      ON CONFLICT (email) DO UPDATE SET password_hash = ${sitaramPass}, username = 'Sitaram';
    `;

    // 7. Seed Backup Admin User
    const adminPass = await bcrypt.hash('Sitaram@123', 10);
    await sql`
      INSERT INTO users (username, email, name, password_hash, role)
      VALUES ('admin', 'admin@sunstarnews.com', 'सनस्टार व्यवस्थापक (Admin)', ${adminPass}, 'ADMIN')
      ON CONFLICT (email) DO NOTHING;
    `;

    initialized = true;
  } catch (err) {
    console.error('Database Initialization Warning:', err);
  }
}
