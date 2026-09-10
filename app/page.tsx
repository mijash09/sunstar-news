import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { getLandingData } from '@/lib/landing-data';
import HomePageClient from '@/components/templates/HomePageClient';

export const revalidate = 60;

export default async function HomePage() {
  const queryClient = getQueryClient();

  // Prefetch landing page data on the server side for complete SSR
  await queryClient.prefetchQuery({
    queryKey: ['landing-data'],
    queryFn: getLandingData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}
