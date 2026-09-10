# 📰 Sunstar News (सनस्टार न्युज) - Modern Digital News Portal

[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon_Serverless_PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Vanilla_CSS_%2B_Tailwind_v3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Sunstar News (सनस्टार न्युज)** is a state-of-the-art, high-performance Nepalese national digital news application built using **Next.js 14 App Router**, **TypeScript**, **PostgreSQL (Neon DB Serverless)**, and a custom Ekantipur-inspired responsive design system.

---

## 🌟 Key Features & Layout Modules

### 1. Header & Live Utility Bar
- **Nepali Date & Weather**: Live Nepalese date display paired with real-time weather widgets for Pokhara and Kathmandu.
- **Financial Tickers**: Live stock market NEPSE tickers and gold/silver exchange rates.
- **Breaking News Ticker**: Smooth animated ticker broadcasting high-priority breaking news alerts.
- **Header Utilities**: Quick article search modal, theme toggle (Dark/Light mode), font-size toggles, and user navigation.

### 2. Advertising & Banner System
- Integrated responsive leaderboard advertisement banners at the top header branding space, hero break sections, and between homepage content grids.

### 3. Main Hero & Right Sidebar
- **70% Main Lead Layout**: Large hero card with featured breaking story and secondary top-lead news cards.
- **30% Interactive Sidebar**: Live 24/7 timeline news feed, daily reader opinion polls, and trending updates.

### 4. Full-Width Category News Grids
- 👑 **EXCLUSIVE (विशेष समाचार)**: Featured 5-column left-lead news grid.
- 🗳️ **राजनीति (Politics)**: Signature Ekantipur-style 3-column politics grid block.
- 📈 **अर्थ / वाणिज्य (Business & Economy)**: 5-column left-lead financial grid system.
- ✍️ **विचार / विश्लेषण (Opinions & Analysis Carousel)**: Interactive multi-card carousel slider featuring author avatars, roles, reading time badges, and editorial analysis.
- 📸 **सनस्टार स्टोरी (Visual Web Stories)**: Modern portrait web story cards with author avatars, video/image overlays, view counters, and story category tags.
- ⚽ **खेलकुद (Sports)**: Multi-column sports grid system with specialized tags (Cricket, Football, Martial Arts).
- 🎬 **मनोरञ्जन (Entertainment)**: Cinema, arts, literature, and celebrity culture news block.
- 📰 **फिचर समाचार (Feature Story)**: Long-form feature reporting and human-interest stories.
- 🔬 **प्रविधि (Science & Tech)**: Technology, gadgets, and tech startup news grid.
- 🌍 **विश्व समाचार (World News)**: Global international affairs grid.

### 5. Pradesh (Province & Local) News Module
- **Interactive 7-Province Tabbed System**: Seamless tabbed navigation covering all 7 Nepalese Provinces (*गण्डकी, कोशी, मधेश, बाग्मती, लुम्बिनी, कर्णाली, सुदूरपश्चिम*).
- **State & County Filtering**: Database schema designed for state (province) and county (district) level news querying.

### 6. Daily Rashifal (Horoscope) Module
- **12 Zodiac Signs Grid**: Interactive zodiac grid featuring signs from Aries (मेष) to Pisces (मीन).
- **Modal Horoscope Viewer**: Detailed horoscope predictions, lucky colors, lucky numbers, and date ranges.

### 7. Reading Experience & Dynamic Pagination
- **Interactive Article Modal**: Distraction-free full article reader popup with font resizing, social share buttons, and related news recommendations.
- **Dynamic Category Pages**: Dynamic SSR/SSG routes (`/category/[slug]`) and load-more pagination.

---

## 🚀 Technology Stack

- **Framework**: Next.js 14 App Router (`app/`)
- **Language**: TypeScript (`.ts`, `.tsx`)
- **Styling**: Custom Vanilla CSS Design System (`app/globals.css`) + Tailwind CSS v3
- **Database Engine**: Serverless PostgreSQL via **Neon DB** (`@neondatabase/serverless`)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` for secure admin access
- **SEO & Metadata**: Built-in OpenGraph, Twitter Cards, dynamic `sitemap.xml`, `robots.txt`, and `manifest.webmanifest`

---

## 🛠️ Project Structure

```
sunstar-news/
├── app/                        # Next.js 14 App Router
│   ├── category/[slug]/       # Category & Province news pages
│   ├── news/[id]/             # Single news article reader page
│   ├── login/                 # Administrator login page
│   ├── globals.css            # Custom CSS design system & tokens
│   ├── layout.tsx             # Root layout with metadata & providers
│   ├── page.tsx               # Homepage layout
│   ├── manifest.webmanifest/  # Web app manifest
│   ├── robots.ts              # Search engine robots configuration
│   └── sitemap.ts             # Dynamic XML sitemap generator
├── components/
│   ├── atoms/                 # Badges, Avatars, Icons, Buttons
│   ├── molecules/             # AdBanner, SectionHeader, CategoryLoadMore, WeatherWidget
│   ├── organisms/             # Header, Footer, HeroCard, NewsCard, PradeshTabs, RashifalSection
│   └── templates/             # MainNewsLayout, CategoryPageLayout
├── lib/
│   ├── data.ts                # TypeScript data interfaces, helper functions & memory fallback
│   ├── db.ts                  # Neon Serverless PostgreSQL SQL connection client
│   ├── init-db.ts             # Automatic DB schema creation & admin seeding routine
│   └── auth.ts                # JWT authentication & session verification utilities
├── DATABASE_SCHEMA_PLAN.md    # Relational Database Design & SQL DDL Blueprint
├── README.md                  # Project documentation
└── package.json
```

---

## 💻 Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/mijash09/sunstar-news.git
cd sunstar-news
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL Database Connection String
DATABASE_URL="postgresql://neondb_owner:npg_OenEuUSta3M9@ep-fragrant-sunset-a59f6sfk-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret Key for Admin Authentication
JWT_SECRET="sunstar-news-secure-jwt-secret-key-2026-pokhara"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Netlify Hosting & Deployment Guide

This project is configured for **Netlify** using `@netlify/plugin-nextjs`:

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Netlify deployment"
   git push origin sitaram
   ```

2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com/) -> **Add new site** -> **Import an existing project**.
   - Select **GitHub** and pick the repository `sunstar-news`.
   - Select branch `sitaram` (or `main`).

3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`

4. **Environment Variables on Netlify**:
   Add the following under **Site settings > Environment variables**:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_OenEuUSta3M9@ep-fragrant-sunset-a59f6sfk-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET`: `sunstar-news-secure-jwt-secret-key-2026-pokhara`
   - `NODE_VERSION`: `20`

---

## 🗄️ Database Architecture

The project features a **unified relational PostgreSQL schema** hosted on Neon DB Serverless. All news items live inside a single `articles` table with foreign key relations for `categories`, `provinces` (state), and `districts` (county).

For complete SQL schema DDL scripts, database indexes, and ERD diagrams, see:
👉 **[DATABASE_SCHEMA_PLAN.md](file:///Users/lionheart/Imstara/sunstar-news/DATABASE_SCHEMA_PLAN.md)**

---

## 📜 License & Copyright

© 2026 **Sunstar News (सनस्टार न्युज)** • Pokhara, Nepal. All Rights Reserved.
