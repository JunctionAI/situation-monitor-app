'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 45 * 1000, // 45 seconds
            refetchOnWindowFocus: true, // Refresh when user returns to tab
            refetchOnReconnect: true, // Refresh on network reconnect
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        {children}
        <UpgradeModal />
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}
