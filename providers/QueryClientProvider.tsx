'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryClientProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30 * 60 * 1000, // 30 minutes
                        gcTime: 60 * 60 * 1000, // 60 minutes
                        retry: 2,
                        refetchOnWindowFocus: false,
                        refetchOnMount: false,
                        refetchOnReconnect: true,
                        networkMode: 'online',
                    },
                },
            })
    );

    return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}
