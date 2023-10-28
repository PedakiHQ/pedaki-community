'use server';

import { httpBatchLink, loggerLink } from '@trpc/client';
import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server';
import type { AppRouter } from '~/server/router/router.ts';
import { cookies } from 'next/headers.js';
import superjson from 'superjson';
import { getUrl } from './shared';

export const api: ReturnType<typeof experimental_createTRPCNextAppDirServer<AppRouter>> =
  experimental_createTRPCNextAppDirServer<AppRouter>({
    config() {
      return {
        transformer: superjson,
        links: [
          loggerLink({
            enabled: opts => true,
          }),
          httpBatchLink({
            url: getUrl(),
            headers() {
              return {
                cookie: cookies().toString(),
                'x-trpc-source': 'rsc-http',
              };
            },
          }),
        ],
      };
    },
  });
