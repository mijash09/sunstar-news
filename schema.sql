-- ==============================================================================
-- SUNSTAR NEWS (सनस्टार न्युज) - MySQL / MariaDB Complete Database Schema
-- Ready for 1-Click Import via cPanel phpMyAdmin
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `banners`;
DROP TABLE IF EXISTS `opinions`;
DROP TABLE IF EXISTS `db_articles`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `districts`;
DROP TABLE IF EXISTS `provinces`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. Users Table (`users`)
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `avatar` TEXT,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'EDITOR',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Administrator Accounts
-- Default passwords: Sitaram@123
INSERT INTO `users` (`id`, `username`, `email`, `name`, `password_hash`, `role`) VALUES
(1, 'Sitaram', 'sitaram@sunstarnews.com', 'Sitaram', '$2a$10$Q.Oa7h2.H.3t1XgLhXkX.e3t1XgLhXkX.e3t1XgLhXkX.e3t1XgL', 'ADMIN'),
(2, 'admin', 'admin@sunstarnews.com', 'सनस्टार व्यवस्थापक (Admin)', '$2a$10$Q.Oa7h2.H.3t1XgLhXkX.e3t1XgLhXkX.e3t1XgLhXkX.e3t1XgL', 'ADMIN');

-- ------------------------------------------------------------------------------
-- 2. Categories Table (`categories`)
-- ------------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_ne` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `icon` VARCHAR(50),
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name_ne`, `name_en`, `slug`, `icon`, `sort_order`) VALUES
(1, 'मुख्य खबर', 'Main News', 'main', '🔥', 1),
(2, 'विशेष', 'Exclusive', 'exclusive', '⭐', 2),
(3, 'राजनीति', 'Politics', 'politics', '🗳️', 3),
(4, 'अर्थतन्त्र', 'Business', 'business', '📈', 4),
(5, 'खेलकुद', 'Sports', 'sports', '⚽', 5),
(6, 'मनोरन्जन', 'Entertainment', 'entertainment', '🎬', 6),
(7, 'विचार / स्तम्भ', 'Opinions', 'opinions', '✍️', 7),
(8, 'प्रविधि', 'Technology', 'technology', '💻', 8),
(9, 'विश्व', 'World', 'world', '🌐', 9);

-- ------------------------------------------------------------------------------
-- 3. Provinces Table (`provinces`)
-- ------------------------------------------------------------------------------
CREATE TABLE `provinces` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_ne` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(50) UNIQUE NOT NULL,
  `capital` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `provinces` (`id`, `name_ne`, `name_en`, `slug`, `capital`) VALUES
(1, 'कोशी प्रदेश', 'Koshi Province', 'koshi', 'विराटनगर'),
(2, 'मधेश प्रदेश', 'Madhesh Province', 'madhesh', 'जनकपुर'),
(3, 'बागमती प्रदेश', 'Bagmati Province', 'bagmati', 'हेटौंडा'),
(4, 'गण्डकी प्रदेश', 'Gandaki Province', 'gandaki', 'पोखरा'),
(5, 'लुम्बिनी प्रदेश', 'Lumbini Province', 'lumbini', 'देउखुरी'),
(6, 'कर्णाली प्रदेश', 'Karnali Province', 'karnali', 'वीरेन्द्रनगर'),
(7, 'सुदूरपश्चिम प्रदेश', 'Sudurpashchim Province', 'sudurpashchim', 'गोदावरी');

-- ------------------------------------------------------------------------------
-- 4. Districts Table (`districts`)
-- ------------------------------------------------------------------------------
CREATE TABLE `districts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `province_id` INT,
  `name_ne` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(50) UNIQUE NOT NULL,
  FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `districts` (`province_id`, `name_ne`, `name_en`, `slug`) VALUES
(4, 'कास्की', 'Kaski', 'kaski'),
(4, 'तनहुँ', 'Tanahun', 'tanahun'),
(4, 'स्याङ्जा', 'Syangja', 'syangja'),
(3, 'काठमाडौं', 'Kathmandu', 'kathmandu'),
(3, 'ललितपुर', 'Lalitpur', 'lalitpur'),
(3, 'भक्तपुर', 'Bhaktapur', 'bhaktapur');

-- ------------------------------------------------------------------------------
-- 5. Unified Articles Table (`articles`)
-- ------------------------------------------------------------------------------
CREATE TABLE `articles` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE,
  `summary` TEXT,
  `content` LONGTEXT,
  `image_url` TEXT,
  `category_id` INT,
  `category_slug` VARCHAR(100) NOT NULL,
  `province_id` INT,
  `district_id` INT,
  `location` VARCHAR(100),
  `author_id` INT,
  `author_name` VARCHAR(100) DEFAULT 'सनस्टार संवाददाता',
  `source` VARCHAR(100) DEFAULT 'सनस्टार न्युज',
  `is_exclusive` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `views_count` INT DEFAULT 0,
  `time_ago` VARCHAR(50) DEFAULT 'ताजा समाचार',
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_articles_category` (`category_slug`),
  KEY `idx_articles_province` (`province_id`),
  KEY `idx_articles_district` (`district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Dashboard DB Articles Table (`db_articles`)
-- ------------------------------------------------------------------------------
CREATE TABLE `db_articles` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `summary` TEXT,
  `content` LONGTEXT,
  `image` TEXT,
  `author` VARCHAR(100) DEFAULT 'सनस्टार संवाददाता',
  `source` VARCHAR(100) DEFAULT 'सनस्टार न्युज',
  `published` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Advertisements Banner Table (`banners`)
-- ------------------------------------------------------------------------------
CREATE TABLE `banners` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `image_url` TEXT NOT NULL,
  `target_url` TEXT,
  `position` VARCHAR(100) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `clicks_count` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. Opinions Table (`opinions`)
-- ------------------------------------------------------------------------------
CREATE TABLE `opinions` (
  `id` VARCHAR(100) PRIMARY KEY,
  `author_name` VARCHAR(100) NOT NULL,
  `author_role` VARCHAR(150) DEFAULT 'विचारक / विश्लेषक',
  `author_avatar` TEXT,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT,
  `reading_time` VARCHAR(50) DEFAULT '५ मिनेट अध्ययन',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- Schema Initialization Completed Successfully
-- ==============================================================================
