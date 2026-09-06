import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRashifalById, getAllRashifal } from '@/lib/data';
import SingleRashifalClient from '@/components/organisms/SingleRashifalClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getRashifalById(params.id);
  if (!item) {
    return { title: 'राशिफल भेटिएन | Sunstar News' };
  }

  const title = `${item.sign} राशि (${item.latinName}) - आजको दैनिक, साप्ताहिक र वार्षिक राशिफल | Sunstar News`;
  const description = `${item.sign} राशि (${item.latinName}) को आजको भविष्यफल, शुभ रंग (${item.luckyColor}), शुभ अंक (${item.luckyNumber}) र विस्तृत ज्योतिषीय विश्लेषण।`;
  const url = `https://sunstarnews.com/rashifal/${item.id}`;

  return {
    title,
    description,
    keywords: [
      `${item.sign} राशिफल`,
      `${item.latinName} Horoscope`,
      'नेपाली राशिफल',
      'Sunstar News Rashifal',
      'आजको राशिफल',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'सनस्टार न्युज (Sunstar News)',
      locale: 'ne_NP',
      type: 'article',
      images: [
        {
          url: 'https://sunstarnews.com/images/nepali_rashifal_banner.png',
          width: 1200,
          height: 630,
          alt: `${item.sign} राशिफल`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://sunstarnews.com/images/nepali_rashifal_banner.png'],
    },
  };
}

export async function generateStaticParams() {
  const list = getAllRashifal();
  return list.map((item) => ({
    id: item.id,
  }));
}

export default function SingleRashifalPage({ params }: Props) {
  const item = getRashifalById(params.id);

  if (!item) {
    notFound();
  }

  const allSigns = getAllRashifal();

  return <SingleRashifalClient initialItem={item} allSigns={allSigns} />;
}
