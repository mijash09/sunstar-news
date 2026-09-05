import { Metadata } from 'next';
import Link from 'next/link';
import CategoryPageLayout from '@/components/templates/CategoryPageLayout';
import NewsSectionEkantipur from '@/components/organisms/NewsSectionEkantipur';
import CategoryLoadMore from '@/components/molecules/CategoryLoadMore';
import AdBanner from '@/components/molecules/AdBanner';
import SUNSTAR_DATA, { Article, getAllArticles } from '@/lib/data';

interface Props {
  params: { slug: string };
}

const categoryTitles: Record<string, string> = {
  exclusive: '👑 EXCLUSIVE (विशेष समाचार)',
  politics: '🗳️ राजनीति (Politics)',
  business: '📈 अर्थ / वाणिज्य (Business & Economy)',
  opinion: '✍️ विचार / विश्लेषण (Opinions)',
  sports: '⚽ खेलकुद (Sports)',
  entertainment: '🎬 मनोरञ्जन (Entertainment)',
  interview: '🎙️ अन्तर्वार्ता (Interview)',
  feature: '📰 फिचर (Feature)',
  technology: '🔬 प्रविधि (Technology)',
  world: '🌍 विश्व समाचार (World News)',
  gandaki: '🏔️ गण्डकी प्रदेश समाचार',
  koshi: '🏔️ कोशी प्रदेश समाचार',
  madhesh: '🌴 मधेश प्रदेश समाचार',
  bagmati: '🏛️ बाग्मती प्रदेश समाचार',
  lumbini: '🪷 लुम्बिनी प्रदेश समाचार',
  karnali: '🏞️ कर्णाली प्रदेश समाचार',
  sudurpaschim: '🌅 सुदूरपश्चिम प्रदेश समाचार',
  autolife: '🚗 अटो लाइफ (Auto Life)',
  lifestyle: '🌿 जीवनशैली (Lifestyle)',
  literature: '📖 साहित्य / विविध (Literature)',
  archive: '📜 सनस्टार अर्काइभ (Archive)',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawTitle = categoryTitles[params.slug] || 'समाचार वर्ग';
  const cleanTitle = rawTitle.replace(/^[^\w\s\u0900-\u097F]+/, '').trim();
  const url = `https://sunstarnews.com/category/${params.slug}`;
  const description = `सनस्टार न्युज (Sunstar News) - ${cleanTitle} क्षेत्रका ताजा तथा विशेष समाचार, विश्लेषण र अपडेटहरू।`;

  return {
    title: `${cleanTitle} - सनस्टार न्युज | Sunstar News`,
    description,
    keywords: [cleanTitle, 'Sunstar News', 'सनस्टार न्युज', 'नेपाल समाचार', 'ताजा खबर'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title: `${cleanTitle} - सनस्टार न्युज`,
      description,
      siteName: 'सनस्टार न्युज (Sunstar News)',
      locale: 'ne_NP',
      images: [
        {
          url: 'https://sunstarnews.com/assets/sunstar-logo.jpg',
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} - Sunstar News`,
      description,
      images: ['https://sunstarnews.com/assets/sunstar-logo.jpg'],
      site: '@sunstarnews',
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: 'exclusive' },
    { slug: 'politics' },
    { slug: 'business' },
    { slug: 'opinion' },
    { slug: 'sports' },
    { slug: 'entertainment' },
    { slug: 'interview' },
    { slug: 'feature' },
    { slug: 'technology' },
    { slug: 'world' },
    { slug: 'gandaki' },
    { slug: 'koshi' },
    { slug: 'madhesh' },
    { slug: 'bagmati' },
    { slug: 'lumbini' },
    { slug: 'karnali' },
    { slug: 'sudurpaschim' },
    { slug: 'autolife' },
    { slug: 'lifestyle' },
    { slug: 'literature' },
    { slug: 'archive' },
  ];
}

export default function CategoryPage({ params }: Props) {
  const categoryTitle = categoryTitles[params.slug] || 'समाचार वर्ग';
  const cleanTitle = categoryTitle.replace(/^[^\w\s\u0900-\u097F]+/, '').trim();

  let articles: Article[] = [];
  if (params.slug === 'politics') articles = SUNSTAR_DATA.politicsNews;
  else if (params.slug === 'business') articles = SUNSTAR_DATA.businessNews;
  else if (params.slug === 'sports') articles = SUNSTAR_DATA.sportsNews;
  else if (params.slug === 'entertainment') articles = SUNSTAR_DATA.entertainmentNews;
  else if (params.slug === 'world') articles = SUNSTAR_DATA.worldNews;
  else if (params.slug === 'exclusive') articles = SUNSTAR_DATA.exclusiveNews;
  else if (params.slug === 'interview') articles = SUNSTAR_DATA.interviewNews;
  else if (params.slug === 'feature') articles = SUNSTAR_DATA.featureNews;
  else if (params.slug === 'technology') articles = SUNSTAR_DATA.technologyNews;
  else if (params.slug === 'opinion') {
    articles = SUNSTAR_DATA.opinions.map((op) => ({
      id: op.id,
      title: op.title,
      category: 'विचार / विश्लेषण',
      author: op.author,
      time: op.time,
      summary: op.summary,
      image: op.avatar,
    }));
  } else if (SUNSTAR_DATA.pradeshNews[params.slug]) {
    articles = (SUNSTAR_DATA.pradeshNews[params.slug] || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      category: `प्रदेश (${item.location || 'नेपाल'})`,
      time: item.time,
      source: item.source || 'सनस्टार न्युज',
      image: item.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
      summary: item.summary || item.title,
    }));
  } else {
    const all = getAllArticles();
    articles = all.filter((a) =>
      a.category.toLowerCase().includes(params.slug.toLowerCase()) ||
      (a.categorySlug && a.categorySlug === params.slug)
    );
    if (articles.length === 0) {
      articles = all.slice(0, 6);
    }
  }

  const allCategoryArticles = [...articles, ...getAllArticles().filter(a => a.categorySlug !== params.slug)];
  const lead = articles[0];
  const rest = articles.slice(1);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'गृहपृष्ठ (Home)',
        item: 'https://sunstarnews.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: cleanTitle,
        item: `https://sunstarnews.com/category/${params.slug}`,
      },
    ],
  };

  return (
    <CategoryPageLayout
      title={categoryTitle}
      activeHref={`/category/${params.slug}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <AdBanner />

      {lead && (
        <NewsSectionEkantipur
          title={cleanTitle}
          categorySlug={params.slug}
          leadArticle={lead}
          subArticles={rest.length > 0 ? rest : getAllArticles().slice(0, 4)}
        />
      )}

      <CategoryLoadMore
        initialArticles={rest}
        allArticles={allCategoryArticles}
        categoryTitle={cleanTitle}
      />
    </CategoryPageLayout>
  );
}

