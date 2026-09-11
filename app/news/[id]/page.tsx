import { Metadata } from 'next';
import SingleArticleClient from '@/components/organisms/SingleArticleClient';
import { getAllArticles } from '@/lib/data';
import { getArticleByIdAsync, getDummyFallbackArticle } from '@/lib/article-data';
import { getDbBanners } from '@/lib/landing-data';

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleByIdAsync(params.id);

  const url = `https://sunstarnews.com/news/${article.id}`;
  const description =
    article.summary || `${article.title} - सनस्टार न्युज (Sunstar News)`;
  const displayImages = Array.isArray(article.images) && article.images.length > 0
    ? article.images
    : [article.image || 'https://sunstarnews.com/assets/sunstar-logo.jpg'];

  return {
    title: `${article.title} - सनस्टार न्युज | Sunstar News`,
    description,
    keywords: [
      article.category || 'समाचार',
      'Sunstar News',
      'सनस्टार न्युज',
      'नेपाल समाचार',
      'ताजा खबर',
    ],
    authors: [{ name: article.author || 'Sunstar News Desk' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description,
      siteName: 'सनस्टार न्युज (Sunstar News)',
      locale: 'ne_NP',
      images: displayImages.map((imgUrl) => ({
        url: imgUrl,
        width: 1200,
        height: 630,
        alt: article.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: displayImages,
      site: '@sunstarnews',
      creator: '@sunstarnews',
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await getArticleByIdAsync(params.id);
  const displayImages = Array.isArray(article.images) && article.images.length > 0
    ? article.images
    : [article.image || 'https://sunstarnews.com/assets/sunstar-logo.jpg'];

  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  const trendingArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 5);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sunstarnews.com/news/${article.id}`,
    },
    headline: article.title,
    description: article.summary || article.title,
    image: displayImages,
    datePublished: '2026-09-05T08:00:00+05:45',
    dateModified: '2026-09-05T12:00:00+05:45',
    author: {
      '@type': 'Person',
      name: article.author || 'सनस्टार समाचार डेस्क',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'सनस्टार न्युज (Sunstar News)',
      url: 'https://sunstarnews.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sunstarnews.com/assets/sunstar-logo.jpg',
      },
    },
    articleSection: article.category || 'समाचार',
    inLanguage: 'ne-NP',
  };

  const banners = await getDbBanners();

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <SingleArticleClient
        article={article}
        relatedArticles={relatedArticles}
        trendingArticles={trendingArticles}
        banners={banners}
      />
    </div>
  );
}
