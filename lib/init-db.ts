import { sql } from './db';
import bcrypt from 'bcryptjs';

let initialized = false;

export async function initDatabase() {
  if (initialized) return;

  try {
    // 1. Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        avatar TEXT,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'EDITOR',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Categories Table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_ne VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(50),
        sort_order INT DEFAULT 0
      );
    `;

    // 3. Provinces (State) Table
    await sql`
      CREATE TABLE IF NOT EXISTS provinces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_ne VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        capital VARCHAR(100)
      );
    `;

    // 4. Districts (Local) Table
    await sql`
      CREATE TABLE IF NOT EXISTS districts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        province_id INT,
        name_ne VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
      );
    `;

    // 5. Unified Articles Table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        summary TEXT,
        content LONGTEXT,
        image_url TEXT,
        category_id INT,
        category_slug VARCHAR(100) NOT NULL,
        province_id INT,
        district_id INT,
        location VARCHAR(100),
        author_id INT,
        author_name VARCHAR(100) DEFAULT 'सनस्टार संवाददाता',
        source VARCHAR(100) DEFAULT 'सनस्टार न्युज',
        is_exclusive BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        views_count INT DEFAULT 0,
        time_ago VARCHAR(50) DEFAULT 'ताजा समाचार',
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Legacy / Dashboard db_articles Table
    await sql`
      CREATE TABLE IF NOT EXISTS db_articles (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        summary TEXT,
        content LONGTEXT,
        image TEXT,
        author VARCHAR(100) DEFAULT 'सनस्टार संवाददाता',
        source VARCHAR(100) DEFAULT 'सनस्टार न्युज',
        published BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 7. Advertisements Banner Table
    await sql`
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        target_url TEXT,
        position VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        clicks_count INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 8. Opinions Table
    await sql`
      CREATE TABLE IF NOT EXISTS opinions (
        id VARCHAR(100) PRIMARY KEY,
        author_name VARCHAR(100) NOT NULL,
        author_role VARCHAR(150) DEFAULT 'विचारक / विश्लेषक',
        author_avatar TEXT,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        content LONGTEXT,
        reading_time VARCHAR(50) DEFAULT '५ मिनेट अध्ययन',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 9. Seed Default Sitaram Admin User
    const sitaramPass = await bcrypt.hash('Sitaram@123', 10);
    await sql`
      INSERT INTO users (username, email, name, password_hash, role)
      VALUES ('Sitaram', 'sitaram@sunstarnews.com', 'Sitaram', ${sitaramPass}, 'ADMIN')
      ON DUPLICATE KEY UPDATE password_hash = ${sitaramPass}, username = 'Sitaram';
    `;

    // 10. Seed Backup Admin User
    const adminPass = await bcrypt.hash('Sitaram@123', 10);
    await sql`
      INSERT INTO users (username, email, name, password_hash, role)
      VALUES ('admin', 'admin@sunstarnews.com', 'सनस्टार व्यवस्थापक (Admin)', ${adminPass}, 'ADMIN')
      ON DUPLICATE KEY UPDATE password_hash = ${adminPass};
    `;

    initialized = true;
  } catch (err) {
    console.error('MySQL Initialization Warning:', err);
  }
}

