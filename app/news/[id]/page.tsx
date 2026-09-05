import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticlePageLayout from '@/components/templates/ArticlePageLayout';
import Badge from '@/components/atoms/Badge';
import SourcePill from '@/components/atoms/SourcePill';
import ArticleMeta from '@/components/molecules/ArticleMeta';
import { getArticleById, getAllArticles } from '@/lib/data';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleById(params.id);
  if (!article) {
    return { title: 'समाचार भेटिएन | Sunstar News' };
  }

  const url = `https://sunstarnews.com/news/${article.id}`;
  const description =
    article.summary || `${article.title} - सनस्टार न्युज (Sunstar News)`;
  const imageUrl = article.image || 'https://sunstarnews.com/assets/sunstar-logo.jpg';

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
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [imageUrl],
      site: '@sunstarnews',
      creator: '@sunstarnews',
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export default function ArticleDetailPage({ params }: Props) {
  const article = getArticleById(params.id);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sunstarnews.com/news/${article.id}`,
    },
    headline: article.title,
    description: article.summary || article.title,
    image: article.image ? [article.image] : ['https://sunstarnews.com/assets/sunstar-logo.jpg'],
    datePublished: article.date ? '2026-09-05T08:00:00+05:45' : '2026-09-05T08:00:00+05:45',
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

  return (
    <ArticlePageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        <div className="reader-header">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Badge variant="category">📌 {article.category || 'समाचार'}</Badge>
            <div className="source-credit-banner">
              📰 स्रोत: <SourcePill>{article.source || 'SunstarNews.com'}</SourcePill>
            </div>
          </div>
          <h1 className="reader-title">{article.title}</h1>
          <ArticleMeta
            author={article.author}
            authorImage={article.authorImage}
            date={article.date}
            time={article.time}
          />
        </div>

        {article.image && (
          <div style={{ padding: '0 30px', marginTop: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              style={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
              }}
              alt={article.title}
            />
            {article.caption && (
              <div
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {article.caption}
              </div>
            )}
          </div>
        )}

        <div
          className="reader-body"
          dangerouslySetInnerHTML={{
            __html: article.content || `<p>${article.summary || ''}</p>`,
          }}
        />

        <div
          style={{
            padding: '20px 30px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              color: 'var(--brand-orange)',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            ⬅ गृहपृष्ठमा फर्कनुहोस् (Back to Home)
          </Link>
        </div>
      </article>
    </ArticlePageLayout>
  );
}
