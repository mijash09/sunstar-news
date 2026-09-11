import { Metadata } from 'next';
import CategoryPageLayout from '@/components/templates/CategoryPageLayout';
import NewsSectionEkantipur from '@/components/organisms/NewsSectionEkantipur';
import CategoryLoadMore from '@/components/molecules/CategoryLoadMore';
import AdBanner from '@/components/molecules/AdBanner';
import { getAllArticles } from '@/lib/data';
import { getCategoryArticlesAsync } from '@/lib/article-data';

export const dynamic = 'force-dynamic';

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
  pradesh: '🏔️ प्रदेश समाचार (Province News)',
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
    { slug: 'pradesh' },
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

export default async function CategoryPage({ params }: Props) {
  const categoryTitle = categoryTitles[params.slug] || 'समाचार वर्ग';
  const cleanTitle = categoryTitle.replace(/^[^\w\s\u0900-\u097F]+/, '').trim();

  const { articles, lead, rest, allCategoryArticles } = await getCategoryArticlesAsync(params.slug);

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

