import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'सनस्टार न्युज (Sunstar News)',
    short_name: 'SunstarNews',
    description: 'नेपालको राष्ट्रिय डिजिटल अनलाइन पत्रिका - पोखरा तथा नेपालका सामाचार',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e88e5',
    icons: [
      {
        src: '/assets/sunstar-logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/assets/sunstar-logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
