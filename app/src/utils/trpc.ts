'use client';

import { httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '../server/routers/_app';

const baseUrl = '';

export const getUrl = () => {
  return baseUrl + '/api/t';
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            suspense: false,
            staleTime: 10_000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (failureCount: number, error) => {
              if (failureCount > 2) return false;

              if (error instanceof TRPCClientError) {
                const code = (error as TRPCClientError<AppRouter>).data?.code;

                if (
                  code === 'UNAUTHORIZED' ||
                  code === 'FORBIDDEN' ||
                  code === 'NOT_FOUND' ||
                  code === 'BAD_REQUEST' ||
                  code === 'METHOD_NOT_SUPPORTED' ||
                  code === 'INTERNAL_SERVER_ERROR' ||
                  code === 'TOO_MANY_REQUESTS' ||
                  code === 'PAYLOAD_TOO_LARGE'
                ) {
                  return false;
                }
              }
              return true;
            },
          },
        },
      },
      transformer: superjson,

      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: getUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              signal: options?.signal,
              credentials: 'include',
            });
          },
        }),
      ],
    };
  },
  ssr: true,
});
