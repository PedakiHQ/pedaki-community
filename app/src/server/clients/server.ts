import { auth } from '@pedaki/auth/server';
import { loggerLink } from '@trpc/client';
import { experimental_nextCacheLink } from '@trpc/next/app-dir/links/nextCache';
import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server';
import { appRouter } from '~api/router/router';
import { headers } from 'next/headers';
import SuperJSON from 'superjson';

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: () => false,
        }),
        experimental_nextCacheLink({
          transformer: SuperJSON,
          // requests are cached for 5 seconds
          revalidate: 5,
          router: appRouter,
          createContext: async () => {
            return {
              session: await auth(),
              headers: headers(),
            };
          },
        }),
      ],
    };
  },
});
