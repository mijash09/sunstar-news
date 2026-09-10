'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query/get-query-client';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
