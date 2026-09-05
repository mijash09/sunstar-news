import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/private'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/dashboard'],
      },
    ],
    sitemap: 'https://sunstarnews.com/sitemap.xml',
    host: 'https://sunstarnews.com',
  };
}
