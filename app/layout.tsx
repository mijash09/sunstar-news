import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sunstarnews.com'),
  title: {
    default:
      'सनस्टार न्युज - नेपालको राष्ट्रिय डिजिटल अनलाइन पत्रिका | Sunstar News',
    template: '%s - सनस्टार न्युज | Sunstar News',
  },
  description:
    'सनस्टार न्युज (Sunstar News) - पोखरा तथा नेपालका सामाचार, राजनीति, अर्थ, विचार, खेलकुद, मनोरञ्जन, प्रविधि र अन्तर्राष्ट्रिय घटनाक्रमको सत्य, तथ्य र निष्पक्ष अनलाइन समाचार प्लेटफर्म।',
  applicationName: 'Sunstar News',
  authors: [{ name: 'Sunstar News Desk', url: 'https://sunstarnews.com' }],
  generator: 'Next.js',
  keywords: [
    'Sunstar News',
    'सनस्टार न्युज',
    'Ekantipur',
    'Online Khabar',
    'Pokhara News',
    'Nepal News',
    'पोखरा समाचार',
    'नेपाल समाचार',
    'ताजा खबर',
    'राजनीति समाचार',
    'नेपाली न्युज',
    'डिजिटल पत्रिका',
    'नेप्से सेयर बजार',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Sunstar Media Pvt. Ltd.',
  publisher: 'Sunstar News',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://sunstarnews.com',
    languages: {
      ne: 'https://sunstarnews.com',
      'en-US': 'https://sunstarnews.com/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/assets/sunstar-logo.jpg',
    shortcut: '/assets/sunstar-logo.jpg',
    apple: '/assets/sunstar-logo.jpg',
  },
  openGraph: {
    title:
      'सनस्टार न्युज - नेपालको राष्ट्रिय डिजिटल अनलाइन पत्रिका | Sunstar News',
    description:
      'पोखराबाट सञ्चालित सत्य, तथ्य र निष्पक्ष अनलाइन डिजिटल समाचार प्लेटफर्म। नेपालभरिका ताजा घटनाक्रम र गहिरो विश्लेषण।',
    url: 'https://sunstarnews.com',
    siteName: 'सनस्टार न्युज (Sunstar News)',
    images: [
      {
        url: '/assets/sunstar-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Sunstar News Logo',
      },
    ],
    locale: 'ne_NP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'सनस्टार न्युज - Sunstar News Nepal',
    description:
      'पोखरा तथा नेपालका ताजा समाचार, राजनीति, अर्थ र विचारको सत्य, तथ्य अनलाइन पत्रिका।',
    images: ['/assets/sunstar-logo.jpg'],
    site: '@sunstarnews',
    creator: '@sunstarnews',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'सनस्टार न्युज (Sunstar News)',
  alternateName: ['Sunstar News', 'Sunstar Digital News', 'sunstarnews.com'],
  url: 'https://sunstarnews.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://sunstarnews.com/assets/sunstar-logo.jpg',
    width: 600,
    height: 60,
  },
  sameAs: [
    'https://facebook.com/sunstarnews',
    'https://twitter.com/sunstarnews',
    'https://youtube.com/sunstarnews',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pokhara',
    addressRegion: 'Gandaki Province',
    addressCountry: 'NP',
  },
  publishingPrinciples: 'https://sunstarnews.com/about',
  ethicsPolicy: 'https://sunstarnews.com/ethics',
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'सनस्टार न्युज',
  url: 'https://sunstarnews.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://sunstarnews.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne">
      <head>
        <link rel="icon" type="image/jpeg" href="/assets/sunstar-logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
