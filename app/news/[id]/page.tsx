import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import RashifalSection from '@/components/organisms/RashifalSection';
import SingleArticleClient from '@/components/organisms/SingleArticleClient';
import { getArticleById, getAllArticles, Article } from '@/lib/data';

interface Props {
  params: { id: string };
}

function getDummyFallbackArticle(id: string): Article {
  const cleanId = id.replace(/-/g, ' ');
  const formattedTitle = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);

  return {
    id: id || 'news-fallback-demo',
    title: `सनस्टार विशेष समाचार: ${formattedTitle.length > 5 ? formattedTitle : 'नेपालको चौतर्फी विकास र सूचना प्रविधिको नयाँ युग'}`,
    category: 'मुख्य समाचार',
    categories: ['मुख्य समाचार', 'विशेष', 'राजनीति'],
    time: '१० मिनेट अगाडि',
    date: '२०८१ भदौ २१ गते, शनिबार',
    views: '४,५२० पटक पढिएको',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    caption: 'नेपालमा प्रविधि तथा डिजिटल सञ्चारको द्रुत विकास र सम्भावनाहरू।',
    summary: 'सूचना प्रविधिको द्रुत विकाससँगै नेपालमा डिजिटल मिडिया र अनलाइन सञ्चार माध्यमको पहुँच अभूतपूर्व रूपमा विस्तार भइरहेको छ।',
    content: `काठमाडौँ — नेपालमा डिजिटल प्रविधि र सञ्चार माध्यमको विकासले नयाँ उचाइ हासिल गरिरहेको छ। मुलुकभर इन्टरनेटको पहुँच तीव्र रूपमा विस्तार भएसँगै नागरिकहरूलाई सर्वसुलभ, सत्य र निष्पक्ष समाचार पहुँच पुर्‍याउन अनलाइन मिडियाको भूमिका महत्त्वपूर्ण बन्दै गएको छ।\n\nविशेषज्ञहरूका अनुसार आगामी दिनहरूमा नेपालमा सूचना प्रविधिका पूर्वाधारहरू थप सुदृढ भई प्रत्येक स्थानीय तहसम्म डिजिटल सेवा पुग्ने अपेक्षा गरिएको छ। सनस्टार न्युजले पाठकहरूलाई सधैं गुणस्तरीय र आधिकारिक सूचना प्रदान गर्न प्रतिबद्धता व्यक्त गर्दछ।`,
    author: 'सनस्टार सम्पादकीय टोली',
    authorRole: 'वरिष्ठ समाचार सम्पादक',
    authorImage: '👨‍💼',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = getArticleById(params.id);
  const article = found || getDummyFallbackArticle(params.id);

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
  const found = getArticleById(params.id);
  const article = found || getDummyFallbackArticle(params.id);

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
    image: article.image ? [article.image] : ['https://sunstarnews.com/assets/sunstar-logo.jpg'],
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
      />
    </div>
  );
}
